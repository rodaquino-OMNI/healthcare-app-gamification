<?php

namespace App\Http\Controllers\Api\V1\Wellness;

use App\Http\Controllers\Controller;
use App\Models\JournalEntry;
use App\Models\MeditationLog;
use App\Models\MoodEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class WellnessSummaryController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $today  = Carbon::today();

        // Mood streak: count consecutive days with at least one mood entry in the last 30 days
        $moodStreak = $this->calculateMoodStreak($userId, $today);

        // Meditation minutes logged today
        $meditationMinutesToday = MeditationLog::where('user_id', $userId)
            ->whereDate('created_at', $today)
            ->sum('duration_minutes');

        // Journal entries count for the current month
        $journalEntriesCount = JournalEntry::where('user_id', $userId)
            ->whereYear('created_at', $today->year)
            ->whereMonth('created_at', $today->month)
            ->count();

        // Latest mood entry
        $latestMoodEntry = MoodEntry::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->first();

        return response()->json([
            'mood_streak'              => $moodStreak,
            'meditation_minutes_today' => (int) $meditationMinutesToday,
            'journal_entries_count'    => $journalEntriesCount,
            'latest_mood'              => $latestMoodEntry ? $latestMoodEntry->mood : null,
        ]);
    }

    private function calculateMoodStreak(string $userId, Carbon $today): int
    {
        $streak  = 0;
        $current = $today->copy();
        $limit   = $today->copy()->subDays(29); // last 30 days window

        while ($current->greaterThanOrEqualTo($limit)) {
            $hasEntry = MoodEntry::where('user_id', $userId)
                ->whereDate('created_at', $current)
                ->exists();

            if (! $hasEntry) {
                break;
            }

            $streak++;
            $current->subDay();
        }

        return $streak;
    }
}
