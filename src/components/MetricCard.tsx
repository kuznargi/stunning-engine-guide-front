import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  icon: string;
  value: string | number;
  label: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'destructive';
  };
  subtext?: string;
}

const MetricCard = ({ icon, value, label, trend, badge, subtext }: MetricCardProps) => {
  const badgeColors = {
    success: 'bg-success/20 text-success border-success/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    destructive: 'bg-destructive/20 text-destructive border-destructive/30',
  };

  return (
    <div className="glass-card rounded-xl p-6 hover-lift cursor-pointer group relative overflow-hidden">
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        {/* Icon & Badge Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          {badge && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badgeColors[badge.variant]}`}>
              {badge.text}
            </span>
          )}
        </div>

        {/* Main Value */}
        <div className="mb-2">
          <div className="text-3xl font-bold font-mono text-primary mb-1">
            {value}
          </div>
          <div className="text-sm text-muted-foreground">
            {label}
          </div>
        </div>

        {/* Trend or Subtext */}
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trend.value}</span>
          </div>
        )}

        {subtext && (
          <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <span>≈</span>
            <span>{subtext}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
