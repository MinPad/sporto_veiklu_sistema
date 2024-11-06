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
            // 'id' => $this->id,
            'id' => $this->id,
            // 'name' => $this->user ? $this->user->name : null, // Safely access user name
            // 'surname' => $this->user ? $this->user->surname : null, // Safely access user surname
            'name' => $this->name,  // Potentially null
            'surname' => $this->surname,  // Potentially null
            'specialty' => $this->specialty,
            // 'email' => $this->user->email,
            'isApproved' => $this->is_approved,
            'gymId' => $this->gym_id
        ];
    }
}