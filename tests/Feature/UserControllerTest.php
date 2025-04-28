<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function user_can_view_own_profile()
    {
        $user = User::factory()->create();
        $token = auth()->login($user);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->getJson('/api/user');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'email',
                'created_at',
                'avatar_url',
                'cover_photo_url',
                'motivational_text',
                'goal',
                'height',
                'weight',
                'experience_level',
                'preferred_workout_types',
                'personalization_updated_at',
                'disable_welcome_modal',
            ],
        ]);
    }
    #[Test]
    public function admin_can_view_list_of_users()
    {
        $admin = User::factory()->create([
            'role' => 'Admin',
        ]);
        User::factory()->count(5)->create();
    
        $token = auth()->login($admin);
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->getJson('/api/users');
    
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'email',
                    'created_at',
                    'avatar_url',
                    'cover_photo_url',
                    'motivational_text',
                    'goal',
                    'height',
                    'weight',
                    'experience_level',
                    'preferred_workout_types',
                    'personalization_updated_at',
                    'disable_welcome_modal',
                ]
            ]
        ]);
    }
    #[Test]
    public function user_can_view_own_profile_by_id()
    {
        $user = User::factory()->create();
        $token = auth()->login($user);
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->getJson('/api/users/' . $user->id);
    
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'email',
                'created_at',
                'avatar_url',
                'cover_photo_url',
                'motivational_text',
                'goal',
                'height',
                'weight',
                'experience_level',
                'preferred_workout_types',
                'personalization_updated_at',
                'disable_welcome_modal',
            ],
        ]);
    }
    #[Test]
    public function user_cannot_view_another_users_profile()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        $token = auth()->login($user1);
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->getJson('/api/users/' . $user2->id);
    
        $response->assertStatus(403);
    }
    #[Test]
    public function user_can_update_their_information()
    {
        $user = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
        ]);
        $token = auth()->login($user);
    
        $newData = [
            'name' => 'New Name',
            'email' => 'new@example.com',
            'password' => 'NewPassword123!',
        ];
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->patchJson('/api/users/' . $user->id, $newData);
    
        $response->assertStatus(200);
        $response->assertJsonPath('data.name', 'New Name');
        $response->assertJsonPath('data.email', 'new@example.com');
        
        $this->assertDatabaseHas('users', [
            'email' => 'new@example.com',
            'name' => 'New Name',
        ]);
    }
    #[Test]
    public function admin_can_delete_other_users()
    {
        $admin = User::factory()->create([
            'role' => 'Admin',
        ]);
    
        $user = User::factory()->create();
    
        $token = auth()->login($admin);
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->deleteJson('/api/users/' . $user->id);
    
        $response->assertStatus(204);
        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }
    #[Test]
    public function user_can_update_personalization_with_avatar()
    {
        // Arrange: create a user
        $user = User::factory()->create();
        $token = auth()->login($user);
    
        \Storage::fake('public');
    
        $avatar = \Illuminate\Http\UploadedFile::fake()->image('avatar.jpg');
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/users/' . $user->id . '/personalization', [
                             'avatar' => $avatar,
                             'motivational_text' => 'Stay strong!',
                             'goal' => ['Lose weight', 'Build muscle'],
                             'height' => 180,
                             'weight' => 75,
                             'experience_level' => 'Intermediate',
                             'preferred_workout_types' => ['Cardio', 'Strength'],
                         ]);
    
        $response->assertStatus(200);
        $response->assertJsonPath('data.motivational_text', 'Stay strong!');
        $response->assertJsonPath('data.height', 180);
        $response->assertJsonPath('data.weight', 75);
        $response->assertJsonPath('data.experience_level', 'Intermediate');
    
        \Storage::disk('public')->assertExists('avatars/' . $avatar->hashName());
    }
    #[Test]
    public function user_can_update_settings()
    {
        $user = User::factory()->create([
            'disable_welcome_modal' => false,
        ]);
        $token = auth()->login($user);
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->patchJson('/api/user/settings', [
                             'disable_welcome_modal' => true,
                         ]);
    
        $response->assertStatus(200);
        $response->assertJsonPath('data.disable_welcome_modal', true);
    
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'disable_welcome_modal' => true,
        ]);
    }
    
    
}
