<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Opd;
use Illuminate\Http\Request;

class OpdController extends Controller
{
    public function create()
    {
        $opds = Opd::all();

        return inertia('Admin/CreateOpd', [
            'opds' => $opds,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:opds,name',
        ]);

        $opd = Opd::create([
            'name' => $validated['name'],
        ]);

        return response()->json(['success' => true, 'opd' => $opd]);
    }

    public function destroy(Opd $opd)
    {
        $opd->delete();

        return response()->json(['success' => true, 'message' => 'OPD berhasil dihapus!']);
    }
}
