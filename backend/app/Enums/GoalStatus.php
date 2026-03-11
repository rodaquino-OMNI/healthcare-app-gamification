<?php

namespace App\Enums;

enum GoalStatus: string
{
    case ACTIVE = 'ACTIVE';
    case COMPLETED = 'COMPLETED';
    case ABANDONED = 'ABANDONED';
}
