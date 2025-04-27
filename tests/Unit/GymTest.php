<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Gym;
use PHPUnit\Framework\Attributes\Test;

class GymTest extends TestCase
{
    #[Test]
    public function it_returns_default_image_url_when_no_image_path()
    {
        $gym = new Gym([
            'image_path' => null,
        ]);

        $this->assertStringContainsString('default-gym.png', $gym->image_url);
    }

    #[Test]
    public function it_returns_full_url_if_image_path_is_url()
    {
        $url = 'https://example.com/gym.jpg';

        $gym = new Gym([
            'image_path' => $url,
        ]);

        $this->assertEquals($url, $gym->image_url);
    }

    #[Test]
    public function it_returns_storage_asset_path_when_image_path_is_local()
    {
        $path = 'gym-images/test-image.jpg';

        $gym = new Gym([
            'image_path' => $path,
        ]);

        $this->assertStringContainsString('storage/gym-images/test-image.jpg', $gym->image_url);
    }
}
