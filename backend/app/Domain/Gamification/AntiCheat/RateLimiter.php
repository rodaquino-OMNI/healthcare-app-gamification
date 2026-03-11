<?php

namespace App\Domain\Gamification\AntiCheat;

use Illuminate\Support\Facades\Cache;

class RateLimiter
{
    /**
     * Check if a user has exceeded the event rate limit.
     */
    public function isRateLimited(string $userId): bool
    {
        $key = "gamification_events:{$userId}";
        $count = Cache::get($key, 0);
        $maxEvents = config('gamification.anti_cheat.max_events_per_minute', 100);

        return $count >= $maxEvents;
    }

    /**
     * Record an event for rate limiting purposes.
     */
    public function recordEvent(string $userId): void
    {
        $key = "gamification_events:{$userId}";
        $count = Cache::get($key, 0);
        Cache::put($key, $count + 1, 60); // 60 seconds TTL
    }

    /**
     * Check if the daily points cap has been reached.
     */
    public function isDailyCapReached(string $userId): bool
    {
        $key = "gamification_daily_points:{$userId}";
        $points = Cache::get($key, 0);
        $maxPoints = config('gamification.limits.max_points_per_day', 1000);

        return $points >= $maxPoints;
    }
}
