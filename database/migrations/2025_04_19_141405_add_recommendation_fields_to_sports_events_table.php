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
    Schema::table('sports_events', function (Blueprint $table) {
        $table->foreignId('gym_id')->nullable()->constrained()->onDelete('set null');
        $table->string('activity_type')->nullable();
        $table->string('difficulty_level')->nullable();
        $table->json('goal_tags')->nullable();
    });
}

public function down(): void
{
    Schema::table('sports_events', function (Blueprint $table) {
        $table->dropForeign(['gym_id']);
        $table->dropColumn([
            'gym_id',
            'activity_type',
            'difficulty_level',
            'goal_tags',
        ]);
    });
}

};
