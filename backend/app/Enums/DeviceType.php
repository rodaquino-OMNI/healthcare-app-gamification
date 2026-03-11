<?php

namespace App\Enums;

enum DeviceType: string
{
    case FITBIT = 'FITBIT';
    case APPLE_HEALTH = 'APPLE_HEALTH';
    case GOOGLE_FIT = 'GOOGLE_FIT';
    case SAMSUNG_HEALTH = 'SAMSUNG_HEALTH';
    case GARMIN = 'GARMIN';
}
