<?php

namespace App\Http\Requests\Care;

use Illuminate\Foundation\Http\FormRequest;

class StoreTelemedicineRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'provider_id' => ['required', 'uuid', 'exists:providers,id'],
            'appointment_id' => ['nullable', 'uuid', 'exists:appointments,id'],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'duration_minutes' => ['required', 'integer', 'min:15', 'max:120'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
