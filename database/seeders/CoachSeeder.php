<?php

namespace Database\Seeders;

use App\Models\Coach;
use App\Models\Gym;
use App\Models\Specialty;
use Illuminate\Database\Seeder;

class CoachSeeder extends Seeder
{
    public function run(): void
    {
        $gyms = Gym::all();
        $specialtyIds = Specialty::pluck('id')->all();

        $coaches = Coach::factory()
            ->count(30)
            ->state(new \Illuminate\Database\Eloquent\Factories\Sequence(
                fn () => [
                    'gym_id' => fake()->boolean(80) 
                        ? $gyms->random()?->id 
                        : null,
                ]
            ))
            ->create();

        foreach ($coaches as $coach) {
            $coach->specialties()->sync(
                fake()->randomElements($specialtyIds, rand(1, 3))
            );
        }
    }
}
