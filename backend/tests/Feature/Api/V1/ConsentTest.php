<?php

namespace Tests\Feature\Api\V1;

use App\Enums\ConsentStatus;
use App\Models\ConsentRecord;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ConsentTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ─── Index ────────────────────────────────────────────────────────

    public function test_index_returns_paginated_consents_for_authenticated_user(): void
    {
        Sanctum::actingAs($this->user);

        ConsentRecord::factory()->count(3)->create(['user_id' => $this->user->id]);
        ConsentRecord::factory()->count(2)->create(); // other user's consents

        $response = $this->getJson('/api/v1/consent');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    // ─── Store ────────────────────────────────────────────────────────

    public function test_store_creates_consent_and_returns_201(): void
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'consent_type' => 'DATA_PROCESSING',
            'status' => 'ACTIVE',
            'purpose' => 'Health data analysis',
            'data_categories' => ['health', 'personal'],
            'granted_at' => '2026-01-01 00:00:00',
            'expires_at' => '2027-01-01 00:00:00',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'TestAgent/1.0',
            'version' => 1,
        ];

        $response = $this->postJson('/api/v1/consent', $payload);

        $response->assertCreated()
            ->assertJsonStructure(['data' => ['id']]);

        $this->assertDatabaseHas('consent_records', [
            'user_id' => $this->user->id,
            'consent_type' => 'DATA_PROCESSING',
            'status' => 'ACTIVE',
        ]);
    }

    // ─── Revoke ───────────────────────────────────────────────────────

    public function test_revoke_sets_status_to_revoked(): void
    {
        Sanctum::actingAs($this->user);

        $consent = ConsentRecord::factory()->create([
            'user_id' => $this->user->id,
            'status' => ConsentStatus::ACTIVE,
        ]);

        $response = $this->deleteJson("/api/v1/consent/{$consent->id}");

        $response->assertOk();

        $this->assertDatabaseHas('consent_records', [
            'id' => $consent->id,
            'status' => 'REVOKED',
        ]);
    }

    public function test_revoke_returns_404_for_nonexistent_consent(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->deleteJson('/api/v1/consent/00000000-0000-0000-0000-000000000000');

        $response->assertNotFound();
    }

    // ─── Auth ─────────────────────────────────────────────────────────

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/v1/consent');

        $response->assertUnauthorized();
    }
}
