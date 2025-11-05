import { Clock } from "lucide-react";
import { useTrafficPredictions } from "@/hooks/useTrafficData";

interface TimeBlock {
  hour: string;
  level: 'low' | 'medium' | 'high';
  event?: string;
  loadPercent: number;
}

interface PredictionsTimelineProps {
  currentHour: number;
}

const PredictionsTimeline = ({ currentHour }: PredictionsTimelineProps) => {
  const { data: predictionsData, loading } = useTrafficPredictions(4);

  const formatHour = (hour: number) => {
    const h = hour % 24;
    return `${h.toString().padStart(2, '0')}:00`;
  };

  const getEvent = (hour: number) => {
    const h = hour % 24;
    if (h >= 7 && h < 10) return 'Morning Rush';
    if (h >= 12 && h < 14) return 'Lunch Time';
    if (h >= 17 && h < 20) return 'Evening Rush';
    return undefined;
  };

  let timeBlocks: TimeBlock[] = [];

  if (loading || !predictionsData) {
    // Fallback while loading
    timeBlocks = [
      { hour: formatHour(currentHour), level: 'medium', event: 'Current', loadPercent: 50 },
      { hour: formatHour(currentHour + 1), level: 'medium', event: getEvent(currentHour + 1), loadPercent: 60 },
      { hour: formatHour(currentHour + 2), level: 'medium', event: getEvent(currentHour + 2), loadPercent: 65 },
      { hour: formatHour(currentHour + 3), level: 'medium', event: getEvent(currentHour + 3), loadPercent: 55 },
      { hour: formatHour(currentHour + 4), level: 'medium', event: getEvent(currentHour + 4), loadPercent: 45 },
    ];
  } else {
    // Use real predictions
    timeBlocks = [
      {
        hour: formatHour(currentHour),
        level: 'medium',
        event: 'Current',
        loadPercent: predictionsData.predictions[0]?.avg_city_load_percent || 50
      },
      ...predictionsData.predictions.slice(0, 4).map((pred, i) => {
        const h = pred.hour;
        const load = pred.avg_city_load_percent;
        let level: 'low' | 'medium' | 'high' = 'medium';
        if (load < 50) level = 'low';
        else if (load > 75) level = 'high';

        return {
          hour: formatHour(h),
          level,
          event: getEvent(h),
          loadPercent: load
        };
      })
    ];
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-success';
      case 'medium': return 'bg-warning';
      case 'high': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getLevelLabel = (level: string, loadPercent: number) => {
    const percent = `${loadPercent.toFixed(0)}%`;
    switch (level) {
      case 'low': return `Light Traffic (${percent})`;
      case 'medium': return `Moderate Traffic (${percent})`;
      case 'high': return `Heavy Congestion (${percent})`;
      default: return `Unknown (${percent})`;
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔮</span>
        <h3 className="text-lg font-semibold text-foreground">Next 4 Hours Forecast</h3>
        {loading && (
          <span className="text-xs text-muted-foreground">(loading...)</span>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {timeBlocks.slice(0, 5).map((block, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Time Label */}
            <div className="w-24">
              <div className="flex items-center gap-1">
                {index === 0 && <Clock className="w-3 h-3 text-primary" />}
                <span className="text-sm font-mono text-foreground">{block.hour}</span>
              </div>
              {block.event && (
                <span className="text-xs text-muted-foreground">{block.event}</span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="flex-1">
              <div className="h-10 rounded-lg overflow-hidden bg-background-elevated border border-primary/10 relative group">
                <div
                  className={`h-full ${getLevelColor(block.level)} transition-all duration-500 relative`}
                  style={{ width: '100%' }}
                >
                  {/* Animated Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {/* Level Label */}
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {getLevelLabel(block.level, block.loadPercent)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="pt-4 border-t border-primary/10 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <span className="text-muted-foreground">&lt;50%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning"></div>
          <span className="text-muted-foreground">50-75%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive"></div>
          <span className="text-muted-foreground">&gt;75%</span>
        </div>
      </div>
    </div>
  );
};

export default PredictionsTimeline;
