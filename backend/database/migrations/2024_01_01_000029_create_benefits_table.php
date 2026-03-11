<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('benefits', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('plan_id')->constrained('plans')->onDelete('cascade');
            $table->string('type');
            $table->text('description');
            $table->text('limitations')->nullable();
            $table->string('usage')->nullable();

            $table->index('plan_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('benefits');
    }
};
