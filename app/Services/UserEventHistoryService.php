<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Collection;

class UserEventHistoryService
{
    /**
     * Get recent event history for a user.
     * Returns a collection of relevant participation data for recommendation use.
     */
    public function getRecentParticipationInsights(User $user, int $limit = 15): array
    {
        $history = $user->sportsEvents()
            ->wherePivot('left_at', null)
            ->where(function ($q) {
                $q->whereNotNull('end_date')->whereDate('end_date', '<', now())
                  ->orWhere(function ($q2) {
                      $q2->whereNull('end_date')->whereDate('start_date', '<', now());
                  });
            })
            ->orderByDesc('start_date')
            ->limit($limit)
            ->get();

        $gymFrequency = $history->groupBy('gym_id')->map->count()->sortDesc();
        $activityTypes = $history->groupBy('activity_type')->map->count()->sortDesc();
        $goalTags = $history->pluck('goal_tags')->flatten()->countBy()->sortDesc();

        return [
            'gym_frequency' => $gymFrequency,       
            'activity_types' => $activityTypes,      
            'goal_tags' => $goalTags,                
        ];
    }
}
