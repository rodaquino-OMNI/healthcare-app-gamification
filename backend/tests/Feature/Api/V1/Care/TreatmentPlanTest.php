<?php

namespace Tests\Feature\Api\V1\Care;

use App\Models\Provider;
use App\Models\TreatmentPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TreatmentPlanTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ── Index ───────────────────────────────────────────────────────

    public function test_index_returns_paginated_plans(): void
    {
        Sanctum::actingAs($this->user);
        TreatmentPlan::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/v1/care/treatment-plans');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [['id', 'title', 'description']],
                'links',
                'meta',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_index_unauthenticated(): void
    {
        $response = $this->getJson('/api/v1/care/treatment-plans');

        $response->assertStatus(401);
    }

    public function test_index_only_returns_own_plans(): void
    {
        Sanctum::actingAs($this->user);

        TreatmentPlan::factory()->count(2)->create(['user_id' => $this->user->id]);
        TreatmentPlan::factory()->count(3)->create(); // other user

        $response = $this->getJson('/api/v1/care/treatment-plans');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    // ── Store ───────────────────────────────────────────────────────

    public function test_store_creates_plan(): void
    {
        Sanctum::actingAs($this->user);
        $provider = Provider::factory()->create();

        $payload = [
            'title' => 'Physical Therapy Program',
            'description' => 'Post-surgery rehabilitation',
            'provider_id' => $provider->id,
            'starts_at' => '2026-01-01',
            'ends_at' => '2026-06-01',
            'goals' => ['Improve mobility', 'Reduce pain'],
        ];

        $response = $this->postJson('/api/v1/care/treatment-plans', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'title', 'description']]);

        $this->assertDatabaseHas('treatment_plans', [
            'user_id' => $this->user->id,
            'name' => 'Physical Therapy Program',
        ]);
    }

    public function test_store_validation_errors(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/v1/care/treatment-plans', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'provider_id', 'starts_at']);
    }

    // ── Show ────────────────────────────────────────────────────────

    public function test_show_returns_single_plan(): void
    {
        Sanctum::actingAs($this->user);
        $plan = TreatmentPlan::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/v1/care/treatment-plans/{$plan->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'title', 'description']])
            ->assertJsonPath('data.id', $plan->id);
    }

    public function test_show_not_found(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/care/treatment-plans/00000000-0000-0000-0000-000000000000');

        $response->assertStatus(404);
    }

    // ── Update ──────────────────────────────────────────────────────

    public function test_update_plan(): void
    {
        Sanctum::actingAs($this->user);
        $plan = TreatmentPlan::factory()->create(['user_id' => $this->user->id]);

        $response = $this->putJson("/api/v1/care/treatment-plans/{$plan->id}", [
            'title' => 'Updated Plan Title',
            'description' => 'Updated description',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('treatment_plans', [
            'id' => $plan->id,
            'description' => 'Updated description',
        ]);
    }

    // ── Destroy ─────────────────────────────────────────────────────

    public function test_destroy_plan(): void
    {
        Sanctum::actingAs($this->user);
        $plan = TreatmentPlan::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/v1/care/treatment-plans/{$plan->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('treatment_plans', ['id' => $plan->id]);
    }
}
