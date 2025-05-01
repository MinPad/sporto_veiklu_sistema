<?php

namespace Tests\Unit;

use App\Models\GymReview;
use App\Models\User;
use App\Policies\GymReviewPolicy;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class GymReviewPolicyTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function admin_can_update_and_delete_any_review()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $review = GymReview::factory()->create();

        $policy = new GymReviewPolicy();

        $this->assertTrue($policy->update($admin, $review));
        $this->assertTrue($policy->delete($admin, $review));
    }

    #[Test]
    public function user_can_update_and_delete_own_review()
    {
        $user = User::factory()->create(['role' => 'User']);
        $review = GymReview::factory()->create(['user_id' => $user->id]);

        $policy = new GymReviewPolicy();

        $this->assertTrue($policy->update($user, $review));
        $this->assertTrue($policy->delete($user, $review));
    }

    #[Test]
    public function user_cannot_update_or_delete_others_review()
    {
        $user = User::factory()->create(['role' => 'User']);
        $review = GymReview::factory()->create();

        $policy = new GymReviewPolicy();

        $this->assertFalse($policy->update($user, $review));
        $this->assertFalse($policy->delete($user, $review));
    }
}
