<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
// use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;
    public function getJWTIdentifier()
    {
        // Refresh token(1h) + 3 roles + cloud
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,  // Adds the user's role to the JWT token
        ];
    }
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'cover_photo',
        'motivational_text',
        'goal',
        'height',
        'weight',
        'preferred_workout_types',
        'experience_level',
        'personalization_updated_at',
        'disable_welcome_modal',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'preferred_workout_types' => 'array',
            'goal' => 'array',
        ];
    }
    public function refreshTokens()
    {
        return $this->hasMany(RefreshToken::class);
    }
    public function sportsEvents()
    {
        return $this->belongsToMany(SportsEvent::class, 'sports_event_user')->withTimestamps();
    }
    public function gymReviews()
    {
        return $this->hasMany(GymReview::class);
    }
    public function completedEvents()
    {
        return $this->sportsEvents()
            ->wherePivot('left_at', null)
            ->where(function ($q) {
                $q->whereNotNull('end_date')->whereDate('end_date', '<', now())
                  ->orWhere(function ($q2) {
                      $q2->whereNull('end_date')->whereDate('start_date', '<', now());
                  });
            });
    }
    
}
