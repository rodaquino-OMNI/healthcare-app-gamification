<?php

namespace App\Domain\Notification\Actions;

use App\Models\Notification;
use App\Models\User;

class SendNotificationAction
{
    /**
     * Send a notification to a user, respecting their preferences.
     */
    public function execute(User $user, string $type, string $title, string $body, array $data = []): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'channel' => 'push',
            'status' => 'pending',
            'metadata' => $data,
        ]);
    }
}
