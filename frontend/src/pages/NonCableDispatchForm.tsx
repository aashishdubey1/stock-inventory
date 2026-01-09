import { Card } from '../components/Card';

export function NonCableDispatchForm({ onNavigate }: { onNavigate: (path: string) => void }) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Non-Cable / Loose Dispatch</h1>
            <Card padding="lg">
                <p>Form to dispatch Loose Lengths or Non-Cable items will go here.</p>
            </Card>
        </div>
    );
}
