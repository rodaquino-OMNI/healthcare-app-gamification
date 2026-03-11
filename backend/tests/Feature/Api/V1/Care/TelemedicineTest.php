<?php

namespace Tests\Feature\Api\V1\Care;

use App\Models\Appointment;
use App\Models\Provider;
use App\Models\TelemedicineSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TelemedicineTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ── Index ───────────────────────────────────────────────────────

    public function test_index_returns_paginated_sessions(): void
    {
        Sanctum::actingAs($this->user);

        $provider = Provider::factory()->create();
        $appointment = Appointment::factory()->create([
            'user_id' => $this->user->id,
            'provider_id' => $provider->id,
        ]);

        TelemedicineSession::factory()->count(3)->create([
            'patient_id' => $this->user->id,
            'provider_id' => $this->user->id,
            'appointment_id' => $appointment->id,
        ]);

        $response = $this->getJson('/api/v1/care/telemedicine');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [['id', 'provider_id', 'status']],
                'links',
                'meta',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_index_unauthenticated(): void
    {
        $response = $this->getJson('/api/v1/care/telemedicine');

        $response->assertStatus(401);
    }

    public function test_index_only_returns_own_sessions(): void
    {
        Sanctum::actingAs($this->user);

        $provider = Provider::factory()->create();
        $appointment = Appointment::factory()->create([
            'user_id' => $this->user->id,
            'provider_id' => $provider->id,
        ]);

        TelemedicineSession::factory()->count(2)->create([
            'patient_id' => $this->user->id,
            'provider_id' => $this->user->id,
            'appointment_id' => $appointment->id,
        ]);

        // Other user's sessions
        $otherUser = User::factory()->create();
        $otherAppointment = Appointment::factory()->create([
            'user_id' => $otherUser->id,
            'provider_id' => $provider->id,
        ]);
        TelemedicineSession::factory()->count(3)->create([
            'patient_id' => $otherUser->id,
            'provider_id' => $otherUser->id,
            'appointment_id' => $otherAppointment->id,
        ]);

        $response = $this->getJson('/api/v1/care/telemedicine');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    // ── Store ───────────────────────────────────────────────────────

    public function test_store_creates_session(): void
    {
        Sanctum::actingAs($this->user);
        $provider = Provider::factory()->create();
        $appointment = Appointment::factory()->create([
            'user_id' => $this->user->id,
            'provider_id' => $provider->id,
        ]);

        $payload = [
            'provider_id' => $provider->id,
            'appointment_id' => $appointment->id,
            'scheduled_at' => now()->addDays(3)->toDateTimeString(),
            'duration_minutes' => 30,
            'notes' => 'Follow-up consultation',
        ];

        $response = $this->postJson('/api/v1/care/telemedicine', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'provider_id', 'status']]);

        $this->assertDatabaseHas('telemedicine_sessions', [
            'patient_id' => $this->user->id,
        ]);
    }

    public function test_store_validation_errors(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/v1/care/telemedicine', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['provider_id', 'scheduled_at', 'duration_minutes']);
    }

    // ── Show ────────────────────────────────────────────────────────

    public function test_show_returns_single_session(): void
    {
        Sanctum::actingAs($this->user);

        $provider = Provider::factory()->create();
        $appointment = Appointment::factory()->create([
            'user_id' => $this->user->id,
            'provider_id' => $provider->id,
        ]);

        $session = TelemedicineSession::factory()->create([
            'patient_id' => $this->user->id,
            'provider_id' => $this->user->id,
            'appointment_id' => $appointment->id,
        ]);

        $response = $this->getJson("/api/v1/care/telemedicine/{$session->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'provider_id', 'status']])
            ->assertJsonPath('data.id', $session->id);
    }

    public function test_show_not_found(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/care/telemedicine/00000000-0000-0000-0000-000000000000');

        $response->assertStatus(404);
    }

    // ── Update ──────────────────────────────────────────────────────

    public function test_update_session(): void
    {
        Sanctum::actingAs($this->user);

        $provider = Provider::factory()->create();
        $appointment = Appointment::factory()->create([
            'user_id' => $this->user->id,
            'provider_id' => $provider->id,
        ]);

        $session = TelemedicineSession::factory()->create([
            'patient_id' => $this->user->id,
            'provider_id' => $this->user->id,
            'appointment_id' => $appointment->id,
        ]);

        $response = $this->putJson("/api/v1/care/telemedicine/{$session->id}", [
            'status' => 'completed',
            'notes' => 'Session completed successfully',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('telemedicine_sessions', [
            'id' => $session->id,
            'status' => 'completed',
        ]);
    }

    // ── Destroy ─────────────────────────────────────────────────────

    public function test_destroy_session(): void
    {
        Sanctum::actingAs($this->user);

        $provider = Provider::factory()->create();
        $appointment = Appointment::factory()->create([
            'user_id' => $this->user->id,
            'provider_id' => $provider->id,
        ]);

        $session = TelemedicineSession::factory()->create([
            'patient_id' => $this->user->id,
            'provider_id' => $this->user->id,
            'appointment_id' => $appointment->id,
        ]);

        $response = $this->deleteJson("/api/v1/care/telemedicine/{$session->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('telemedicine_sessions', ['id' => $session->id]);
    }

    // ── Edge-case / negative tests ───────────────────────────────────

    public function test_update_nonexistent_session_returns_404(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->putJson('/api/v1/care/telemedicine/00000000-0000-0000-0000-000000000000', [
            'status' => 'completed',
        ]);

        $response->assertStatus(404);
    }

    public function test_destroy_nonexistent_session_returns_404(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->deleteJson('/api/v1/care/telemedicine/00000000-0000-0000-0000-000000000000');

        $response->assertStatus(404);
    }

    public function test_index_returns_empty_when_no_sessions(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/care/telemedicine');

        $response->assertStatus(200)
            ->assertJsonCount(0, 'data');
    }
}
