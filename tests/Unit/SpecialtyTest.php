<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Specialty;
use App\Models\Gym;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SpecialtyTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function specialty_has_many_gyms()
    {
        $specialty = Specialty::factory()->create();
        $gym = Gym::factory()->create();

        $specialty->gyms()->attach($gym);

        $this->assertTrue($specialty->gyms->contains($gym));
    }
}
