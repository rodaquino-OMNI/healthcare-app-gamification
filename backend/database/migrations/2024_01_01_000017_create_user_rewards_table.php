<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_rewards', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('profile_id')->constrained('game_profiles')->onDelete('cascade');
            $table->foreignUuid('reward_id')->constrained('rewards')->onDelete('cascade');
            $table->timestamp('earned_at')->useCurrent();

            $table->index('profile_id');
            $table->index('reward_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_rewards');
    }
};
