<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email');
        $table->string('whatsapp');
        $table->enum('priority', ['Rendah', 'Menengah', 'Tinggi']);
        $table->foreignId('opd_id')->constrained('opds')->onDelete('cascade');
        $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
        $table->text('description');
        $table->string('attachment')->nullable();
        $table->enum('status', ['baru', 'didelegasikan', 'diproses', 'selesai'])->default('baru');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
