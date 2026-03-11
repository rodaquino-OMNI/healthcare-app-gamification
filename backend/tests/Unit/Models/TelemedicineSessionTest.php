<?php

namespace Tests\Unit\Models;

use App\Models\Appointment;
use App\Models\TelemedicineSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TelemedicineSessionTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $patient = User::factory()->create();
        $providerUser = User::factory()->create();
        $session = TelemedicineSession::factory()->create([
            'patient_id' => $patient->id,
            'provider_id' => $providerUser->id,
        ]);

        $this->assertDatabaseHas('telemedicine_sessions', ['id' => $session->id]);
    }

    public function test_casts_start_time_to_datetime(): void
    {
        $patient = User::factory()->create();
        $providerUser = User::factory()->create();
        $session = TelemedicineSession::factory()->create([
            'patient_id' => $patient->id,
            'provider_id' => $providerUser->id,
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $session->start_time);
    }

    public function test_casts_end_time_to_datetime(): void
    {
        $patient = User::factory()->create();
        $providerUser = User::factory()->create();
        $session = TelemedicineSession::factory()->create([
            'patient_id' => $patient->id,
            'provider_id' => $providerUser->id,
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $session->end_time);
    }

    public function test_appointment_relationship_returns_belongs_to(): void
    {
        $patient = User::factory()->create();
        $providerUser = User::factory()->create();
        $session = TelemedicineSession::factory()->create([
            'patient_id' => $patient->id,
            'provider_id' => $providerUser->id,
        ]);

        $this->assertInstanceOf(BelongsTo::class, $session->appointment());
    }

    public function test_appointment_relationship_returns_correct_model(): void
    {
        $appointment = Appointment::factory()->create();
        $patient = User::factory()->create();
        $providerUser = User::factory()->create();
        $session = TelemedicineSession::factory()->create([
            'appointment_id' => $appointment->id,
            'patient_id' => $patient->id,
            'provider_id' => $providerUser->id,
        ]);

        $this->assertInstanceOf(Appointment::class, $session->appointment);
        $this->assertEquals($appointment->id, $session->appointment->id);
    }

    public function test_patient_relationship_returns_belongs_to(): void
    {
        $patient = User::factory()->create();
        $providerUser = User::factory()->create();
        $session = TelemedicineSession::factory()->create([
            'patient_id' => $patient->id,
            'provider_id' => $providerUser->id,
        ]);

        $this->assertInstanceOf(BelongsTo::class, $session->patient());
    }

    public function test_patient_relationship_returns_correct_model(): void
    {
        $patient = User::factory()->create();
        $providerUser = User::factory()->create();
        $session = TelemedicineSession::factory()->create([
            'patient_id' => $patient->id,
            'provider_id' => $providerUser->id,
        ]);

        $this->assertInstanceOf(User::class, $session->patient);
        $this->assertEquals($patient->id, $session->patient->id);
    }

    public function test_provider_relationship_returns_belongs_to(): void
    {
        $patient = User::factory()->create();
        $providerUser = User::factory()->create();
        $session = TelemedicineSession::factory()->create([
            'patient_id' => $patient->id,
            'provider_id' => $providerUser->id,
        ]);

        $this->assertInstanceOf(BelongsTo::class, $session->provider());
    }

    public function test_provider_relationship_returns_correct_model(): void
    {
        $patient = User::factory()->create();
        $providerUser = User::factory()->create();
        $session = TelemedicineSession::factory()->create([
            'patient_id' => $patient->id,
            'provider_id' => $providerUser->id,
        ]);

        $this->assertInstanceOf(User::class, $session->provider);
        $this->assertEquals($providerUser->id, $session->provider->id);
    }
}
