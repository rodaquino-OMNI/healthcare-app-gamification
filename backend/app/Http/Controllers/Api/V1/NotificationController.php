<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->paginate(15);

        return response()->json($notifications);
    }

    public function show(string $id): JsonResponse
    {
        $notification = Notification::findOrFail($id);

        return response()->json(['data' => $notification]);
    }

    public function markAsRead(string $id): JsonResponse
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['status' => 'read']);

        return response()->json(['data' => $notification]);
    }
}
