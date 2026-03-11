<?php

namespace App\Enums;

enum ConsentType: string
{
    case DATA_PROCESSING = 'DATA_PROCESSING';
    case HEALTH_DATA_SHARING = 'HEALTH_DATA_SHARING';
    case MARKETING = 'MARKETING';
    case RESEARCH = 'RESEARCH';
    case TELEMEDICINE = 'TELEMEDICINE';
    case THIRD_PARTY_SHARING = 'THIRD_PARTY_SHARING';
}
