import Header from "@/components/Header";
import MetricCard from "@/components/MetricCard";
import SuburbanFlowCard from "@/components/SuburbanFlowCard";
import BridgeMonitorCard from "@/components/BridgeMonitorCard";
import PredictionsTimeline from "@/components/PredictionsTimeline";
import AIAssistant from "@/components/AIAssistant";
import TrafficMap from "@/components/TrafficMap";
import { useTrafficData } from "@/hooks/useTrafficData";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: trafficData, loading, error } = useTrafficData(true, 30000);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading traffic data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground">Connection Error</h2>
          <p className="text-muted-foreground">
            Failed to connect to backend API. Make sure the server is running on https://ai-guide-py50.onrender.com
          </p>
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (!trafficData) return null;

  // Calculate problem areas (heavy or jam status)
  const problemAreas = trafficData.roads.filter(
    road => road.traffic.status === 'heavy' || road.traffic.status === 'jam'
  ).length;

  // Calculate CO2 reduction compared to theoretical max
  const co2ReductionPercent = ((1 - (trafficData.eco_impact.co2_emissions_kg_per_hour / 20000)) * 100).toFixed(1);
  const treesEquivalent = Math.round(trafficData.eco_impact.co2_emissions_kg_per_hour / 22); // 1 tree absorbs ~22kg CO2/year

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content - Below Header */}
      <main className="pt-16 h-screen overflow-hidden">
        <div className="h-full flex gap-4 p-4">
          {/* Left Side - Map (65%) */}
          <div className="w-[65%] h-full">
            <TrafficMap trafficData={trafficData} />
          </div>

          {/* Right Side - Data Panel (35%) */}
          <div className="w-[35%] h-full overflow-y-auto custom-scrollbar space-y-4 pr-2">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 gap-4">
              <MetricCard
                icon="🚗"
                value={trafficData.total_vehicles_on_roads.toLocaleString()}
                label="Транспортные средства сейчас"
                trend={{
                  value: `${trafficData.avg_city_load_percent.toFixed(1)}% capacity`,
                  isPositive: trafficData.avg_city_load_percent < 70
                }}
              />
              <MetricCard
                icon="⚠️"
                value={problemAreas}
                label="Проблемные участки"
                badge={{
                }}
              />
              {
//               <MetricCard
//                 icon="🌱"
//                 value={`${co2ReductionPercent}%`}
//                 label="Энергоэффективность по выбросам CO₂"
//                 badge={{
//                   text: Number(co2ReductionPercent) > 0 ? "Good" : "Poor",
//                   variant: Number(co2ReductionPercent) > 0 ? "success" : "warning"
//                 }}
//                 subtext={`≈${treesEquivalent} деревьев в час`}
//               />
              }
            </div>

            {/* Suburban Flow */}
            <SuburbanFlowCard suburbs={trafficData.suburbs} />

            {/* Bridge Monitor */}
            <BridgeMonitorCard bridges={trafficData.bridges} />

            {/* Predictions */}
           {/* <PredictionsTimeline currentHour={trafficData.hour} /> */}
          </div>
        </div>
      </main>

      {/* AI Assistant - Floating */}
      <AIAssistant />
    </div>
  );
};

export default Index;
