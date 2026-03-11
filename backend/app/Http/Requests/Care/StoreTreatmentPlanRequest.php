<?php

namespace App\Http\Requests\Care;

use Illuminate\Foundation\Http\FormRequest;

class StoreTreatmentPlanRequest extends FormRequest
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
            'provider_id' => ['required', 'uuid', 'exists:providers,id'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'goals' => ['nullable', 'array'],
            'goals.*' => ['string'],
        ];
    }
}
