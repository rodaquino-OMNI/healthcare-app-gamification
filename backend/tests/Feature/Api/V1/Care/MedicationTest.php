<?php

namespace Tests\Feature\Api\V1\Care;

use App\Models\Medication;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MedicationTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ── Index ───────────────────────────────────────────────────────

    public function test_index_returns_paginated_medications(): void
    {
        Sanctum::actingAs($this->user);
        Medication::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/v1/care/medications');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [['id', 'name', 'dosage', 'frequency']],
                'links',
                'meta',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_index_unauthenticated(): void
    {
        $response = $this->getJson('/api/v1/care/medications');

        $response->assertStatus(401);
    }

    public function test_index_only_returns_own_medications(): void
    {
        Sanctum::actingAs($this->user);

        Medication::factory()->count(2)->create(['user_id' => $this->user->id]);
        Medication::factory()->count(3)->create(); // other user

        $response = $this->getJson('/api/v1/care/medications');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    // ── Store ───────────────────────────────────────────────────────

    public function test_store_creates_medication(): void
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'name' => 'Amoxicillin',
            'dosage' => 500,
            'frequency' => 'Twice daily',
            'starts_at' => '2026-01-01',
            'ends_at' => '2026-06-01',
            'instructions' => 'Take with food',
        ];

        $response = $this->postJson('/api/v1/care/medications', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'name', 'dosage', 'frequency']]);

        $this->assertDatabaseHas('medications', [
            'user_id' => $this->user->id,
            'name' => 'Amoxicillin',
        ]);
    }

    public function test_store_validation_errors(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/v1/care/medications', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'dosage', 'frequency', 'starts_at']);
    }

    // ── Show ────────────────────────────────────────────────────────

    public function test_show_returns_single_medication(): void
    {
        Sanctum::actingAs($this->user);
        $medication = Medication::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/v1/care/medications/{$medication->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'name', 'dosage', 'frequency']])
            ->assertJsonPath('data.id', $medication->id);
    }

    public function test_show_not_found(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/care/medications/00000000-0000-0000-0000-000000000000');

        $response->assertStatus(404);
    }

    // ── Update ──────────────────────────────────────────────────────

    public function test_update_medication(): void
    {
        Sanctum::actingAs($this->user);
        $medication = Medication::factory()->create(['user_id' => $this->user->id]);

        $response = $this->putJson("/api/v1/care/medications/{$medication->id}", [
            'name' => 'Updated Medication Name',
            'dosage' => '250mg',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Updated Medication Name');

        $this->assertDatabaseHas('medications', [
            'id' => $medication->id,
            'name' => 'Updated Medication Name',
        ]);
    }

    // ── Destroy ─────────────────────────────────────────────────────

    public function test_destroy_medication(): void
    {
        Sanctum::actingAs($this->user);
        $medication = Medication::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/v1/care/medications/{$medication->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('medications', ['id' => $medication->id]);
    }

    // ── Edge-case / negative tests ───────────────────────────────────

    public function test_update_nonexistent_medication_returns_404(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->putJson('/api/v1/care/medications/00000000-0000-0000-0000-000000000000', [
            'name' => 'Does not exist',
        ]);

        $response->assertStatus(404);
    }

    public function test_destroy_nonexistent_medication_returns_404(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->deleteJson('/api/v1/care/medications/00000000-0000-0000-0000-000000000000');

        $response->assertStatus(404);
    }

    public function test_index_returns_empty_when_no_medications(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/care/medications');

        $response->assertStatus(200)
            ->assertJsonCount(0, 'data');
    }
}
