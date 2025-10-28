<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Operator;
use Illuminate\Http\Request;

class CategoryOperatorController extends Controller
{

     public function create()
    {
         $categories = Category::with('operator')->get();

         return inertia('Admin/CreateCategoryOperator', [
        'categories' => $categories,
    ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:255',
            'operator_name' => 'required|string|max:255',
        ]);

        $operator = Operator::create([
            'name' => $validated['operator_name'],
        ]);

       $category = Category::create([
            'name' => $validated['category_name'],
            'operator_id' => $operator->id, 
        ]);

        $category->load('operator');
        return response()->json(['success' => true, 'category' => $category]);
    }

     public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:255',
            'operator_name' => 'required|string|max:255',
        ]);

        $category->name = $validated['category_name'];
        $category->save();

        if ($category->operator) {
            $category->operator->update([
                'name' => $validated['operator_name'],
            ]);
        } else {
            $operator = Operator::create([
                'name' => $validated['operator_name'],
            ]);
            $category->operator_id = $operator->id;
            $category->save();
        }

         return response()->json(['success' => true, 'category' => $category]);
    }

    public function destroy(Category $category)
{
    if ($category->operator) {
        $category->operator->delete();
    }

    $category->delete();

    return response()->json(['success' => true, 'message' => 'Kategori dan Operator berhasil dihapus!']);
}

}
