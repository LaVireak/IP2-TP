import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'ORDERS_SERVICE', transport: Transport.TCP },
    ]),
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
