<?php

namespace Tests\Unit\Domain\Notification;

use App\Domain\Notification\Actions\SendNotificationAction;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SendNotificationActionTest extends TestCase
{
    use RefreshDatabase;

    private SendNotificationAction $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = new SendNotificationAction();
    }

    public function test_creates_notification_record_in_database(): void
    {
        $user = User::factory()->create();

        $notification = $this->action->execute(
            $user,
            'achievement',
            'New Achievement!',
            'You earned a badge.',
            ['badge_name' => 'First Steps']
        );

        $this->assertInstanceOf(Notification::class, $notification);
        $this->assertDatabaseHas('notifications', [
            'id' => $notification->id,
        ]);
    }

    public function test_sets_correct_user_id_type_title_body(): void
    {
        $user = User::factory()->create();

        $notification = $this->action->execute(
            $user,
            'reminder',
            'Take your medication',
            'It is time for your daily dose.'
        );

        $this->assertEquals($user->id, $notification->user_id);
        $this->assertEquals('reminder', $notification->type);
        $this->assertEquals('Take your medication', $notification->title);
        $this->assertEquals('It is time for your daily dose.', $notification->body);
    }

    public function test_sets_channel_to_push_and_status_to_pending(): void
    {
        $user = User::factory()->create();

        $notification = $this->action->execute(
            $user,
            'info',
            'Test',
            'Test body'
        );

        $this->assertEquals('push', $notification->channel);
        $this->assertEquals('pending', $notification->status);
    }

    public function test_stores_metadata_correctly(): void
    {
        $user = User::factory()->create();
        $metadata = ['key1' => 'value1', 'key2' => 42];

        $notification = $this->action->execute(
            $user,
            'info',
            'Test',
            'Test body',
            $metadata
        );

        $this->assertEquals($metadata, $notification->metadata);
    }
}
