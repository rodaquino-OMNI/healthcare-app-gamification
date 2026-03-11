<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('health_metrics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('type');
            $table->float('value');
            $table->string('unit');
            $table->timestamp('timestamp');
            $table->string('source')->nullable();
            $table->text('notes')->nullable();
            $table->float('trend')->nullable();
            $table->boolean('is_abnormal')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('type');
            $table->index('timestamp');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health_metrics');
    }
};
