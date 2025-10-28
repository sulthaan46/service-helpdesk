import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';

import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Operator Dashboard',
        href: route('operator.dashboard'),
    },
];

interface Props {
    operatorName?: string | null;
}

export default function OperatorDashboard({ operatorName }: Props) {
    const title = operatorName
        ? `Operator ${operatorName}`
        : 'Operator Dashboard';
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
        </AppLayout>
    );
}
