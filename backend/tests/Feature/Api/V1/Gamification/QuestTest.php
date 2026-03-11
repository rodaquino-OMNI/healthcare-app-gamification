<?php

namespace Tests\Feature\Api\V1\Gamification;

use App\Models\GameProfile;
use App\Models\Quest;
use App\Models\User;
use App\Models\UserQuest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class QuestTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ─── Index ────────────────────────────────────────────────────────

    public function test_index_returns_all_quests(): void
    {
        Sanctum::actingAs($this->user);

        Quest::factory()->count(4)->create();

        $response = $this->getJson('/api/v1/gamification/quests');

        $response->assertOk()
            ->assertJsonCount(4, 'data')
            ->assertJsonStructure([
                'data' => [['id', 'title', 'description']],
            ]);
    }

    // ─── Show ─────────────────────────────────────────────────────────

    public function test_show_returns_quest(): void
    {
        Sanctum::actingAs($this->user);

        $quest = Quest::factory()->create();

        $response = $this->getJson("/api/v1/gamification/quests/{$quest->id}");

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'title', 'description']]);
    }

    public function test_show_returns_404_for_nonexistent_quest(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/gamification/quests/00000000-0000-0000-0000-000000000000');

        $response->assertNotFound();
    }

    // ─── Start ────────────────────────────────────────────────────────

    public function test_start_creates_user_quest_and_returns_201(): void
    {
        Sanctum::actingAs($this->user);

        $profile = GameProfile::factory()->create(['user_id' => $this->user->id]);
        $quest = Quest::factory()->create();

        $response = $this->postJson("/api/v1/gamification/quests/{$quest->id}/start");

        $response->assertStatus(201)
            ->assertJson(['message' => 'Quest started.']);

        $this->assertDatabaseHas('user_quests', [
            'profile_id' => $profile->id,
            'quest_id' => $quest->id,
            'progress' => 0,
            'completed' => false,
        ]);
    }

    public function test_start_returns_404_when_no_game_profile(): void
    {
        Sanctum::actingAs($this->user);

        $quest = Quest::factory()->create();

        $response = $this->postJson("/api/v1/gamification/quests/{$quest->id}/start");

        $response->assertNotFound();
    }

    public function test_start_returns_404_for_nonexistent_quest(): void
    {
        Sanctum::actingAs($this->user);

        GameProfile::factory()->create(['user_id' => $this->user->id]);

        $response = $this->postJson('/api/v1/gamification/quests/00000000-0000-0000-0000-000000000000/start');

        $response->assertNotFound();
    }

    // ─── Complete Task ────────────────────────────────────────────────

    public function test_complete_task_increments_progress(): void
    {
        Sanctum::actingAs($this->user);

        $profile = GameProfile::factory()->create(['user_id' => $this->user->id]);
        $quest = Quest::factory()->create();

        UserQuest::factory()->create([
            'profile_id' => $profile->id,
            'quest_id' => $quest->id,
            'progress' => 2,
            'completed' => false,
        ]);

        $response = $this->postJson("/api/v1/gamification/quests/{$quest->id}/tasks/1/complete");

        $response->assertOk()
            ->assertJson(['message' => 'Task completed.']);

        $this->assertDatabaseHas('user_quests', [
            'profile_id' => $profile->id,
            'quest_id' => $quest->id,
            'progress' => 3,
        ]);
    }

    public function test_complete_task_returns_404_when_user_quest_not_found(): void
    {
        Sanctum::actingAs($this->user);

        $profile = GameProfile::factory()->create(['user_id' => $this->user->id]);
        $quest = Quest::factory()->create();

        $response = $this->postJson("/api/v1/gamification/quests/{$quest->id}/tasks/1/complete");

        $response->assertNotFound();
    }

    // ─── Auth ─────────────────────────────────────────────────────────

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/v1/gamification/quests');

        $response->assertUnauthorized();
    }

    // ─── Edge Cases ────────────────────────────────────────────────────

    public function test_index_unauthenticated_returns_401(): void
    {
        $response = $this->getJson('/api/v1/gamification/quests');

        $response->assertUnauthorized();
    }

    public function test_show_unauthenticated_returns_401(): void
    {
        $quest = Quest::factory()->create();

        $response = $this->getJson("/api/v1/gamification/quests/{$quest->id}");

        $response->assertUnauthorized();
    }

    public function test_start_unauthenticated_returns_401(): void
    {
        $quest = Quest::factory()->create();

        $response = $this->postJson("/api/v1/gamification/quests/{$quest->id}/start");

        $response->assertUnauthorized();
    }

    public function test_complete_task_unauthenticated_returns_401(): void
    {
        $quest = Quest::factory()->create();

        $response = $this->postJson("/api/v1/gamification/quests/{$quest->id}/tasks/1/complete");

        $response->assertUnauthorized();
    }

    public function test_index_returns_empty_when_no_quests(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/gamification/quests');

        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_start_creates_quest_with_zero_progress(): void
    {
        Sanctum::actingAs($this->user);

        $profile = GameProfile::factory()->create(['user_id' => $this->user->id]);
        $quest = Quest::factory()->create();

        $response = $this->postJson("/api/v1/gamification/quests/{$quest->id}/start");

        $response->assertStatus(201);

        $this->assertDatabaseHas('user_quests', [
            'profile_id' => $profile->id,
            'quest_id' => $quest->id,
            'progress' => 0,
            'completed' => false,
        ]);
    }
}
