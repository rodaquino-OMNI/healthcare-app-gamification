<?php

namespace Tests\Feature\Api\V1\Plan;

use App\Models\Claim;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ClaimTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ─── Index ────────────────────────────────────────────────────────

    public function test_index_returns_paginated_claims_for_authenticated_user(): void
    {
        Sanctum::actingAs($this->user);

        Claim::factory()->count(3)->create(['user_id' => $this->user->id]);
        Claim::factory()->count(2)->create(); // other user's claims

        $response = $this->getJson('/api/v1/plan/claims');

        $response->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [['id']],
                'links',
                'meta',
            ]);
    }

    // ─── Store ────────────────────────────────────────────────────────

    public function test_store_creates_claim_and_returns_201(): void
    {
        Sanctum::actingAs($this->user);

        $plan = Plan::factory()->create(['user_id' => $this->user->id]);

        $payload = [
            'plan_id' => $plan->id,
            'type' => 'medical',
            'amount' => 1500.50,
            'description' => 'Doctor visit',
            'occurred_at' => '2026-01-15',
        ];

        $response = $this->postJson('/api/v1/plan/claims', $payload);

        $response->assertCreated()
            ->assertJsonStructure(['data' => ['id']]);

        $this->assertDatabaseHas('claims', [
            'user_id' => $this->user->id,
            'type' => 'medical',
        ]);
    }

    public function test_store_returns_422_when_validation_fails(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/v1/plan/claims', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['plan_id', 'type', 'amount', 'description', 'occurred_at']);
    }

    // ─── Show ─────────────────────────────────────────────────────────

    public function test_show_returns_claim(): void
    {
        Sanctum::actingAs($this->user);

        $claim = Claim::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/v1/plan/claims/{$claim->id}");

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id']]);
    }

    public function test_show_returns_404_for_nonexistent_claim(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/plan/claims/00000000-0000-0000-0000-000000000000');

        $response->assertNotFound();
    }

    // ─── Update ───────────────────────────────────────────────────────

    public function test_update_modifies_claim_and_returns_200(): void
    {
        Sanctum::actingAs($this->user);

        $claim = Claim::factory()->create(['user_id' => $this->user->id]);

        $response = $this->putJson("/api/v1/plan/claims/{$claim->id}", [
            'description' => 'Updated description',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id']]);
    }

    // ─── Destroy ──────────────────────────────────────────────────────

    public function test_destroy_deletes_claim_and_returns_204(): void
    {
        Sanctum::actingAs($this->user);

        $claim = Claim::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/v1/plan/claims/{$claim->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('claims', ['id' => $claim->id]);
    }

    // ─── Auth ─────────────────────────────────────────────────────────

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/v1/plan/claims');

        $response->assertUnauthorized();
    }
}
