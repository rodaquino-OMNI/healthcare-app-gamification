<?php

namespace Tests\Feature\Api\V1;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ─── Index ────────────────────────────────────────────────────────

    public function test_index_returns_paginated_notifications_for_authenticated_user(): void
    {
        Sanctum::actingAs($this->user);

        Notification::factory()->count(3)->create(['user_id' => $this->user->id]);
        Notification::factory()->count(2)->create(); // other user's notifications

        $response = $this->getJson('/api/v1/notifications');

        $response->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [['id', 'type', 'title', 'body', 'status']],
            ]);
    }

    // ─── Show ─────────────────────────────────────────────────────────

    public function test_show_returns_notification(): void
    {
        Sanctum::actingAs($this->user);

        $notification = Notification::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/v1/notifications/{$notification->id}");

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'type', 'title', 'body', 'status']]);
    }

    public function test_show_returns_404_for_nonexistent_notification(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/notifications/99999');

        $response->assertNotFound();
    }

    // ─── Mark as Read ─────────────────────────────────────────────────

    public function test_mark_as_read_updates_status(): void
    {
        Sanctum::actingAs($this->user);

        $notification = Notification::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'sent',
        ]);

        $response = $this->patchJson("/api/v1/notifications/{$notification->id}/read");

        $response->assertOk();

        $this->assertDatabaseHas('notifications', [
            'id' => $notification->id,
            'status' => 'read',
        ]);
    }

    // ─── Auth ─────────────────────────────────────────────────────────

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/v1/notifications');

        $response->assertUnauthorized();
    }

    // ─── Edge Cases ────────────────────────────────────────────────────

    public function test_index_unauthenticated_returns_401(): void
    {
        $response = $this->getJson('/api/v1/notifications');

        $response->assertUnauthorized();
    }

    public function test_show_unauthenticated_returns_401(): void
    {
        $notification = Notification::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/v1/notifications/{$notification->id}");

        $response->assertUnauthorized();
    }

    public function test_mark_as_read_unauthenticated_returns_401(): void
    {
        $notification = Notification::factory()->create(['user_id' => $this->user->id]);

        $response = $this->patchJson("/api/v1/notifications/{$notification->id}/read");

        $response->assertUnauthorized();
    }

    public function test_mark_as_read_nonexistent_notification_returns_404(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->patchJson('/api/v1/notifications/00000000-0000-0000-0000-000000000000/read');

        $response->assertNotFound();
    }

    public function test_index_returns_empty_when_no_notifications(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/notifications');

        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_index_only_returns_own_notifications(): void
    {
        Sanctum::actingAs($this->user);

        $otherUser = User::factory()->create();

        Notification::factory()->count(2)->create(['user_id' => $this->user->id]);
        Notification::factory()->count(3)->create(['user_id' => $otherUser->id]);

        $response = $this->getJson('/api/v1/notifications');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }
}
