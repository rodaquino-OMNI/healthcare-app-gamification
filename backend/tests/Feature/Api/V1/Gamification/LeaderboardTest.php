<?php

namespace Tests\Feature\Api\V1\Gamification;

use App\Models\LeaderboardEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LeaderboardTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ─── Show ─────────────────────────────────────────────────────────

    public function test_show_returns_leaderboard_entries_for_journey(): void
    {
        Sanctum::actingAs($this->user);

        LeaderboardEntry::factory()->count(3)->create(['journey' => 'health']);
        LeaderboardEntry::factory()->count(2)->create(['journey' => 'care']);

        $response = $this->getJson('/api/v1/gamification/leaderboard/health');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_show_returns_entries_ordered_by_score_descending(): void
    {
        Sanctum::actingAs($this->user);

        LeaderboardEntry::factory()->create(['journey' => 'health', 'score' => 100]);
        LeaderboardEntry::factory()->create(['journey' => 'health', 'score' => 500]);
        LeaderboardEntry::factory()->create(['journey' => 'health', 'score' => 300]);

        $response = $this->getJson('/api/v1/gamification/leaderboard/health');

        $response->assertOk();

        $scores = array_column($response->json('data'), 'score');
        $this->assertEquals([500, 300, 100], $scores);
    }

    public function test_show_returns_empty_data_for_journey_with_no_entries(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/gamification/leaderboard/wellness');

        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }

    // ─── Auth ─────────────────────────────────────────────────────────

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/v1/gamification/leaderboard/health');

        $response->assertUnauthorized();
    }

    // ─── Edge Cases ────────────────────────────────────────────────────

    public function test_unauthenticated_returns_401(): void
    {
        $response = $this->getJson('/api/v1/gamification/leaderboard/health');

        $response->assertUnauthorized();
    }

    public function test_show_limits_to_100_entries(): void
    {
        Sanctum::actingAs($this->user);

        LeaderboardEntry::factory()->count(110)->create(['journey' => 'health']);

        $response = $this->getJson('/api/v1/gamification/leaderboard/health');

        $response->assertOk();

        $this->assertLessThanOrEqual(100, count($response->json('data')));
    }

    public function test_show_only_returns_entries_for_requested_journey(): void
    {
        Sanctum::actingAs($this->user);

        LeaderboardEntry::factory()->count(3)->create(['journey' => 'health']);
        LeaderboardEntry::factory()->count(4)->create(['journey' => 'care']);

        $response = $this->getJson('/api/v1/gamification/leaderboard/health');

        $response->assertOk()
            ->assertJsonCount(3, 'data');

        $journeys = array_column($response->json('data'), 'journey');
        foreach ($journeys as $journey) {
            $this->assertEquals('health', $journey);
        }
    }
}
