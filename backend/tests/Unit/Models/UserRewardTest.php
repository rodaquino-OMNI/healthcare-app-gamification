<?php

namespace Tests\Unit\Models;

use App\Models\GameProfile;
use App\Models\Reward;
use App\Models\UserReward;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserRewardTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $ur = UserReward::factory()->create();

        $this->assertDatabaseHas('user_rewards', ['id' => $ur->id]);
    }

    public function test_timestamps_are_disabled(): void
    {
        $ur = new UserReward();

        $this->assertFalse($ur->usesTimestamps());
    }

    public function test_casts_earned_at_to_datetime(): void
    {
        $ur = UserReward::factory()->create(['earned_at' => '2025-06-15 12:00:00']);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $ur->earned_at);
    }

    public function test_game_profile_relationship_returns_belongs_to(): void
    {
        $ur = UserReward::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $ur->gameProfile());
    }

    public function test_game_profile_relationship_returns_correct_model(): void
    {
        $profile = GameProfile::factory()->create();
        $ur = UserReward::factory()->create(['profile_id' => $profile->id]);

        $this->assertInstanceOf(GameProfile::class, $ur->gameProfile);
        $this->assertEquals($profile->id, $ur->gameProfile->id);
    }

    public function test_reward_relationship_returns_belongs_to(): void
    {
        $ur = UserReward::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $ur->reward());
    }

    public function test_reward_relationship_returns_correct_model(): void
    {
        $reward = Reward::factory()->create();
        $ur = UserReward::factory()->create(['reward_id' => $reward->id]);

        $this->assertInstanceOf(Reward::class, $ur->reward);
        $this->assertEquals($reward->id, $ur->reward->id);
    }
}
