<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Services\UserEventHistoryService;
use Illuminate\Support\Collection;
use Mockery;
use PHPUnit\Framework\Attributes\Test;

class UserEventHistoryServiceTest extends TestCase
{
    #[Test]
    public function get_recent_participation_insights_returns_correct_structure()
    {
        $user = Mockery::mock(User::class);

        $fakeEvents = collect([
            (object)[
                'gym_id' => 1,
                'activity_type' => 'Cardio',
                'goal_tags' => ['Lose Weight']
            ],
            (object)[
                'gym_id' => 1,
                'activity_type' => 'Strength',
                'goal_tags' => ['Gain Muscle']
            ],
            (object)[
                'gym_id' => 2,
                'activity_type' => 'Cardio',
                'goal_tags' => ['Lose Weight']
            ],
        ]);

        $sportsEventsRelation = Mockery::mock();
        $sportsEventsRelation->shouldReceive('wherePivot')->andReturnSelf();
        $sportsEventsRelation->shouldReceive('where')->andReturnSelf();
        $sportsEventsRelation->shouldReceive('orWhere')->andReturnSelf();
        $sportsEventsRelation->shouldReceive('orderByDesc')->andReturnSelf();
        $sportsEventsRelation->shouldReceive('limit')->andReturnSelf();
        $sportsEventsRelation->shouldReceive('get')->andReturn($fakeEvents);

        $user->shouldReceive('sportsEvents')->andReturn($sportsEventsRelation);

        $service = new UserEventHistoryService();

        $insights = $service->getRecentParticipationInsights($user);

        $this->assertArrayHasKey('gym_frequency', $insights);
        $this->assertArrayHasKey('activity_types', $insights);
        $this->assertArrayHasKey('goal_tags', $insights);

        $this->assertEquals(2, $insights['gym_frequency']->count());
        $this->assertEquals(2, $insights['activity_types']->count());
        $this->assertEquals(2, $insights['goal_tags']->count());
    }
}