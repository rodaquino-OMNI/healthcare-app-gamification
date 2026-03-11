<?php

namespace Tests\Feature\Api\V1\Gamification;

use App\Models\GameProfile;
use App\Models\Reward;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RewardTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ─── Index ────────────────────────────────────────────────────────

    public function test_index_returns_all_rewards(): void
    {
        Sanctum::actingAs($this->user);

        Reward::factory()->count(4)->create();

        $response = $this->getJson('/api/v1/gamification/rewards');

        $response->assertOk()
            ->assertJsonCount(4, 'data')
            ->assertJsonStructure([
                'data' => [['id', 'title', 'description']],
            ]);
    }

    // ─── Show ─────────────────────────────────────────────────────────

    public function test_show_returns_reward(): void
    {
        Sanctum::actingAs($this->user);

        $reward = Reward::factory()->create();

        $response = $this->getJson("/api/v1/gamification/rewards/{$reward->id}");

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'title', 'description']]);
    }

    public function test_show_returns_404_for_nonexistent_reward(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/gamification/rewards/00000000-0000-0000-0000-000000000000');

        $response->assertNotFound();
    }

    // ─── Claim ────────────────────────────────────────────────────────

    public function test_claim_creates_user_reward_and_returns_201(): void
    {
        Sanctum::actingAs($this->user);

        $profile = GameProfile::factory()->create(['user_id' => $this->user->id]);
        $reward = Reward::factory()->create();

        $response = $this->postJson("/api/v1/gamification/rewards/{$reward->id}/claim");

        $response->assertStatus(201)
            ->assertJson(['message' => 'Reward claimed.']);

        $this->assertDatabaseHas('user_rewards', [
            'profile_id' => $profile->id,
            'reward_id' => $reward->id,
        ]);
    }

    public function test_claim_returns_404_when_no_game_profile(): void
    {
        Sanctum::actingAs($this->user);

        $reward = Reward::factory()->create();

        $response = $this->postJson("/api/v1/gamification/rewards/{$reward->id}/claim");

        $response->assertNotFound();
    }

    public function test_claim_returns_404_for_nonexistent_reward(): void
    {
        Sanctum::actingAs($this->user);

        GameProfile::factory()->create(['user_id' => $this->user->id]);

        $response = $this->postJson('/api/v1/gamification/rewards/00000000-0000-0000-0000-000000000000/claim');

        $response->assertNotFound();
    }

    // ─── Auth ─────────────────────────────────────────────────────────

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/v1/gamification/rewards');

        $response->assertUnauthorized();
    }

    // ─── Edge Cases ────────────────────────────────────────────────────

    public function test_index_unauthenticated_returns_401(): void
    {
        $response = $this->getJson('/api/v1/gamification/rewards');

        $response->assertUnauthorized();
    }

    public function test_show_unauthenticated_returns_401(): void
    {
        $reward = Reward::factory()->create();

        $response = $this->getJson("/api/v1/gamification/rewards/{$reward->id}");

        $response->assertUnauthorized();
    }

    public function test_claim_unauthenticated_returns_401(): void
    {
        $reward = Reward::factory()->create();

        $response = $this->postJson("/api/v1/gamification/rewards/{$reward->id}/claim");

        $response->assertUnauthorized();
    }

    public function test_index_returns_empty_when_no_rewards(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/v1/gamification/rewards');

        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }
}
