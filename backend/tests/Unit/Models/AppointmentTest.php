<?php

namespace Tests\Unit\Models;

use App\Enums\AppointmentStatus;
use App\Enums\AppointmentType;
use App\Models\Appointment;
use App\Models\Provider;
use App\Models\TelemedicineSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppointmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $appointment = Appointment::factory()->create();

        $this->assertDatabaseHas('appointments', ['id' => $appointment->id]);
    }

    public function test_casts_date_time_to_datetime(): void
    {
        $appointment = Appointment::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $appointment->date_time);
    }

    public function test_casts_type_to_appointment_type_enum(): void
    {
        $appointment = Appointment::factory()->create(['type' => AppointmentType::IN_PERSON]);

        $this->assertInstanceOf(AppointmentType::class, $appointment->type);
        $this->assertEquals(AppointmentType::IN_PERSON, $appointment->type);
    }

    public function test_casts_status_to_appointment_status_enum(): void
    {
        $appointment = Appointment::factory()->create(['status' => AppointmentStatus::SCHEDULED]);

        $this->assertInstanceOf(AppointmentStatus::class, $appointment->status);
        $this->assertEquals(AppointmentStatus::SCHEDULED, $appointment->status);
    }

    public function test_user_relationship_returns_belongs_to(): void
    {
        $appointment = Appointment::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $appointment->user());
    }

    public function test_user_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        $appointment = Appointment::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $appointment->user);
        $this->assertEquals($user->id, $appointment->user->id);
    }

    public function test_provider_relationship_returns_belongs_to(): void
    {
        $appointment = Appointment::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $appointment->provider());
    }

    public function test_provider_relationship_returns_correct_model(): void
    {
        $provider = Provider::factory()->create();
        $appointment = Appointment::factory()->create(['provider_id' => $provider->id]);

        $this->assertInstanceOf(Provider::class, $appointment->provider);
        $this->assertEquals($provider->id, $appointment->provider->id);
    }

    public function test_telemedicine_sessions_relationship_returns_has_many(): void
    {
        $appointment = Appointment::factory()->create();

        $this->assertInstanceOf(HasMany::class, $appointment->telemedicineSessions());
    }

    public function test_telemedicine_sessions_relationship_returns_correct_models(): void
    {
        $appointment = Appointment::factory()->create();
        $patient = User::factory()->create();
        $providerUser = User::factory()->create();

        TelemedicineSession::factory()->count(2)->create([
            'appointment_id' => $appointment->id,
            'patient_id' => $patient->id,
            'provider_id' => $providerUser->id,
        ]);

        $this->assertCount(2, $appointment->telemedicineSessions);
        $this->assertInstanceOf(TelemedicineSession::class, $appointment->telemedicineSessions->first());
    }
}
