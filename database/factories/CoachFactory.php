<?php

namespace Database\Factories;

use App\Models\Coach;
use App\Models\Gym;
use Illuminate\Database\Eloquent\Factories\Factory;

class CoachFactory extends Factory
{
    protected $model = Coach::class;

    public function definition()
    {
        return [
            'name' => $this->faker->firstName,
            'surname' => $this->faker->lastName,
            'is_approved' => true,
            'gym_id' => Gym::factory(),
        ];
    }
}
