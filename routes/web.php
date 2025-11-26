<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Routing\Router;

Route::get('/login', [AuthController::class, 'login'])->name('login');

// Please keep this route snippet last
Route::controller(AuthController::class)->group(function (Router $router) {
    $router->get('/', 'index')->middleware('verify.shopify')->name('home');
    $router->get('/{any}', 'index')->middleware('verify.shopify')->where('any', '(.+)?');
});