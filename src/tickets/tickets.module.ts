import { forwardRef, Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), forwardRef(() => OrdersModule)],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
