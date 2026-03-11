<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('health_goals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('record_id');
            $table->string('type');
            $table->string('title');
            $table->text('description')->nullable();
            $table->float('target_value');
            $table->string('unit');
            $table->float('current_value')->default(0);
            $table->string('status')->default('ACTIVE');
            $table->string('period');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->date('completed_date')->nullable();
            $table->timestamps();

            $table->index(['record_id', 'type']);
            $table->index('status');
            $table->index('period');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health_goals');
    }
};
