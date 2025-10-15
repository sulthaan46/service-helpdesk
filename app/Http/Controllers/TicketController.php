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

    public function getTicketDetail(Request $request)
    {
        $ticketId = $request->query('ticket_id');

        $ticket = Ticket::where('ticket_id', $ticketId)->first();

        if (!$ticket){
            return response()->json(['message' => 'Tiket tidak ditemukan'], 404);
        }

        $ticketDetail = [
            'ticket_id' => $ticket->ticket_id,
            'status' => $ticket->status,
            'priority' => $ticket->priority,
            'created_at' =>$ticket->created_at->format('d/m/Y, H:i:s'),
            'updated_at' =>$ticket->updated_at->format('d/m/Y, H:i:s'),
            'name' => $ticket->name,
            'email' => $ticket->email,
            'whatsapp' => $ticket->whatsapp,
            'description' => $ticket->description,
        ];
        return response()->json($ticketDetail);
    }
   
}
