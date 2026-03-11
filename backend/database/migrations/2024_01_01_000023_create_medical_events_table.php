<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medical_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('type');
            $table->string('title');
            $table->text('description');
            $table->string('provider')->nullable();
            $table->string('location')->nullable();
            $table->date('date');
            $table->json('documents')->nullable();
            $table->json('tags')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_events');
    }
};
