<?php

namespace Database\Seeders;

use App\Models\Specialty;
use Illuminate\Database\Seeder;

class SpecialtySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $specialties = [
            'Yoga',
            'Cardio',
            'Weightlifting',
            'CrossFit',
            'Boxing',
            'Pilates',
            'Dance',
        ];

        foreach ($specialties as $name) {
            Specialty::firstOrCreate(['name' => $name]);
        }
    }
}
