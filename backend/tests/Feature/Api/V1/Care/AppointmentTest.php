<?php

namespace Tests\Feature\Api\V1\Care;

use App\Models\Appointment;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AppointmentTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ── Index ───────────────────────────────────────────────────────

    public function test_index_returns_paginated_appointments(): void
    {
        Sanctum::actingAs($this->user);
        $provider = Provider::factory()->create();
        Appointment::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'provider_id' => $provider->id,
        ]);

        $response = $this->getJson('/api/v1/care/appointments');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [['id', 'provider_id', 'type', 'status']],
                'links',
                'meta',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_index_unauthenticated(): void
    {
        $response = $this->getJson('/api/v1/care/appointments');

        $response->assertStatus(401);
    }

    public function test_index_only_returns_own_appointments(): void
    {
        Sanctum::actingAs($this->user);

        $provider = Provider::factory()->create();
        Appointment::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'provider_id' => $provider->id,
        ]);
        Appointment::factory()->count(3)->create([
            'provider_id' => $provider->id,
        ]); // other user

        $response = $this->getJson('/api/v1/care/appointments');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    // ── Store ───────────────────────────────────────────────────────

    public function test_store_creates_appointment(): void
    {
        Sanctum::actingAs($this->user);
        $provider = Provider::factory()->create();

        $payload = [
            'provider_id' => $provider->id,
            'type' => 'IN_PERSON',
            'scheduled_at' => now()->addDays(7)->toDateTimeString(),
            'duration_minutes' => 30,
            'notes' => 'First visit',
        ];

        $response = $this->postJson('/api/v1/care/appointments', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'provider_id', 'type']]);

        $this->assertDatabaseHas('appointments', [
            'user_id' => $this->user->id,
            'provider_id' => $provider->id,
            'type' => 'IN_PERSON',
        ]);
    }

    public function test_store_validation_errors(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/v1/care/appointments', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['provider_id', 'type', 'scheduled_at', 'duration_minutes']);
    }

    // ── Show ────────────────────────────────────────────────────────

    public function test_show_returns_single_appointment(): void
    {
        Sanctum::actingAs($this->user);
        $provider = Provider::factory()->create();
        $appointment = Appointment::factory()->create([
            'user_id' => $this->user->id,
            'provider_id' => $provider->id,
        ]);

        $response = $this->getJson("/api/v1/care/appointments/{$appointment->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'provider_id', 'type', 'status']])
            ->assertJsonPath('data.id', $appointment->id);
    }

    public function test_show_not_found(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/care/appointments/00000000-0000-0000-0000-000000000000');

        $response->assertStatus(404);
    }

    // ── Update ──────────────────────────────────────────────────────

    public function test_update_appointment(): void
    {
        Sanctum::actingAs($this->user);
        $provider = Provider::factory()->create();
        $appointment = Appointment::factory()->create([
            'user_id' => $this->user->id,
            'provider_id' => $provider->id,
        ]);

        $response = $this->putJson("/api/v1/care/appointments/{$appointment->id}", [
            'notes' => 'Updated appointment notes',
            'status' => 'CANCELLED',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'CANCELLED',
        ]);
    }

    // ── Destroy ─────────────────────────────────────────────────────

    public function test_destroy_appointment(): void
    {
        Sanctum::actingAs($this->user);
        $provider = Provider::factory()->create();
        $appointment = Appointment::factory()->create([
            'user_id' => $this->user->id,
            'provider_id' => $provider->id,
        ]);

        $response = $this->deleteJson("/api/v1/care/appointments/{$appointment->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('appointments', ['id' => $appointment->id]);
    }
}
