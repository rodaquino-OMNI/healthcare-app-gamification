<?php

namespace App\Enums;

enum GoalPeriod: string
{
    case DAILY = 'DAILY';
    case WEEKLY = 'WEEKLY';
    case MONTHLY = 'MONTHLY';
    case CUSTOM = 'CUSTOM';
}
