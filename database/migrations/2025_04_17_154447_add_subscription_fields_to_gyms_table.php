<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('gyms', function (Blueprint $table) {
            $table->boolean('is_free')->default(false)->after('longitude');
            $table->decimal('monthly_fee', 8, 2)->nullable()->after('is_free');
        });
    }

    public function down()
    {
        Schema::table('gyms', function (Blueprint $table) {
            $table->dropColumn(['is_free', 'monthly_fee']);
        });
    }
};
