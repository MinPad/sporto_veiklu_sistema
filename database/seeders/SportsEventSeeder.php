<?php

namespace Database\Seeders;

use App\Models\SportsEvent;
use Illuminate\Database\Seeder;
use App\Models\Specialty;
use App\Models\Coach;

class SportsEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $goalMap = [
            'Yoga' => ['Flexibility', 'Stress Relief'],
            'Cardio' => ['Cardio Health', 'Endurance'],
            'Weightlifting' => ['Muscle Gain', 'Strength'],
            'CrossFit' => ['Endurance', 'Muscle Gain'],
            'Boxing' => ['Weight Loss', 'Endurance'],
            'Pilates' => ['Flexibility', 'Core Strength'],
            'Dance' => ['Weight Loss', 'Cardio Health'],
            'Calisthenics' => ['Muscle Gain', 'Functional Strength'],
            'Functional Training' => ['Rehabilitation', 'Flexibility'],
            'Powerlifting' => ['Muscle Gain', 'Strength'],
            'HIIT' => ['Weight Loss', 'Cardio Health'],
            'Cycling' => ['Cardio Health', 'Endurance'],
            'Stretching / Mobility' => ['Flexibility', 'Rehabilitation'],
            'Martial Arts' => ['Endurance', 'Weight Loss', 'Discipline'],
        ];
    
        SportsEvent::factory()->count(5)->create()->each(function ($event) use ($goalMap) {
            $specialties = Specialty::inRandomOrder()->take(rand(1, 2))->get();
            $event->specialties()->attach($specialties->pluck('id'));
    
            if (rand(0, 100) < 70) {
                $coaches = Coach::inRandomOrder()->take(rand(1, 2))->pluck('id');
                $event->coaches()->attach($coaches);
            }
    
            $goals = [];
            foreach ($specialties as $specialty) {
                if (isset($goalMap[$specialty->name])) {
                    $goals = array_merge($goals, $goalMap[$specialty->name]);
                }
            }
    
            $goals = collect($goals)->unique()->shuffle()->take(rand(1, 3))->values()->all();
    
            $event->goal_tags = $goals;
            $event->save();
        });
    }
    
}
