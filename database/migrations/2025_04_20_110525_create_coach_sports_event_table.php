<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('coach_sports_event', function (Blueprint $table) {
            $table->foreignId('coach_id')->constrained()->onDelete('cascade');
            $table->foreignId('sports_event_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->primary(['coach_id', 'sports_event_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coach_sports_event');
    }
};
