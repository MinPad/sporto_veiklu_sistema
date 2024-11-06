<?php


use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/signup', [AuthController::class, 'signup']);

Route::get('/', function () {
    return view('welcome');
});
