<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('description');
            $table->string('journey');
            $table->string('icon');
            $table->integer('xp_reward');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quests');
    }
};
