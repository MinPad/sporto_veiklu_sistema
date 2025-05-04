<?php

namespace Database\Factories;

use App\Models\SportsEvent;
use App\Models\Gym;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class SportsEventFactory extends Factory
{
    protected $model = SportsEvent::class;

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
        $startDate = $this->faker->dateTimeBetween(now(), now()->addYear());
        $endDate = $this->faker->optional()->dateTimeBetween($startDate, (clone $startDate)->modify('+7 days'));

        $isInGym = $this->faker->boolean(50);
        $gym = $isInGym && Gym::count() > 0 ? Gym::inRandomOrder()->first() : null;

        $max = $this->faker->numberBetween(10, 100);

        $current = $this->faker->boolean(20)
            ? $max
            : $this->faker->numberBetween(0, $max - 1);

        $generatedName = $this->faker->randomElement($this->eventPrefixes) . ' ' .
                         $this->faker->randomElement($this->eventFocuses);

        return [
            'name' => $generatedName,
            'description' => $this->faker->sentence,
            'location' => $gym ? $gym->address : $this->faker->city,
            'entry_fee' => $this->faker->boolean(50) ? null : $this->faker->randomFloat(2, 5, 50),
            'is_free' => $this->faker->boolean(50),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate ? $endDate->format('Y-m-d') : null,
            'max_participants' => $max,
            'current_participants' => $current,
            'gym_id' => $gym?->id,
            'difficulty_level' => $this->faker->randomElement(['Beginner', 'Intermediate', 'Advanced']),
        ];
    }
}
