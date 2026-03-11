<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('providers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('specialty');
            $table->string('location');
            $table->string('phone');
            $table->string('email');
            $table->boolean('telemedicine_available')->default(false);
            $table->timestamps();

            $table->index('specialty');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('providers');
    }
};
