import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entities/order-items.entity';
import { OrderItemExtra } from './entities/order-item-extras.entity';

import { ProductsService } from 'src/products/products.service';
import { ExtrasService } from 'src/products/extras.service';
import { UsersService } from 'src/users/users.service';

import { OrderStatus } from './enums/oder-status.enum';
import { RolesUser } from 'src/users/enums/rolesUser.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(OrderItemExtra)
    private readonly orderItemExtraRepository: Repository<OrderItemExtra>,

    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly extrasService: ExtrasService,
  ) {}

  /*
  =================================================
  CREATE ORDER
  =================================================
  */

  async create(dto: CreateOrderDto, userId: string) {
    const user = await this.usersService.findById(userId);

    const order = this.orderRepository.create({
      user,
      status: OrderStatus.PENDING,
      isPaid: false,
      total: 0,
    });

    await this.orderRepository.save(order);

    let total = 0;

    for (const item of dto.items) {
      const product = await this.productsService.findOne(item.productId);

      const orderItem = this.orderItemRepository.create({
        order,
        productId: product.id,
        productName: product.name,
        price: product.basePrice,
        quantity: item.quantity,
        notes: item.notes,
      } as Partial<OrderItem>);

      await this.orderItemRepository.save(orderItem);

      let extrasTotal = 0;

      if (item.extras?.length) {
        for (const extraId of item.extras) {
          const extra = await this.extrasService.findOne(extraId);

          const orderExtra = this.orderItemExtraRepository.create({
            orderItem,
            extraId: extra.id,
            name: extra.name,
            price: extra.price,
          });

          await this.orderItemExtraRepository.save(orderExtra);

          extrasTotal += extra.price;
        }
      }

      const itemTotal = (product.basePrice + extrasTotal) * item.quantity;

      total += itemTotal;
    }

    order.total = total;

    await this.orderRepository.save(order);

    return this.findOne(order.id);
  }

  /*
  =================================================
  FIND ALL
  =================================================
  */

  async findAll(status?: OrderStatus, page = 1, limit = 10) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.extras', 'extras')
      .leftJoinAndSelect('order.user', 'user')
      .orderBy('order.createdAt', 'DESC');

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    const [orders, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: orders.map((o) => this.mapOrder(o)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /*
  =================================================
  FIND MY ORDERS
  =================================================
  */

  async findMyOrders(userId: string) {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.extras', 'extras')
      .leftJoinAndSelect('order.user', 'user')
      .where('order.userId = :userId', { userId })
      .orderBy('order.createdAt', 'DESC')
      .getMany();

    return orders.map((o) => this.mapOrder(o));
  }

  /*
  =================================================
  FIND ONE
  =================================================
  */

  async findOne(id: string) {
    const order = await this.getOrderEntity(id);
    return this.mapOrder(order);
  }

  async findOneSecure(id: string, user: any) {
    const order = await this.getOrderEntity(id);

    const isAdmin = user.roles.includes(RolesUser.ADMIN);
    const isEmployee = user.roles.includes(RolesUser.EMPLOYEE);

    if (!isAdmin && !isEmployee && order.user.id !== user.id) {
      throw new ForbiddenException('You cannot access this order');
    }

    return this.mapOrder(order);
  }

  /*
  =================================================
  ORDER STATE CHANGES
  =================================================
  */

  async confirmOrder(id: string) {
    const order = await this.getOrderEntity(id);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be confirmed');
    }

    order.status = OrderStatus.CONFIRMED;

    await this.orderRepository.save(order);

    return this.mapOrder(order);
  }

  async cancelOrder(id: string) {
    const order = await this.getOrderEntity(id);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    order.status = OrderStatus.CANCELLED;

    await this.orderRepository.save(order);

    return this.mapOrder(order);
  }

  async startPreparing(id: string) {
    const order = await this.getOrderEntity(id);

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Order must be confirmed first');
    }

    if (!order.isPaid) {
      throw new BadRequestException('Order must be paid before preparing');
    }

    order.status = OrderStatus.PREPARING;

    await this.orderRepository.save(order);

    return this.mapOrder(order);
  }

  async markReady(id: string) {
    const order = await this.getOrderEntity(id);

    if (order.status !== OrderStatus.PREPARING) {
      throw new BadRequestException('Order must be preparing');
    }

    order.status = OrderStatus.READY;

    await this.orderRepository.save(order);

    return this.mapOrder(order);
  }

  async markPickedUp(id: string) {
    const order = await this.getOrderEntity(id);

    if (order.status !== OrderStatus.READY) {
      throw new BadRequestException('Order must be ready');
    }

    order.status = OrderStatus.PICKED_UP;

    await this.orderRepository.save(order);

    const pointsEarned = Math.floor(order.total / 10);

    await this.usersService.addPoints(order.user.id, pointsEarned);

    return {
      order: this.mapOrder(order),
      pointsEarned,
    };
  }

  async markAbandoned(id: string) {
    const order = await this.getOrderEntity(id);

    if (order.status !== OrderStatus.READY) {
      throw new BadRequestException('Only ready orders can be abandoned');
    }

    order.status = OrderStatus.ABANDONED;

    await this.orderRepository.save(order);

    return this.mapOrder(order);
  }

  /*
  =================================================
  PAYMENT
  =================================================
  */

  async payOrder(id: string, userId: string) {
    const order = await this.getOrderEntity(id);

    if (order.user.id !== userId) {
      throw new ForbiddenException('You cannot pay this order');
    }

    if (order.isPaid) {
      throw new BadRequestException('Order already paid');
    }

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Order must be confirmed before payment');
    }

    order.isPaid = true;
    order.ticketNumber = await this.generateTicketNumber();

    await this.orderRepository.save(order);

    return this.mapOrder(order);
  }

  /*
  =================================================
  TICKET
  =================================================
  */

  async getTicket(id: string, user: any) {
    const order = await this.getOrderEntity(id);

    if (!order.isPaid) {
      throw new BadRequestException('Ticket not available until order is paid');
    }

    const isAdmin = user.roles.includes(RolesUser.ADMIN);
    const isEmployee = user.roles.includes(RolesUser.EMPLOYEE);

    if (!isAdmin && !isEmployee && order.user.id !== user.id) {
      throw new ForbiddenException('You cannot access this ticket');
    }

    return this.mapOrder(order);
  }

  async findByTicketNumber(ticketNumber: string) {
    const order = await this.orderRepository.findOne({
      where: { ticketNumber },
      relations: ['items', 'items.extras', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Ticket not found');
    }

    return this.mapOrder(order);
  }

  /*
  =================================================
  HELPERS
  =================================================
  */

  private async getOrderEntity(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.extras', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  private mapOrder(order: Order) {
    return {
      id: order.id,
      ticketNumber: order.ticketNumber,
      status: order.status,
      isPaid: order.isPaid,
      createdAt: order.createdAt,
      total: Number(order.total),

      customer: {
        id: order.user?.id,
        name: order.user?.name,
      },

      items:
        order.items?.map((item) => {
          const extrasTotal =
            item.extras?.reduce((sum, e) => sum + Number(e.price), 0) ?? 0;

          const basePrice = Number(item.price);
          const unitPrice = basePrice + extrasTotal;

          return {
            productId: item.productId,
            productName: item.productName,
            price: basePrice,
            quantity: item.quantity,
            notes: item.notes,

            extras:
              item.extras?.map((e) => ({
                id: e.extraId,
                name: e.name,
                price: e.price,
              })) ?? [],

            subtotal: unitPrice * item.quantity,
          };
        }) ?? [],
    };
  }

  private async generateTicketNumber(): Promise<string> {
    const lastOrder = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.ticketNumber IS NOT NULL')
      .orderBy('order.createdAt', 'DESC')
      .getOne();

    let nextNumber = 1;

    if (lastOrder?.ticketNumber) {
      const lastNumber = parseInt(lastOrder.ticketNumber.split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    return `CX-${nextNumber.toString().padStart(6, '0')}`;
  }
}