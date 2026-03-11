<?php

namespace App\Http\Requests\Health;

use App\Enums\MetricSource;
use App\Enums\MetricType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHealthMetricRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['sometimes', Rule::enum(MetricType::class)],
            'value' => ['sometimes', 'numeric'],
            'unit' => ['sometimes', 'string', 'max:50'],
            'source' => ['sometimes', Rule::enum(MetricSource::class)],
            'recorded_at' => ['nullable', 'date'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
