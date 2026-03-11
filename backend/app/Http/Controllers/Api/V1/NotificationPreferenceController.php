<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\NotificationPreference;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationPreferenceController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $preference = NotificationPreference::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'push_enabled' => true,
                'email_enabled' => true,
                'sms_enabled' => false,
                'type_preferences' => [],
                'journey_preferences' => [],
            ],
        );

        return response()->json(['data' => $preference]);
    }

    public function update(Request $request): JsonResponse
    {
        $preference = NotificationPreference::updateOrCreate(
            ['user_id' => $request->user()->id],
            $request->only([
                'push_enabled',
                'email_enabled',
                'sms_enabled',
                'type_preferences',
                'journey_preferences',
            ]),
        );

        return response()->json(['data' => $preference]);
    }
}
