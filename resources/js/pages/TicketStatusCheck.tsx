import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface TicketDetail {
    ticket_id: string;
    status: string;
    priority: string;
    created_at: string;
    updated_at: string;
    name: string;
    email: string;
    whatsapp: string;
    description: string;
}

export default function TicketStatusCheck() {
    const [ticketId, setTicketId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [ticketDetail, setTicketDetail] = useState<TicketDetail | null>(null);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setTicketDetail(null);

        if (!ticketId.trim()) {
            setError('Masukkan ID tiket terlebih dahulu.');
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams({ ticket_id: ticketId.trim() });
            const url = `/api/tickets/status?${params.toString()}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });
            if (!res.ok) throw new Error('Gagal mengambil data tiket');
            const json = await res.json();
            setTicketDetail(json);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Terjadi kesalahan');
            } else {
                setError('Terjadi kesalahan tidak terduga');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Head title="Cari Tiket" />
            <div className="min-h-screen bg-gray-100 px-6 py-12">
                <div className="mx-auto max-w-3xl">
                    {/* Card Cari Tiket */}
                    <Card className="w-full bg-white shadow-md">
                        <CardHeader className="py-8 text-center">
                            <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
                                Lacak Status Tiket Anda
                            </h1>
                            <p className="mt-2 text-sm text-slate-600">
                                Masukkan ID tiket Anda untuk melihat progres
                                penyelesaian.
                            </p>
                        </CardHeader>
                        <CardContent className="px-8 pb-10">
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col items-center gap-6"
                            >
                                <div className="flex w-full max-w-xl items-center gap-3">
                                    <Input
                                        placeholder="e.g., Tick-20250925-141"
                                        value={ticketId}
                                        onChange={(e) =>
                                            setTicketId(e.target.value)
                                        }
                                        className="h-11 flex-1"
                                    />
                                    <Button
                                        type="submit"
                                        className="h-11 bg-blue-600 px-6 text-white hover:bg-blue-700"
                                        disabled={loading}
                                    >
                                        Cari Tiket
                                    </Button>
                                </div>

                                {ticketDetail && (
                                    <div className="mt-2 w-full border-t border-slate-400 pt-6">
                                        <h2 className="text-center text-xl font-semibold text-slate-900">
                                            Detail Tiket:{' '}
                                            {ticketDetail.ticket_id}
                                        </h2>
                                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            {/* Status */}
                                            <div className="flex flex-row items-center gap-2">
                                                <span className="text-sm text-slate-600">
                                                    Status:
                                                </span>
                                                <span
                                                    className={`rounded-lg px-2 font-semibold text-white ${ticketDetail.status === 'baru' ? 'bg-blue-500' : ''} ${ticketDetail.status === 'didelegasikan' ? 'bg-yellow-500' : ''} ${ticketDetail.status === 'diproses' ? 'bg-orange-500' : ''} ${ticketDetail.status === 'selesai' ? 'bg-green-500' : ''} `}
                                                >
                                                    {ticketDetail.status}
                                                </span>
                                            </div>

                                            {/* Prioritas */}
                                            <div className="flex flex-row items-center gap-2">
                                                <span className="text-sm text-slate-600">
                                                    Prioritas:
                                                </span>
                                                <span className="text-sm font-medium text-slate-900">
                                                    {ticketDetail.priority}
                                                </span>
                                            </div>

                                            {/* Tanggal Dibuat */}
                                            <div className="flex flex-row items-center gap-2">
                                                <span className="text-sm text-slate-600">
                                                    Tanggal Dibuat:
                                                </span>
                                                <span className="text-sm font-medium text-slate-900">
                                                    {ticketDetail.created_at}
                                                </span>
                                            </div>

                                            {/* Terakhir Update */}
                                            <div className="flex flex-row items-center gap-2">
                                                <span className="text-sm text-slate-600">
                                                    Terakhir Update:
                                                </span>
                                                <span className="text-sm font-medium text-slate-900">
                                                    {ticketDetail.updated_at}
                                                </span>
                                            </div>

                                            {/* Pelapor */}
                                            <div className="flex flex-row items-center gap-2">
                                                <span className="text-sm text-slate-600">
                                                    Pelapor:
                                                </span>
                                                <span className="text-sm font-medium text-slate-900">
                                                    {ticketDetail.name} (
                                                    {ticketDetail.email})
                                                </span>
                                            </div>

                                            {/* Deskripsi Masalah */}
                                            <div className="flex flex-col sm:col-span-2">
                                                <span className="text-sm text-slate-600">
                                                    Deskripsi Masalah
                                                </span>
                                                <div className="min-h-[60px] rounded-lg bg-gray-200 px-2 py-1">
                                                    <p className="text-sm font-medium text-slate-900">
                                                        {
                                                            ticketDetail.description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <a href="/" className="text-sm text-blue-600">
                                    Kembali ke Beranda
                                </a>

                                {error && (
                                    <div className="text-sm text-red-600">
                                        {error}
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    {/* Lupa ID */}
                    <div className="mt-10">
                        <Card className="border bg-gradient-to-br from-white to-slate-50">
                            <CardContent className="px-6 py-8 text-center">
                                <h3 className="text-m font-medium text-slate-800">
                                    Tidak menemukan ID tiket Anda?
                                </h3>
                                <p className="mt-2 text-xs text-slate-600">
                                    Gunakan fitur Lupa ID Pelacakan untuk
                                    mendapatkan daftar tiket melalui email
                                </p>
                                <div className="mt-4">
                                    <a
                                        href={route('ticket.forgotTicket')}
                                        className="inline-block"
                                    >
                                        <Button
                                            variant="outline"
                                            className="h-9"
                                        >
                                            Lupa ID Pelacakan
                                        </Button>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
