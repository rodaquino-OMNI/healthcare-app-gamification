<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consent_records', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('consent_type');
            $table->string('status')->default('ACTIVE');
            $table->text('purpose');
            $table->json('data_categories')->nullable();
            $table->timestamp('granted_at');
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->integer('version')->default(1);
            $table->timestamps();

            $table->index('user_id');
            $table->index('consent_type');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consent_records');
    }
};
