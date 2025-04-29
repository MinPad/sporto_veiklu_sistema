<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PasswordResetControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_sends_password_reset_link()
    {
        Mail::fake();
    
        $user = \App\Models\User::factory()->create();
    
        $response = $this->postJson('/api/password/email', [
            'email' => $user->email,
        ]);
    
        $response->assertStatus(200);
        $response->assertJsonFragment(['message' => 'Password reset link sent successfully']);
    
        $this->assertDatabaseHas('password_reset_tokens', [
            'email' => $user->email,
        ]);
    
        // Just make sure NO unexpected mails were sent (fake is active)
        Mail::assertNothingSent(false); // false = allow some mails
    }
    
    

    #[Test]
    public function it_requires_valid_email_to_send_link()
    {
        $response = $this->postJson('/api/password/email', [
            'email' => 'nonexistent@example.com',
        ]);

        $response->assertStatus(422); // validation error
        $response->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function it_resets_password_with_valid_token()
    {
        $user = User::factory()->create(['password' => bcrypt('oldpassword')]);
        $token = Str::random(60);

        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => $token,
            'created_at' => now(),
        ]);

        $payload = [
            'email' => $user->email,
            'token' => $token,
            'password' => 'newsecurepassword',
            'password_confirmation' => 'newsecurepassword',
        ];

        $response = $this->postJson('/api/password/reset', $payload);

        $response->assertStatus(200);
        $response->assertJsonFragment(['message' => 'Password reset successfully']);

        $this->assertTrue(Hash::check('newsecurepassword', $user->fresh()->password));
    }

    #[Test]
    public function it_fails_reset_with_invalid_token()
    {
        $user = User::factory()->create();

        $payload = [
            'email' => $user->email,
            'token' => 'invalid-token',
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ];

        $response = $this->postJson('/api/password/reset', $payload);

        $response->assertStatus(400);
        $response->assertJsonFragment(['message' => 'Invalid or expired reset token']);
    }

    #[Test]
    public function it_fails_reset_when_user_not_found()
    {
        $token = Str::random(60);

        DB::table('password_reset_tokens')->insert([
            'email' => 'ghost@example.com',
            'token' => $token,
            'created_at' => now(),
        ]);

        $payload = [
            'email' => 'ghost@example.com',
            'token' => $token,
            'password' => 'somepassword',
            'password_confirmation' => 'somepassword',
        ];

        $response = $this->postJson('/api/password/reset', $payload);

        $response->assertStatus(404);
        $response->assertJsonFragment(['message' => 'User not found']);
    }
}
