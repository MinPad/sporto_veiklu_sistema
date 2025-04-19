<?php

namespace Database\Factories;

use App\Models\SportsEvent;
use App\Models\Gym;
use App\Models\Specialty;
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
        $isFree = $this->faker->boolean(50);
        $startDate = $this->faker->dateTimeBetween('now', '+1 year');
        $endDate = $this->faker->optional()->dateTimeBetween($startDate, '+1 year');
    
        $isInGym = $this->faker->boolean(60);
        $gym = $isInGym ? Gym::inRandomOrder()->first() : null;
    
        return [
            'name' => $this->faker->words(2, true),
            'description' => $this->faker->sentence,
            'location' => $gym ? $gym->address : $this->faker->city,
            'entry_fee' => $isFree ? null : $this->faker->randomFloat(2, 5, 50),
            'is_free' => $isFree,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate ? $endDate->format('Y-m-d') : null,
            'max_participants' => $this->faker->numberBetween(10, 100),
            'current_participants' => $this->faker->numberBetween(0, 30),
    
            'gym_id' => $gym?->id,
            'difficulty_level' => $this->faker->randomElement(['Beginner', 'Intermediate', 'Advanced']),
            'goal_tags' => $this->faker->randomElements(
                ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'Cardio Health'],
                rand(1, 3)
            ),
        ];
    }
    
}