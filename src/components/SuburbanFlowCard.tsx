import { ArrowRight } from "lucide-react";

interface Suburb {
  id: string;
  name: string;
  name_en: string;
  population: number;
  daily_inflow: number;
  distance_km: number;
  current_flow: number;
  flow_coefficient: number;
  flow_percent: number;
  status: string;
}

interface SuburbanFlowCardProps {
  suburbs: Suburb[];
}

const SuburbanFlowCard = ({ suburbs }: SuburbanFlowCardProps) => {
  const totalVehicles = suburbs.reduce((sum, s) => sum + s.daily_inflow, 0);
  const currentTotal = suburbs.reduce((sum, s) => sum + s.current_flow, 0);

  const getGradientColor = (flowPercent: number) => {
    if (flowPercent > 150) return 'from-destructive/50 to-destructive';
    if (flowPercent > 100) return 'from-warning/50 to-warning';
    return 'from-success/50 to-success';
  };

  const getTrendIcon = (flowCoef: number) => {
    if (flowCoef > 1.5) return '↑';
    if (flowCoef < 0.8) return '↓';
    return '→';
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      high: 'bg-warning/20 text-warning border-warning/30',
      normal: 'bg-success/20 text-success border-success/30',
      low: 'bg-muted/20 text-muted-foreground border-muted/30',
    };
    return badges[status] || badges.normal;
  };

  // Find next peak time (morning 6-9 or evening 17-20)
  const now = new Date();
  const currentHour = now.getHours();
  let nextPeakHour = 0;
  if (currentHour < 6) nextPeakHour = 6;
  else if (currentHour < 17) nextPeakHour = 17;
  else nextPeakHour = 6 + 24; // next day morning

  const hoursUntilPeak = nextPeakHour > 24 ? nextPeakHour - currentHour - 24 : nextPeakHour - currentHour;
  const minutesUntilPeak = hoursUntilPeak * 60 - now.getMinutes();

  // Sort by current flow (descending)
  const sortedSuburbs = [...suburbs].sort((a, b) => b.current_flow - a.current_flow);

  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚙</span>
          <h3 className="text-lg font-semibold text-foreground">Поток транспорта из пригорода</h3>
        </div>
        {minutesUntilPeak > 0 && minutesUntilPeak < 180 && (
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge('high')}`}>
            Peak in {minutesUntilPeak < 60 ? `${minutesUntilPeak} min` : `${Math.round(minutesUntilPeak / 60)}h`}
          </div>
        )}
      </div>

      {/* Suburb Bars */}
      <div className="space-y-3">
        {sortedSuburbs.map((suburb, index) => {
          const intensity = Math.min(100, (suburb.flow_percent / 2)); // Scale to 0-100

          return (
            <div key={suburb.id} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">{suburb.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {getTrendIcon(suburb.flow_coefficient)}
                  </span>
                  <span className="font-mono text-sm text-primary">{suburb.current_flow.toLocaleString()}/h</span>
                </div>
              </div>
              <div className="relative h-2 bg-background-elevated rounded-full overflow-hidden">
                {/* Animated Flow */}
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getGradientColor(suburb.flow_percent)} rounded-full transition-all duration-500 group-hover:shadow-lg`}
                  style={{ width: `${intensity}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
                {/* Flow Direction Arrow */}
                <ArrowRight className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-70" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Footer */}
      <div className="pt-4 border-t border-primary/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Текущий поток транспорта</span>
          <span className="text-lg font-bold font-mono text-primary">{currentTotal.toLocaleString()}/h</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Прогноз на день</span>
          <span className="text-lg font-bold font-mono text-primary">{totalVehicles.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SuburbanFlowCard;
