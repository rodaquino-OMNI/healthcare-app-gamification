<?php

namespace App\Http\Controllers\Api\V1\Gamification;

use App\Http\Controllers\Controller;
use App\Http\Requests\Gamification\ProcessEventRequest;
use App\Jobs\ProcessGamificationEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GamificationEventController extends Controller
{
    public function process(ProcessEventRequest $request): JsonResponse
    {
        ProcessGamificationEvent::dispatch(
            $request->user()->id,
            $request->validated('event_type'),
            $request->validated('payload'),
        );

        return response()->json([
            'message' => 'Event accepted for processing.',
        ], 202);
    }
}
