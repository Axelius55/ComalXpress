import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RolesUser } from './enums/rolesUser.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUserWithRoles(dto: CreateUserDto, roles: RolesUser[]) {
    const userExist = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (userExist) {
      throw new ConflictException('User already exists');
    }

    const user = this.userRepository.create({
      ...dto,
      roles,
      password: await bcrypt.hash(dto.password, 10),
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
      isActive: user.isActive,
      points: user.points,
    };
  }

  findAll() {
    return this.userRepository.find();
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);

    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (emailExists) {
        throw new ConflictException(`The email ${dto.email} is already in use`);
      }
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    const merged = this.userRepository.merge(user, dto);

    return this.userRepository.save(merged);
  }

  async deactivate(id: string, currentUser: any) {
    const user = await this.findById(id);

    const isEmployee = currentUser.roles.includes(RolesUser.EMPLOYEE);
    const targetIsAdmin = user.roles.includes(RolesUser.ADMIN);
    const targetIsEmployee = user.roles.includes(RolesUser.EMPLOYEE);

    if (isEmployee && (targetIsAdmin || targetIsEmployee)) {
      throw new ForbiddenException(
        'Insufficient permissions to deactivate this user',
      );
    }

    user.isActive = false;

    return this.userRepository.save(user);
  }

  async activate(id: string) {
    const user = await this.findById(id);

    user.isActive = true;

    return this.userRepository.save(user);
  }

  async findClients() {
    return this.userRepository
      .createQueryBuilder('user')
      .where(':role = ANY(user.roles)', { role: RolesUser.CLIENT })
      .getMany();
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneByEmailForAuth(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async remove(id: string) {
    const user = await this.findById(id);

    return this.userRepository.remove(user);
  }

  async addPoints(userId: string, points: number) {
    const user = await this.findById(userId);

    user.points += points;

    return this.userRepository.save(user);
  }
}
