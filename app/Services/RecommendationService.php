<?php

namespace App\Services;

use App\Models\SportsEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use App\Services\UserEventHistoryService;

class RecommendationService
{
    protected UserEventHistoryService $historyService;

    public function __construct(UserEventHistoryService $historyService)
    {
        $this->historyService = $historyService;
    }

    public function getRecommendationsQueryForUser(User $user): Builder
    {
        return SportsEvent::where('start_date', '>', now())
            ->whereDoesntHave('users', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->whereNull('sports_event_user.left_at');
            });
    }
    public function scoreEventsForUser($events, User $user)
    {
        $history = $this->historyService->getRecentParticipationInsights($user);

        return $events->map(function ($event) use ($user, $history) {
            $score = 0;

            if (!empty($event->goal_tags) && is_array($event->goal_tags)) {
                $goalMatch = array_intersect($event->goal_tags, $user->goal ?? []);
                $score += count($goalMatch) * 3;
            }
            if (in_array($event->activity_type, $user->preferred_workout_types ?? [])) {
                $score += 2;
            }

            // difficulty match
            if ($event->difficulty_level === $user->experience_level) {
                $score += 1; 
            } else {
                $score -= 2; 
            }

            // activity match
            if (isset($history['activity_types'][$event->activity_type])) {
                $score += $history['activity_types'][$event->activity_type] * 2;
            }

            // gyms match
            if (isset($history['gym_frequency'][$event->gym_id])) {
                $score += $history['gym_frequency'][$event->gym_id] * 1.5;
            }

            // goal tags match
            $historyGoals = $history['goal_tags']->keys()->all();
            $goalMatchFromHistory = array_intersect($event->goal_tags ?? [], $historyGoals);
            $score += count($goalMatchFromHistory) * 1;

            $event->recommendation_score = $score;
            // \Log::info("Event: {$event->name} | Score: {$score}", [
            //     'matched_goals' => $goalMatch,
            //     'user_goals' => $user->goal,
            //     'event_goals' => $event->goal_tags,
            //     'difficulty_match' => $event->difficulty_level === $user->experience_level,
            // ]);
            return $event;
        });
    }
}