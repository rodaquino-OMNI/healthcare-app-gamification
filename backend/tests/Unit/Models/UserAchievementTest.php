<?php

namespace Tests\Unit\Models;

use App\Models\Achievement;
use App\Models\GameProfile;
use App\Models\UserAchievement;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserAchievementTest extends TestCase
{
    use RefreshDatabase;

    public function test_has_composite_primary_key(): void
    {
        $model = new UserAchievement();

        $this->assertEquals(['profile_id', 'achievement_id'], $model->getKeyName());
    }

    public function test_incrementing_is_disabled(): void
    {
        $model = new UserAchievement();

        $this->assertFalse($model->getIncrementing());
    }

    public function test_can_be_created_manually(): void
    {
        $profile = GameProfile::factory()->create();
        $achievement = Achievement::factory()->create();

        $ua = UserAchievement::create([
            'profile_id' => $profile->id,
            'achievement_id' => $achievement->id,
            'progress' => 75,
            'unlocked' => false,
        ]);

        $this->assertDatabaseHas('user_achievements', [
            'profile_id' => $profile->id,
            'achievement_id' => $achievement->id,
            'progress' => 75,
        ]);
    }

    public function test_can_be_created_with_factory(): void
    {
        $ua = UserAchievement::factory()->create();

        $this->assertDatabaseHas('user_achievements', [
            'profile_id' => $ua->profile_id,
            'achievement_id' => $ua->achievement_id,
        ]);
    }

    public function test_casts_progress_to_integer(): void
    {
        $profile = GameProfile::factory()->create();
        $achievement = Achievement::factory()->create();

        $ua = UserAchievement::create([
            'profile_id' => $profile->id,
            'achievement_id' => $achievement->id,
            'progress' => 50,
            'unlocked' => false,
        ]);

        $fresh = UserAchievement::where('profile_id', $profile->id)
            ->where('achievement_id', $achievement->id)
            ->first();

        $this->assertIsInt($fresh->progress);
    }

    public function test_casts_unlocked_to_boolean(): void
    {
        $profile = GameProfile::factory()->create();
        $achievement = Achievement::factory()->create();

        UserAchievement::create([
            'profile_id' => $profile->id,
            'achievement_id' => $achievement->id,
            'progress' => 100,
            'unlocked' => true,
            'unlocked_at' => now(),
        ]);

        $fresh = UserAchievement::where('profile_id', $profile->id)
            ->where('achievement_id', $achievement->id)
            ->first();

        $this->assertIsBool($fresh->unlocked);
        $this->assertTrue($fresh->unlocked);
    }

    public function test_casts_unlocked_at_to_datetime(): void
    {
        $profile = GameProfile::factory()->create();
        $achievement = Achievement::factory()->create();

        UserAchievement::create([
            'profile_id' => $profile->id,
            'achievement_id' => $achievement->id,
            'progress' => 100,
            'unlocked' => true,
            'unlocked_at' => '2025-06-15 12:00:00',
        ]);

        $fresh = UserAchievement::where('profile_id', $profile->id)
            ->where('achievement_id', $achievement->id)
            ->first();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $fresh->unlocked_at);
    }

    public function test_game_profile_relationship_returns_belongs_to(): void
    {
        $ua = UserAchievement::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $ua->gameProfile());
    }

    public function test_game_profile_relationship_returns_correct_model(): void
    {
        $profile = GameProfile::factory()->create();
        $achievement = Achievement::factory()->create();

        $ua = UserAchievement::create([
            'profile_id' => $profile->id,
            'achievement_id' => $achievement->id,
            'progress' => 50,
            'unlocked' => false,
        ]);

        $this->assertInstanceOf(GameProfile::class, $ua->gameProfile);
        $this->assertEquals($profile->id, $ua->gameProfile->id);
    }

    public function test_achievement_relationship_returns_belongs_to(): void
    {
        $ua = UserAchievement::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $ua->achievement());
    }

    public function test_achievement_relationship_returns_correct_model(): void
    {
        $profile = GameProfile::factory()->create();
        $achievement = Achievement::factory()->create();

        $ua = UserAchievement::create([
            'profile_id' => $profile->id,
            'achievement_id' => $achievement->id,
            'progress' => 50,
            'unlocked' => false,
        ]);

        $this->assertInstanceOf(Achievement::class, $ua->achievement);
        $this->assertEquals($achievement->id, $ua->achievement->id);
    }

    public function test_get_key_type_returns_string(): void
    {
        $model = new UserAchievement();

        $this->assertEquals('string', $model->getKeyType());
    }
}
