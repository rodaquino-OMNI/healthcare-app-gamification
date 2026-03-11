<?php

namespace Tests\Unit\Models;

use App\Models\Achievement;
use App\Models\GameProfile;
use App\Models\UserAchievement;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AchievementTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $achievement = Achievement::factory()->create();

        $this->assertDatabaseHas('achievements', ['id' => $achievement->id]);
    }

    public function test_timestamps_are_disabled(): void
    {
        $achievement = new Achievement();

        $this->assertFalse($achievement->usesTimestamps());
    }

    public function test_casts_xp_reward_to_integer(): void
    {
        $achievement = Achievement::factory()->create(['xp_reward' => 150]);

        $this->assertIsInt($achievement->xp_reward);
        $this->assertEquals(150, $achievement->xp_reward);
    }

    public function test_user_achievements_relationship_returns_has_many(): void
    {
        $achievement = Achievement::factory()->create();

        $this->assertInstanceOf(HasMany::class, $achievement->userAchievements());
    }

    public function test_user_achievements_relationship_returns_correct_models(): void
    {
        $achievement = Achievement::factory()->create();
        $profile = GameProfile::factory()->create();

        UserAchievement::create([
            'profile_id' => $profile->id,
            'achievement_id' => $achievement->id,
            'progress' => 100,
            'unlocked' => true,
            'unlocked_at' => now(),
        ]);

        $this->assertCount(1, $achievement->userAchievements);
        $this->assertInstanceOf(UserAchievement::class, $achievement->userAchievements->first());
    }
}
