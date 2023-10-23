import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { RmqModule } from './rmq.module';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';
import { AppHelper } from './app.helper';

@Module({
  imports: [RmqModule, PrometheusModule.register()],
  providers: [
    AppService,
    AppHelper,
    makeCounterProvider({
      name: 'messages_received_total',
      help: 'Total messages received by channel',
      labelNames: ['channel'],
    }),
    makeHistogramProvider({
      name: 'message_latency_seconds',
      help: 'Latency in seconds for consumed messages',
      labelNames: ['channel'],
      buckets: [0.001, 0.01, 0.1, 0.5, 1, 5],
    }),
  ],
})
export class AppModule {}
