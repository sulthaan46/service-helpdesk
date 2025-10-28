<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Operator;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $operatorJaringan = Operator::create(['name' => 'Jaringan']);
        $operatorAplikasi = Operator::create(['name' => 'Aplikasi']);

         Category::create([
            'name' => 'Jaringan Intra Pemerintah',
            'operator_id' => $operatorJaringan->id
        ]);

        Category::create([
            'name' => 'Aplikasi E-Gov',
            'operator_id' => $operatorAplikasi->id
        ]);
    }
}
