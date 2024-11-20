import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
                    {trend && (
                        <p className={`mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            <span className="text-gray-600"> vs last month</span>
                        </p>
                    )}
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                    <Icon className="w-8 h-8 text-blue-500" />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
