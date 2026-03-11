<?php

namespace App\Enums;

enum ConsentStatus: string
{
    case ACTIVE = 'ACTIVE';
    case REVOKED = 'REVOKED';
    case EXPIRED = 'EXPIRED';
}
