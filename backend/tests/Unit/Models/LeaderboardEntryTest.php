<?php

namespace Tests\Unit\Models;

use App\Models\LeaderboardEntry;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeaderboardEntryTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $entry = LeaderboardEntry::factory()->create();

        $this->assertDatabaseHas('leaderboard_entries', ['id' => $entry->id]);
    }

    public function test_casts_score_to_integer(): void
    {
        $entry = LeaderboardEntry::factory()->create(['score' => 5000]);

        $this->assertIsInt($entry->score);
        $this->assertEquals(5000, $entry->score);
    }

    public function test_casts_rank_to_integer(): void
    {
        $entry = LeaderboardEntry::factory()->create(['rank' => 42]);

        $this->assertIsInt($entry->rank);
        $this->assertEquals(42, $entry->rank);
    }

    public function test_user_relationship_returns_belongs_to(): void
    {
        $entry = LeaderboardEntry::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $entry->user());
    }

    public function test_user_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        $entry = LeaderboardEntry::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $entry->user);
        $this->assertEquals($user->id, $entry->user->id);
    }
}
