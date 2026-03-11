<?php

namespace App\Http\Controllers\Api\V1\Wellness;

use App\Http\Controllers\Controller;
use App\Http\Requests\Wellness\StoreMeditationLogRequest;
use App\Http\Resources\Wellness\MeditationLogResource;
use App\Http\Resources\Wellness\MeditationSessionResource;
use App\Models\MeditationLog;
use App\Models\MeditationSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MeditationController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $sessions = MeditationSession::where('is_active', true)->get();

        return MeditationSessionResource::collection($sessions);
    }

    public function log(StoreMeditationLogRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $log = MeditationLog::create([
            'user_id'          => $request->user()->id,
            'session_id'       => $validated['session_id'],
            'duration_minutes' => $validated['duration_minutes'],
        ]);

        return (new MeditationLogResource($log))
            ->response()
            ->setStatusCode(201);
    }
}
