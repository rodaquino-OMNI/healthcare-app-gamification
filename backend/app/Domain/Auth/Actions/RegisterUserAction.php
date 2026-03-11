<?php

namespace App\Domain\Auth\Actions;

use App\Models\GameProfile;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterUserAction
{
    /**
     * Register a new user and create associated profiles.
     */
    public function execute(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'cpf' => $data['cpf'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
        ]);

        GameProfile::create([
            'user_id' => $user->id,
            'xp' => 0,
            'level' => 1,
        ]);

        return $user;
    }
}
