<?php

namespace Tests\Feature\Api\V1\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MfaTest extends TestCase
{
    use RefreshDatabase;

    // ── Enable ──────────────────────────────────────────────────────

    public function test_mfa_enable_returns_501(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/auth/mfa/enable');

        $response->assertStatus(501)
            ->assertJson([
                'message' => 'MFA enable is not yet implemented.',
                'mfa_enabled' => false,
            ]);
    }

    public function test_mfa_enable_unauthenticated(): void
    {
        $response = $this->postJson('/api/v1/auth/mfa/enable');

        $response->assertStatus(401);
    }

    // ── Verify ──────────────────────────────────────────────────────

    public function test_mfa_verify_returns_501(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/auth/mfa/verify');

        $response->assertStatus(501)
            ->assertJson([
                'message' => 'MFA verify is not yet implemented.',
                'verified' => false,
            ]);
    }

    public function test_mfa_verify_unauthenticated(): void
    {
        $response = $this->postJson('/api/v1/auth/mfa/verify');

        $response->assertStatus(401);
    }

    // ── Disable ─────────────────────────────────────────────────────

    public function test_mfa_disable_returns_501(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/auth/mfa/disable');

        $response->assertStatus(501)
            ->assertJson([
                'message' => 'MFA disable is not yet implemented.',
                'mfa_enabled' => true,
            ]);
    }

    public function test_mfa_disable_unauthenticated(): void
    {
        $response = $this->postJson('/api/v1/auth/mfa/disable');

        $response->assertStatus(401);
    }
}
