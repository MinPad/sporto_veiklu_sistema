<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;

class UserTest extends TestCase
{
    #[Test]
    public function it_returns_correct_jwt_identifier()
    {
        $user = new User();
        $user->forceFill(['id' => 123]);

        $this->assertEquals(123, $user->getJWTIdentifier());
    }

    #[Test]
    public function it_returns_correct_jwt_custom_claims()
    {
        $user = new User();
        $user->forceFill(['role' => 'admin']);

        $claims = $user->getJWTCustomClaims();

        $this->assertArrayHasKey('role', $claims);
        $this->assertEquals('admin', $claims['role']);
    }
}
