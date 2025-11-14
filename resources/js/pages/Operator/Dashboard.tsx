import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { BreadcrumbItem } from '@/types';
import { route } from 'ziggy-js';
import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

type Ticket = {
    id: number;
    ticket_id: string;
    name: string;
    email: string;
    whatsapp: string;
    status: string;
    priority: string;
    description: string;
    attachment: string;
    opd?: { name: string };
    category?: { name: string };
    created_at: string;
    updated_at: string;
    operator?: { name: string };
    notes?: {
        id: number;
        note: string;
        user?: { id: number; name: string; role: 'admin' | 'operator' };
        operator_id?: number;
        operator?: { name: string };
        created_at: string;
        updated_at: string;
    }[];
};

interface Props {
    tickets: Ticket[];
    operatorName?: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Operator Dashboard', href: route('operator.dashboard') },
];

export default function OperatorDashboard({ tickets, operatorName }: Props) {
    const title = operatorName
        ? `Operator ${operatorName}`
        : 'Operator Dashboard';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [newNote, setNewNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleRowClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true); // membuka modal saat row diklik
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
    };

    const handleSaveNote = async () => {
        if (newNote.trim() === '') {
            console.log('Catatan tidak boleh kosong');
            return;
        }

        setIsSaving(true);

        try {
            // Kirim data ke backend
            await Inertia.post(
                route('operator.addNote', { ticket: selectedTicket!.id }),
                {
                    note: newNote,
                },
            );

            setNewNote('');
            closeModal();
        } catch (error) {
            console.error('Gagal menambahkan catatan:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="p-4">
                <h2 className="mb-6 text-xl font-semibold">{title}</h2>
                <div className="overflow-x-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead>ID TIKET</TableHead>
                                <TableHead>SUBJEK/PELAPOR</TableHead>
                                <TableHead>STATUS</TableHead>
                                <TableHead>PRIORITAS</TableHead>
                                <TableHead>TANGGAL</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.map((ticket) => (
                                <TableRow
                                    key={ticket.id}
                                    className="transition-colors hover:bg-gray-50"
                                    onClick={() => handleRowClick(ticket)}
                                >
                                    <TableCell>
                                        <div className="font-medium">
                                            {ticket.ticket_id}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {ticket.category?.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">
                                            {ticket.opd?.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {ticket.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`rounded-lg px-2 py-1 text-sm text-white ${
                                                ticket.status === 'baru'
                                                    ? 'bg-blue-500'
                                                    : ticket.status ===
                                                        'didelegasikan'
                                                      ? 'bg-yellow-500'
                                                      : ticket.status ===
                                                          'diproses'
                                                        ? 'bg-orange-500'
                                                        : ticket.status ===
                                                            'selesai'
                                                          ? 'bg-green-500'
                                                          : 'bg-gray-500'
                                            }`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{ticket.priority}</TableCell>
                                    <TableCell>
                                        {new Date(
                                            ticket.created_at,
                                        ).toLocaleDateString('id-ID')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {isModalOpen && selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
                    {/* overlay */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={closeModal}
                    />

                    {/* modal box */}
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="relative z-10 mx-auto w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg sm:max-w-4xl md:max-w-5xl lg:max-w-6xl"
                    >
                        {/* Content with max height */}
                        <div className="max-h-[80vh] overflow-y-auto px-4 py-5">
                            <div className="flex flex-col sm:flex-row">
                                <div className="w-full p-6 sm:w-3/5">
                                    <div className="rounded-t-xl border border-gray-300 bg-white p-4 shadow-sm">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    Detail Ticket
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {selectedTicket?.ticket_id}
                                                </p>
                                            </div>
                                            <div>
                                                <span
                                                    className={`rounded-lg px-2 py-1 text-sm text-white ${
                                                        selectedTicket.status ===
                                                        'baru'
                                                            ? 'bg-blue-500'
                                                            : selectedTicket.status ===
                                                                'didelegasikan'
                                                              ? 'bg-yellow-500'
                                                              : selectedTicket.status ===
                                                                  'diproses'
                                                                ? 'bg-orange-500'
                                                                : selectedTicket.status ===
                                                                    'selesai'
                                                                  ? 'bg-green-500'
                                                                  : 'bg-gray-500'
                                                    }`}
                                                >
                                                    {selectedTicket.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-1 rounded-b-xl border border-gray-300 bg-white p-4 shadow-sm">
                                        <h3 className="text-md font-semibold">
                                            Deskripsi Masalah
                                        </h3>
                                        <p className="mb-4 text-sm text-gray-700">
                                            {selectedTicket?.description || '-'}
                                        </p>

                                        <h3 className="text-md mb-2 font-semibold">
                                            Lampiran
                                        </h3>
                                        {selectedTicket?.attachment ? (
                                            <a
                                                href={selectedTicket.attachment}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Lihat Lampiran
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                Tidak ada lampiran
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-3 rounded-t-xl border border-gray-300 bg-white p-4 shadow-sm">
                                        <h3 className="text-md font-semibold">
                                            Riwayat dan Catatan
                                        </h3>
                                    </div>
                                    <div className="mt-1 rounded-b-xl border border-gray-300 bg-white p-4 shadow-sm">
                                        <h3 className="mb-3 font-semibold">
                                            Tambah Catatan Baru
                                        </h3>
                                        <textarea
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            rows={4}
                                            placeholder="Tulis catatan baru terkait tiket ini..."
                                            value={newNote}
                                            onChange={(e) =>
                                                setNewNote(e.target.value)
                                            }
                                        ></textarea>
                                        <div className="mt-1 flex justify-end">
                                            <button
                                                onClick={handleSaveNote}
                                                disabled={isSaving}
                                                className={`rounded-lg ${
                                                    isSaving
                                                        ? 'bg-gray-400'
                                                        : 'bg-blue-600'
                                                } px-4 py-2 text-sm font-medium text-white hover:bg-blue-700`}
                                            >
                                                {isSaving
                                                    ? 'Menyimpan...'
                                                    : 'Simpan Perubahan'}
                                            </button>
                                        </div>
                                        {selectedTicket?.notes &&
                                        selectedTicket.notes.length > 0 ? (
                                            <div className="mt-2 max-h-48 overflow-y-auto">
                                                {selectedTicket.notes
                                                    .slice() // Membuat salinan array untuk mencegah perubahan data asli
                                                    .reverse() // Membalikkan urutan catatan
                                                    .map((note) => (
                                                        <div
                                                            key={note.id}
                                                            className="mb-2 rounded-lg bg-gray-100 p-4"
                                                        >
                                                            <p className="text-xs">
                                                                {note.user
                                                                    ?.role ===
                                                                'admin'
                                                                    ? 'Admin'
                                                                    : note.user
                                                                            ?.role ===
                                                                            'operator' &&
                                                                        note.operator
                                                                      ? `Operator ${note.operator.name}` // Menampilkan nama operator
                                                                      : 'Pengguna Tidak Diketahui'}{' '}
                                                                {new Date(
                                                                    note.created_at,
                                                                ).toLocaleString(
                                                                    'id-ID',
                                                                )}
                                                            </p>
                                                            <p className="text-xs font-semibold text-gray-600">
                                                                {note.note}
                                                            </p>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                Tidak ada catatan untuk tiket
                                                ini.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full p-6 sm:w-2/5">
                                    <div className="rounded-t-xl border border-gray-300 bg-white p-4 shadow-sm">
                                        <h3 className="mb-4 text-xl font-semibold">
                                            Informasi
                                        </h3>
                                        <div className="flex justify-between text-lg text-gray-700">
                                            <span>Prioritas</span>
                                            <span className="font-medium">
                                                {selectedTicket?.priority}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex justify-between text-lg text-gray-700">
                                            <span>Kategori</span>
                                            <span className="font-medium">
                                                {selectedTicket?.category?.name}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex justify-between text-lg text-gray-700">
                                            <span>Dibuat pada</span>
                                            <span className="font-medium">
                                                {new Date(
                                                    selectedTicket?.created_at,
                                                ).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex justify-between text-lg text-gray-700">
                                            <span>Update terakhir</span>
                                            <span className="font-medium">
                                                {new Date(
                                                    selectedTicket?.updated_at,
                                                ).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-3 border border-gray-300 bg-white p-4 shadow-sm">
                                        <h3 className="text-xl font-semibold">
                                            Pelapor
                                        </h3>
                                        <div className="mt-2">
                                            <span className="text-lg">
                                                {selectedTicket?.name}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-lg">
                                                {selectedTicket?.email}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-lg">
                                                {selectedTicket?.whatsapp}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-lg">
                                                {selectedTicket?.opd?.name ||
                                                    '-'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-3 rounded-b-xl border border-gray-300 bg-white p-4 shadow-sm">
                                        <h3 className="text-xl font-semibold">
                                            Aksi Cepat
                                        </h3>
                                        <div className="mt-4">
                                            <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                                                Tandai Selesai
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-4 py-3">
                            <button
                                onClick={closeModal}
                                className="rounded-lg bg-gray-300 px-4 py-2 text-gray-700"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
