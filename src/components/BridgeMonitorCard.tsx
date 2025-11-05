import { ArrowUpDown } from "lucide-react";

interface Bridge {
  id: string;
  name: string;
  name_en: string;
  type: string;
  capacity: number;
  lanes: number;
  length_km: number;
  status: string;
  year_built: number;
  traffic: {
    current_vehicles: number;
    load_percent: number;
    status: string;
    color: string;
  };
}

interface BridgeMonitorCardProps {
  bridges: Bridge[];
}

const BridgeMonitorCard = ({ bridges }: BridgeMonitorCardProps) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'free': return 'text-success border-success bg-success/20';
      case 'moderate': return 'text-warning border-warning bg-warning/20';
      case 'heavy': return 'text-destructive border-destructive bg-destructive/20';
      case 'jam': return 'text-destructive border-destructive bg-destructive/30';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'free': return '✓ Оптимальный';
      case 'moderate': return '⚠ Средний';
      case 'heavy': return '⚠ Плотный';
      case 'jam': return '✕ Избегать';
      default: return status;
    }
  };

  const getCapacityColor = (loadPercent: number) => {
    if (loadPercent > 90) return 'bg-destructive';
    if (loadPercent > 70) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🌉</span>
        <h3 className="text-lg font-semibold text-foreground">Статус моста</h3>
      </div>

      {/* Bridge Cards */}
      <div className="space-y-4">
        {bridges.map((bridge) => {
          const vehiclesPerMin = Math.round(bridge.traffic.current_vehicles / 60);

          return (
            <div
              key={bridge.id}
              className="p-4 rounded-lg bg-background-elevated/50 border border-primary/10 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{bridge.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ArrowUpDown className="w-3 h-3" />
                    <span>{bridge.lanes} дорожные полосы • {bridge.length_km}km</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(bridge.traffic.status)}`}>
                  {getStatusLabel(bridge.traffic.status)}
                </span>
              </div>

              {/* Capacity Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Capacity</span>
                  <span className="text-xs font-mono text-foreground">{bridge.traffic.load_percent.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getCapacityColor(bridge.traffic.load_percent)} transition-all duration-300 relative`}
                    style={{ width: `${Math.min(100, bridge.traffic.load_percent)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Vehicles Per Minute */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Поток транспорта в минуту</span>
                <span className="font-mono font-semibold text-primary">{vehiclesPerMin} </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BridgeMonitorCard;
