<?php

return [
    'xp_per_level' => 100,
    'rules_refresh_interval' => 60,
    'points' => [
        'health_metric_recorded' => 10,
        'appointment_booked' => 20,
        'appointment_attended' => 50,
        'claim_submitted' => 15,
        'goal_completed' => 100,
    ],
    'limits' => [
        'max_points_per_day' => 1000,
        'max_points_per_action' => 500,
    ],
    'leaderboard' => [
        'max_entries' => 100,
        'ttl' => 300,
    ],
    'anti_cheat' => [
        'enabled' => true,
        'max_events_per_minute' => 100,
    ],
    'cache_ttl' => [
        'achievements' => 3600,
        'user_profile' => 300,
        'leaderboard' => 900,
        'rules' => 600,
    ],
];
