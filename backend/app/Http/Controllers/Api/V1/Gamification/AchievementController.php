<?php

namespace App\Http\Controllers\Api\V1\Gamification;

use App\Http\Controllers\Controller;
use App\Http\Resources\Gamification\AchievementResource;
use App\Models\Achievement;
use App\Models\GameProfile;
use App\Models\UserAchievement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AchievementController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $achievements = Achievement::all();

        return AchievementResource::collection($achievements);
    }

    public function show(string $id): AchievementResource
    {
        $achievement = Achievement::findOrFail($id);

        return new AchievementResource($achievement);
    }

    public function acknowledge(Request $request, string $id): JsonResponse
    {
        $profile = GameProfile::where('user_id', $request->user()->id)->firstOrFail();

        $userAchievement = UserAchievement::where('profile_id', $profile->id)
            ->where('achievement_id', $id)
            ->firstOrFail();

        $userAchievement->acknowledged = true;
        $userAchievement->save();

        return response()->json([
            'message' => 'Achievement acknowledged.',
        ], 200);
    }
}
