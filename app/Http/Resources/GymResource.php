<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GymResource extends JsonResource
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
            'cityId' => $this->city_id,
            'cityName' => $this->city->name,
            'address' => $this->address,
            'description' => $this->description,
            'openingHours' => $this->opening_hours,
            'image_url' => $this->image_url, // New line for the image URL
        ];
    }
}