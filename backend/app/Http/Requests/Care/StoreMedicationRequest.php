<?php

namespace App\Http\Requests\Care;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'dosage' => ['required', 'numeric'],
            'frequency' => ['required', 'string', 'max:100'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'instructions' => ['nullable', 'string'],
            'prescriber_id' => ['nullable', 'uuid', 'exists:providers,id'],
        ];
    }
}
