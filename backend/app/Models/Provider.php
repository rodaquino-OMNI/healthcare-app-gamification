<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provider extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'specialty',
        'location',
        'phone',
        'email',
        'telemedicine_available',
    ];

    protected function casts(): array
    {
        return [
            'telemedicine_available' => 'boolean',
        ];
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
