<?php

namespace Tests\Feature\Api\V1\Health;

use App\Models\DeviceConnection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DeviceConnectionTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ── Index ───────────────────────────────────────────────────────

    public function test_index_returns_paginated_connections(): void
    {
        Sanctum::actingAs($this->user);
        DeviceConnection::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/v1/health/devices');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [['id', 'device_type', 'device_name', 'status']],
                'links',
                'meta',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_index_unauthenticated(): void
    {
        $response = $this->getJson('/api/v1/health/devices');

        $response->assertStatus(401);
    }

    public function test_index_only_returns_own_connections(): void
    {
        Sanctum::actingAs($this->user);

        DeviceConnection::factory()->count(2)->create(['user_id' => $this->user->id]);
        DeviceConnection::factory()->count(3)->create(); // other user

        $response = $this->getJson('/api/v1/health/devices');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    // ── Store ───────────────────────────────────────────────────────

    public function test_store_creates_connection(): void
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'device_type' => 'FITBIT',
            'device_name' => 'My Fitbit Charge 5',
            'device_identifier' => 'FITBIT-12345',
        ];

        $response = $this->postJson('/api/v1/health/devices', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'device_type', 'device_name']]);

        $this->assertDatabaseHas('device_connections', [
            'user_id' => $this->user->id,
            'device_type' => 'FITBIT',
        ]);
    }

    public function test_store_validation_errors(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/v1/health/devices', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['device_type', 'device_name', 'device_identifier']);
    }

    // ── Show ────────────────────────────────────────────────────────

    public function test_show_returns_single_connection(): void
    {
        Sanctum::actingAs($this->user);
        $connection = DeviceConnection::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/v1/health/devices/{$connection->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'device_type', 'device_name']])
            ->assertJsonPath('data.id', $connection->id);
    }

    public function test_show_not_found(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/health/devices/00000000-0000-0000-0000-000000000000');

        $response->assertStatus(404);
    }

    // ── Update ──────────────────────────────────────────────────────

    public function test_update_connection(): void
    {
        Sanctum::actingAs($this->user);
        $connection = DeviceConnection::factory()->create(['user_id' => $this->user->id]);

        $response = $this->putJson("/api/v1/health/devices/{$connection->id}", [
            'status' => 'CONNECTED',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('device_connections', [
            'id' => $connection->id,
            'status' => 'CONNECTED',
        ]);
    }

    public function test_update_connection_with_tokens_and_metadata(): void
    {
        Sanctum::actingAs($this->user);
        $connection = DeviceConnection::factory()->create(['user_id' => $this->user->id]);

        $response = $this->putJson("/api/v1/health/devices/{$connection->id}", [
            'access_token' => 'new-access-token',
            'refresh_token' => 'new-refresh-token',
            'metadata' => ['key' => 'value'],
        ]);

        $response->assertStatus(200);
    }

    // ── Destroy ─────────────────────────────────────────────────────

    public function test_destroy_connection(): void
    {
        Sanctum::actingAs($this->user);
        $connection = DeviceConnection::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/v1/health/devices/{$connection->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('device_connections', ['id' => $connection->id]);
    }

    // ── Edge-case / negative tests ───────────────────────────────────

    public function test_update_nonexistent_connection_returns_404(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->putJson('/api/v1/health/devices/00000000-0000-0000-0000-000000000000', [
            'status' => 'CONNECTED',
        ]);

        $response->assertStatus(404);
    }

    public function test_destroy_nonexistent_connection_returns_404(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->deleteJson('/api/v1/health/devices/00000000-0000-0000-0000-000000000000');

        $response->assertStatus(404);
    }

    public function test_index_returns_empty_when_no_connections(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/health/devices');

        $response->assertStatus(200)
            ->assertJsonCount(0, 'data');
    }

    public function test_store_with_optional_tokens(): void
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'device_type' => 'FITBIT',
            'device_name' => 'My Fitbit',
            'device_identifier' => 'FITBIT-99999',
            'access_token' => 'my-access-token',
            'refresh_token' => 'my-refresh-token',
        ];

        $response = $this->postJson('/api/v1/health/devices', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'device_type', 'device_name']]);
    }
}
