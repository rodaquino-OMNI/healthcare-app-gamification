<?php

namespace Tests\Feature\Api\V1\Health;

use App\Models\HealthGoal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HealthGoalTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ── Index ───────────────────────────────────────────────────────

    public function test_index_returns_paginated_goals(): void
    {
        Sanctum::actingAs($this->user);
        HealthGoal::factory()->count(3)->create(['record_id' => $this->user->id]);

        $response = $this->getJson('/api/v1/health/goals');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [['id', 'type', 'title', 'target_value', 'unit', 'period']],
                'links',
                'meta',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_index_unauthenticated(): void
    {
        $response = $this->getJson('/api/v1/health/goals');

        $response->assertStatus(401);
    }

    public function test_index_only_returns_own_goals(): void
    {
        Sanctum::actingAs($this->user);

        HealthGoal::factory()->count(2)->create(['record_id' => $this->user->id]);
        HealthGoal::factory()->count(3)->create(); // other user's record_id

        $response = $this->getJson('/api/v1/health/goals');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    // ── Store ───────────────────────────────────────────────────────

    public function test_store_creates_goal(): void
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'type' => 'STEPS',
            'title' => 'Walk 10000 steps daily',
            'description' => 'Daily step goal',
            'target_value' => 10000,
            'unit' => 'steps',
            'period' => 'DAILY',
            'starts_at' => '2026-01-01',
            'ends_at' => '2026-12-31',
        ];

        $response = $this->postJson('/api/v1/health/goals', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'type', 'title', 'target_value']]);

        $this->assertDatabaseHas('health_goals', [
            'record_id' => $this->user->id,
            'type' => 'STEPS',
            'title' => 'Walk 10000 steps daily',
        ]);
    }

    public function test_store_validation_errors(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/v1/health/goals', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type', 'title', 'target_value', 'unit', 'period', 'starts_at']);
    }

    // ── Show ────────────────────────────────────────────────────────

    public function test_show_returns_single_goal(): void
    {
        Sanctum::actingAs($this->user);
        $goal = HealthGoal::factory()->create(['record_id' => $this->user->id]);

        $response = $this->getJson("/api/v1/health/goals/{$goal->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'type', 'title']])
            ->assertJsonPath('data.id', $goal->id);
    }

    public function test_show_not_found(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/health/goals/00000000-0000-0000-0000-000000000000');

        $response->assertStatus(404);
    }

    // ── Update ──────────────────────────────────────────────────────

    public function test_update_goal(): void
    {
        Sanctum::actingAs($this->user);
        $goal = HealthGoal::factory()->create(['record_id' => $this->user->id]);

        $response = $this->putJson("/api/v1/health/goals/{$goal->id}", [
            'title' => 'Updated Goal Title',
            'target_value' => 5000,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.title', 'Updated Goal Title');

        $this->assertDatabaseHas('health_goals', [
            'id' => $goal->id,
            'title' => 'Updated Goal Title',
        ]);
    }

    // ── Destroy ─────────────────────────────────────────────────────

    public function test_destroy_goal(): void
    {
        Sanctum::actingAs($this->user);
        $goal = HealthGoal::factory()->create(['record_id' => $this->user->id]);

        $response = $this->deleteJson("/api/v1/health/goals/{$goal->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('health_goals', ['id' => $goal->id]);
    }
}
