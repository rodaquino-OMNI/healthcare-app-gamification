<?php

namespace App\Http\Requests\Wellness;

use Illuminate\Foundation\Http\FormRequest;

class StoreMeditationLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'session_id'       => ['required', 'uuid', 'exists:meditation_sessions,id'],
            'duration_minutes' => ['required', 'integer', 'min:1', 'max:180'],
        ];
    }
}
