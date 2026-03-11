<?php

namespace Tests\Unit\Domain\Gamification;

use App\Domain\Gamification\Actions\AwardXpAction;
use App\Models\GameProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AwardXpActionTest extends TestCase
{
    use RefreshDatabase;

    private AwardXpAction $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = new AwardXpAction();
    }

    public function test_awards_xp_to_existing_profile(): void
    {
        $user = User::factory()->create();
        GameProfile::factory()->create([
            'user_id' => $user->id,
            'xp' => 50,
            'level' => 1,
        ]);

        $this->action->execute($user->id, 25, 'test reason');

        $profile = GameProfile::where('user_id', $user->id)->first();
        $this->assertEquals(75, $profile->xp);
    }

    public function test_creates_profile_if_none_exists(): void
    {
        $user = User::factory()->create();

        $this->action->execute($user->id, 30, 'first xp');

        $this->assertDatabaseHas('game_profiles', [
            'user_id' => $user->id,
            'xp' => 30,
        ]);
    }

    public function test_xp_is_correctly_incremented(): void
    {
        $user = User::factory()->create();
        GameProfile::factory()->create([
            'user_id' => $user->id,
            'xp' => 100,
            'level' => 2,
        ]);

        $this->action->execute($user->id, 50, 'bonus xp');

        $profile = GameProfile::where('user_id', $user->id)->first();
        $this->assertEquals(150, $profile->xp);
    }

    public function test_level_up_detection(): void
    {
        $user = User::factory()->create();
        GameProfile::factory()->create([
            'user_id' => $user->id,
            'xp' => 90,
            'level' => 1,
        ]);

        $this->action->execute($user->id, 60, 'level up xp');

        $profile = GameProfile::where('user_id', $user->id)->first();
        $this->assertEquals(150, $profile->xp);
        // Level accessor: floor(150/100) + 1 = 2
        $this->assertEquals(2, $profile->level);
    }
}
