import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      channels: {
        main: {
          default: true,
          prefetchCount: 500,
        },
        sub: {
          prefetchCount: 500,
        },
        pub: {
          prefetchCount: 500,
        },
      },
      exchanges: [
        {
          name: 'exchange1',
          type: 'direct',
        },
        {
          name: 'exchange2',
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
