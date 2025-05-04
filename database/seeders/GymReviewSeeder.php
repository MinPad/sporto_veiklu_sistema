<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GymReview;
use App\Models\User;
use App\Models\Gym;
use Illuminate\Support\Facades\DB;

class GymReviewSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $gyms = Gym::all();

        $maxReviews = 10;
        $createdPairs = [];

        for ($i = 0; $i < $maxReviews; $i++) {
            $user = $users->random();
            $gym = $gyms->random();

            $pairKey = $user->id . '-' . $gym->id;

            if (isset($createdPairs[$pairKey])) {
                continue;
            }

            GymReview::create([
                'user_id' => $user->id,
                'gym_id' => $gym->id,
                'rating' => rand(1, 5),
                'comment' => fake()->sentence(),
            ]);

            $createdPairs[$pairKey] = true;
        }
    }
}
