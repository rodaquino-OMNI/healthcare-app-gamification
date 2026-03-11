<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coverages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('plan_id')->constrained('plans')->onDelete('cascade');
            $table->string('type');
            $table->text('details');
            $table->text('limitations')->nullable();
            $table->decimal('co_payment', 5, 2)->default(0);
            $table->timestamps();

            $table->index('plan_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coverages');
    }
};
