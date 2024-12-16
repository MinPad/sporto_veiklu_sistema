<?php

// use Illuminate\Foundation\Application;
// use Illuminate\Foundation\Configuration\Middleware;
// use Illuminate\Foundation\Configuration\Exceptions;
// use App\Http\Middleware\CorsMiddleware;

// return Application::configure(basePath: dirname(__DIR__))
//     ->withRouting(
//         web: __DIR__.'/../routes/web.php',
//         api: __DIR__.'/../routes/api.php',
//         commands: __DIR__.'/../routes/console.php',
//         health: '/up',
//     )
//     ->withMiddleware(function (Middleware $middleware) {
//         $middleware->append(CorsMiddleware::class);
        
//         // If you're using API routes, also append to API middleware group
//         $middleware->appendToGroup('api', [
//             CorsMiddleware::class,
//         ]);
//     })
//     ->withExceptions(function (Exceptions $exceptions) {
//         //
//     })->create();



    use Illuminate\Foundation\Application;
    use Illuminate\Foundation\Configuration\Middleware;
    use Illuminate\Foundation\Configuration\Exceptions;
    
    return Application::configure(basePath: dirname(__DIR__))
        ->withRouting(
            web: __DIR__.'/../routes/web.php',
            api: __DIR__.'/../routes/api.php',
            commands: __DIR__.'/../routes/console.php',
            health: '/up',
        )
        ->withMiddleware(function (Middleware $middleware) {
            // Remove any complex CORS configurations
        })
        ->withExceptions(function (Exceptions $exceptions) {
            //
        })->create();