<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_achievements', function (Blueprint $table) {
            $table->foreignUuid('profile_id')->constrained('game_profiles')->onDelete('cascade');
            $table->foreignUuid('achievement_id')->constrained('achievements')->onDelete('cascade');
            $table->integer('progress')->default(0);
            $table->boolean('unlocked')->default(false);
            $table->boolean('acknowledged')->default(false);
            $table->timestamp('unlocked_at')->nullable();
            $table->timestamps();

            $table->primary(['profile_id', 'achievement_id']);
            $table->index('achievement_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_achievements');
    }
};
