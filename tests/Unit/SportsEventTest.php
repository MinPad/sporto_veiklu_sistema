<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\SportsEvent;
use PHPUnit\Framework\Attributes\Test;

class SportsEventTest extends TestCase
{
    #[Test]
    public function it_recognizes_full_event()
    {
        $event = new SportsEvent([
            'max_participants' => 10,
            'current_participants' => 10,
        ]);

        $this->assertTrue($event->isFull());
    }

    #[Test]
    public function it_recognizes_not_full_event()
    {
        $event = new SportsEvent([
            'max_participants' => 20,
            'current_participants' => 5,
        ]);

        $this->assertFalse($event->isFull());
    }

    #[Test]
    public function it_handles_null_max_participants_as_not_full()
    {
        $event = new SportsEvent([
            'max_participants' => null,
            'current_participants' => 999,
        ]);

        $this->assertFalse($event->isFull());
    }
}