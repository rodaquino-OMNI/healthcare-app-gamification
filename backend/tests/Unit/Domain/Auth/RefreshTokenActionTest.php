<?php

namespace Tests\Unit\Domain\Auth;

use App\Domain\Auth\Actions\RefreshTokenAction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RefreshTokenActionTest extends TestCase
{
    use RefreshDatabase;

    private RefreshTokenAction $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = new RefreshTokenAction();
    }

    public function test_refreshing_token_deletes_old_token_and_creates_new_one(): void
    {
        $user = User::factory()->create();
        $oldToken = $user->createToken('api');
        $oldPlainText = $oldToken->plainTextToken;

        // Act as the user with the current token
        $this->actingAs($user);
        $user->withAccessToken($oldToken->accessToken);

        $result = $this->action->execute($user);

        // Old token should be deleted
        $this->assertDatabaseMissing('personal_access_tokens', [
            'id' => $oldToken->accessToken->id,
        ]);

        // New token should exist
        $this->assertNotEquals($oldPlainText, $result['token']);
        $this->assertNotEmpty($result['token']);
    }

    public function test_returns_user_and_new_token_string(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('api');

        $user->withAccessToken($token->accessToken);

        $result = $this->action->execute($user);

        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('token', $result);
        $this->assertInstanceOf(User::class, $result['user']);
        $this->assertEquals($user->id, $result['user']->id);
        $this->assertIsString($result['token']);
        $this->assertNotEmpty($result['token']);
    }
}
