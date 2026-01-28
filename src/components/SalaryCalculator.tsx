import { useState, useEffect } from "react";
import { Calculator, TrendingDown, Building2, HardHat, Truck } from "lucide-react";

const SECTOR_RISKS = [
  { id: "office", label: "Oficina (IT, Admin...)", rate: 0.015, icon: Building2 },
  { id: "construction", label: "Construcción", rate: 0.067, icon: HardHat },
  { id: "transport", label: "Transporte", rate: 0.037, icon: Truck },
];

// 2026 Spanish Social Security rates (employer share)
const SS_RATES = {
  contingenciasComunes: 0.2360,
  desempleo: 0.0550,
  fogasa: 0.0020,
  formacionProf: 0.0060,
  meei: 0.0075,
};

// Hidden costs
const HIDDEN_COSTS = {
  vacationsHolidays: 0.12, // 12% inactive time
  operatingCosts: 2500, // Fixed annual
  absentismRisk: 0.03, // 3% provision
};

interface CalculationResult {
  grossSalary: number;
  sectorRisk: number;
  contingenciasComunes: number;
  desempleo: number;
  fogasa: number;
  formacionProf: number;
  meei: number;
  totalSS: number;
  vacationsCost: number;
  operatingCosts: number;
  absentismCost: number;
  totalHiddenCosts: number;
  totalBossCost: number;
  estimatedNet: number;
}

function calculateCosts(grossSalary: number, sectorRiskRate: number): CalculationResult {
  const sectorRisk = grossSalary * sectorRiskRate;
  const contingenciasComunes = grossSalary * SS_RATES.contingenciasComunes;
  const desempleo = grossSalary * SS_RATES.desempleo;
  const fogasa = grossSalary * SS_RATES.fogasa;
  const formacionProf = grossSalary * SS_RATES.formacionProf;
  const meei = grossSalary * SS_RATES.meei;
  
  const totalSS = sectorRisk + contingenciasComunes + desempleo + fogasa + formacionProf + meei;
  
  const vacationsCost = grossSalary * HIDDEN_COSTS.vacationsHolidays;
  const operatingCosts = HIDDEN_COSTS.operatingCosts;
  const absentismCost = grossSalary * HIDDEN_COSTS.absentismRisk;
  
  const totalHiddenCosts = vacationsCost + operatingCosts + absentismCost;
  const totalBossCost = grossSalary + totalSS + totalHiddenCosts;
  
  // Rough net estimate (simplified IRPF calculation)
  const irpfRate = grossSalary > 60000 ? 0.37 : grossSalary > 35000 ? 0.30 : grossSalary > 20000 ? 0.24 : 0.19;
  const employeeSS = grossSalary * 0.0635; // Employee SS contribution
  const estimatedNet = grossSalary - (grossSalary * irpfRate) - employeeSS;
  
  return {
    grossSalary,
    sectorRisk,
    contingenciasComunes,
    desempleo,
    fogasa,
    formacionProf,
    meei,
    totalSS,
    vacationsCost,
    operatingCosts,
    absentismCost,
    totalHiddenCosts,
    totalBossCost,
    estimatedNet,
  };
}

export function SalaryCalculator() {
  const [salary, setSalary] = useState<string>("35000");
  const [sectorId, setSectorId] = useState<string>("office");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);

  const selectedSector = SECTOR_RISKS.find(s => s.id === sectorId) || SECTOR_RISKS[0];

  useEffect(() => {
    const numericSalary = parseFloat(salary.replace(/[^\d]/g, "")) || 0;
    if (numericSalary > 0) {
      const calculated = calculateCosts(numericSalary, selectedSector.rate);
      setResult(calculated);
      setIsCalculated(true);
    } else {
      setResult(null);
      setIsCalculated(false);
    }
  }, [salary, selectedSector]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    setSalary(value);
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="brutalist-box p-6 md:p-8">
        <label className="block text-sm uppercase tracking-widest text-muted-foreground mb-4">
          <Calculator className="inline-block w-4 h-4 mr-2" />
          Salario Bruto Anual
        </label>
        <div className="relative">
          <input
            type="text"
            value={salary ? `${parseInt(salary).toLocaleString("es-ES")}` : ""}
            onChange={handleSalaryChange}
            placeholder="35.000"
            className="brutalist-input"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl md:text-4xl font-mono text-muted-foreground">
            €
          </span>
        </div>
        
        {/* Sector Risk Selector */}
        <div className="mt-6">
          <label className="block text-sm uppercase tracking-widest text-muted-foreground mb-3">
            <TrendingDown className="inline-block w-4 h-4 mr-2" />
            Factor Pupas (Riesgo Sectorial)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SECTOR_RISKS.map((sector) => {
              const Icon = sector.icon;
              return (
                <button
                  key={sector.id}
                  onClick={() => setSectorId(sector.id)}
                  className={`p-4 border-2 transition-all text-left ${
                    sectorId === sector.id
                      ? "border-primary bg-primary/10 neon-border-green"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${sectorId === sector.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="font-bold text-sm">{sector.label}</div>
                  <div className="font-mono text-primary text-lg">{(sector.rate * 100).toFixed(1)}%</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
