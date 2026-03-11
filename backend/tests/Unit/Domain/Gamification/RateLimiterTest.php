<?php

namespace Tests\Unit\Domain\Gamification;

use App\Domain\Gamification\AntiCheat\RateLimiter;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class RateLimiterTest extends TestCase
{
    private RateLimiter $limiter;

    protected function setUp(): void
    {
        parent::setUp();
        $this->limiter = new RateLimiter();
        Cache::flush();
    }

    public function test_is_rate_limited_returns_false_when_under_limit(): void
    {
        Cache::put('gamification_events:user-123', 5, 60);

        $this->assertFalse($this->limiter->isRateLimited('user-123'));
    }

    public function test_is_rate_limited_returns_true_when_at_limit(): void
    {
        $maxEvents = config('gamification.anti_cheat.max_events_per_minute', 100);
        Cache::put('gamification_events:user-123', $maxEvents, 60);

        $this->assertTrue($this->limiter->isRateLimited('user-123'));
    }

    public function test_is_rate_limited_returns_true_when_over_limit(): void
    {
        $maxEvents = config('gamification.anti_cheat.max_events_per_minute', 100);
        Cache::put('gamification_events:user-123', $maxEvents + 10, 60);

        $this->assertTrue($this->limiter->isRateLimited('user-123'));
    }

    public function test_record_event_increments_counter_in_cache(): void
    {
        $this->limiter->recordEvent('user-456');
        $this->assertEquals(1, Cache::get('gamification_events:user-456'));

        $this->limiter->recordEvent('user-456');
        $this->assertEquals(2, Cache::get('gamification_events:user-456'));

        $this->limiter->recordEvent('user-456');
        $this->assertEquals(3, Cache::get('gamification_events:user-456'));
    }

    public function test_is_daily_cap_reached_returns_false_when_under_cap(): void
    {
        Cache::put('gamification_daily_points:user-123', 500, 86400);

        $this->assertFalse($this->limiter->isDailyCapReached('user-123'));
    }

    public function test_is_daily_cap_reached_returns_true_when_at_cap(): void
    {
        $maxPoints = config('gamification.limits.max_points_per_day', 1000);
        Cache::put('gamification_daily_points:user-123', $maxPoints, 86400);

        $this->assertTrue($this->limiter->isDailyCapReached('user-123'));
    }

    public function test_is_daily_cap_reached_returns_true_when_over_cap(): void
    {
        $maxPoints = config('gamification.limits.max_points_per_day', 1000);
        Cache::put('gamification_daily_points:user-123', $maxPoints + 100, 86400);

        $this->assertTrue($this->limiter->isDailyCapReached('user-123'));
    }
}
