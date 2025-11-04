<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\UserController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Users
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/search', [UserController::class, 'search']);

    // Groups
    Route::apiResource('groups', GroupController::class);
    Route::post('groups/{id}/users', [GroupController::class, 'addUser']);
    Route::delete('groups/{id}/users', [GroupController::class, 'removeUser']);
    Route::post('groups/{id}/status', [GroupController::class, 'updateStatus']);

    // Messages
    Route::apiResource('messages', MessageController::class);
});
