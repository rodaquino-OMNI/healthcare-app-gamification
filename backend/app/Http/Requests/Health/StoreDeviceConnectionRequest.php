<?php

namespace App\Http\Requests\Health;

use App\Enums\DeviceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDeviceConnectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_type' => ['required', Rule::enum(DeviceType::class)],
            'device_name' => ['required', 'string', 'max:255'],
            'device_identifier' => ['required', 'string', 'max:255'],
            'access_token' => ['nullable', 'string'],
            'refresh_token' => ['nullable', 'string'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
