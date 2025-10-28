<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
      public function index(Request $request)
    {
        $operatorName = optional($request->user()->operator)->name;

        return Inertia::render('Operator/Dashboard', [
            'operatorName' => $operatorName,
        ]);
    }
}
