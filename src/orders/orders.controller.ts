import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { RolesUser } from 'src/users/enums/rolesUser.enum';
import { AuthOnlyUser } from 'src/auth/decorators/authOnlyUser.decorator';
import { OrderStatus } from './enums/oder-status.enum';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @Auth(RolesUser.CLIENT, RolesUser.EMPLOYEE, RolesUser.ADMIN)
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: any) {
    return this.ordersService.create(dto, user.id);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Get orders of the current user' })
  @AuthOnlyUser()
  findMyOrders(@CurrentUser() user: any) {
    return this.ordersService.findMyOrders(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with optional status filter and pagination' })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @Auth(RolesUser.ADMIN, RolesUser.EMPLOYEE)
  findAllByStatus(
    @Query('status') status?: OrderStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.ordersService.findAll(status, +page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID', example: 'uuid-order-id' })
  @Auth(RolesUser.ADMIN, RolesUser.EMPLOYEE, RolesUser.CLIENT)
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.findOneSecure(id, user);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm an order' })
  @ApiParam({ name: 'id', example: 'uuid-order-id' })
  @Auth(RolesUser.ADMIN, RolesUser.EMPLOYEE)
  confirm(@Param('id') id: string) {
    return this.ordersService.confirmOrder(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', example: 'uuid-order-id' })
  @Auth(RolesUser.ADMIN, RolesUser.EMPLOYEE)
  cancel(@Param('id') id: string) {
    return this.ordersService.cancelOrder(id);
  }

  @Patch(':id/preparing')
  @ApiOperation({ summary: 'Mark order as preparing' })
  @ApiParam({ name: 'id', example: 'uuid-order-id' })
  @Auth(RolesUser.ADMIN, RolesUser.EMPLOYEE)
  preparing(@Param('id') id: string) {
    return this.ordersService.startPreparing(id);
  }

  @Patch(':id/ready')
  @ApiOperation({ summary: 'Mark order as ready' })
  @ApiParam({ name: 'id', example: 'uuid-order-id' })
  @Auth(RolesUser.ADMIN, RolesUser.EMPLOYEE)
  ready(@Param('id') id: string) {
    return this.ordersService.markReady(id);
  }

  @Patch(':id/picked-up')
  @ApiOperation({ summary: 'Mark order as picked up by the customer' })
  @ApiParam({ name: 'id', example: 'uuid-order-id' })
  @Auth(RolesUser.ADMIN, RolesUser.EMPLOYEE)
  pickedUp(@Param('id') id: string) {
    return this.ordersService.markPickedUp(id);
  }

  @Patch(':id/abandoned')
  @ApiOperation({ summary: 'Mark order as abandoned (customer did not arrive)' })
  @ApiParam({ name: 'id', example: 'uuid-order-id' })
  @Auth(RolesUser.ADMIN, RolesUser.EMPLOYEE)
  abandoned(@Param('id') id: string) {
    return this.ordersService.markAbandoned(id);
  }

  @Patch(':id/pay')
  @ApiOperation({ summary: 'Pay an order' })
  @ApiParam({ name: 'id', example: 'uuid-order-id' })
  @Auth(RolesUser.ADMIN, RolesUser.EMPLOYEE, RolesUser.CLIENT)
  pay(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.payOrder(id, user.id);
  }
  
}
