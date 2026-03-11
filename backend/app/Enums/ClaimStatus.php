<?php

namespace App\Enums;

enum ClaimStatus: string
{
    case DRAFT = 'DRAFT';
    case SUBMITTED = 'SUBMITTED';
    case UNDER_REVIEW = 'UNDER_REVIEW';
    case ADDITIONAL_INFO_REQUIRED = 'ADDITIONAL_INFO_REQUIRED';
    case APPROVED = 'APPROVED';
    case DENIED = 'DENIED';
    case PROCESSING = 'PROCESSING';
    case COMPLETED = 'COMPLETED';
    case CANCELLED = 'CANCELLED';
}
