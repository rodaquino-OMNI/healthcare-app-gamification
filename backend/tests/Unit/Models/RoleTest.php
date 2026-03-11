<?php

namespace Tests\Unit\Models;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $role = Role::factory()->create();

        $this->assertDatabaseHas('roles', ['id' => $role->id]);
    }

    public function test_casts_is_default_to_boolean(): void
    {
        $role = Role::factory()->create(['is_default' => true]);

        $this->assertIsBool($role->is_default);
        $this->assertTrue($role->is_default);
    }

    public function test_users_relationship_returns_belongs_to_many(): void
    {
        $role = Role::factory()->create();

        $this->assertInstanceOf(BelongsToMany::class, $role->users());
    }

    public function test_users_relationship_returns_correct_models(): void
    {
        $role = Role::factory()->create();
        $user = User::factory()->create();
        $role->users()->attach($user);

        $this->assertCount(1, $role->users);
        $this->assertInstanceOf(User::class, $role->users->first());
    }

    public function test_permissions_relationship_returns_belongs_to_many(): void
    {
        $role = Role::factory()->create();

        $this->assertInstanceOf(BelongsToMany::class, $role->permissions());
    }

    public function test_permissions_relationship_returns_correct_models(): void
    {
        $role = Role::factory()->create();
        $permission = Permission::factory()->create();
        $role->permissions()->attach($permission);

        $this->assertCount(1, $role->permissions);
        $this->assertInstanceOf(Permission::class, $role->permissions->first());
    }
}
