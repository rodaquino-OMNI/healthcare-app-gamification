<?php

namespace App\Enums;

enum AppointmentType: string
{
    case IN_PERSON = 'IN_PERSON';
    case TELEMEDICINE = 'TELEMEDICINE';
}
