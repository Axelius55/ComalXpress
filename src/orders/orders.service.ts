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
import { ProductsService } from 'src/products/products.service';
import { OrderItem } from './entities/order-items.entity';
import { OrderStatus } from './enums/oder-status.enum';
import { RolesUser } from 'src/users/enums/rolesUser.enum';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly usersService: UsersService,

    private readonly productsService: ProductsService,
  ) {}

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

    const orderItems: OrderItem[] = [];

    for (const item of dto.items) {
      const product = await this.productsService.findOne(item.productId);

      const orderItem = this.orderItemRepository.create({
        order,
        productId: product.id,
        productName: product.name,
        price: product.basePrice,
        quantity: item.quantity,
      });

      total += product.basePrice * item.quantity;

      orderItems.push(orderItem);
    }

    await this.orderItemRepository.save(orderItems);

    order.total = total;

    await this.orderRepository.save(order);

    return this.findOne(order.id);
  }

  async findAll(status?: OrderStatus, page = 1, limit = 10) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
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
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findMyOrders(userId: string) {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .where('order.userId = :userId', { userId })
      .orderBy('order.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findOneSecure(id: string, user: any) {
    const order = await this.findOne(id);

    const isAdmin = user.roles.includes(RolesUser.ADMIN);
    const isEmployee = user.roles.includes(RolesUser.EMPLOYEE);

    if (isAdmin || isEmployee) {
      return order;
    }

    if (order.user.id !== user.id) {
      throw new ForbiddenException('You cannot access this order');
    }

    return order;
  }

  async confirmOrder(id: string) {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be confirmed');
    }

    order.status = OrderStatus.CONFIRMED;

    return this.orderRepository.save(order);
  }

  async cancelOrder(id: string) {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    order.status = OrderStatus.CANCELLED;

    return this.orderRepository.save(order);
  }

  async startPreparing(id: string) {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Order must be confirmed first');
    }

    if (!order.isPaid) {
      throw new BadRequestException('Order must be paid before preparing');
    }

    order.status = OrderStatus.PREPARING;

    return this.orderRepository.save(order);
  }

  async markReady(id: string) {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.PREPARING) {
      throw new BadRequestException('Order must be preparing');
    }

    order.status = OrderStatus.READY;

    return this.orderRepository.save(order);
  }

  async markPickedUp(id: string) {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.READY) {
      throw new BadRequestException('Order must be ready');
    }

    order.status = OrderStatus.PICKED_UP;

    await this.orderRepository.save(order);

    const pointsEarned = Math.floor(order.total / 10);

    await this.usersService.addPoints(order.user.id, pointsEarned);

    return {
      order,
      pointsEarned,
    };
  }

  async markAbandoned(id: string) {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.READY) {
      throw new BadRequestException('Only ready orders can be abandoned');
    }

    order.status = OrderStatus.ABANDONED;

    return this.orderRepository.save(order);
  }

  async payOrder(id: string, userId: string) {
    const order = await this.findOne(id);

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

    return this.orderRepository.save(order);
  }

  async findByStatus(status: OrderStatus) {
    const orders = await this.orderRepository.find({
      where: { status },
      relations: ['user', 'items'],
      order: {
        createdAt: 'ASC',
      },
    });

    return orders;
  }
}
