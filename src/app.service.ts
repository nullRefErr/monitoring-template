import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
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

  publish(count: number) {
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

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'subscribe-route',
    queue: 'subscribe-queue',
    createQueueIfNotExists: true,
  })
  public async consume1(msg) {
    console.log(`consume1 - Received message: ${JSON.stringify(msg)}`);
    const receiveTime = Date.now();

    // Calculate latency
    const latency = (receiveTime - parseInt(msg.startTime)) / 1000;
    this.latencyHistogram.labels('subscribe-route').observe(latency);

    // Count received messages
    this.receivedCounter.labels('subscribe-route').inc();
    console.log(`Latency: ${latency} seconds`);
  }
}
