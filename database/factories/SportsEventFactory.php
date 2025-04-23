<?php

namespace Database\Factories;

use App\Models\SportsEvent;
use App\Models\Gym;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class SportsEventFactory extends Factory
{
    protected $model = SportsEvent::class;

    // Custom event naming options
    protected array $eventPrefixes = [
        'Intro to', 'Advanced', 'Beginner', 'Evening', 'Weekend', 'Morning', 'Ultimate', 'Intensive', 'Functional', 'Total Body'
    ];

    protected array $eventFocuses = [
        'Yoga', 'Strength Training', 'Cardio Blast', 'HIIT Challenge', 'Boxing Bootcamp',
        'Endurance Workshop', 'Core Stability', 'Pilates Flow', 'Mobility Class',
        'CrossFit Burnout', 'Power Circuit', 'Fat Burn Express', 'Conditioning Lab'
    ];

    public function definition(): array
    {
        $isFree = $this->faker->boolean(50);
        $startDate = $this->faker->dateTimeBetween('now', '+1 year');
        $endDate = $this->faker->optional()->dateTimeBetween($startDate, '+1 year');
    
        $isInGym = $this->faker->boolean(50);
        $gym = $isInGym ? Gym::inRandomOrder()->first() : null;

        $generatedName = $this->faker->randomElement($this->eventPrefixes) . ' ' .
                         $this->faker->randomElement($this->eventFocuses);
    
        return [
            'name' => $generatedName,
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
