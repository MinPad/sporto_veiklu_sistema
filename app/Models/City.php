<?php

namespace App\Models;

use App\Models\Gym;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'latitude',
        'longitude',
    ];
    

    public $timestamps = false;

    public function gyms()
    {
        return $this->hasMany(Gym::class, 'city_id');
    }
}