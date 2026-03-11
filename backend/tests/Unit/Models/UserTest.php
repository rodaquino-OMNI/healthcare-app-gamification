<?php

namespace Tests\Unit\Models;

use App\Models\Appointment;
use App\Models\Claim;
use App\Models\ConsentRecord;
use App\Models\DeviceConnection;
use App\Models\GameProfile;
use App\Models\HealthMetric;
use App\Models\LeaderboardEntry;
use App\Models\MedicalEvent;
use App\Models\Medication;
use App\Models\Notification;
use App\Models\NotificationPreference;
use App\Models\Plan;
use App\Models\Role;
use App\Models\TreatmentPlan;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $user = User::factory()->create();

        $this->assertDatabaseHas('users', ['id' => $user->id]);
        $this->assertNotNull($user->name);
        $this->assertNotNull($user->email);
    }

    public function test_has_correct_fillable_fields(): void
    {
        $user = new User();

        $this->assertEquals([
            'name',
            'email',
            'phone',
            'cpf',
            'password',
        ], $user->getFillable());
    }

    public function test_has_correct_hidden_fields(): void
    {
        $user = new User();

        $this->assertEquals([
            'password',
            'remember_token',
        ], $user->getHidden());
    }

    public function test_casts_email_verified_at_to_datetime(): void
    {
        $user = User::factory()->create(['email_verified_at' => '2025-01-15 10:30:00']);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $user->email_verified_at);
    }

    public function test_casts_password_as_hashed(): void
    {
        $user = User::factory()->create(['password' => 'plaintext']);

        $this->assertNotEquals('plaintext', $user->password);
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('plaintext', $user->password));
    }

    public function test_roles_relationship_returns_belongs_to_many(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(BelongsToMany::class, $user->roles());
    }

    public function test_roles_relationship_returns_correct_models(): void
    {
        $user = User::factory()->create();
        $role = Role::factory()->create();
        $user->roles()->attach($role);

        $this->assertCount(1, $user->roles);
        $this->assertInstanceOf(Role::class, $user->roles->first());
    }

    public function test_game_profile_relationship_returns_has_one(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(HasOne::class, $user->gameProfile());
    }

    public function test_game_profile_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        GameProfile::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(GameProfile::class, $user->gameProfile);
    }

    public function test_appointments_relationship_returns_has_many(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(HasMany::class, $user->appointments());
    }

    public function test_appointments_relationship_returns_correct_models(): void
    {
        $user = User::factory()->create();
        Appointment::factory()->count(2)->create(['user_id' => $user->id]);

        $this->assertCount(2, $user->appointments);
        $this->assertInstanceOf(Appointment::class, $user->appointments->first());
    }

    public function test_medications_relationship_returns_has_many(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(HasMany::class, $user->medications());
    }

    public function test_medications_relationship_returns_correct_models(): void
    {
        $user = User::factory()->create();
        Medication::factory()->count(3)->create(['user_id' => $user->id]);

        $this->assertCount(3, $user->medications);
        $this->assertInstanceOf(Medication::class, $user->medications->first());
    }

    public function test_health_metrics_relationship_returns_has_many(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(HasMany::class, $user->healthMetrics());
    }

    public function test_health_metrics_relationship_returns_correct_models(): void
    {
        $user = User::factory()->create();
        HealthMetric::factory()->count(2)->create(['user_id' => $user->id]);

        $this->assertCount(2, $user->healthMetrics);
        $this->assertInstanceOf(HealthMetric::class, $user->healthMetrics->first());
    }

    public function test_plans_relationship_returns_has_many(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(HasMany::class, $user->plans());
    }

    public function test_plans_relationship_returns_correct_models(): void
    {
        $user = User::factory()->create();
        Plan::factory()->count(2)->create(['user_id' => $user->id]);

        $this->assertCount(2, $user->plans);
        $this->assertInstanceOf(Plan::class, $user->plans->first());
    }

    public function test_claims_relationship_returns_has_many(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(HasMany::class, $user->claims());
    }

    public function test_claims_relationship_returns_correct_models(): void
    {
        $user = User::factory()->create();
        $plan = Plan::factory()->create(['user_id' => $user->id]);
        Claim::factory()->count(2)->create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'processed_at' => now(),
        ]);

        $this->assertCount(2, $user->claims);
        $this->assertInstanceOf(Claim::class, $user->claims->first());
    }

    public function test_device_connections_relationship_returns_has_many(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(HasMany::class, $user->deviceConnections());
    }

    public function test_device_connections_relationship_returns_correct_models(): void
    {
        $user = User::factory()->create();
        DeviceConnection::factory()->count(2)->create(['user_id' => $user->id]);

        $this->assertCount(2, $user->deviceConnections);
        $this->assertInstanceOf(DeviceConnection::class, $user->deviceConnections->first());
    }

    public function test_medical_events_relationship_returns_has_many(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(HasMany::class, $user->medicalEvents());
    }

    public function test_medical_events_relationship_returns_correct_models(): void
    {
        $user = User::factory()->create();
        MedicalEvent::factory()->count(2)->create(['user_id' => $user->id]);

        $this->assertCount(2, $user->medicalEvents);
        $this->assertInstanceOf(MedicalEvent::class, $user->medicalEvents->first());
    }

    public function test_treatment_plans_relationship_returns_has_many(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(HasMany::class, $user->treatmentPlans());
    }

    public function test_treatment_plans_relationship_returns_correct_models(): void
    {
        $user = User::factory()->create();
        TreatmentPlan::factory()->count(2)->create(['user_id' => $user->id]);

        $this->assertCount(2, $user->treatmentPlans);
        $this->assertInstanceOf(TreatmentPlan::class, $user->treatmentPlans->first());
    }

    public function test_consent_records_relationship_returns_has_many(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(HasMany::class, $user->consentRecords());
    }

    public function test_consent_records_relationship_returns_correct_models(): void
    {
        $user = User::factory()->create();
        ConsentRecord::factory()->count(2)->create(['user_id' => $user->id]);

        $this->assertCount(2, $user->consentRecords);
        $this->assertInstanceOf(ConsentRecord::class, $user->consentRecords->first());
    }

    public function test_notifications_relationship_returns_has_many(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(HasMany::class, $user->notifications());
    }

    public function test_notifications_relationship_returns_correct_models(): void
    {
        $user = User::factory()->create();
        Notification::factory()->count(2)->create(['user_id' => $user->id]);

        $this->assertCount(2, $user->notifications);
        $this->assertInstanceOf(Notification::class, $user->notifications->first());
    }

    public function test_notification_preferences_relationship_returns_has_many(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(HasMany::class, $user->notificationPreferences());
    }

    public function test_notification_preferences_relationship_returns_correct_models(): void
    {
        $user = User::factory()->create();
        NotificationPreference::factory()->count(2)->create(['user_id' => $user->id]);

        $this->assertCount(2, $user->notificationPreferences);
        $this->assertInstanceOf(NotificationPreference::class, $user->notificationPreferences->first());
    }

    public function test_leaderboard_entries_relationship_returns_has_many(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(HasMany::class, $user->leaderboardEntries());
    }

    public function test_leaderboard_entries_relationship_returns_correct_models(): void
    {
        $user = User::factory()->create();
        LeaderboardEntry::factory()->create(['user_id' => $user->id, 'journey' => 'health']);
        LeaderboardEntry::factory()->create(['user_id' => $user->id, 'journey' => 'care']);

        $this->assertCount(2, $user->leaderboardEntries);
        $this->assertInstanceOf(LeaderboardEntry::class, $user->leaderboardEntries->first());
    }
}
