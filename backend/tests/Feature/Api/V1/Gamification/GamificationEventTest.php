<?php

namespace Tests\Feature\Api\V1\Gamification;

use App\Jobs\ProcessGamificationEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GamificationEventTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ─── Process ──────────────────────────────────────────────────────

    public function test_process_dispatches_job_and_returns_202(): void
    {
        Queue::fake();
        Sanctum::actingAs($this->user);

        $payload = [
            'event_type' => 'appointment_completed',
            'payload' => ['appointment_id' => 'abc-123'],
        ];

        $response = $this->postJson('/api/v1/gamification/events', $payload);

        $response->assertStatus(202)
            ->assertJson(['message' => 'Event accepted for processing.']);

        Queue::assertPushed(ProcessGamificationEvent::class, function ($job) {
            return $job->userId === $this->user->id
                && $job->eventType === 'appointment_completed'
                && $job->payload === ['appointment_id' => 'abc-123'];
        });
    }

    public function test_process_returns_422_when_event_type_missing(): void
    {
        Queue::fake();
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/v1/gamification/events', [
            'payload' => ['key' => 'value'],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['event_type']);

        Queue::assertNothingPushed();
    }

    public function test_process_returns_422_when_payload_missing(): void
    {
        Queue::fake();
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/v1/gamification/events', [
            'event_type' => 'some_event',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payload']);

        Queue::assertNothingPushed();
    }

    public function test_process_returns_422_when_payload_is_not_array(): void
    {
        Queue::fake();
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/v1/gamification/events', [
            'event_type' => 'some_event',
            'payload' => 'not-an-array',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payload']);

        Queue::assertNothingPushed();
    }

    // ─── Auth ─────────────────────────────────────────────────────────

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->postJson('/api/v1/gamification/events', [
            'event_type' => 'test',
            'payload' => [],
        ]);

        $response->assertUnauthorized();
    }
}
