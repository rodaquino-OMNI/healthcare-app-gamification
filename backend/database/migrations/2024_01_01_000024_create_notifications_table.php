<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('type');
            $table->string('title');
            $table->text('body');
            $table->string('channel');
            $table->string('status');
            $table->string('journey')->nullable();
            $table->json('metadata')->nullable();
            $table->string('achievement_id')->nullable();
            $table->integer('points')->nullable();
            $table->string('badge_id')->nullable();
            $table->integer('level')->nullable();
            $table->string('gamification_event_type')->nullable();
            $table->integer('points_earned')->nullable();
            $table->integer('new_level')->nullable();
            $table->boolean('show_celebration')->default(false);
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
