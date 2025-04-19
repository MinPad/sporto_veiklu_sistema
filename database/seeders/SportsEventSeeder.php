<?php

namespace Database\Seeders;

use App\Models\SportsEvent;
use Illuminate\Database\Seeder;
use App\Models\Specialty;

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
        });
    }
}
