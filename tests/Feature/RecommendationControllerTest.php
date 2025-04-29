<?php

namespace Tests\Feature;

use App\Models\SportsEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class RecommendationControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_returns_recommended_events_for_authenticated_user()
    {
        $user = User::factory()->create([
            'goal' => ['Weight loss'],
            'preferred_workout_types' => ['Cardio'],
            'experience_level' => 'Beginner',
        ]);
        $token = auth()->login($user);

        $event = SportsEvent::factory()->create([
            'goal_tags' => ['Weight loss'],
            'activity_type' => 'Cardio',
            'difficulty_level' => 'Beginner',
            'start_date' => now()->addDays(3),
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->getJson('/api/recommendations');

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'id' => $event->id,
        ]);
    }

    #[Test]
    public function it_requires_authentication()
    {
        $response = $this->getJson('/api/recommendations');

        $response->assertStatus(401); 
    }

    #[Test]
    public function it_filters_out_low_score_events()
    {
        $user = User::factory()->create([
            'goal' => ['Weight loss'],
            'preferred_workout_types' => ['Cardio'],
            'experience_level' => 'Beginner',
        ]);
        $token = auth()->login($user);

        $event = SportsEvent::factory()->create([
            'goal_tags' => ['Muscle gain'],
            'activity_type' => 'Weightlifting',
            'difficulty_level' => 'Advanced',
            'start_date' => now()->addDays(3),
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->getJson('/api/recommendations');

        $response->assertStatus(200);
        $response->assertJsonMissing([
            'id' => $event->id,
        ]);
    }

    #[Test]
    public function it_filters_out_joined_events()
    {
        $user = User::factory()->create();
        $token = auth()->login($user);

        $event = SportsEvent::factory()->create([
            'goal_tags' => ['Weight loss'],
            'activity_type' => 'Cardio',
            'difficulty_level' => 'Beginner',
            'start_date' => now()->addDays(3),
        ]);

        DB::table('sports_event_user')->insert([
            'user_id' => $user->id,
            'sports_event_id' => $event->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->getJson('/api/recommendations');

        $response->assertStatus(200);
        $response->assertJsonMissing([
            'id' => $event->id,
        ]);
    }
}
