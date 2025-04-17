<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGymReviewsTable extends Migration
{
    public function up()
    {
        Schema::create('gym_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('gym_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('rating')->unsigned()->default(0); // 0-5 stars
            $table->text('comment')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'gym_id']); // one review per user per gym
        });
    }

    public function down()
    {
        Schema::dropIfExists('gym_reviews');
    }
}

