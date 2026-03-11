<?php

namespace App\Http\Requests\Care;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTreatmentPlanRequest extends FormRequest
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
            'status' => ['sometimes', 'string', 'in:active,completed,cancelled'],
            'starts_at' => ['sometimes', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'goals' => ['nullable', 'array'],
            'goals.*' => ['string'],
        ];
    }
}
