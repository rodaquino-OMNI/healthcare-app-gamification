import { Permission } from '../../permissions/entities/permission.entity';

/**
 * Role entity representing a collection of permissions that can be assigned to users
 * within the AUSTA SuperApp. Roles enable journey-specific access control across the
 * application's three core journeys: Health, Care, and Plan.
 */
export class Role {
    /**
     * Unique identifier for the role
     */
    id: number = 0;

    /**
     * Unique name of the role (e.g., 'User', 'Caregiver', 'Provider', 'Administrator')
     */
    name: string = '';

    /**
     * Description of the role and its purpose
     */
    description: string = '';

    /**
     * The journey this role is associated with (health, care, plan, or null for global roles)
     */
    journey: string | null = null;

    /**
     * Indicates if this is a default role assigned to new users
     */
    isDefault: boolean = false;

    /**
     * Permissions assigned to this role
     */
    permissions: Permission[] = [];

    /**
     * Timestamp of when the role was created
     */
    createdAt: Date = new Date();

    /**
     * Timestamp of when the role was last updated
     */
    updatedAt: Date = new Date();
}
