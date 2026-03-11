<?php

namespace Tests\Feature\Api\V1\Requests;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LoginRequestTest extends TestCase
{
    use RefreshDatabase;

    private string $endpoint = '/api/v1/auth/login';

    // ─── Email ────────────────────────────────────────────────────────

    public function test_email_is_required(): void
    {
        $response = $this->postJson($this->endpoint, [
            'password' => 'password123',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_email_must_be_valid_format(): void
    {
        $response = $this->postJson($this->endpoint, [
            'email' => 'not-an-email',
            'password' => 'password123',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    // ─── Password ─────────────────────────────────────────────────────

    public function test_password_is_required(): void
    {
        $response = $this->postJson($this->endpoint, [
            'email' => 'test@example.com',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    }

    // ─── Valid Login ──────────────────────────────────────────────────

    public function test_valid_login_succeeds(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson($this->endpoint, [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['user', 'token']);
    }

    public function test_invalid_credentials_returns_401(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson($this->endpoint, [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertUnauthorized();
    }
}
