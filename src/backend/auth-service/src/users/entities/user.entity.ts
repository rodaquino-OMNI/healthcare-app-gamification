import { Role } from '../../roles/entities/role.entity';

/**
 * Represents a user entity.
 * Stores core user information required for authentication and profile management.
 */
export class User {
  /**
   * Unique identifier for the user.
   */
  id: string = '';

  /**
   * Full name of the user.
   */
  name: string = '';

  /**
   * Email address of the user (must be unique).
   * Used as the primary identifier for authentication.
   */
  email: string = '';

  /**
   * Phone number of the user (optional).
   * Can be used for MFA and notifications.
   */
  phone: string = '';

  /**
   * CPF (Brazilian national ID) of the user (optional).
   * Used for identity verification in Brazilian healthcare context.
   */
  cpf: string = '';

  /**
   * Hashed password of the user.
   * Never stored in plain text.
   */
  password: string = '';

  /**
   * The roles assigned to this user.
   * Many-to-many relationship with Role entity.
   */
  roles: Role[] = [];

  /**
   * Timestamp of when the user was created.
   */
  createdAt: Date = new Date();

  /**
   * Timestamp of when the user was last updated.
   */
  updatedAt: Date = new Date();
}
