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
        Schema::create('coaches', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surname');
            $table->boolean('is_approved')->default(0); // Default value is 0 (not approved)
            $table->foreignId('gym_id')->constrained('gyms')->onDelete('cascade'); // Define gym_id foreign key
            $table->foreignId('user_id')->constrained()->after('id');
            $table->timestamps();

            $table->unique(['name', 'surname', 'gym_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coaches');
    }
};
