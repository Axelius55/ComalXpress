import {
  ConflictException,
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

  async createUserWithRoles(createUserDto: CreateUserDto, roles: RolesUser[]) {
    console.log('CREATE USER DTO:', createUserDto);
    const userExist = await this.findOneByEmail(createUserDto.email);
    if (userExist) {
      throw new ConflictException('The user already exists');
    }

    const user = this.userRepository.create({
      ...createUserDto,
      roles,
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    const savedUser = await this.userRepository.save(user);
    console.log('SAVED USER PASSWORD:', savedUser.password);

    return {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      lastName: savedUser.lastName,
    };
  }

  findAllUsersClients() {
    return this.userRepository.find();
  }

  async findOneUserClient(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id: ${id}, not found`);
    } else {
      return user;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Verificar que el usuario exista
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Si viene email, validar que no lo use OTRO usuario
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException(
          `The user with email ${updateUserDto.email} already exists`,
        );
      }
    }

    // Mezclar datos (sin perder el id)
    const updatedUser = this.userRepository.merge(user, updateUserDto);

    // Guardar
    return this.userRepository.save(updatedUser);
  }

  async removeClient(id: string) {
    const userExists = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!userExists) {
      throw new NotFoundException(`The user with id: ${id}, no exists`);
    }
    return this.userRepository.remove(userExists);
  }

  //custom functions----------------------------------------------------------------

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findOneByEmailForAuth(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }
}
