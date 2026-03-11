<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_quests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('profile_id')->constrained('game_profiles')->onDelete('cascade');
            $table->foreignUuid('quest_id')->constrained('quests')->onDelete('cascade');
            $table->integer('progress')->default(0);
            $table->boolean('completed')->default(false);
            $table->timestamps();

            $table->index('profile_id');
            $table->index('quest_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_quests');
    }
};
