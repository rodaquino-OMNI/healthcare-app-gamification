<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rewards', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('description');
            $table->integer('xp_reward');
            $table->string('icon');
            $table->string('journey')->default('global');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rewards');
    }
};
