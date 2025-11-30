<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Routing\Router;
use App\Http\Controllers\API\LocationsController;
use Illuminate\Support\Facades\Auth;

Route::get('/login', [AuthController::class, 'login'])->name('login');


Route::prefix('api/locations')->middleware('verify.shopify')->group(function () {
    Route::get('/', [LocationsController::class, 'index']);
});

// Please keep this route snippet last
Route::controller(AuthController::class)->group(function (Router $router) {
    $router->get('/', 'index')->middleware('verify.shopify')->name('home');
    $router->get('/{any}', 'index')->middleware('verify.shopify')->where('any', '(.+)?');
});