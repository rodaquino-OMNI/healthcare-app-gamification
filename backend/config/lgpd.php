<?php

return [
    'retention_years' => 20,
    'consent_expiry_days' => 365,
    'data_export_format' => 'json',
    'dpo_email' => env('DPO_EMAIL', 'dpo@austa.com.br'),
];
