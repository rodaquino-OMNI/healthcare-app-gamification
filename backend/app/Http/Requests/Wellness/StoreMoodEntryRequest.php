<?php

namespace App\Http\Requests\Wellness;

use Illuminate\Foundation\Http\FormRequest;

class StoreMoodEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'mood' => ['required', 'integer', 'between:1,5'],
            'note' => ['nullable', 'string', 'max:500'],
        ];
    }
}
