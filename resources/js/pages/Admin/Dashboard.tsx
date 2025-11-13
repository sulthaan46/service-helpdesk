import { Head } from '@inertiajs/react';
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
import { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

type Ticket = {
    id: number;
    ticket_id: string;
    name: string;
    email: string;
    status: string;
    priority: string;
    operatorUser?: {
        id: number;
        name: string;
        operator?: { name: string; id: number };
    };
    opd?: { name: string };
    category?: { name: string };
    created_at: string;
    description: string;
    notes?: {
        id: number;
        note: string;
        user?: { id: number; name: string };
        created_at: string;
        updated_at: string;
    }[];
};

interface User {
    id: number;
    name: string;
    operator_id: number;
}

interface Operator {
    id: number;
    name: string;
    users?: User[];
}

interface Props {
    tickets: Ticket[];
    operators: Operator[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: route('admin.dashboard') },
];

export default function AdminDashboard({ tickets, operators }: Props) {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [status, setStatus] = useState(selectedTicket?.status || '');
    const [operator, setOperator] = useState(
        selectedTicket?.operatorUser?.operator?.id || '',
    );
    const [operatorUser, setOperatorUser] = useState<string | null>(
        selectedTicket?.operatorUser?.name || '',
    );
    const [newNote, setNewNote] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (selectedTicket) {
            setStatus(selectedTicket.status);
            setOperator(selectedTicket.operatorUser?.operator?.id || '');
            setOperatorUser(selectedTicket.operatorUser?.name || '');
            setNewNote('');
        }
    }, [selectedTicket]);

    const handleRowClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value); // Update status berdasarkan pilihan dropdown
    };

    const handleNewNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewNote(e.target.value);
    };

    const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOperatorId = e.target.value;
        setOperator(selectedOperatorId);
        const selectedOperator = operators.find(
            (op) => op.id.toString() === selectedOperatorId,
        );
        if (selectedOperator) {
            const selectedUser = selectedOperator.users?.find(
                (user) => user.operator_id === selectedOperator.id,
            );
            setOperatorUser(selectedUser ? selectedUser.name : '');
        }
    };

    const handleSaveChanges = () => {
        if (!selectedTicket) return;

        Inertia.put(
            route('admin.tickets.update', selectedTicket.id),
            {
                status,
                operator_id: operator || null,
                note: newNote ? newNote : null,
            },
            {
                onSuccess: () => {
                    console.log('Tiket berhasil diperbarui di database');
                    setIsModalOpen(false);
                    setSelectedTicket(null);
                    setNewNote('');
                },
                onError: (errors) => {
                    console.log('Terjadi error saat update tiket:', errors);
                },
            },
        );
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="p-4">
                <div className="overflow-x-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead>ID TIKET</TableHead>
                                <TableHead>SUBJEK/PELAPOR</TableHead>
                                <TableHead>STATUS</TableHead>
                                <TableHead>PRIORITAS</TableHead>
                                <TableHead>OPERATOR</TableHead>
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
                                            className={`rounded px-2 py-1 text-sm text-white ${
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
                                        {ticket.operatorUser
                                            ? `${ticket.operatorUser.name} (${ticket.operatorUser.operator?.name || '-'})`
                                            : '-'}
                                    </TableCell>
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
                        {/* header */}
                        <div className="flex items-start justify-between border-b border-gray-200 px-4 py-3">
                            <h2 className="text-lg font-bold">
                                Detail Tiket: {selectedTicket.ticket_id}
                            </h2>
                            <button
                                onClick={closeModal}
                                aria-label="Tutup"
                                className="rounded p-1 text-2xl leading-none hover:bg-gray-100"
                            >
                                ×
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto px-4 py-5">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
                                <div className="sm:col-span-3">
                                    <h3 className="mb-2 font-semibold">
                                        Deskripsi Masalah
                                    </h3>
                                    <div className="rounded-lg bg-gray-100 p-3 whitespace-pre-wrap">
                                        {selectedTicket.description || '-'}
                                    </div>

                                    <h3 className="mt-4 mb-2 font-semibold">
                                        Riwayat Catatan
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedTicket.notes &&
                                        selectedTicket.notes.length > 0 ? (
                                            <div className="max-h-48 overflow-y-auto">
                                                {selectedTicket.notes.map(
                                                    (note) => (
                                                        <div
                                                            key={note.id}
                                                            className="mt-2 rounded-lg bg-gray-100 p-2"
                                                        >
                                                            <div className="text-sm text-gray-600">
                                                                <strong>
                                                                    {note.user
                                                                        ?.name ||
                                                                        'Admin'}
                                                                </strong>{' '}
                                                                <span>-</span>{' '}
                                                                <span className="text-xs text-gray-400">
                                                                    {new Date(
                                                                        note.created_at,
                                                                    ).toLocaleDateString(
                                                                        'id-ID',
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <p className="mt-1 text-sm">
                                                                {note.note}
                                                            </p>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">
                                                Belum ada catatan
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <div className="rounded-lg bg-gray-100 p-4">
                                        <h3 className="mb-2 font-semibold">
                                            Informasi Tiket
                                        </h3>
                                        <p>
                                            <strong>Status:</strong>{' '}
                                            <span
                                                className={`rounded p-0.5 text-sm text-white ${
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
                                        </p>
                                        <p>
                                            <strong>Prioritas:</strong>{' '}
                                            {selectedTicket.priority}
                                        </p>
                                        <p>
                                            <strong>Pelapor:</strong>{' '}
                                            {selectedTicket.name}
                                        </p>
                                        <p>
                                            <strong>Email:</strong>{' '}
                                            {selectedTicket.email}
                                        </p>
                                        <p>
                                            <strong>OPD:</strong>{' '}
                                            {selectedTicket.opd?.name}
                                        </p>
                                        <p>
                                            <strong>Dibuat:</strong>{' '}
                                            {new Date(
                                                selectedTicket.created_at,
                                            ).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <hr className="my-5 border-t border-gray-200" />
                            <h3 className="mb-4 font-semibold">Tindakan</h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block font-semibold">
                                        Ubah Status
                                    </label>
                                    <select
                                        className="w-full rounded-lg border border-gray-300 p-2"
                                        value={status}
                                        onChange={handleStatusChange}
                                    >
                                        <option value="baru">Baru</option>
                                        <option value="didelegasikan">
                                            Didelegasikan
                                        </option>
                                        <option value="diproses">
                                            Diproses
                                        </option>
                                        <option value="selesai">Selesai</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block font-semibold">
                                        Ubah Operator
                                    </label>
                                    <select
                                        value={operator}
                                        onChange={handleOperatorChange}
                                        className="w-full rounded-md border border-gray-300 p-2"
                                    >
                                        <option value="">
                                            — Pilih Operator —
                                        </option>
                                        {operators.map((op) => (
                                            <option key={op.id} value={op.id}>
                                                {op.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mt-2 text-sm text-gray-600">
                                        {operatorUser
                                            ? operatorUser
                                            : selectedTicket.operatorUser
                                              ? `${selectedTicket.operatorUser.name} (${selectedTicket.operatorUser.operator?.name || '-'})`
                                              : '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="mb-2 block font-semibold">
                                    Tambah Catatan Baru
                                </label>
                                <textarea
                                    className="w-full rounded-lg border border-gray-300 p-2"
                                    rows={4}
                                    placeholder="Tambahkan catatan progres atau penyelesaian..."
                                    value={newNote}
                                    onChange={handleNewNoteChange}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-4 py-3">
                            <button
                                onClick={closeModal}
                                className="rounded-lg bg-gray-300 px-4 py-2 text-gray-700"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
