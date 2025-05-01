<?php

namespace Tests\Unit;

use App\Models\Gym;
use App\Models\GymReview;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class GymReviewTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_belongs_to_a_user()
    {
        $review = GymReview::factory()->create();
        $this->assertInstanceOf(User::class, $review->user);
    }

    #[Test]
    public function it_belongs_to_a_gym()
    {
        $review = GymReview::factory()->create();
        $this->assertInstanceOf(Gym::class, $review->gym);
    }
}
