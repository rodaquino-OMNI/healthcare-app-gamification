<?php

namespace App\Http\Requests\Health;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicalEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'event_type' => ['required', 'string', 'max:100'],
            'severity' => ['nullable', 'string', 'in:low,medium,high,critical'],
            'occurred_at' => ['required', 'date'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
