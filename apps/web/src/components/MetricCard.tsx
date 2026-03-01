import { Card, CardContent, CardHeader } from "./ui/card";

interface MetricCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
}

export function MetricCard({ label, value, icon }: MetricCardProps) {
    return (
        <Card className="border-[1px] border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-baseline justify-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-700 flex items-center justify-center">
                    {icon}
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
            </CardHeader>
            <CardContent>
                <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</span>
            </CardContent>
        </Card>
    );
}