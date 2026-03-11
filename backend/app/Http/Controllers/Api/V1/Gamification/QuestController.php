<?php

namespace App\Http\Controllers\Api\V1\Gamification;

use App\Http\Controllers\Controller;
use App\Http\Resources\Gamification\QuestResource;
use App\Models\GameProfile;
use App\Models\Quest;
use App\Models\UserQuest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class QuestController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $quests = Quest::all();

        return QuestResource::collection($quests);
    }

    public function show(string $id): QuestResource
    {
        $quest = Quest::findOrFail($id);

        return new QuestResource($quest);
    }

    public function start(Request $request, string $id): JsonResponse
    {
        $profile = GameProfile::where('user_id', $request->user()->id)->firstOrFail();

        Quest::findOrFail($id);

        $userQuest = UserQuest::create([
            'profile_id' => $profile->id,
            'quest_id' => $id,
            'progress' => 0,
            'completed' => false,
        ]);

        return response()->json([
            'message' => 'Quest started.',
            'data' => $userQuest,
        ], 201);
    }

    public function completeTask(Request $request, string $id, string $taskId): JsonResponse
    {
        $profile = GameProfile::where('user_id', $request->user()->id)->firstOrFail();

        $userQuest = UserQuest::where('profile_id', $profile->id)
            ->where('quest_id', $id)
            ->firstOrFail();

        $userQuest->progress = $userQuest->progress + 1;
        $userQuest->save();

        return response()->json([
            'message' => 'Task completed.',
            'data' => $userQuest,
        ], 200);
    }
}
