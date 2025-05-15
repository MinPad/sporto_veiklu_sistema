<?php

namespace Database\Factories;

use App\Models\GymReview;
use App\Models\User;
use App\Models\Gym;
use Illuminate\Database\Eloquent\Factories\Factory;

class GymReviewFactory extends Factory
{
    protected $model = GymReview::class;

    public function definition()
    {
        return [
            // 'user_id' => User::inRandomOrder()->first()->id,
            // 'gym_id' => Gym::inRandomOrder()->first()->id,
            'user_id' => User::factory(),
            'gym_id' => Gym::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->sentence(),
        ];
    }
}
