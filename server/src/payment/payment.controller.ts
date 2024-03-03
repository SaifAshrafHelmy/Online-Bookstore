import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PayWithCardDTO, PayWithWalletDTO } from './dtos/payment-request.dto';
import { AuthGuard, Public } from 'src/users/auth.guard';

@UseGuards(AuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('/paywithcard')
  async createNewCardPayment(@Body() cardPaymentRequest: PayWithCardDTO) {
    return await this.paymentService.createNewCardPayment(cardPaymentRequest);
  }

  @Post('/paywithwallet')
  async createNewWalletPayment(@Body() walletPaymentRequest: PayWithWalletDTO) {
    return await this.paymentService.createNewWalletPayment(
      walletPaymentRequest,
    );
  }

  @Post('/post_pay')
  @Public()
  @HttpCode(HttpStatus.ACCEPTED)
  async listenForPaymentStatus(
    @Body() webhookData: any,
    @Query('hmac') hmac: string,
  ) {
    this.paymentService.updatePaymentStatus(webhookData, hmac);
  }

  @Get('/payment_done_redirect')
  @Public()
  async redirectAfterPaymentUpdate(
    @Query() reqQuery: any,
    @Query('hmac') hmac: string,
  ) {
    /* This redirection SHOULD BE (to?) CLIENT SIDE */
    const redirectUrlData = await this.paymentService.redirectAfterPayment(
      reqQuery,
      hmac,
    );

    return redirectUrlData;
  }
}
