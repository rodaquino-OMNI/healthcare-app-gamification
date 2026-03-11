<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case SCHEDULED = 'SCHEDULED';
    case COMPLETED = 'COMPLETED';
    case CANCELLED = 'CANCELLED';
}
