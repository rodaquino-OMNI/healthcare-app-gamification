<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('template_id');
            $table->string('language')->default('pt-BR');
            $table->string('title');
            $table->text('body');
            $table->string('channels');
            $table->string('journey')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('template_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_templates');
    }
};
