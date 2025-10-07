<?php

namespace Database\Seeders;

use App\Models\Opd;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OpdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         Opd::create([
            'name' => 'Dinas Kesehatan',
        ]);
        Opd::create([
            'name' => 'Dinas Pendidikan',
        ]);
        Opd::create([
            'name' => 'Dinas Sosial',
        ]);
    }
}
