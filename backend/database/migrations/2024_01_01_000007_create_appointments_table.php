<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('provider_id')->constrained('providers')->onDelete('cascade');
            $table->timestamp('date_time');
            $table->string('type'); // IN_PERSON, TELEMEDICINE
            $table->string('status')->default('SCHEDULED'); // SCHEDULED, COMPLETED, CANCELLED
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('provider_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
