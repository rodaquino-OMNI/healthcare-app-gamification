<?php

namespace Tests\Feature\Api\V1\Health;

use App\Models\HealthMetric;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HealthMetricTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ── Index ───────────────────────────────────────────────────────

    public function test_index_returns_paginated_metrics(): void
    {
        Sanctum::actingAs($this->user);
        HealthMetric::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/v1/health/metrics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [['id', 'type', 'value', 'unit', 'source']],
                'links',
                'meta',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_index_unauthenticated(): void
    {
        $response = $this->getJson('/api/v1/health/metrics');

        $response->assertStatus(401);
    }

    public function test_index_only_returns_own_metrics(): void
    {
        Sanctum::actingAs($this->user);

        HealthMetric::factory()->count(2)->create(['user_id' => $this->user->id]);
        HealthMetric::factory()->count(3)->create(); // other user

        $response = $this->getJson('/api/v1/health/metrics');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    // ── Store ───────────────────────────────────────────────────────

    public function test_store_creates_metric(): void
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'type' => 'STEPS',
            'value' => 8500,
            'unit' => 'steps',
            'source' => 'USER_INPUT',
        ];

        $response = $this->postJson('/api/v1/health/metrics', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'type', 'value', 'unit', 'source']]);

        $this->assertDatabaseHas('health_metrics', [
            'user_id' => $this->user->id,
            'type' => 'STEPS',
            'value' => 8500,
            'unit' => 'steps',
            'source' => 'USER_INPUT',
        ]);
    }

    public function test_store_validation_errors(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/v1/health/metrics', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type', 'value', 'unit', 'source']);
    }

    // ── Show ────────────────────────────────────────────────────────

    public function test_show_returns_single_metric(): void
    {
        Sanctum::actingAs($this->user);
        $metric = HealthMetric::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/v1/health/metrics/{$metric->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'type', 'value', 'unit']])
            ->assertJsonPath('data.id', $metric->id);
    }

    public function test_show_not_found(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/health/metrics/00000000-0000-0000-0000-000000000000');

        $response->assertStatus(404);
    }

    // ── Update ──────────────────────────────────────────────────────

    public function test_update_metric(): void
    {
        Sanctum::actingAs($this->user);
        $metric = HealthMetric::factory()->create(['user_id' => $this->user->id]);

        $response = $this->putJson("/api/v1/health/metrics/{$metric->id}", [
            'value' => 9999,
            'unit' => 'bpm',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.value', 9999);

        $this->assertDatabaseHas('health_metrics', [
            'id' => $metric->id,
            'value' => 9999,
            'unit' => 'bpm',
        ]);
    }

    // ── Destroy ─────────────────────────────────────────────────────

    public function test_destroy_metric(): void
    {
        Sanctum::actingAs($this->user);
        $metric = HealthMetric::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/v1/health/metrics/{$metric->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('health_metrics', ['id' => $metric->id]);
    }
}
