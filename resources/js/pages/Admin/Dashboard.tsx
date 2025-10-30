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

type Ticket = {
    id: number;
    ticket_id: string;
    name: string;
    status: string;
    priority: string;
    operatorUser?: {
        name: string;
        operator?: { name: string };
    };
    opd?: { name: string };
    category?: { name: string };
    created_at: string;
};

interface Props {
    tickets: Ticket[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: route('admin.dashboard') },
];

export default function AdminDashboard({ tickets }: Props) {
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
                                                ticket.status === 'Open'
                                                    ? 'bg-green-500'
                                                    : ticket.status === 'baru'
                                                      ? 'bg-blue-500'
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
        </AppLayout>
    );
}
