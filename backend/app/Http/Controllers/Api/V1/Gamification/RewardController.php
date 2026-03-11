<?php

namespace App\Http\Controllers\Api\V1\Gamification;

use App\Http\Controllers\Controller;
use App\Http\Resources\Gamification\RewardResource;
use App\Models\GameProfile;
use App\Models\Reward;
use App\Models\UserReward;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RewardController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $rewards = Reward::all();

        return RewardResource::collection($rewards);
    }

    public function show(string $id): RewardResource
    {
        $reward = Reward::findOrFail($id);

        return new RewardResource($reward);
    }

    public function claim(Request $request, string $id): JsonResponse
    {
        $profile = GameProfile::where('user_id', $request->user()->id)->firstOrFail();

        Reward::findOrFail($id);

        $userReward = UserReward::create([
            'profile_id' => $profile->id,
            'reward_id' => $id,
            'earned_at' => now(),
        ]);

        return response()->json([
            'message' => 'Reward claimed.',
            'data' => $userReward,
        ], 201);
    }
}
