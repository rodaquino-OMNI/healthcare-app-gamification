<?php

namespace App\Http\Requests\Health;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMedicalEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'event_type' => ['sometimes', 'string', 'max:100'],
            'severity' => ['nullable', 'string', 'in:low,medium,high,critical'],
            'occurred_at' => ['sometimes', 'date'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
