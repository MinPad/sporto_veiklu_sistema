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
        SportsEvent::factory()->count(5)->create()->each(function ($event) {
            $specialties = Specialty::inRandomOrder()->take(rand(1, 2))->pluck('id');
            $event->specialties()->attach($specialties);
    
            if (rand(0, 100) < 70) { // 70%
                $coaches = Coach::inRandomOrder()->take(rand(1, 2))->pluck('id');
                $event->coaches()->attach($coaches);
            }
        });
    }
}
