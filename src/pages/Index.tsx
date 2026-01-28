import { useState, useEffect } from "react";
import { Calculator, TrendingDown, Building2, HardHat, Truck, Zap } from "lucide-react";
import { ResultBars } from "@/components/ResultBars";
import { CostBreakdown } from "@/components/CostBreakdown";
import { CTAButtons } from "@/components/CTAButtons";

const SECTOR_RISKS = [
  { id: "office", label: "Oficina", rate: 0.015, icon: Building2 },
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
  vacationsHolidays: 0.12,
  operatingCosts: 2500,
  absentismRisk: 0.03,
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
  
  const irpfRate = grossSalary > 60000 ? 0.37 : grossSalary > 35000 ? 0.30 : grossSalary > 20000 ? 0.24 : 0.19;
  const employeeSS = grossSalary * 0.0635;
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

const Index = () => {
  const [salary, setSalary] = useState<string>("35000");
  const [sectorId, setSectorId] = useState<string>("office");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const selectedSector = SECTOR_RISKS.find(s => s.id === sectorId) || SECTOR_RISKS[0];

  useEffect(() => {
    const numericSalary = parseFloat(salary.replace(/[^\d]/g, "")) || 0;
    if (numericSalary > 0) {
      setResult(calculateCosts(numericSalary, selectedSector.rate));
    } else {
      setResult(null);
    }
  }, [salary, selectedSector]);

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    setSalary(value);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b-4 border-border py-12 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border-2 border-primary mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-widest font-bold text-primary">
                Actualizado 2026
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-none mb-6 glitch-text">
              ¿Cuánto le{" "}
              <span className="neon-text-red">cuesto</span>
              <br />a mi jefe?
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre la <span className="text-foreground font-bold">cruda realidad</span> de lo que
              realmente cuesta tenerte en nómina. Spoiler: no es bonito.
            </p>
          </div>
        </div>
      </header>

      {/* Calculator Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="brutalist-box p-6 md:p-8">
              <label className="block text-sm uppercase tracking-widest text-muted-foreground mb-4">
                <Calculator className="inline-block w-4 h-4 mr-2" />
                Tu Salario Bruto Anual
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={salary ? parseInt(salary).toLocaleString("es-ES") : ""}
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
                  Factor Pupas <span className="text-xs">(Riesgo Sectorial)</span>
                </label>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {SECTOR_RISKS.map((sector) => {
                    const Icon = sector.icon;
                    return (
                      <button
                        key={sector.id}
                        onClick={() => setSectorId(sector.id)}
                        className={`p-3 md:p-4 border-2 transition-all text-center ${
                          sectorId === sector.id
                            ? "border-primary bg-primary/10 neon-border-green"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <Icon className={`w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 ${
                          sectorId === sector.id ? "text-primary" : "text-muted-foreground"
                        }`} />
                        <div className="font-bold text-xs md:text-sm">{sector.label}</div>
                        <div className="font-mono text-primary text-sm md:text-lg">
                          {(sector.rate * 100).toFixed(1)}%
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <>
          <section className="py-12 md:py-16 border-t-4 border-border">
            <div className="container">
              <div className="max-w-3xl mx-auto">
                <ResultBars
                  netSalary={result.estimatedNet}
                  totalCost={result.totalBossCost}
                />
              </div>
            </div>
          </section>

          {/* Breakdown Section */}
          <section className="py-12 md:py-16 border-t-4 border-border bg-card/50">
            <div className="container">
              <div className="max-w-3xl mx-auto">
                <CostBreakdown
                  contingenciasComunes={result.contingenciasComunes}
                  desempleo={result.desempleo}
                  fogasa={result.fogasa}
                  formacionProf={result.formacionProf}
                  meei={result.meei}
                  sectorRisk={result.sectorRisk}
                  vacationsCost={result.vacationsCost}
                  operatingCosts={result.operatingCosts}
                  absentismCost={result.absentismCost}
                  totalSS={result.totalSS}
                  totalHiddenCosts={result.totalHiddenCosts}
                />
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-16 border-t-4 border-border">
            <div className="container">
              <div className="max-w-3xl mx-auto">
                <CTAButtons
                  netSalary={result.estimatedNet}
                  totalCost={result.totalBossCost}
                  grossSalary={result.grossSalary}
                />
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="py-8 border-t-4 border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs text-muted-foreground">
              * Cálculos basados en proyecciones fiscales 2026. Esto no es asesoramiento fiscal.
              <br />
              Si tu jefe se enfada, no es culpa nuestra.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Hecho con <span className="neon-text-red">💔</span> y mucho IRPF
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
