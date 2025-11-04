<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        // Remove automatic broadcasting registration here to customize it below
        channels: null,
        health: '/up',
    )
    // Register broadcasting routes using Sanctum tokens
    ->withBroadcasting(
        channels: __DIR__.'/../routes/channels.php',
        attributes: [
            'middleware' => ['web', 'auth:sanctum'],
        ],
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);

        // Excluir broadcasting/auth da verificação CSRF
        $middleware->validateCsrfTokens(except: [
            'broadcasting/auth',
        ]);

        // Adicionar Sanctum ao grupo web para permitir autenticação via token no broadcasting
        $middleware->web(append: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
