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
        Schema::create('sports_event_user', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('sports_event_id')->constrained()->onDelete('cascade'); // Foreign key to sports_events
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key to users
            $table->timestamps(); // Created at and Updated at timestamps
            $table->unique(['sports_event_id', 'user_id']); // Ensure a user can join an event only once
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sports_event_user');
    }
};
