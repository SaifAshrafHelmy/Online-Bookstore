import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentConfiguration {
  constructor(private configService: ConfigService) {}
  get apiKey(): string {
    return this.configService.get<string>('API_KEY');
  }
  get cardPaymentIntegrationId(): number {
    return Number(
      this.configService.get<string>('CARD_PAYMENT_INTEGRATION_ID'),
    );
  }
  get walletPaymentIntegrationId(): number {
    return Number(
      this.configService.get<string>('WALLET_PAYMENT_INTEGRATION_ID'),
    );
  }
  get hmacSecret(): string {
    return this.configService.get<string>('HMAC_SECRET');
  }
}
