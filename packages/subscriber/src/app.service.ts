import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { AppHelper } from './app.helper';

@Injectable()
export class AppService {
  constructor(
    private readonly appHelper: AppHelper,
    @InjectMetric('messages_received_total')
    public receivedCounter: Counter<string>,
    @InjectMetric('message_latency_seconds')
    public latencyHistogram: Histogram<string>,
  ) {}

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'subscribe-route',
    queue: 'subscribe-queue',
    createQueueIfNotExists: true,
    queueOptions: {
      channel: 'sub',
    },
  })
  public async consumeFromChannel(msg) {
    console.log(
      `consumeFromChannel - Received message: ${JSON.stringify(msg)}`,
    );
    const receiveTime = Date.now();

    // Calculate latency
    const latency = (receiveTime - parseInt(msg.startTime)) / 1000;
    this.latencyHistogram.labels('subscribe-route').observe(latency);

    // Count received messages
    this.receivedCounter.labels('subscribe-route').inc();
    console.log(`Latency: ${latency} seconds`);

    const timeout = parseFloat(Math.random().toFixed(2)) * 100;
    await this.appHelper.sleep(timeout);
  }

  @RabbitSubscribe({
    exchange: 'exchange2',
    routingKey: 'subscribe-route2',
    queue: 'subscribe-queue2',
    createQueueIfNotExists: true,
  })
  public async consume(msg) {
    console.log(`consume - Received message: ${JSON.stringify(msg)}`);
    const receiveTime = Date.now();

    // Calculate latency
    const latency = (receiveTime - parseInt(msg.startTime)) / 1000;
    this.latencyHistogram.labels('subscribe-route').observe(latency);

    // Count received messages
    this.receivedCounter.labels('subscribe-route').inc();
    console.log(`Latency: ${latency} seconds`);

    const timeout = parseFloat(Math.random().toFixed(2)) * 100;
    await this.appHelper.sleep(timeout);
  }
}
