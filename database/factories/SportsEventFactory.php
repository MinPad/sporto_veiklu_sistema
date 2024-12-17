<?php

namespace Database\Factories;

use App\Models\SportsEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

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
        $isFree = $this->faker->boolean(40); // 70% chance the event is free

        return [
            'name' => $this->faker->word, // Random event name
            'description' => $this->faker->sentence, // Random description
            'location' => $this->faker->city, // Random city for location
            'entry_fee' => $isFree ? null : $this->faker->randomFloat(2, 0, 100), // Only generate fee if not free
            'is_free' => $isFree,
            'start_date' => $this->faker->date, // Random start date
            'end_date' => $this->faker->optional()->date, // Optional end date
            'max_participants' => $this->faker->numberBetween(1, 500), // Random max participants
            'current_participants' => $this->faker->numberBetween(0, 100), // Random current participants
        ];
    }
}
