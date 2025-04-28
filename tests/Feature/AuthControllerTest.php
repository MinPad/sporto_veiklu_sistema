<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\Attributes\Test;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function user_can_signup_successfully()
    {
        $response = $this->postJson('/api/signup', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'user' => [
                'id',
                'name',
                'email',
                'created_at',
                'updated_at',
            ],
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);
    }
    #[Test]
    public function user_can_login_successfully()
    {
        $user = \App\Models\User::factory()->create([
            'password' => bcrypt('Password123!'),
        ]);
    
        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'Password123!',
        ]);
    
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'message',
            'accessToken',
            'refreshToken',
            'tokenType',
            'accessExpiresIn',
            'refreshExpiresIn',
        ]);
    }
    #[Test]
    public function user_cannot_login_with_wrong_credentials()
    {
        $user = \App\Models\User::factory()->create([
            'password' => bcrypt('Password123!'),
        ]);
    
        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'WrongPassword!',
        ]);
    
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('login');
    }
    #[Test]
    public function user_can_logout_successfully()
    {
        $user = \App\Models\User::factory()->create();
        $token = auth()->login($user);
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/logout');
    
        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Successfully logged out',
        ]);
    }
    #[Test]
    public function user_can_refresh_token_successfully()
    {
        $user = \App\Models\User::factory()->create();
        $oldAccessToken = auth()->login($user);
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $oldAccessToken)
                         ->postJson('/api/refresh-token');
    
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'accessToken',
            'tokenType',
            'expiresIn',
        ]);
    }
    
    
    
    
}