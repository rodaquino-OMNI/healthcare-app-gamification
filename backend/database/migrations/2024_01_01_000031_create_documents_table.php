<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('entity_id');
            $table->string('entity_type');
            $table->string('type');
            $table->string('file_path');
            $table->timestamps();

            $table->index(['entity_id', 'entity_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
