<?php

namespace Tests\Unit\Jobs;

use App\Domain\Notification\Actions\SendNotificationAction;
use App\Jobs\SendNotification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Mockery;
use Tests\TestCase;

class SendNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_job_has_correct_tries_and_backoff(): void
    {
        $user = User::factory()->create();
        $job = new SendNotification($user, 'info', 'Title', 'Body');

        $this->assertEquals(3, $job->tries);
        $this->assertEquals(10, $job->backoff);
    }

    public function test_handle_calls_send_notification_action(): void
    {
        $user = User::factory()->create();

        $action = Mockery::mock(SendNotificationAction::class);
        $action->shouldReceive('execute')
            ->once()
            ->with(
                Mockery::on(fn ($u) => $u->id === $user->id),
                'achievement',
                'Badge Earned',
                'Congrats!',
                ['badge' => 'first']
            );

        $job = new SendNotification($user, 'achievement', 'Badge Earned', 'Congrats!', ['badge' => 'first']);
        $job->handle($action);
    }

    public function test_job_can_be_queued(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        SendNotification::dispatch($user, 'info', 'Title', 'Body');

        Queue::assertPushed(SendNotification::class);
    }
}
