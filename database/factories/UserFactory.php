<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        $firstNames = ['Jonas', 'Agnė', 'Tomas', 'Rūta', 'Lukas', 'Eglė', 'Paulius', 'Monika', 'Mantas', 'Gabija', 'Justinas', 'Karolina', 'Dovydas', 'Simona', 'Arnas', 'Viktorija', 'Edvinas', 'Ieva', 'Nerijus', 'Laura'];
        $lastNames = ['Kazlauskas', 'Petrauskienė', 'Jankauskas', 'Vaitkutė', 'Zabiela', 'Mockienė', 'Stankevičius', 'Bieliauskaitė', 'Sakalauskas', 'Žukauskaitė', 'Petraitis', 'Urbonavičiūtė', 'Sabaliauskas', 'Kavaliauskienė', 'Vasiliauskas', 'Morkūnaitė', 'Žilinskas', 'Balčiūnaitė', 'Milasius', 'Jurgaitė'];

        $firstName = $this->faker->randomElement($firstNames);
        $lastName = $this->faker->randomElement($lastNames);
        $fullName = "$firstName $lastName";

        // Make email parts ASCII-safe and lowercase
        $asciiFirst = Str::ascii(strtolower($firstName));
        $asciiLast = Str::ascii(strtolower($lastName));

        // Random realistic domains
        $domains = ['gmail.com', 'yahoo.com', 'outlook.com'];
        $domain = $this->faker->randomElement($domains);

        $email = "{$asciiFirst}.{$asciiLast}" . rand(1, 999) . "@{$domain}";

        $workoutOptions = [
            'Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'Cardio Health', 'Stress Relief', 'Rehabilitation'
        ];

        $experienceOptions = ['Beginner', 'Intermediate', 'Advanced', null];

        return [
            'name' => $fullName,
            'email' => $email,
            'password' => Hash::make('Test123!'),
            'role' => 'User',
            'height' => $this->faker->numberBetween(150, 200),
            'weight' => $this->faker->numberBetween(50, 120),
            'preferred_workout_types' => $this->faker->randomElement([[], $this->faker->randomElements($workoutOptions, rand(1, 3))]),
            'goal' => $this->faker->randomElement([[], ['Get fit', 'Build muscle', 'Lose weight']]),
            'experience_level' => $this->faker->randomElement($experienceOptions),
        ];
    }
}