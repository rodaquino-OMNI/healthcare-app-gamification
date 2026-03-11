<?php

namespace Tests\Unit\Models;

use App\Models\Reward;
use App\Models\UserReward;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RewardTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $reward = Reward::factory()->create();

        $this->assertDatabaseHas('rewards', ['id' => $reward->id]);
    }

    public function test_timestamps_are_disabled(): void
    {
        $reward = new Reward();

        $this->assertFalse($reward->usesTimestamps());
    }

    public function test_casts_xp_reward_to_integer(): void
    {
        $reward = Reward::factory()->create(['xp_reward' => 300]);

        $this->assertIsInt($reward->xp_reward);
        $this->assertEquals(300, $reward->xp_reward);
    }

    public function test_user_rewards_relationship_returns_has_many(): void
    {
        $reward = Reward::factory()->create();

        $this->assertInstanceOf(HasMany::class, $reward->userRewards());
    }

    public function test_user_rewards_relationship_returns_correct_models(): void
    {
        $reward = Reward::factory()->create();
        UserReward::factory()->count(2)->create(['reward_id' => $reward->id]);

        $this->assertCount(2, $reward->userRewards);
        $this->assertInstanceOf(UserReward::class, $reward->userRewards->first());
    }
}
