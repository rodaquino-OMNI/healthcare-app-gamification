<?php

namespace Tests\Unit\Models;

use App\Models\Achievement;
use App\Models\GameProfile;
use App\Models\Quest;
use App\Models\Reward;
use App\Models\User;
use App\Models\UserAchievement;
use App\Models\UserQuest;
use App\Models\UserReward;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GameProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $profile = GameProfile::factory()->create();

        $this->assertDatabaseHas('game_profiles', ['id' => $profile->id]);
    }

    public function test_get_level_attribute_returns_1_for_xp_0(): void
    {
        $profile = GameProfile::factory()->create(['xp' => 0]);

        $this->assertEquals(1, $profile->level);
    }

    public function test_get_level_attribute_returns_1_for_xp_99(): void
    {
        $profile = GameProfile::factory()->create(['xp' => 99]);

        $this->assertEquals(1, $profile->level);
    }

    public function test_get_level_attribute_returns_2_for_xp_100(): void
    {
        $profile = GameProfile::factory()->create(['xp' => 100]);

        $this->assertEquals(2, $profile->level);
    }

    public function test_get_level_attribute_returns_3_for_xp_250(): void
    {
        $profile = GameProfile::factory()->create(['xp' => 250]);

        $this->assertEquals(3, $profile->level);
    }

    public function test_get_level_attribute_returns_10_for_xp_999(): void
    {
        $profile = GameProfile::factory()->create(['xp' => 999]);

        $this->assertEquals(10, $profile->level);
    }

    public function test_user_relationship_returns_belongs_to(): void
    {
        $profile = GameProfile::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $profile->user());
    }

    public function test_user_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        $profile = GameProfile::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $profile->user);
        $this->assertEquals($user->id, $profile->user->id);
    }

    public function test_user_achievements_relationship_returns_has_many(): void
    {
        $profile = GameProfile::factory()->create();

        $this->assertInstanceOf(HasMany::class, $profile->userAchievements());
    }

    public function test_user_achievements_relationship_returns_correct_models(): void
    {
        $profile = GameProfile::factory()->create();
        $achievement = Achievement::factory()->create();

        UserAchievement::create([
            'profile_id' => $profile->id,
            'achievement_id' => $achievement->id,
            'progress' => 50,
            'unlocked' => false,
        ]);

        $this->assertCount(1, $profile->userAchievements);
        $this->assertInstanceOf(UserAchievement::class, $profile->userAchievements->first());
    }

    public function test_user_quests_relationship_returns_has_many(): void
    {
        $profile = GameProfile::factory()->create();

        $this->assertInstanceOf(HasMany::class, $profile->userQuests());
    }

    public function test_user_quests_relationship_returns_correct_models(): void
    {
        $profile = GameProfile::factory()->create();
        UserQuest::factory()->count(2)->create(['profile_id' => $profile->id]);

        $this->assertCount(2, $profile->userQuests);
        $this->assertInstanceOf(UserQuest::class, $profile->userQuests->first());
    }

    public function test_user_rewards_relationship_returns_has_many(): void
    {
        $profile = GameProfile::factory()->create();

        $this->assertInstanceOf(HasMany::class, $profile->userRewards());
    }

    public function test_user_rewards_relationship_returns_correct_models(): void
    {
        $profile = GameProfile::factory()->create();
        UserReward::factory()->count(2)->create(['profile_id' => $profile->id]);

        $this->assertCount(2, $profile->userRewards);
        $this->assertInstanceOf(UserReward::class, $profile->userRewards->first());
    }
}
