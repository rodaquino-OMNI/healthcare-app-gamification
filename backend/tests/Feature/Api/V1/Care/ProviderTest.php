<?php

namespace Tests\Feature\Api\V1\Care;

use App\Models\Provider;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProviderTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ── Index ───────────────────────────────────────────────────────

    public function test_index_returns_paginated_providers(): void
    {
        Sanctum::actingAs($this->user);
        Provider::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/care/providers');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [['id', 'name', 'specialty']],
                'links',
                'meta',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_index_unauthenticated(): void
    {
        $response = $this->getJson('/api/v1/care/providers');

        $response->assertStatus(401);
    }

    // ── Show ────────────────────────────────────────────────────────

    public function test_show_returns_single_provider(): void
    {
        Sanctum::actingAs($this->user);
        $provider = Provider::factory()->create();

        $response = $this->getJson("/api/v1/care/providers/{$provider->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'name', 'specialty']])
            ->assertJsonPath('data.id', $provider->id);
    }

    public function test_show_not_found(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/care/providers/00000000-0000-0000-0000-000000000000');

        $response->assertStatus(404);
    }
}
