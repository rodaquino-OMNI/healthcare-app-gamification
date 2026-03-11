<?php

namespace App\Http\Controllers\Api\V1\Gamification;

use App\Http\Controllers\Controller;
use App\Http\Resources\Gamification\GameProfileResource;
use App\Models\GameProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $profile = GameProfile::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['xp' => 0, 'level' => 1],
        );

        return (new GameProfileResource($profile))
            ->response()
            ->setStatusCode(200);
    }
}
