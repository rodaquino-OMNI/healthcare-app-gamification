<?php

namespace Tests\Unit\Domain\Auth;

use App\Domain\Auth\Actions\LoginAction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class LoginActionTest extends TestCase
{
    use RefreshDatabase;

    private LoginAction $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = new LoginAction();
    }

    public function test_successful_login_returns_user_and_token(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('secret123'),
        ]);

        $result = $this->action->execute('test@example.com', 'secret123');

        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('token', $result);
        $this->assertInstanceOf(User::class, $result['user']);
        $this->assertEquals($user->id, $result['user']->id);
        $this->assertIsString($result['token']);
        $this->assertNotEmpty($result['token']);
    }

    public function test_login_with_wrong_password_throws_validation_exception(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('secret123'),
        ]);

        $this->expectException(ValidationException::class);

        $this->action->execute('test@example.com', 'wrong-password');
    }

    public function test_login_with_non_existent_email_throws_validation_exception(): void
    {
        $this->expectException(ValidationException::class);

        $this->action->execute('nonexistent@example.com', 'any-password');
    }
}
