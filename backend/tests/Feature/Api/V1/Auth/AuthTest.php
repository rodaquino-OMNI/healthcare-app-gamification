<?php

namespace Tests\Feature\Api\V1\Auth;

use App\Models\GameProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    // ── Register ────────────────────────────────────────────────────

    public function test_register_success(): void
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'cpf' => '12345678901',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/v1/auth/register', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email'],
                'token',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'name' => 'John Doe',
            'cpf' => '12345678901',
        ]);
    }

    public function test_register_validation_errors(): void
    {
        $response = $this->postJson('/api/v1/auth/register', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'cpf', 'password']);
    }

    public function test_register_duplicate_email(): void
    {
        User::factory()->create(['email' => 'john@example.com']);

        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'cpf' => '12345678901',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/v1/auth/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_register_creates_game_profile(): void
    {
        $payload = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'cpf' => '98765432100',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $this->postJson('/api/v1/auth/register', $payload)
            ->assertStatus(201);

        $user = User::where('email', 'jane@example.com')->first();

        $this->assertDatabaseHas('game_profiles', [
            'user_id' => $user->id,
            'xp' => 0,
            'level' => 1,
        ]);
    }

    // ── Login ───────────────────────────────────────────────────────

    public function test_login_success(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['user', 'token']);
    }

    public function test_login_invalid_credentials(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Invalid credentials.']);
    }

    public function test_login_missing_fields(): void
    {
        $response = $this->postJson('/api/v1/auth/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    // ── Refresh ─────────────────────────────────────────────────────

    public function test_refresh_success(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/auth/refresh');

        $response->assertStatus(200)
            ->assertJsonStructure(['token']);
    }

    // ── Logout ──────────────────────────────────────────────────────

    public function test_logout_success(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/auth/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Successfully logged out.']);
    }

    public function test_logout_unauthenticated(): void
    {
        $response = $this->postJson('/api/v1/auth/logout');

        $response->assertStatus(401);
    }

    // ── Me ───────────────────────────────────────────────────────────

    public function test_me_success(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJsonStructure(['user' => ['id', 'name', 'email']])
            ->assertJsonPath('user.id', $user->id);
    }

    public function test_me_unauthenticated(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401);
    }
}
