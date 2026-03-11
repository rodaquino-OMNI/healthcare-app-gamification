<?php

namespace Tests\Unit\Domain\Gamification;

use App\Domain\Gamification\Actions\UnlockAchievementAction;
use App\Models\Achievement;
use App\Models\GameProfile;
use App\Models\User;
use App\Models\UserAchievement;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UnlockAchievementActionTest extends TestCase
{
    use RefreshDatabase;

    private UnlockAchievementAction $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = new UnlockAchievementAction();
    }

    public function test_creates_user_achievement_record(): void
    {
        $user = User::factory()->create();
        $profile = GameProfile::factory()->create(['user_id' => $user->id, 'xp' => 0]);
        $achievement = Achievement::factory()->create(['xp_reward' => 50]);

        $this->action->execute($user->id, $achievement->id);

        $this->assertDatabaseHas('user_achievements', [
            'profile_id' => $profile->id,
            'achievement_id' => $achievement->id,
        ]);
    }

    public function test_sets_unlocked_true_and_unlocked_at(): void
    {
        $user = User::factory()->create();
        $profile = GameProfile::factory()->create(['user_id' => $user->id, 'xp' => 0]);
        $achievement = Achievement::factory()->create(['xp_reward' => 50]);

        $this->action->execute($user->id, $achievement->id);

        $userAchievement = UserAchievement::where('profile_id', $profile->id)
            ->where('achievement_id', $achievement->id)
            ->first();

        $this->assertTrue($userAchievement->unlocked);
        $this->assertNotNull($userAchievement->unlocked_at);
        $this->assertEquals(100, $userAchievement->progress);
    }

    public function test_awards_xp_from_achievement_xp_reward(): void
    {
        $user = User::factory()->create();
        $profile = GameProfile::factory()->create(['user_id' => $user->id, 'xp' => 100]);
        $achievement = Achievement::factory()->create(['xp_reward' => 75]);

        $this->action->execute($user->id, $achievement->id);

        $profile->refresh();
        $this->assertEquals(175, $profile->xp);
    }

    public function test_skips_if_achievement_already_unlocked(): void
    {
        $user = User::factory()->create();
        $profile = GameProfile::factory()->create(['user_id' => $user->id, 'xp' => 100]);
        $achievement = Achievement::factory()->create(['xp_reward' => 75]);

        // Unlock once
        $this->action->execute($user->id, $achievement->id);

        $xpAfterFirst = GameProfile::where('user_id', $user->id)->first()->xp;

        // Unlock again (should be idempotent)
        $this->action->execute($user->id, $achievement->id);

        $profile->refresh();
        $this->assertEquals($xpAfterFirst, $profile->xp);

        // Should still only have one record
        $count = UserAchievement::where('profile_id', $profile->id)
            ->where('achievement_id', $achievement->id)
            ->count();
        $this->assertEquals(1, $count);
    }

    public function test_throws_model_not_found_if_profile_not_found(): void
    {
        $achievement = Achievement::factory()->create();

        $this->expectException(ModelNotFoundException::class);

        $this->action->execute('non-existent-user-id', $achievement->id);
    }

    public function test_throws_model_not_found_if_achievement_not_found(): void
    {
        $user = User::factory()->create();
        GameProfile::factory()->create(['user_id' => $user->id]);

        $this->expectException(ModelNotFoundException::class);

        $this->action->execute($user->id, 'non-existent-achievement-id');
    }
}
