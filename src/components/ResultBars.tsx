import { useEffect, useState } from "react";
import { Banknote, Skull } from "lucide-react";

interface ResultBarsProps {
  netSalary: number;
  totalCost: number;
}

export function ResultBars({ netSalary, totalCost }: ResultBarsProps) {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [netSalary, totalCost]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const maxValue = totalCost;
  const netPercentage = (netSalary / maxValue) * 100;
  const costPercentage = 100;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-black uppercase mb-2">
          La Cruda Realidad
        </h3>
        <p className="text-muted-foreground">
          Tu salario neto es solo la punta del iceberg
        </p>
      </div>

      {/* Your Net Salary Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" />
            <span className="uppercase text-sm font-bold tracking-wider">Lo que tú ves</span>
          </div>
          <span className="font-mono text-2xl md:text-3xl neon-text-green animate-pulse-neon">
            {formatCurrency(netSalary)}
          </span>
        </div>
        <div className="h-12 md:h-16 bg-muted/30 border-2 border-border overflow-hidden">
          <div
            className={`h-full bar-green transition-all duration-1000 ease-out ${
              animated ? "" : "w-0"
            }`}
            style={{ width: animated ? `${netPercentage}%` : "0%" }}
          />
        </div>
      </div>

      {/* Total Boss Cost Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skull className="w-5 h-5 text-destructive" />
            <span className="uppercase text-sm font-bold tracking-wider">Lo que paga tu jefe</span>
          </div>
          <span className="font-mono text-2xl md:text-3xl neon-text-red animate-pulse-neon">
            {formatCurrency(totalCost)}
          </span>
        </div>
        <div className="h-20 md:h-24 bg-muted/30 border-2 border-destructive overflow-hidden">
          <div
            className={`h-full bar-red transition-all duration-1000 ease-out delay-300 ${
              animated ? "" : "w-0"
            }`}
            style={{ width: animated ? `${costPercentage}%` : "0%" }}
          />
        </div>
      </div>

      {/* Multiplier Badge */}
      <div className="text-center pt-4">
        <div className="inline-block brutalist-box border-destructive p-4">
          <span className="text-muted-foreground text-sm uppercase">Multiplicador del dolor</span>
          <div className="font-mono text-4xl md:text-5xl font-bold neon-text-red">
            x{(totalCost / netSalary).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
