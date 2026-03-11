<?php

namespace App\Http\Requests\Health;

use App\Enums\GoalPeriod;
use App\Enums\GoalStatus;
use App\Enums\GoalType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHealthGoalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['sometimes', Rule::enum(GoalType::class)],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'target_value' => ['sometimes', 'numeric'],
            'current_value' => ['sometimes', 'numeric'],
            'unit' => ['sometimes', 'string', 'max:50'],
            'period' => ['sometimes', Rule::enum(GoalPeriod::class)],
            'status' => ['sometimes', Rule::enum(GoalStatus::class)],
            'starts_at' => ['sometimes', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
        ];
    }
}
