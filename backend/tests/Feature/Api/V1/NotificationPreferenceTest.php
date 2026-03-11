<?php

namespace Tests\Feature\Api\V1;

use App\Models\NotificationPreference;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationPreferenceTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ─── Show ─────────────────────────────────────────────────────────

    public function test_show_returns_existing_preference(): void
    {
        Sanctum::actingAs($this->user);

        NotificationPreference::factory()->create([
            'user_id' => $this->user->id,
            'push_enabled' => true,
            'email_enabled' => false,
        ]);

        $response = $this->getJson('/api/v1/notifications/preferences');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['id', 'push_enabled', 'email_enabled', 'sms_enabled'],
            ]);
    }

    public function test_show_creates_default_preference_if_none_exists(): void
    {
        Sanctum::actingAs($this->user);

        $this->assertDatabaseMissing('notification_preferences', ['user_id' => $this->user->id]);

        $response = $this->getJson('/api/v1/notifications/preferences');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['id', 'push_enabled', 'email_enabled', 'sms_enabled'],
            ]);

        $this->assertDatabaseHas('notification_preferences', [
            'user_id' => $this->user->id,
            'push_enabled' => true,
            'email_enabled' => true,
            'sms_enabled' => false,
        ]);
    }

    // ─── Update ───────────────────────────────────────────────────────

    public function test_update_modifies_preference(): void
    {
        Sanctum::actingAs($this->user);

        NotificationPreference::factory()->create([
            'user_id' => $this->user->id,
            'push_enabled' => true,
        ]);

        $response = $this->putJson('/api/v1/notifications/preferences', [
            'push_enabled' => false,
            'sms_enabled' => true,
        ]);

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'push_enabled', 'sms_enabled']]);

        $this->assertDatabaseHas('notification_preferences', [
            'user_id' => $this->user->id,
            'push_enabled' => false,
            'sms_enabled' => true,
        ]);
    }

    public function test_update_creates_preference_if_none_exists(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->putJson('/api/v1/notifications/preferences', [
            'push_enabled' => false,
            'email_enabled' => true,
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('notification_preferences', [
            'user_id' => $this->user->id,
            'push_enabled' => false,
            'email_enabled' => true,
        ]);
    }

    // ─── Auth ─────────────────────────────────────────────────────────

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/v1/notifications/preferences');

        $response->assertUnauthorized();
    }

    // ─── Edge Cases ────────────────────────────────────────────────────

    public function test_show_unauthenticated_returns_401(): void
    {
        $response = $this->getJson('/api/v1/notifications/preferences');

        $response->assertUnauthorized();
    }

    public function test_update_unauthenticated_returns_401(): void
    {
        $response = $this->putJson('/api/v1/notifications/preferences', [
            'push_enabled' => false,
        ]);

        $response->assertUnauthorized();
    }
}
