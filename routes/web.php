<?php

use App\Http\Controllers\Admin\CategoryOperatorController;
use App\Http\Controllers\Operator\DashboardController;
use App\Http\Controllers\TicketController;
use App\Http\Middleware\IsAdmin;
use App\Http\Middleware\IsOperator;
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

Route::get('/ticket/forgot-ticket', function () {
    return Inertia::render('ForgotTicket');
})->name('ticket.forgotTicket');

Route::get('/api/tickets/options', [TicketController::class, 'getOptions']);
Route::post('/ticket/create',[TicketController::class, 'store'])->name('tickets.store');
Route::get('/api/tickets/status', [TicketController::class,'getTicketDetail']);
Route::post('/tickets/send-list', [TicketController::class, 'sendList'])->name('tickets.sendList');


Route::middleware(['auth', 'verified',IsAdmin::class])->get('admin/dashboard',function(){
   return Inertia::render('Admin/Dashboard'); 
})->name('admin.dashboard');

Route::middleware(['auth', 'verified', IsAdmin::class])->get('admin/categories/create', [CategoryOperatorController::class, 'create'])->name('admin.categories.create');
Route::middleware(['auth', 'verified', IsAdmin::class])->post('admin/categories', [CategoryOperatorController::class, 'store'])->name('admin.categories.store');
Route::middleware(['auth', 'verified', IsAdmin::class])->put('admin/categories/{category}', [CategoryOperatorController::class, 'update'])->name('admin.categories.update');
Route::middleware(['auth', 'verified', IsAdmin::class])
    ->delete('admin/categories/{category}', [CategoryOperatorController::class, 'destroy'])
    ->name('admin.categories.destroy');

Route::middleware(['auth', 'verified', IsOperator::class])
    ->get('/operator/dashboard', [DashboardController::class, 'index'])
    ->name('operator.dashboard');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
