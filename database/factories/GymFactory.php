<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\City;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Gym>
 */
class GymFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'address' => fake()->streetAddress(),
            'description' => fake()->paragraph(),
            'opening_hours' => 'Mon-Fri 08:00-20:00',
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'is_free' => fake()->boolean(),
            'monthly_fee' => fake()->randomFloat(2, 10, 100),
            'image_path' => 'gym-images/placeholder-gym-image.jpg',
            'city_id' => City::factory(),
        ];
    }
}
