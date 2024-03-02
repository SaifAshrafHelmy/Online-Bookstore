import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PayWithCardDTO, PayWithWalletDTO } from './dtos/payment-request.dto';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get('/hello')
  async test() {
    return 'Hello';
  }

  @Post('/paywithcard')
  async createNewCardPayment(@Body() cardPaymentRequest: PayWithCardDTO) {
    const res =
      await this.paymentService.createNewCardPayment(cardPaymentRequest);

    return res;
  }

  @Post('/paywithwallet')
  async createNewWalletPayment(@Body() walletPaymentRequest: PayWithWalletDTO) {
    const res =
      await this.paymentService.createNewWalletPayment(walletPaymentRequest);

    return res;
  }

  @Post('/post_pay')
  async listenForPaymentStatus(
    @Body() webhookData: any,
    @Query('hmac') hmac: string,
  ) {
    await this.paymentService.updatePaymentStatus(webhookData, hmac);
    return 'All good';
  }

  @Get('/payment_done_redirect')
  async redirectAfterPaymentUpdate(
    @Query() reqQuery: any,
    @Query('hmac') hmac: string,
  ) {
    /* This redirection SHOULD BE (to?) CLIENT SIDE */
    // console.log({ receivedQuery: reqQuery });
    // console.log({ receivedHmac: hmac });

    const redirectUrlData = await this.paymentService.redirectAfterPayment(
      reqQuery,
      hmac,
    );

    return redirectUrlData;
  }
}
