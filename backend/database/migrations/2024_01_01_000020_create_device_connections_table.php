<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('device_connections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('record_id');
            $table->string('device_type');
            $table->string('device_id')->nullable();
            $table->string('status')->default('PENDING');
            $table->timestamp('last_sync')->nullable();
            $table->text('auth_token')->nullable();
            $table->text('refresh_token')->nullable();
            $table->timestamp('token_expiry')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('device_type');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('device_connections');
    }
};
