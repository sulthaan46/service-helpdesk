<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Opd;
use App\Models\Ticket;
use Carbon\Carbon;
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'whatsapp' => 'required|string|max:15',
            'opd_id' => 'required|exists:opds,id',
            'priority' => 'required|in:Rendah,Menengah,Tinggi',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string|max:1000',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,docx|max:10240',
        ]);

        if ($request->hasFile('attachment')) {
           $filePath = $request->file('attachment')->store('attachments', 'public');
            $validated['attachment'] = $filePath;
        }

        $today = Carbon::today()->format('Ymd');
        $latestTicket = Ticket::whereDate('created_at', Carbon::today())->latest()->first(); 
        $ticketNumber = $latestTicket ? intval(substr($latestTicket->ticket_id, -3)) + 1 : 1;
        $ticketId = 'TICK-' . $today . '-' . str_pad($ticketNumber, 3, '0', STR_PAD_LEFT);
        $validated['ticket_id'] = $ticketId;


       
        Ticket::create($validated);

        return redirect()->route('home');
    }
   
}
