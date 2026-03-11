<?php

namespace Tests\Unit\Jobs;

use App\Domain\Gamification\Actions\ProcessEventAction;
use App\Jobs\ProcessGamificationEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Queue;
use Mockery;
use Tests\TestCase;

class ProcessGamificationEventTest extends TestCase
{
    public function test_job_implements_should_queue(): void
    {
        $job = new ProcessGamificationEvent('user-1', 'test.event', []);

        $this->assertInstanceOf(ShouldQueue::class, $job);
    }

    public function test_job_has_correct_tries_and_backoff(): void
    {
        $job = new ProcessGamificationEvent('user-1', 'test.event', []);

        $this->assertEquals(3, $job->tries);
        $this->assertEquals(30, $job->backoff);
    }

    public function test_handle_calls_process_event_action_with_correct_params(): void
    {
        $action = Mockery::mock(ProcessEventAction::class);
        $action->shouldReceive('execute')
            ->once()
            ->with('user-123', 'appointment.completed', ['count' => 1]);

        $job = new ProcessGamificationEvent('user-123', 'appointment.completed', ['count' => 1]);
        $job->handle($action);
    }

    public function test_job_can_be_dispatched_to_queue(): void
    {
        Queue::fake();

        ProcessGamificationEvent::dispatch('user-1', 'test.event', ['key' => 'value']);

        Queue::assertPushed(ProcessGamificationEvent::class, function ($job) {
            return $job->userId === 'user-1'
                && $job->eventType === 'test.event'
                && $job->payload === ['key' => 'value'];
        });
    }
}
