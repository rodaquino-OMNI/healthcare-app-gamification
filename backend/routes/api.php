<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\MfaController;
use App\Http\Controllers\Api\V1\Care\AppointmentController;
use App\Http\Controllers\Api\V1\Care\MedicationController;
use App\Http\Controllers\Api\V1\Care\ProviderController;
use App\Http\Controllers\Api\V1\Care\TelemedicineController;
use App\Http\Controllers\Api\V1\Care\TreatmentPlanController;
use App\Http\Controllers\Api\V1\ConsentController;
use App\Http\Controllers\Api\V1\Gamification\AchievementController;
use App\Http\Controllers\Api\V1\Gamification\GamificationEventController;
use App\Http\Controllers\Api\V1\Gamification\GameProfileController;
use App\Http\Controllers\Api\V1\Gamification\LeaderboardController;
use App\Http\Controllers\Api\V1\Gamification\QuestController;
use App\Http\Controllers\Api\V1\Gamification\RewardController;
use App\Http\Controllers\Api\V1\Health\DeviceConnectionController;
use App\Http\Controllers\Api\V1\Health\HealthGoalController;
use App\Http\Controllers\Api\V1\Health\HealthMetricController;
use App\Http\Controllers\Api\V1\Health\MedicalEventController;
use App\Http\Controllers\Api\V1\HealthCheckController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\NotificationPreferenceController;
use App\Http\Controllers\Api\V1\Plan\BenefitController;
use App\Http\Controllers\Api\V1\Plan\ClaimController;
use App\Http\Controllers\Api\V1\Plan\CoverageController;
use App\Http\Controllers\Api\V1\Plan\PlanController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // ─── Public ──────────────────────────────────────────────────────
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/refresh', [AuthController::class, 'refresh']);
    Route::get('health', HealthCheckController::class);

    // ─── Protected ───────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::post('auth/mfa/enable', [MfaController::class, 'enable']);
        Route::post('auth/mfa/verify', [MfaController::class, 'verify']);
        Route::post('auth/mfa/disable', [MfaController::class, 'disable']);

        // Health
        Route::apiResource('health/metrics', HealthMetricController::class);
        Route::apiResource('health/goals', HealthGoalController::class);
        Route::apiResource('health/devices', DeviceConnectionController::class);
        Route::apiResource('health/medical-events', MedicalEventController::class);

        // Care
        Route::apiResource('care/appointments', AppointmentController::class);
        Route::apiResource('care/providers', ProviderController::class)->only(['index', 'show']);
        Route::apiResource('care/medications', MedicationController::class);
        Route::apiResource('care/telemedicine', TelemedicineController::class);
        Route::apiResource('care/treatment-plans', TreatmentPlanController::class);

        // Plan
        Route::apiResource('plan/plans', PlanController::class);
        Route::apiResource('plan/claims', ClaimController::class);
        Route::apiResource('plan/coverages', CoverageController::class)->only(['index', 'show']);
        Route::apiResource('plan/benefits', BenefitController::class)->only(['index', 'show']);

        // Gamification
        Route::get('gamification/profile', [GameProfileController::class, 'show']);
        Route::get('gamification/achievements', [AchievementController::class, 'index']);
        Route::get('gamification/achievements/{id}', [AchievementController::class, 'show']);
        Route::post('gamification/achievements/{id}/acknowledge', [AchievementController::class, 'acknowledge']);
        Route::get('gamification/quests', [QuestController::class, 'index']);
        Route::get('gamification/quests/{id}', [QuestController::class, 'show']);
        Route::post('gamification/quests/{id}/start', [QuestController::class, 'start']);
        Route::post('gamification/quests/{id}/tasks/{taskId}/complete', [QuestController::class, 'completeTask']);
        Route::get('gamification/rewards', [RewardController::class, 'index']);
        Route::get('gamification/rewards/{id}', [RewardController::class, 'show']);
        Route::post('gamification/rewards/{id}/claim', [RewardController::class, 'claim']);
        Route::get('gamification/leaderboard/{journey}', [LeaderboardController::class, 'show']);
        Route::post('gamification/events', [GamificationEventController::class, 'process']);

        // Notifications
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::get('notifications/preferences', [NotificationPreferenceController::class, 'show']);
        Route::put('notifications/preferences', [NotificationPreferenceController::class, 'update']);
        Route::get('notifications/{id}', [NotificationController::class, 'show']);
        Route::patch('notifications/{id}/read', [NotificationController::class, 'markAsRead']);

        // Consent (LGPD)
        Route::get('consent', [ConsentController::class, 'index']);
        Route::post('consent', [ConsentController::class, 'store']);
        Route::delete('consent/{id}', [ConsentController::class, 'revoke']);
    });
});
