<?php

namespace Tests\Unit\Domain\Gamification;

use App\Domain\Gamification\Actions\ProgressQuestAction;
use App\Models\GameProfile;
use App\Models\Quest;
use App\Models\User;
use App\Models\UserQuest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProgressQuestActionTest extends TestCase
{
    use RefreshDatabase;

    private ProgressQuestAction $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = new ProgressQuestAction();
    }

    public function test_increments_progress_on_user_quest(): void
    {
        $user = User::factory()->create();
        $profile = GameProfile::factory()->create(['user_id' => $user->id]);
        $quest = Quest::factory()->create();
        $userQuest = UserQuest::factory()->create([
            'profile_id' => $profile->id,
            'quest_id' => $quest->id,
            'progress' => 50,
            'completed' => false,
        ]);

        $this->action->execute($user->id, $quest->id, 'task-1');

        $userQuest->refresh();
        $this->assertEquals(51, $userQuest->progress);
    }

    public function test_caps_progress_at_100(): void
    {
        $user = User::factory()->create();
        $profile = GameProfile::factory()->create(['user_id' => $user->id]);
        $quest = Quest::factory()->create();
        $userQuest = UserQuest::factory()->create([
            'profile_id' => $profile->id,
            'quest_id' => $quest->id,
            'progress' => 100,
            'completed' => true,
        ]);

        $this->action->execute($user->id, $quest->id, 'task-1');

        $userQuest->refresh();
        $this->assertEquals(100, $userQuest->progress);
    }

    public function test_sets_completed_true_when_progress_reaches_100(): void
    {
        $user = User::factory()->create();
        $profile = GameProfile::factory()->create(['user_id' => $user->id]);
        $quest = Quest::factory()->create();
        $userQuest = UserQuest::factory()->create([
            'profile_id' => $profile->id,
            'quest_id' => $quest->id,
            'progress' => 99,
            'completed' => false,
        ]);

        $this->action->execute($user->id, $quest->id, 'task-1');

        $userQuest->refresh();
        $this->assertEquals(100, $userQuest->progress);
        $this->assertTrue($userQuest->completed);
    }

    public function test_throws_model_not_found_if_profile_not_found(): void
    {
        $this->expectException(ModelNotFoundException::class);

        $this->action->execute('non-existent-user-id', 'quest-id', 'task-id');
    }

    public function test_throws_model_not_found_if_user_quest_not_found(): void
    {
        $user = User::factory()->create();
        GameProfile::factory()->create(['user_id' => $user->id]);

        $this->expectException(ModelNotFoundException::class);

        $this->action->execute($user->id, 'non-existent-quest-id', 'task-id');
    }
}
