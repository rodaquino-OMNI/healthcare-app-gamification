<?php

namespace App\Http\Requests\Wellness;

use Illuminate\Foundation\Http\FormRequest;

class StoreJournalEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'mood'   => ['required', 'integer', 'between:1,5'],
            'body'   => ['required', 'string', 'max:5000'],
            'tags'   => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ];
    }
}
