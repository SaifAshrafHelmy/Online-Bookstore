import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentConfiguration } from './payment.config';
import { PaymobService } from './paymob.service';
import { Repository } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import {
  PayWithCardDTO,
  PayWithWalletDTO,
  PaymentData,
} from './dtos/payment-request.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    private readonly paymentConfiguration: PaymentConfiguration,
    private readonly paymobService: PaymobService,
  ) {}

  async createNewCardPayment(cardPaymentRequest: PayWithCardDTO) {
    // Save the payment instance in the database
    if (!cardPaymentRequest.orderId) throw new BadRequestException();
    const order = await this.ordersRepo.findOne({
      where: {
        id: cardPaymentRequest.orderId,
      },
      relations: {
        payment: true,
      },
    });
    if (!order) throw new NotFoundException();
    if (order.payment && order.payment.status === 'complete')
      return new HttpException('Order is already paid.', HttpStatus.CONFLICT);

    // Call Paymob service
    const [paymobOrderId, finalPaymentToken] =
      await this.paymobService.initPayment('card', order.totalAmount, 'EGP');
    const paymentData: PaymentData = {
      payment_method: 'card',
      status: 'pending',
      amount: order.totalAmount,
      currency: 'EGP',
      paymobOrderId,
    };
    const cardPayment = this.paymentRepo.create(paymentData);
    const savedPayment = await this.paymentRepo.save(cardPayment);
    if (!savedPayment)
      throw new HttpException(
        'Failed to save payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    order.payment = savedPayment;
    await this.ordersRepo.save(order);

    const IframeUrl = this.paymobService.payWithCard(finalPaymentToken);
    if (!IframeUrl)
      throw new HttpException(
        'Failed to get payment IframeUrl',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    // console.log(IframeUrl);
    return IframeUrl;
  }
  async createNewWalletPayment(walletPaymentRequest: PayWithWalletDTO) {
    // Save the payment instance in the database
    if (!walletPaymentRequest.orderId) throw new BadRequestException();
    const order = await this.ordersRepo.findOne({
      where: {
        id: walletPaymentRequest.orderId,
      },
      relations: {
        payment: true,
      },
    });
    if (!order) throw new NotFoundException();
    if (order.payment && order.payment.status === 'complete')
      return new HttpException('Order is already paid.', HttpStatus.CONFLICT);

    // Call Paymob service
    const [paymobOrderId, finalPaymentToken] =
      await this.paymobService.initPayment('wallet', order.totalAmount, 'EGP');
    const paymentData: PaymentData = {
      payment_method: 'card',
      status: 'pending',
      amount: order.totalAmount,
      currency: 'EGP',
      paymobOrderId,
    };
    const cardPayment = this.paymentRepo.create(paymentData);
    const savedPayment = await this.paymentRepo.save(cardPayment);
    if (!savedPayment)
      throw new HttpException(
        'Failed to save payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    order.payment = savedPayment;
    await this.ordersRepo.save(order);

    const redirectionUrl = await this.paymobService.payWithWallet(
      finalPaymentToken,
      walletPaymentRequest.phoneNumber,
    );

    if (!redirectionUrl)
      throw new HttpException(
        'Failed to get payment IframeUrl',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    // console.log({ redirectionUrl });
    return redirectionUrl;
  }

  async updatePaymentStatus(webhookData: any, hmac: string) {
    const validPayment = this.paymobService.checkValidPaymobCallback(
      webhookData.obj,
      hmac,
      'payment_processed',
    );
    if (!validPayment) {
      throw new BadRequestException('Invalid payment data');
    }
    const success = webhookData.obj.success;
    const payment = await this.paymentRepo.findOneBy({
      paymobOrderId: webhookData.obj.order.id,
    });
    if (!payment) {
      throw new NotFoundException('Payment requested to update was not found');
    }

    if (success) {
      payment.status = 'complete';
    } else {
      payment.status = 'failed';
    }
    await this.paymentRepo.save(payment);

    return;
  }
  async redirectAfterPayment(webhookData: any, hmac: string) {
    const validPayment = this.paymobService.checkValidPaymobCallback(
      webhookData,
      hmac,
      'payment_redirection',
    );
    if (!validPayment) {
      throw new BadRequestException('Invalid payment data');
    }
    const success = webhookData.success;
    const FRONT_END_CLIENT = this.paymentConfiguration.frontEndClient;
    return { url: `${FRONT_END_CLIENT}/payment/success=${success}` };
  }
}
