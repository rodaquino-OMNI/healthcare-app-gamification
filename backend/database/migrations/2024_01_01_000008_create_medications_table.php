<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->float('dosage');
            $table->string('frequency');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('reminder_enabled');
            $table->text('notes')->nullable();
            $table->boolean('active');
            $table->timestamps();

            $table->index('user_id');
            $table->index('active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};
