<?php

namespace App\Models;

use App\Models\City;
use App\Models\User;
use App\Models\Coach;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Gym extends Model
{
    use HasFactory;

    protected $table = 'gyms';

    protected $fillable = [
        'name',
        'address',
        'description',
        'opening_hours',
        'city_id',
        'image_path',
        'latitude',
        'longitude',   
        'is_free',
        'monthly_fee',
    ];

    public function coaches()
    {
        return $this->hasMany(Coach::class, 'gym_id');
    }

    public function approved_coaches()
    {
        return $this->hasMany(Coach::class, 'gym_id')->where('is_approved', 1);
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }
    public function getImageUrlAttribute()
    {
    if (!$this->image_path) {
        return asset('images/default-gym.png'); 
    }

    if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
        return $this->image_path; 
    }

    return asset('storage/' . $this->image_path);
    }
    public function specialties()
    {
        return $this->belongsToMany(Specialty::class, 'gym_specialty')->withTimestamps();
    }
    public function reviews()
    {
        return $this->hasMany(GymReview::class);
    }
    public function averageRating()
    {
        return $this->reviews()->avg('rating');
    }

}