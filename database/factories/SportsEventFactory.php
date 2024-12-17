<?php

namespace Database\Factories;

use App\Models\SportsEvent;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class SportsEventFactory extends Factory
{
    /**
     * The name of the corresponding model.
     *
     * @var string
     */
    protected $model = SportsEvent::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Randomly determine if the event is free or paid
        $isFree = $this->faker->boolean(50); // 70% chance the event is free

        $startDate = $this->faker->dateTimeBetween('now', '+1 year');

        // Generate end date, must be after start date, and optional
        $endDate = $this->faker->optional()->dateTimeBetween($startDate, '+1 year');

        return [
            'name' => $this->faker->word, // Random event name
            'description' => $this->faker->sentence, // Random description
            'location' => $this->faker->city, // Random city for location
            'entry_fee' => $isFree ? null : $this->faker->randomFloat(2, 0, 100), // Only generate fee if not free
            'is_free' => $isFree,
            'start_date' => $startDate->format('Y-m-d'), // Format start date as Y-m-d
            'end_date' => $endDate ? $endDate->format('Y-m-d') : null, // Format end date as Y-m-d or null
            'max_participants' => $this->faker->numberBetween(1, 500), // Random max participants
            'current_participants' => $this->faker->numberBetween(0, 100), // Random current participants
        ];
    }
}
