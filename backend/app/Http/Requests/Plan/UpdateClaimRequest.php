<?php

namespace App\Http\Requests\Plan;

use App\Enums\ClaimStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateClaimRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', Rule::enum(ClaimStatus::class)],
            'description' => ['sometimes', 'string'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'documents' => ['nullable', 'array'],
            'documents.*' => ['file', 'max:10240'],
        ];
    }
}
