<?php

namespace Tests\Unit\Models;

use App\Models\NotificationPreference;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationPreferenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $pref = NotificationPreference::factory()->create();

        $this->assertDatabaseHas('notification_preferences', ['id' => $pref->id]);
    }

    public function test_casts_push_enabled_to_boolean(): void
    {
        $pref = NotificationPreference::factory()->create(['push_enabled' => true]);

        $this->assertIsBool($pref->push_enabled);
        $this->assertTrue($pref->push_enabled);
    }

    public function test_casts_email_enabled_to_boolean(): void
    {
        $pref = NotificationPreference::factory()->create(['email_enabled' => false]);

        $this->assertIsBool($pref->email_enabled);
        $this->assertFalse($pref->email_enabled);
    }

    public function test_casts_sms_enabled_to_boolean(): void
    {
        $pref = NotificationPreference::factory()->create(['sms_enabled' => true]);

        $this->assertIsBool($pref->sms_enabled);
        $this->assertTrue($pref->sms_enabled);
    }

    public function test_casts_type_preferences_to_array(): void
    {
        $types = ['achievement', 'reminder', 'alert'];
        $pref = NotificationPreference::factory()->create(['type_preferences' => $types]);

        $this->assertIsArray($pref->type_preferences);
        $this->assertCount(3, $pref->type_preferences);
        $this->assertContains('achievement', $pref->type_preferences);
    }

    public function test_casts_journey_preferences_to_array(): void
    {
        $journeys = ['health', 'care'];
        $pref = NotificationPreference::factory()->create(['journey_preferences' => $journeys]);

        $this->assertIsArray($pref->journey_preferences);
        $this->assertCount(2, $pref->journey_preferences);
    }

    public function test_user_relationship_returns_belongs_to(): void
    {
        $pref = NotificationPreference::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $pref->user());
    }

    public function test_user_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        $pref = NotificationPreference::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $pref->user);
        $this->assertEquals($user->id, $pref->user->id);
    }
}
