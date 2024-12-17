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
        Schema::create('sports_events', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('name'); // Name of the event
            $table->text('description')->nullable(); // Description (optional)
            $table->string('location'); // Event location
            $table->decimal('entry_fee', 8, 2)->nullable(); // Entry fee (null if free)
            $table->boolean('is_free')->default(false); // Indicates if the event is free
            $table->date('start_date'); // Start date of the event
            $table->date('end_date')->nullable(); // End date (nullable for one-day events)
            $table->timestamps(); // Created at and Updated at timestamps
            $table->unsignedInteger('max_participants')->nullable(); // Maximum number of participants (null = unlimited)
            $table->unsignedInteger('current_participants')->default(0); // Current number of participants
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sports_events');
    }
};
