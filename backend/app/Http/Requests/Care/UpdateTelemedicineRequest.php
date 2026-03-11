<?php

namespace App\Http\Requests\Care;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTelemedicineRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'scheduled_at' => ['sometimes', 'date', 'after:now'],
            'duration_minutes' => ['sometimes', 'integer', 'min:15', 'max:120'],
            'status' => ['sometimes', 'string', 'in:scheduled,in_progress,completed,cancelled'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
