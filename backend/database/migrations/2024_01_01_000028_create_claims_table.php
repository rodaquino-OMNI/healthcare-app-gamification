<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('claims', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('plan_id')->constrained('plans')->onDelete('cascade');
            $table->string('type');
            $table->decimal('amount', 10, 2);
            $table->string('status')->default('submitted');
            $table->timestamp('submitted_at');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('processed_at');
            $table->string('procedure_code')->nullable();
            $table->string('diagnosis_code')->nullable();
            $table->date('service_date')->nullable();
            $table->string('provider_name')->nullable();
            $table->string('provider_tax_id')->nullable();
            $table->text('procedure_description')->nullable();
            $table->string('receipt_url')->nullable();
            $table->json('additional_document_urls')->nullable();
            $table->json('status_history')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('plan_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('claims');
    }
};
