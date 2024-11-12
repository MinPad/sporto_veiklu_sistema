<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\RefreshToken;
use Carbon\Carbon;

class DeleteExpiredRefreshTokens extends Command
{
    protected $signature = 'tokens:clean-expired';

    protected $description = 'Delete expired refresh tokens from the database';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $expiredTokensCount = RefreshToken::where('expires_at', '<', Carbon::now())
            ->delete();

        $this->info("$expiredTokensCount expired refresh tokens deleted.");
    }
}

