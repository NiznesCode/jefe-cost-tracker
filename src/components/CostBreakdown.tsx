import { 
  HandCoins, 
  Umbrella, 
  Shield, 
  GraduationCap, 
  Heart,
  Palmtree,
  Monitor,
  Thermometer
} from "lucide-react";

interface CostItem {
  id: string;
  label: string;
  description: string;
  amount: number;
  icon: React.ElementType;
  isDestructive?: boolean;
}

interface CostBreakdownProps {
  contingenciasComunes: number;
  desempleo: number;
  fogasa: number;
  formacionProf: number;
  meei: number;
  sectorRisk: number;
  vacationsCost: number;
  operatingCosts: number;
  absentismCost: number;
  totalSS: number;
  totalHiddenCosts: number;
}

export function CostBreakdown(props: CostBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const ssCosts: CostItem[] = [
    {
      id: "contingencias",
      label: "Contingencias Comunes",
      description: "Por si te pones malo o te jubilas (spoiler: tarde)",
      amount: props.contingenciasComunes,
      icon: Heart,
      isDestructive: true,
    },
    {
      id: "desempleo",
      label: "Desempleo",
      description: "El colchón para cuando te despidan",
      amount: props.desempleo,
      icon: Umbrella,
      isDestructive: true,
    },
    {
      id: "fogasa",
      label: "FOGASA",
      description: "Fondo de Garantía Salarial (por si tu empresa quiebra)",
      amount: props.fogasa,
      icon: Shield,
      isDestructive: true,
    },
    {
      id: "formacion",
      label: "Formación Profesional",
      description: "Para cursos que probablemente nunca harás",
      amount: props.formacionProf,
      icon: GraduationCap,
      isDestructive: true,
    },
    {
      id: "meei",
      label: "MEEI (Mecanismo de Equidad)",
      description: "El nuevo impuesto 'solidario' de 2026",
      amount: props.meei,
      icon: HandCoins,
      isDestructive: true,
    },
    {
      id: "sectorial",
      label: "Contingencias Profesionales",
      description: "Riesgo del sector (accidentes laborales)",
      amount: props.sectorRisk,
      icon: Thermometer,
      isDestructive: true,
    },
  ];

  const hiddenCosts: CostItem[] = [
    {
      id: "vacaciones",
      label: "Vacaciones y Festivos",
      description: "Te paga por estar en la playita (30 días + festivos)",
      amount: props.vacationsCost,
      icon: Palmtree,
    },
    {
      id: "oficina",
      label: "Gastos Operativos",
      description: "Tu silla rota, el PC lento, las licencias de software...",
      amount: props.operatingCosts,
      icon: Monitor,
    },
    {
      id: "absentismo",
      label: "Provisión Bajas",
      description: "Reserva por si te da la gripe o el lumbago",
      amount: props.absentismCost,
      icon: Thermometer,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="text-center">
        <h3 className="text-3xl md:text-4xl font-black uppercase mb-2 glitch-text">
          El Desglose del <span className="neon-text-red">Robo</span>
        </h3>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Cada euro que sale del bolsillo de tu jefe antes de que tú veas un céntimo
        </p>
      </div>

      {/* Social Security Costs */}
      <div className="brutalist-box p-6">
        <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
          <h4 className="text-xl font-black uppercase">
            Seguridad Social <span className="text-muted-foreground text-sm">(Empresa)</span>
          </h4>
          <span className="font-mono text-2xl neon-text-red">{formatCurrency(props.totalSS)}</span>
        </div>
        <div className="space-y-4">
          {ssCosts.map((cost, index) => {
            const Icon = cost.icon;
            return (
              <div
                key={cost.id}
                className="flex items-start gap-4 p-3 bg-muted/20 border-l-4 border-destructive animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-2 bg-destructive/20">
                  <Icon className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm uppercase">{cost.label}</span>
                    <span className="font-mono text-lg text-destructive shrink-0">
                      {formatCurrency(cost.amount)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{cost.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hidden Costs */}
      <div className="brutalist-box p-6 border-primary">
        <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
          <h4 className="text-xl font-black uppercase">
            Costes Ocultos <span className="text-muted-foreground text-sm">(Los que nadie cuenta)</span>
          </h4>
          <span className="font-mono text-2xl neon-text-green">{formatCurrency(props.totalHiddenCosts)}</span>
        </div>
        <div className="space-y-4">
          {hiddenCosts.map((cost, index) => {
            const Icon = cost.icon;
            return (
              <div
                key={cost.id}
                className="flex items-start gap-4 p-3 bg-primary/5 border-l-4 border-primary animate-slide-in"
                style={{ animationDelay: `${(index + ssCosts.length) * 100}ms` }}
              >
                <div className="p-2 bg-primary/20">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm uppercase">{cost.label}</span>
                    <span className="font-mono text-lg text-primary shrink-0">
                      {formatCurrency(cost.amount)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{cost.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
