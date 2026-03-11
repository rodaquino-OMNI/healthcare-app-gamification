<?php

namespace Tests\Feature\Api\V1\Health;

use App\Models\MedicalEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MedicalEventTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ── Index ───────────────────────────────────────────────────────

    public function test_index_returns_paginated_events(): void
    {
        Sanctum::actingAs($this->user);
        MedicalEvent::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/v1/health/medical-events');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [['id', 'title', 'event_type', 'severity', 'occurred_at']],
                'links',
                'meta',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_index_unauthenticated(): void
    {
        $response = $this->getJson('/api/v1/health/medical-events');

        $response->assertStatus(401);
    }

    public function test_index_only_returns_own_events(): void
    {
        Sanctum::actingAs($this->user);

        MedicalEvent::factory()->count(2)->create(['user_id' => $this->user->id]);
        MedicalEvent::factory()->count(3)->create(); // other user

        $response = $this->getJson('/api/v1/health/medical-events');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    // ── Store ───────────────────────────────────────────────────────

    public function test_store_creates_event(): void
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'title' => 'Annual Checkup',
            'description' => 'Routine annual physical',
            'event_type' => 'consultation',
            'severity' => 'low',
            'occurred_at' => '2026-01-15',
        ];

        $response = $this->postJson('/api/v1/health/medical-events', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'title', 'event_type']]);

        $this->assertDatabaseHas('medical_events', [
            'user_id' => $this->user->id,
            'title' => 'Annual Checkup',
        ]);
    }

    public function test_store_validation_errors(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/v1/health/medical-events', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'event_type', 'occurred_at']);
    }

    // ── Show ────────────────────────────────────────────────────────

    public function test_show_returns_single_event(): void
    {
        Sanctum::actingAs($this->user);
        $event = MedicalEvent::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/v1/health/medical-events/{$event->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'title']])
            ->assertJsonPath('data.id', $event->id);
    }

    public function test_show_not_found(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/health/medical-events/00000000-0000-0000-0000-000000000000');

        $response->assertStatus(404);
    }

    // ── Update ──────────────────────────────────────────────────────

    public function test_update_event(): void
    {
        Sanctum::actingAs($this->user);
        $event = MedicalEvent::factory()->create(['user_id' => $this->user->id]);

        $response = $this->putJson("/api/v1/health/medical-events/{$event->id}", [
            'title' => 'Updated Event Title',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.title', 'Updated Event Title');

        $this->assertDatabaseHas('medical_events', [
            'id' => $event->id,
            'title' => 'Updated Event Title',
        ]);
    }

    // ── Destroy ─────────────────────────────────────────────────────

    public function test_destroy_event(): void
    {
        Sanctum::actingAs($this->user);
        $event = MedicalEvent::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/v1/health/medical-events/{$event->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('medical_events', ['id' => $event->id]);
    }
}
