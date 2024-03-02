// import { Body, Controller, Get, Post } from '@nestjs/common';
// import { PaymentService } from './payment.service';
// import {
//   CardPaymentRequest,
//   WalletPaymentRequest,
// } from './dtos/payment-request.dto';

// @Controller('payments')
// export class PaymentController {
//   constructor(private paymentService: PaymentService) {}

//   @Get('/hello')
//   async test() {
//     return 'Hello';
//   }

//   @Post('/paywithcard')
//   async createNewCardPayment(@Body() cardPaymentRequest: CardPaymentRequest) {
//     const finalPaymentToken = await this.paymentService.initPayment(
//       'card',
//       cardPaymentRequest.amount,
//       cardPaymentRequest.currency,
//     );
//     const IframeUrl = this.paymentService.payWithCard(finalPaymentToken);
//     console.log(IframeUrl);
//     return IframeUrl;
//   }
//   @Post('/paywithwallet')
//   async createNewWalletPayment(
//     @Body() walletPaymentRequest: WalletPaymentRequest,
//   ) {
//     const finalPaymentToken = await this.paymentService.initPayment(
//       'wallet',
//       walletPaymentRequest.amount,
//       walletPaymentRequest.currency,
//     );
//     const redirectionUrl = this.paymentService.payWithWallet(
//       finalPaymentToken,
//       walletPaymentRequest.phoneNumber,
//     );
//     console.log({ redirectionUrl });
//     return redirectionUrl;
//   }
// }
