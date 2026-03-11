<?php

namespace Tests\Feature\Api\V1\Gamification;

use App\Models\Achievement;
use App\Models\GameProfile;
use App\Models\User;
use App\Models\UserAchievement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AchievementTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ─── Index ────────────────────────────────────────────────────────

    public function test_index_returns_all_achievements(): void
    {
        Sanctum::actingAs($this->user);

        Achievement::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/gamification/achievements');

        $response->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonStructure([
                'data' => [['id', 'title', 'description']],
            ]);
    }

    // ─── Show ─────────────────────────────────────────────────────────

    public function test_show_returns_achievement(): void
    {
        Sanctum::actingAs($this->user);

        $achievement = Achievement::factory()->create();

        $response = $this->getJson("/api/v1/gamification/achievements/{$achievement->id}");

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'title', 'description']]);
    }

    public function test_show_returns_404_for_nonexistent_achievement(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/gamification/achievements/00000000-0000-0000-0000-000000000000');

        $response->assertNotFound();
    }

    // ─── Acknowledge ──────────────────────────────────────────────────

    public function test_acknowledge_marks_user_achievement_as_acknowledged(): void
    {
        Sanctum::actingAs($this->user);

        $profile = GameProfile::factory()->create(['user_id' => $this->user->id]);
        $achievement = Achievement::factory()->create();

        UserAchievement::factory()->create([
            'profile_id' => $profile->id,
            'achievement_id' => $achievement->id,
            'unlocked' => true,
        ]);

        $response = $this->postJson("/api/v1/gamification/achievements/{$achievement->id}/acknowledge");

        $response->assertOk()
            ->assertJson(['message' => 'Achievement acknowledged.']);

        $this->assertDatabaseHas('user_achievements', [
            'profile_id' => $profile->id,
            'achievement_id' => $achievement->id,
            'acknowledged' => true,
        ]);
    }

    public function test_acknowledge_returns_404_when_no_game_profile(): void
    {
        Sanctum::actingAs($this->user);

        $achievement = Achievement::factory()->create();

        $response = $this->postJson("/api/v1/gamification/achievements/{$achievement->id}/acknowledge");

        $response->assertNotFound();
    }

    // ─── Auth ─────────────────────────────────────────────────────────

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/v1/gamification/achievements');

        $response->assertUnauthorized();
    }
}
