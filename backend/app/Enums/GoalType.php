<?php

namespace App\Enums;

enum GoalType: string
{
    case STEPS = 'STEPS';
    case SLEEP = 'SLEEP';
    case WATER = 'WATER';
    case WEIGHT = 'WEIGHT';
    case EXERCISE = 'EXERCISE';
    case HEART_RATE = 'HEART_RATE';
    case BLOOD_PRESSURE = 'BLOOD_PRESSURE';
    case BLOOD_GLUCOSE = 'BLOOD_GLUCOSE';
    case CUSTOM = 'CUSTOM';
}
