<?php

namespace Database\Seeders;

use App\Models\SportsEvent;
use Illuminate\Database\Seeder;

class SportsEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create 10 fake events
        SportsEvent::factory()->count(5)->create();
    }
}
