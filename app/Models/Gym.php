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
        'image_url',
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

}