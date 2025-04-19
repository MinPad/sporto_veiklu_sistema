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
    Schema::table('users', function (Blueprint $table) {
        $table->string('goal')->nullable()->after('motivational_text');
        $table->float('height')->nullable()->after('goal'); // in cm
        $table->float('weight')->nullable()->after('height'); // in kg
        $table->json('preferred_workout_types')->nullable()->after('weight');
        $table->string('experience_level')->nullable()->after('preferred_workout_types');
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn([
            'goal',
            'height',
            'weight',
            'preferred_workout_types',
            'experience_level',
        ]);
    });
}
};
