<?php

namespace App\Http\Requests\Gamification;

use Illuminate\Foundation\Http\FormRequest;

class ProcessEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_type' => ['required', 'string', 'max:100'],
            'payload' => ['required', 'array'],
            'occurred_at' => ['nullable', 'date'],
        ];
    }
}
