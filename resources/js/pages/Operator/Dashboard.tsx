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
import axios from 'axios';

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
    const [ticketsList, setTicketsList] = useState<Ticket[]>(tickets);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [ticketToUpdate, setTicketToUpdate] = useState<Ticket | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [isConfirmCompleteModalOpen, setIsConfirmCompleteModalOpen] =
        useState(false);
    const [isCompletingTicket, setIsCompletingTicket] = useState(false);

    const handleRowClick = (ticket: Ticket) => {
        const updatedTicket =
            ticketsList.find((t) => t.id === ticket.id) || ticket;
        if (updatedTicket.status === 'baru') {
            setTicketToUpdate(updatedTicket);
            setIsConfirmModalOpen(true);
        } else {
            setSelectedTicket(updatedTicket);
            setIsModalOpen(true);
        }
    };

    const handleConfirmUpdateStatus = async () => {
        if (!ticketToUpdate) return;

        setIsUpdatingStatus(true);

        try {
            const response = await axios.post(
                route('operator.updateStatus', {
                    ticket: ticketToUpdate.id,
                }),
            );

            if (response.data.success) {
                const ticketWithNewStatus = {
                    ...ticketToUpdate,
                    status: response.data.status,
                };
                setTicketsList((prevTickets) =>
                    prevTickets.map((t) =>
                        t.id === ticketWithNewStatus.id
                            ? ticketWithNewStatus
                            : t,
                    ),
                );
                setSelectedTicket(ticketWithNewStatus);
            } else {
                setSelectedTicket(ticketToUpdate);
            }
        } catch (error) {
            console.error('Gagal mengupdate status tiket:', error);
            setSelectedTicket(ticketToUpdate);
        } finally {
            setIsUpdatingStatus(false);
            setIsConfirmModalOpen(false);
            setTicketToUpdate(null);
            setIsModalOpen(true);
        }
    };

    const handleCancelUpdateStatus = () => {
        setIsConfirmModalOpen(false);
        setTicketToUpdate(null);
    };

    const handleMarkAsCompleted = () => {
        setIsConfirmCompleteModalOpen(true);
    };

    const handleConfirmComplete = async () => {
        if (!selectedTicket) return;

        setIsCompletingTicket(true);

        try {
            const response = await axios.post(
                route('operator.updateStatus', {
                    ticket: selectedTicket.id,
                }),
            );

            if (response.data.success) {
                const updatedTicket = response.data.ticket;

                setTicketsList((prevTickets) =>
                    prevTickets.map((t) =>
                        t.id === updatedTicket.id ? updatedTicket : t,
                    ),
                );

                setSelectedTicket(updatedTicket);

                setIsConfirmCompleteModalOpen(false);
            }
        } catch (error) {
            console.error('Gagal menandai tiket selesai:', error);
        } finally {
            setIsCompletingTicket(false);
        }
    };

    const handleCancelComplete = () => {
        setIsConfirmCompleteModalOpen(false);
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
            if (!selectedTicket) {
                console.error('Tiket tidak ditemukan');
                return;
            }
            const response = await axios.post(
                route('operator.addNote', { ticket: selectedTicket!.id }),
                {
                    note: newNote,
                },
            );

            const {
                id,
                note,
                created_at,
                updated_at,
                operator_id,
                user,
                operator,
            } = response.data;

            if (selectedTicket) {
                const updatedTicket = {
                    ...selectedTicket,
                    notes: [
                        ...(selectedTicket.notes || []),
                        {
                            id: id,
                            note: note,
                            user: user,
                            operator: operator,
                            operator_id: operator_id,
                            created_at: created_at,
                            updated_at: updated_at,
                        },
                    ],
                };
                setSelectedTicket(updatedTicket);

                setTicketsList((prevTickets) =>
                    prevTickets.map((ticket) =>
                        ticket.id === updatedTicket.id ? updatedTicket : ticket,
                    ),
                );
            }

            setNewNote('');
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
                            {ticketsList.map((ticket) => (
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
                                            className={`w-full rounded-lg border p-3 text-sm text-gray-700 focus:ring-2 focus:outline-none ${
                                                selectedTicket.status ===
                                                'selesai'
                                                    ? 'cursor-not-allowed border-gray-200 bg-gray-50'
                                                    : 'border-gray-300 bg-white focus:ring-blue-500'
                                            }`}
                                            rows={4}
                                            placeholder={
                                                selectedTicket.status ===
                                                'selesai'
                                                    ? 'Tiket sudah selesai, tidak dapat menambah catatan baru'
                                                    : 'Tulis catatan baru terkait tiket ini...'
                                            }
                                            value={newNote}
                                            onChange={(e) =>
                                                setNewNote(e.target.value)
                                            }
                                            disabled={
                                                selectedTicket.status ===
                                                'selesai'
                                            }
                                            readOnly={
                                                selectedTicket.status ===
                                                'selesai'
                                            }
                                        ></textarea>
                                        <div className="mt-1 flex justify-end">
                                            <button
                                                onClick={handleSaveNote}
                                                disabled={
                                                    isSaving ||
                                                    selectedTicket.status ===
                                                        'selesai'
                                                }
                                                className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                                                    isSaving ||
                                                    selectedTicket.status ===
                                                        'selesai'
                                                        ? 'cursor-not-allowed bg-gray-400'
                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                }`}
                                            >
                                                {isSaving
                                                    ? 'Menyimpan...'
                                                    : selectedTicket.status ===
                                                        'selesai'
                                                      ? 'Tiket Selesai'
                                                      : 'Simpan Perubahan'}
                                            </button>
                                        </div>
                                        {selectedTicket?.notes &&
                                        selectedTicket.notes.length > 0 ? (
                                            <div className="mt-2 max-h-48 overflow-y-auto">
                                                {selectedTicket.notes
                                                    .slice()
                                                    .reverse()
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
                                                                      ? `Operator ${note.operator.name}`
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

                                    {selectedTicket.status !== 'selesai' && (
                                        <div className="mt-3 rounded-b-xl border border-gray-300 bg-white p-4 shadow-sm">
                                            <h3 className="text-xl font-semibold">
                                                Aksi Cepat
                                            </h3>
                                            <div className="mt-4">
                                                <button
                                                    onClick={
                                                        handleMarkAsCompleted
                                                    }
                                                    className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                                >
                                                    Tandai Selesai
                                                </button>
                                            </div>
                                        </div>
                                    )}
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

            {/* Modal Konfirmasi Update Status */}
            {isConfirmModalOpen && ticketToUpdate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
                    {/* overlay */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={handleCancelUpdateStatus}
                    />

                    {/* modal box */}
                    <div className="relative z-10 mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
                        <div className="px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Konfirmasi Update Status
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Apakah Anda yakin ingin mengubah status tiket{' '}
                                <span className="font-medium">
                                    {ticketToUpdate.ticket_id}
                                </span>{' '}
                                dari "baru" menjadi "diproses"?
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
                            <button
                                onClick={handleCancelUpdateStatus}
                                className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
                                disabled={isUpdatingStatus}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmUpdateStatus}
                                disabled={isUpdatingStatus}
                                className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                                    isUpdatingStatus
                                        ? 'cursor-not-allowed bg-gray-400'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {isUpdatingStatus
                                    ? 'Memproses...'
                                    : 'Ya, Update Status'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Tandai Selesai */}
            {isConfirmCompleteModalOpen && selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
                    {/* overlay */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={handleCancelComplete}
                    />

                    {/* modal box */}
                    <div className="relative z-10 mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
                        <div className="px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Konfirmasi Tandai Selesai
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Apakah Anda yakin ingin menandai tiket{' '}
                                <span className="font-medium text-gray-900">
                                    {selectedTicket.ticket_id}
                                </span>{' '}
                                sebagai selesai?
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
                            <button
                                onClick={handleCancelComplete}
                                disabled={isCompletingTicket}
                                className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmComplete}
                                disabled={isCompletingTicket}
                                className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                                    isCompletingTicket
                                        ? 'cursor-not-allowed bg-gray-400'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {isCompletingTicket
                                    ? 'Memproses...'
                                    : 'Ya, Tandai Selesai'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
