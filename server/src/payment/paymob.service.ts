import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import axios, { AxiosRequestConfig } from 'axios';
import { PaymentConfiguration } from './payment.config';
import { createHmac } from 'crypto';

@Injectable()
export class PaymobService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepository,
    private readonly paymentConfiguration: PaymentConfiguration,
  ) {}
  async initPayment(
    paymentMethod: 'card' | 'wallet',
    amount: number,
    currency: 'EGP' | 'USD',
  ) {
    const API_KEY = this.paymentConfiguration.apiKey;
    let INTEGRATION_ID: number;
    if (paymentMethod === 'card') {
      INTEGRATION_ID = this.paymentConfiguration.cardPaymentIntegrationId;
    } else if (paymentMethod === 'wallet') {
      INTEGRATION_ID = this.paymentConfiguration.walletPaymentIntegrationId;
    } else {
      throw new HttpException(
        'Payment method not supported.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const firstToken = await this.getFirstToken(API_KEY);
    const paymobOrderId = await this.getOrderId(firstToken, amount, currency);
    const finalToken = await this.getFinalPaymentToken(
      firstToken,
      paymobOrderId,
      INTEGRATION_ID,
      amount,
      currency,
    );
    return [paymobOrderId, finalToken];
  }

  private async getFirstToken(API_KEY: string) {
    const url: string = 'https://accept.paymob.com/api/auth/tokens';
    const requestData: string = JSON.stringify({
      api_key: API_KEY,
    });
    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios.post(url, requestData, requestConfig);
      const firstToken = res.data.token;
      return firstToken;
    } catch (error) {
      console.error(error);
      throw new Error('Could not get first token.');
    }
  }
  private async getOrderId(
    firstToken: string,
    amount: number,
    currency: 'EGP' | 'USD',
  ) {
    const url: string = 'https://accept.paymob.com/api/ecommerce/orders';
    const requestData: string = JSON.stringify({
      auth_token: firstToken,
      delivery_needed: 'false',
      amount_cents: amount * 100,
      currency: currency,
      items: [],
    });
    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios.post(url, requestData, requestConfig);
      const orderId = res.data.id;
      return orderId;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get orderId');
    }
  }

  private async getFinalPaymentToken(
    firstToken: string,
    orderId: string,
    integrationId: number,
    amount: number,
    currency: 'EGP' | 'USD',
  ) {
    const url: string = 'https://accept.paymob.com/api/acceptance/payment_keys';
    const requestData: string = JSON.stringify({
      auth_token: firstToken,
      order_id: orderId,
      amount_cents: amount * 100,
      currency: currency,
      expiration: 3600,
      integration_id: integrationId,
      billing_data: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        // the rest can be NA
        apartment: 'NA',
        floor: 'NA',
        street: 'NA',
        building: 'NA',
        shipping_method: 'NA',
        postal_code: 'NA',
        city: 'NA',
        country: 'NA',
        state: 'NA',
      },
    });
    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios.post(url, requestData, requestConfig);
      const finalPaymentToken = res.data.token;
      return finalPaymentToken;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get final token');
    }
  }
  public payWithCard(paymentToken: string) {
    const IframeUrl = this.getPaymentIFrameUrl(paymentToken);
    return IframeUrl;
  }
  private getPaymentIFrameUrl(paymentToken: string) {
    const frameId = 827634;
    const IframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${frameId}?payment_token=${paymentToken}`;
    return IframeUrl;
  }

  public payWithWallet(paymentToken: string, mobileWalletNumber: string) {
    const redirectUrl = this.getRedirectUrl(paymentToken, mobileWalletNumber);
    return redirectUrl;
  }

  private async getRedirectUrl(
    paymentToken: string,
    mobileWalletNumber: string,
  ) {
    const url: string = 'https://accept.paymob.com/api/acceptance/payments/pay';
    const requestData: string = JSON.stringify({
      payment_token: paymentToken,
      source: {
        identifier: mobileWalletNumber,
        subtype: 'WALLET',
      },
    });
    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios.post(url, requestData, requestConfig);
      console.log(res.data);
      // NOTE: if the integration id is working, it's called redirect_url, if not, it's called redirection_url
      const { success, pending, redirect_url: redirectUrl } = res.data;
      console.log({ success }, { pending }, { redirectUrl });
      // check for success?
      return redirectUrl;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get redirectUrl');
    }
  }

  checkValidPaymobCallback = (
    obj: any,
    receivedHmac: string,
    webHookType: 'payment_processed' | 'payment_redirection',
  ): boolean => {
    console.log('started validating ---------------------- ');

    const HMAC_SECRET = process.env.HMAC_SECRET as string;

    const concatenatedValuesArr = [
      obj.amount_cents,
      obj.created_at,
      obj.currency,
      obj.error_occured,
      obj.has_parent_transaction,
      obj.id,
      obj.integration_id,
      obj.is_3d_secure,
      obj.is_auth,
      obj.is_capture,
      obj.is_refunded,
      obj.is_standalone_payment,
      obj.is_voided,
      webHookType == 'payment_processed' ? obj.order?.id : obj.order,
      obj.owner,
      obj.pending,
      webHookType == 'payment_processed'
        ? obj.source_data?.pan
        : obj['source_data.pan'],
      webHookType == 'payment_processed'
        ? obj.source_data?.sub_type
        : obj['source_data.sub_type'],
      webHookType == 'payment_processed'
        ? obj.source_data?.type
        : obj['source_data.type'],
      obj.success,
    ];

    concatenatedValuesArr.map((value, idx) => {
      if (value === undefined || null) {
        console.log('badKey: ', idx);
        console.log({ obj });
        throw new Error('One of the object values for Hmac was not found ');
      }
    });

    console.log(concatenatedValuesArr);
    const concatenatedValues = concatenatedValuesArr.join('');
    // console.log({ concatenatedValues });
    const calculatedHmac = createHmac('sha512', HMAC_SECRET)
      .update(concatenatedValues)
      .digest('hex')
      .toLowerCase();

    console.log("here's the calculated value: ", { calculatedHmac });
    console.log("here's the received value: ", { receivedHmac });

    console.log('Are they equal? ', calculatedHmac === receivedHmac);

    return calculatedHmac === receivedHmac;
  };
}
