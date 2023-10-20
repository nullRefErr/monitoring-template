import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      channels: {
        sub: {
          default: true,
          prefetchCount: 5000,
        },
        pub: {
          prefetchCount: 5000,
        },
      },
      exchanges: [
        {
          name: 'exchange1',
          type: 'direct',
        },
      ],
      uri: 'amqp://user:pass@rabbitmq:5672/vhost',
      connectionInitOptions: { wait: false },
    }),
  ],
  exports: [RabbitMQModule],
})
export class RmqModule {}
