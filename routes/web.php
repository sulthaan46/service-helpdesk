<?php

use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/ticket/create', function () {
    return Inertia::render('CreateTicket');
})->name('ticket.create');

Route::get('/ticket/status', function () {
    return Inertia::render('TicketStatusCheck');
})->name('ticket.status');

Route::get('/ticket/forgot-password', function () {
    return Inertia::render('ForgotPassword');
})->name('ticket.forgotPassword');

Route::get('/api/tickets/options', [TicketController::class, 'getOptions']);
Route::post('/ticket/create',[TicketController::class, 'store'])->name('tickets.store');
Route::get('/api/tickets/status', [TicketController::class,'getTicketDetail']);
Route::post('/tickets/send-list', [TicketController::class, 'sendList'])->name('tickets.sendList');


Route::middleware(['auth', 'verified'])->group(function () {
Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
