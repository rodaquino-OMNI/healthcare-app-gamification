<?php

namespace App\Domain\Auth\Actions;

use App\Models\User;

class RefreshTokenAction
{
    /**
     * Refresh the authenticated user's token.
     *
     * @return array{user: User, token: string}
     */
    public function execute(User $user): array
    {
        $user->currentAccessToken()->delete();
        $token = $user->createToken('api')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }
}
