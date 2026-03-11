<?php

namespace App\Enums;

enum MetricSource: string
{
    case USER_INPUT = 'USER_INPUT';
    case GOOGLE_FIT = 'GOOGLE_FIT';
    case HEALTH_KIT = 'HEALTH_KIT';
    case EXTERNAL_LAB = 'EXTERNAL_LAB';
    case CONNECTED_DEVICE = 'CONNECTED_DEVICE';
    case CALCULATED = 'CALCULATED';
}
