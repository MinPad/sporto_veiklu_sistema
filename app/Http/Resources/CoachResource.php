<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CoachResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'surname' => $this->surname,
            'specialty' => $this->specialty,
            'isApproved' => $this->is_approved,
            'gymId' => $this->gym_id,
    
            'sportsEvents' => $this->sportsEvents->map(function ($event) {
                return [
                    'id' => $event->id,
                    'name' => $event->name,
                    'startDate' => $event->start_date,
                    'endDate' => $event->end_date,
                    'location' => $event->location,
                    'isFree' => $event->is_free,
                ];
            }),
        ];
    }
}