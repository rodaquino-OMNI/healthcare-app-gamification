<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('medical_events', function (Blueprint $table) {
            $table->string('severity')->nullable()->after('description');
            $table->json('metadata')->nullable()->after('tags');
        });
    }

    public function down(): void
    {
        Schema::table('medical_events', function (Blueprint $table) {
            $table->dropColumn(['severity', 'metadata']);
        });
    }
};
