<?php

namespace Tests\Unit\Models;

use App\Models\GameProfile;
use App\Models\Quest;
use App\Models\UserQuest;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserQuestTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $uq = UserQuest::factory()->create();

        $this->assertDatabaseHas('user_quests', ['id' => $uq->id]);
    }

    public function test_casts_progress_to_integer(): void
    {
        $uq = UserQuest::factory()->create(['progress' => 75]);

        $this->assertIsInt($uq->progress);
        $this->assertEquals(75, $uq->progress);
    }

    public function test_casts_completed_to_boolean(): void
    {
        $uq = UserQuest::factory()->create(['completed' => true]);

        $this->assertIsBool($uq->completed);
        $this->assertTrue($uq->completed);
    }

    public function test_game_profile_relationship_returns_belongs_to(): void
    {
        $uq = UserQuest::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $uq->gameProfile());
    }

    public function test_game_profile_relationship_returns_correct_model(): void
    {
        $profile = GameProfile::factory()->create();
        $uq = UserQuest::factory()->create(['profile_id' => $profile->id]);

        $this->assertInstanceOf(GameProfile::class, $uq->gameProfile);
        $this->assertEquals($profile->id, $uq->gameProfile->id);
    }

    public function test_quest_relationship_returns_belongs_to(): void
    {
        $uq = UserQuest::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $uq->quest());
    }

    public function test_quest_relationship_returns_correct_model(): void
    {
        $quest = Quest::factory()->create();
        $uq = UserQuest::factory()->create(['quest_id' => $quest->id]);

        $this->assertInstanceOf(Quest::class, $uq->quest);
        $this->assertEquals($quest->id, $uq->quest->id);
    }
}
