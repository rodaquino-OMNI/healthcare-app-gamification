<?php

namespace Tests\Unit\Models;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PermissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $permission = Permission::factory()->create();

        $this->assertDatabaseHas('permissions', ['id' => $permission->id]);
    }

    public function test_timestamps_are_disabled(): void
    {
        $permission = new Permission();

        $this->assertFalse($permission->usesTimestamps());
    }

    public function test_roles_relationship_returns_belongs_to_many(): void
    {
        $permission = Permission::factory()->create();

        $this->assertInstanceOf(BelongsToMany::class, $permission->roles());
    }

    public function test_roles_relationship_returns_correct_models(): void
    {
        $permission = Permission::factory()->create();
        $role = Role::factory()->create();
        $permission->roles()->attach($role);

        $this->assertCount(1, $permission->roles);
        $this->assertInstanceOf(Role::class, $permission->roles->first());
    }
}
