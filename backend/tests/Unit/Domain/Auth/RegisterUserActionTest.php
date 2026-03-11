<?php

namespace Tests\Unit\Domain\Auth;

use App\Domain\Auth\Actions\RegisterUserAction;
use App\Models\GameProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RegisterUserActionTest extends TestCase
{
    use RefreshDatabase;

    private RegisterUserAction $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = new RegisterUserAction();
    }

    public function test_successful_registration_creates_user(): void
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'cpf' => '12345678901',
            'password' => 'secret123',
            'phone' => '11999999999',
        ];

        $user = $this->action->execute($data);

        $this->assertInstanceOf(User::class, $user);
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
        ]);
    }

    public function test_registration_creates_associated_game_profile_with_zero_xp(): void
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'cpf' => '12345678901',
            'password' => 'secret123',
        ];

        $user = $this->action->execute($data);

        $this->assertDatabaseHas('game_profiles', [
            'user_id' => $user->id,
            'xp' => 0,
            'level' => 1,
        ]);
    }

    public function test_user_has_correct_name_email_cpf(): void
    {
        $data = [
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'cpf' => '98765432100',
            'password' => 'secret123',
        ];

        $user = $this->action->execute($data);

        $this->assertEquals('Jane Smith', $user->name);
        $this->assertEquals('jane@example.com', $user->email);
        $this->assertEquals('98765432100', $user->cpf);
    }

    public function test_password_is_hashed_not_stored_as_plain_text(): void
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'cpf' => '12345678901',
            'password' => 'secret123',
        ];

        $user = $this->action->execute($data);

        $this->assertNotEquals('secret123', $user->password);
        $this->assertTrue(Hash::check('secret123', $user->password));
    }
}
