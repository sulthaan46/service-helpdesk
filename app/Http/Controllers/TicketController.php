<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Opd;
use Illuminate\Http\Request;

class TicketController extends Controller
{

    public function getOptions()
    {
        // Fetch options from the database or define them here
        $opds = Opd::all();
        $categories = Category::all();

        return response()->json([
            'opds' => $opds,
            'categories' => $categories,
        ]);
    }
   
}
