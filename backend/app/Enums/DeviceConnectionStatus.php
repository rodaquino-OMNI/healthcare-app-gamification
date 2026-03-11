<?php

namespace App\Enums;

enum DeviceConnectionStatus: string
{
    case CONNECTED = 'CONNECTED';
    case DISCONNECTED = 'DISCONNECTED';
    case EXPIRED = 'EXPIRED';
    case PENDING = 'PENDING';
    case FAILED = 'FAILED';
}
