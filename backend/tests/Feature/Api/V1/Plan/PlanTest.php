<?php

namespace Tests\Feature\Api\V1\Plan;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PlanTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ─── Index ────────────────────────────────────────────────────────

    public function test_index_returns_paginated_plans_for_authenticated_user(): void
    {
        Sanctum::actingAs($this->user);

        Plan::factory()->count(3)->create(['user_id' => $this->user->id]);
        Plan::factory()->count(2)->create(); // other user's plans

        $response = $this->getJson('/api/v1/plan/plans');

        $response->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [['id']],
                'links',
                'meta',
            ]);
    }

    // ─── Store ────────────────────────────────────────────────────────

    public function test_store_creates_plan_and_returns_201(): void
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'name' => 'Premium Health',
            'type' => 'premium',
            'price' => 299.99,
            'description' => 'Full coverage plan',
            'coverage_details' => ['medical' => true, 'dental' => true],
        ];

        $response = $this->postJson('/api/v1/plan/plans', $payload);

        $response->assertCreated()
            ->assertJsonStructure(['data' => ['id']]);

        $this->assertDatabaseHas('plans', [
            'user_id' => $this->user->id,
            'type' => 'premium',
        ]);
    }

    public function test_store_returns_422_when_validation_fails(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/v1/plan/plans', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'type', 'price']);
    }

    // ─── Show ─────────────────────────────────────────────────────────

    public function test_show_returns_plan(): void
    {
        Sanctum::actingAs($this->user);

        $plan = Plan::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/v1/plan/plans/{$plan->id}");

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id']]);
    }

    public function test_show_returns_404_for_nonexistent_plan(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/plan/plans/00000000-0000-0000-0000-000000000000');

        $response->assertNotFound();
    }

    // ─── Update ───────────────────────────────────────────────────────

    public function test_update_modifies_plan_and_returns_200(): void
    {
        Sanctum::actingAs($this->user);

        $plan = Plan::factory()->create(['user_id' => $this->user->id]);

        $response = $this->putJson("/api/v1/plan/plans/{$plan->id}", [
            'type' => 'enterprise',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id']]);

        $this->assertDatabaseHas('plans', [
            'id' => $plan->id,
            'type' => 'enterprise',
        ]);
    }

    // ─── Destroy ──────────────────────────────────────────────────────

    public function test_destroy_deletes_plan_and_returns_204(): void
    {
        Sanctum::actingAs($this->user);

        $plan = Plan::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/v1/plan/plans/{$plan->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('plans', ['id' => $plan->id]);
    }

    // ─── Auth ─────────────────────────────────────────────────────────

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/v1/plan/plans');

        $response->assertUnauthorized();
    }

    // ── Edge-case / negative tests ───────────────────────────────────

    public function test_update_nonexistent_plan_returns_404(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->putJson('/api/v1/plan/plans/00000000-0000-0000-0000-000000000000', [
            'type' => 'basic',
        ]);

        $response->assertNotFound();
    }

    public function test_destroy_nonexistent_plan_returns_404(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->deleteJson('/api/v1/plan/plans/00000000-0000-0000-0000-000000000000');

        $response->assertNotFound();
    }

    public function test_index_returns_empty_when_no_plans(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/plan/plans');

        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }
}
