<?php

namespace Tests\Feature;

use App\Models\Gym;
use App\Models\GymReview;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class GymReviewControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_lists_reviews_for_gym()
    {
        $gym = Gym::factory()->create();
        $review = GymReview::factory()->create(['gym_id' => $gym->id]);

        $response = $this->getJson("/api/gyms/{$gym->id}/reviews");

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'id' => $review->id,
            'rating' => $review->rating,
        ]);
    }

    #[Test]
    public function user_can_create_review_for_gym()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);

        $gym = Gym::factory()->create();

        $payload = [
            'rating' => 4,
            'comment' => 'Solid gym.',
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson("/api/gyms/{$gym->id}/reviews", $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('gym_reviews', [
            'user_id' => $user->id,
            'gym_id' => $gym->id,
            'rating' => 4,
            'comment' => 'Solid gym.',
        ]);
    }

    #[Test]
    public function user_cannot_review_same_gym_twice()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);
        $gym = Gym::factory()->create();

        GymReview::factory()->create([
            'user_id' => $user->id,
            'gym_id' => $gym->id,
        ]);

        $payload = ['rating' => 3];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson("/api/gyms/{$gym->id}/reviews", $payload);

        $response->assertStatus(409);
        $response->assertJsonFragment(['message' => 'You have already reviewed this gym.']);
    }

    #[Test]
    public function user_can_update_own_review()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);

        $review = GymReview::factory()->create([
            'user_id' => $user->id,
            'rating' => 2,
        ]);

        $payload = ['rating' => 5, 'comment' => 'Updated.'];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->putJson("/api/reviews/{$review->id}", $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('gym_reviews', [
            'id' => $review->id,
            'rating' => 5,
            'comment' => 'Updated.',
        ]);
    }

    #[Test]
    public function admin_can_update_any_review()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($admin);

        $review = GymReview::factory()->create();

        $payload = ['rating' => 1];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->putJson("/api/reviews/{$review->id}", $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('gym_reviews', [
            'id' => $review->id,
            'rating' => 1,
        ]);
    }

    #[Test]
    public function user_cannot_update_others_review()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);

        $review = GymReview::factory()->create();

        $payload = ['rating' => 1];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->putJson("/api/reviews/{$review->id}", $payload);

        $response->assertStatus(403);
    }

    #[Test]
    public function user_can_delete_own_review()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);

        $review = GymReview::factory()->create(['user_id' => $user->id]);

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/reviews/{$review->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('gym_reviews', ['id' => $review->id]);
    }

    #[Test]
    public function admin_can_delete_any_review()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($admin);

        $review = GymReview::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/reviews/{$review->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('gym_reviews', ['id' => $review->id]);
    }

    #[Test]
    public function user_cannot_delete_others_review()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);

        $review = GymReview::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/reviews/{$review->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('gym_reviews', ['id' => $review->id]);
    }
}