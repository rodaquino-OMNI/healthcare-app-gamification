<?php

namespace Tests\Feature\Api\V1\Requests;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterRequestTest extends TestCase
{
    use RefreshDatabase;

    private string $endpoint = '/api/v1/auth/register';

    // ─── Name ─────────────────────────────────────────────────────────

    public function test_name_is_required(): void
    {
        $response = $this->postJson($this->endpoint, $this->validPayload(['name' => '']));

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    // ─── Email ────────────────────────────────────────────────────────

    public function test_email_is_required(): void
    {
        $response = $this->postJson($this->endpoint, $this->validPayload(['email' => '']));

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_email_must_be_valid(): void
    {
        $response = $this->postJson($this->endpoint, $this->validPayload(['email' => 'not-an-email']));

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_email_must_be_unique(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $response = $this->postJson($this->endpoint, $this->validPayload(['email' => 'taken@example.com']));

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    // ─── CPF ──────────────────────────────────────────────────────────

    public function test_cpf_is_required(): void
    {
        $response = $this->postJson($this->endpoint, $this->validPayload(['cpf' => '']));

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['cpf']);
    }

    public function test_cpf_must_be_11_characters(): void
    {
        $response = $this->postJson($this->endpoint, $this->validPayload(['cpf' => '123']));

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['cpf']);
    }

    public function test_cpf_must_be_unique(): void
    {
        User::factory()->create(['cpf' => '12345678901']);

        $response = $this->postJson($this->endpoint, $this->validPayload(['cpf' => '12345678901']));

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['cpf']);
    }

    // ─── Password ─────────────────────────────────────────────────────

    public function test_password_is_required(): void
    {
        $response = $this->postJson($this->endpoint, $this->validPayload(['password' => '', 'password_confirmation' => '']));

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    }

    public function test_password_must_be_at_least_8_characters(): void
    {
        $response = $this->postJson($this->endpoint, $this->validPayload([
            'password' => 'short',
            'password_confirmation' => 'short',
        ]));

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    }

    public function test_password_must_be_confirmed(): void
    {
        $response = $this->postJson($this->endpoint, $this->validPayload([
            'password' => 'password123',
            'password_confirmation' => 'different',
        ]));

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    }

    // ─── Valid Registration ───────────────────────────────────────────

    public function test_valid_registration_succeeds(): void
    {
        $response = $this->postJson($this->endpoint, $this->validPayload());

        $response->assertCreated()
            ->assertJsonStructure(['user', 'token']);
    }

    // ─── Helpers ──────────────────────────────────────────────────────

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'cpf' => '98765432100',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ], $overrides);
    }
}
