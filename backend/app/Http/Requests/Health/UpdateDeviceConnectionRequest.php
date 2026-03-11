<?php

namespace App\Http\Requests\Health;

use App\Enums\DeviceConnectionStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDeviceConnectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_name' => ['sometimes', 'string', 'max:255'],
            'status' => ['sometimes', Rule::enum(DeviceConnectionStatus::class)],
            'access_token' => ['nullable', 'string'],
            'refresh_token' => ['nullable', 'string'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
