import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class AppService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    @InjectMetric('messages_received_total')
    public receivedCounter: Counter<string>,
    @InjectMetric('message_latency_seconds')
    public latencyHistogram: Histogram<string>,
  ) {}

  publishWithChannel(count: number) {
    const counter = count || 1000;
    for (let i = 0; i < counter; i++) {
      this.amqpConnection.managedChannels['pub'].publish(
        'exchange1',
        'subscribe-route',
        Buffer.from(
          JSON.stringify({
            startTime: Date.now(),
          }),
          'utf8',
        ),
      );
    }
  }

  publishWithoutChannel(count: number) {
    const counter = count || 1000;
    for (let i = 0; i < counter; i++) {
      this.amqpConnection.publish(
        'exchange2',
        'subscribe-route2',
        Buffer.from(
          JSON.stringify({
            startTime: Date.now(),
          }),
          'utf8',
        ),
      );
    }
  }
}
