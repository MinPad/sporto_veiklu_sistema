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
        'image_url' => $this->image_url,
        'latitude' => $this->latitude,
        'longitude' => $this->longitude,  
        'isFree' => $this->is_free,
        'monthlyFee' => $this->monthly_fee,
        'reviews_avg_rating' => $this->reviews_avg_rating,
        'specialties' => $this->specialties->map(function ($spec) {
            return [
                'id' => $spec->id,
                'name' => $spec->name,
            ];
        }),
        ];
    }
}