<?php

namespace App\Http\Controllers\Api\V1\Gamification;

use App\Http\Controllers\Controller;
use App\Models\LeaderboardEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function show(string $journey): JsonResponse
    {
        $entries = LeaderboardEntry::where('journey', $journey)
            ->orderByDesc('score')
            ->limit(100)
            ->get();

        return response()->json([
            'data' => $entries,
        ]);
    }
}
