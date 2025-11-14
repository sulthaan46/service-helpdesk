<?php

namespace App\Http\Controllers;

use App\Mail\TicketConfirmation;
use App\Mail\TicketListMail;
use App\Models\Category;
use App\Models\Opd;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class TicketController extends Controller
{

    public function getOptions()
    {
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

        $category = Category::with('operator')->findOrFail($validated['category_id']);
        $operator_id = $category->operator ? $category->operator->id : null;

        if ($request->hasFile('attachment')) {
           $filePath = $request->file('attachment')->store('attachments', 'public');
            $validated['attachment'] = $filePath;
        }

        $today = Carbon::today()->format('Ymd');
        $latestTicket = Ticket::whereDate('created_at', Carbon::today())->latest()->first(); 
        $ticketNumber = $latestTicket ? intval(substr($latestTicket->ticket_id, -3)) + 1 : 1;
        $ticketId = 'TICK-' . $today . '-' . str_pad($ticketNumber, 3, '0', STR_PAD_LEFT);
        $validated['ticket_id'] = $ticketId;

        $validated['operator_id'] = $operator_id;
       
        $ticket = Ticket::create($validated);

        Mail::to($ticket->email)->send(new TicketConfirmation($ticket->ticket_id));

        return redirect()->route('home')->with('success', 'Tiket berhasil dibuat!');
    }

    public function getTicketDetail(Request $request)
    {
        $ticketId = $request->query('ticket_id');

        $ticket = Ticket::where('ticket_id', $ticketId)->with(['notes' => function($query) {
                        $query->latest()->take(1);
                    }])->first();

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
            'notes' => $ticket->notes->map(function($note) {
            return [
                'id' => $note->id,
                'note' => $note->note,
                'created_at' => $note->created_at->format('d/m/Y, H:i:s'),
                'updated_at' => $note->updated_at->format('d/m/Y, H:i:s'),
                'user' => [
                    'id' => $note->user->id,  // Asumsi ada relasi 'user' pada TicketNote
                    'name' => $note->user->name,
                ],
            ];
        }),
        ];
        return response()->json($ticketDetail);
    }

    public function sendList(Request $request)
    {
        $data = $request->validate([
        'email' => 'required|email',
        'type' => 'required|in:open,all',
        ]);


        $query = Ticket::where('email', $data['email']);


        if ($data['type'] === 'open') {
        $query->whereIn('status', ['baru', 'diproses']);
        }


        $tickets = $query->orderBy('created_at', 'desc')->get();


        if ($tickets->isEmpty()) {
        return back()->withErrors(['email' => 'Tidak ditemukan tiket untuk email ini.']);
        }

        Mail::to($data['email'])->queue(new TicketListMail($tickets));


        return redirect()->route('home')->with('success', 'Daftar tiket akan dikirim ke email Anda. Periksa folder masuk/spam.');
    }
   
}
