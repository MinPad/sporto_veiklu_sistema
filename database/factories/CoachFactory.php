<?php

namespace Database\Factories;

use App\Models\Coach;
use App\Models\Gym;
use Illuminate\Database\Eloquent\Factories\Factory;

class CoachFactory extends Factory
{
    protected $model = Coach::class;

    public function definition()
    {
        $firstNames = ['Jonas', 'Agnė', 'Tomas', 'Rūta', 'Lukas', 'Eglė', 'Paulius', 'Monika', 'Mantas', 'Gabija', 'Justinas', 'Karolina', 'Dovydas', 'Simona', 'Arnas', 'Viktorija', 'Edvinas', 'Ieva', 'Nerijus', 'Laura'];
        $lastNames = ['Kazlauskas', 'Petrauskienė', 'Jankauskas', 'Vaitkutė', 'Zabiela', 'Mockienė', 'Stankevičius', 'Bieliauskaitė', 'Sakalauskas', 'Žukauskaitė', 'Petraitis', 'Urbonavičiūtė', 'Sabaliauskas', 'Kavaliauskienė', 'Vasiliauskas', 'Morkūnaitė', 'Žilinskas', 'Balčiūnaitė', 'Milasius', 'Jurgaitė'];
    
        return [
            'name' => $this->faker->randomElement($firstNames),
            'surname' => $this->faker->randomElement($lastNames),
            'is_approved' => true,
            'gym_id' => $this->faker->boolean(80) ? Gym::inRandomOrder()->first()?->id : null,
        ];
    }
    
}
