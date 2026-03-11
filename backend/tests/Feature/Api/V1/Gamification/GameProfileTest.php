<?php

namespace Tests\Feature\Api\V1\Gamification;

use App\Models\GameProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GameProfileTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ─── Show ─────────────────────────────────────────────────────────

    public function test_show_returns_existing_game_profile(): void
    {
        Sanctum::actingAs($this->user);

        GameProfile::factory()->create([
            'user_id' => $this->user->id,
            'xp' => 250,
        ]);

        $response = $this->getJson('/api/v1/gamification/profile');

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'xp', 'level']]);
    }

    public function test_show_creates_profile_if_none_exists(): void
    {
        Sanctum::actingAs($this->user);

        $this->assertDatabaseMissing('game_profiles', ['user_id' => $this->user->id]);

        $response = $this->getJson('/api/v1/gamification/profile');

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'xp', 'level']]);

        $this->assertDatabaseHas('game_profiles', [
            'user_id' => $this->user->id,
            'xp' => 0,
        ]);
    }

    // ─── Auth ─────────────────────────────────────────────────────────

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/v1/gamification/profile');

        $response->assertUnauthorized();
    }
}
