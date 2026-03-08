import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RolesUser } from '../enums/rolesUser.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  lastName: string;

  @Column({ type: 'varchar', nullable: false, unique: true, length: 100 })
  email: string;

  @Column({ type: 'varchar', nullable: false, length: 100, select: false })
  password: string;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ type: 'boolean', nullable: false, default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: RolesUser, nullable: false, array: true })
  roles: RolesUser[];
}
