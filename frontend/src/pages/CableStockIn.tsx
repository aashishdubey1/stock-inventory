import { Card } from '../components/Card';

export function CableStockIn({ onNavigate }: { onNavigate: (path: string) => void }) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Cable Stock In</h1>
            <Card padding="lg">
                <p>Form to add new Cable Drums will go here.</p>
            </Card>
        </div>
    );
}
