<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\SportsEvent;
use App\Services\RecommendationService;
use App\Services\UserEventHistoryService;
use Illuminate\Support\Collection;
use PHPUnit\Framework\Attributes\Test;
use Mockery;

class RecommendationServiceTest extends TestCase
{
    #[Test]
    public function score_events_for_user_adds_recommendation_scores()
    {
        
        $user = new User([
            'goal' => ['Lose Weight'],
            'preferred_workout_types' => ['Cardio'],
            'experience_level' => 'Beginner'
        ]);

        $events = collect([
            (object)[
                'id' => 1,
                'goal_tags' => ['Lose Weight'],
                'activity_type' => 'Cardio',
                'difficulty_level' => 'Beginner',
                'gym_id' => 5,
                'users' => collect([])
            ],
            (object)[
                'id' => 2,
                'goal_tags' => ['Gain Muscle'],
                'activity_type' => 'Strength',
                'difficulty_level' => 'Advanced',
                'gym_id' => 7,
                'users' => collect([])
            ],
        ]);

        // Mock
        $historyMock = Mockery::mock(UserEventHistoryService::class);
        $historyMock->shouldReceive('getRecentParticipationInsights')->once()->andReturn([
            'gym_frequency' => collect([5 => 2]),
            'activity_types' => collect(['Cardio' => 1]),
            'goal_tags' => collect(['Lose Weight' => 1]),
        ]);

        $service = new RecommendationService($historyMock);

        $scoredEvents = $service->scoreEventsForUser($events, $user);

        $this->assertNotNull($scoredEvents[0]->recommendation_score);
        $this->assertGreaterThan($scoredEvents[1]->recommendation_score, $scoredEvents[0]->recommendation_score);
    }

    #[Test]
    public function get_recommendations_query_for_user_returns_correct_query()
    {
        $user = new User(['id' => 1]);
    
        $historyMock = \Mockery::mock(\App\Services\UserEventHistoryService::class);
        $service = new \App\Services\RecommendationService($historyMock);
    
        $query = $service->getRecommendationsQueryForUser($user);
    
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Builder::class, $query);
        $this->assertEquals('sports_events', $query->getModel()->getTable());
    }
}