<?php

namespace Tests\Unit\Models;

use App\Models\Quest;
use App\Models\UserQuest;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuestTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $quest = Quest::factory()->create();

        $this->assertDatabaseHas('quests', ['id' => $quest->id]);
    }

    public function test_timestamps_are_disabled(): void
    {
        $quest = new Quest();

        $this->assertFalse($quest->usesTimestamps());
    }

    public function test_casts_xp_reward_to_integer(): void
    {
        $quest = Quest::factory()->create(['xp_reward' => 200]);

        $this->assertIsInt($quest->xp_reward);
        $this->assertEquals(200, $quest->xp_reward);
    }

    public function test_user_quests_relationship_returns_has_many(): void
    {
        $quest = Quest::factory()->create();

        $this->assertInstanceOf(HasMany::class, $quest->userQuests());
    }

    public function test_user_quests_relationship_returns_correct_models(): void
    {
        $quest = Quest::factory()->create();
        UserQuest::factory()->count(2)->create(['quest_id' => $quest->id]);

        $this->assertCount(2, $quest->userQuests);
        $this->assertInstanceOf(UserQuest::class, $quest->userQuests->first());
    }
}
