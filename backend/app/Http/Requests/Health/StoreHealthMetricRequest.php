<?php

namespace App\Http\Requests\Health;

use App\Enums\MetricSource;
use App\Enums\MetricType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHealthMetricRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::enum(MetricType::class)],
            'value' => ['required', 'numeric'],
            'unit' => ['required', 'string', 'max:50'],
            'source' => ['required', Rule::enum(MetricSource::class)],
            'recorded_at' => ['nullable', 'date'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
