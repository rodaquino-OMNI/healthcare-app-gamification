<?php

namespace Tests\Feature\Api\V1\Plan;

use App\Models\Coverage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CoverageTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ─── Index ────────────────────────────────────────────────────────

    public function test_index_returns_paginated_coverages(): void
    {
        Sanctum::actingAs($this->user);

        Coverage::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/plan/coverages');

        $response->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [['id']],
                'links',
                'meta',
            ]);
    }

    // ─── Show ─────────────────────────────────────────────────────────

    public function test_show_returns_coverage(): void
    {
        Sanctum::actingAs($this->user);

        $coverage = Coverage::factory()->create();

        $response = $this->getJson("/api/v1/plan/coverages/{$coverage->id}");

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id']]);
    }

    public function test_show_returns_404_for_nonexistent_coverage(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/plan/coverages/00000000-0000-0000-0000-000000000000');

        $response->assertNotFound();
    }

    // ─── Auth ─────────────────────────────────────────────────────────

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/v1/plan/coverages');

        $response->assertUnauthorized();
    }
}
