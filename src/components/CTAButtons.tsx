import { FileDown, Share2, PartyPopper } from "lucide-react";
import { toast } from "sonner";

interface CTAButtonsProps {
  netSalary: number;
  totalCost: number;
  grossSalary: number;
}

export function CTAButtons({ netSalary, totalCost, grossSalary }: CTAButtonsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleDownloadArguments = () => {
    const multiplier = (totalCost / netSalary).toFixed(2);
    const argumentText = `
╔══════════════════════════════════════════════════════════════╗
║     ARGUMENTARIO PARA TU SUBIDA DE SUELDO - 2026            ║
╚══════════════════════════════════════════════════════════════╝

📊 DATOS DE TU COSTE REAL:

Salario Bruto Anual: ${formatCurrency(grossSalary)}
Tu Salario Neto Estimado: ${formatCurrency(netSalary)}
Coste REAL para la empresa: ${formatCurrency(totalCost)}

📈 MULTIPLICADOR: x${multiplier}
Por cada euro que tú ves, la empresa paga ${multiplier}€

═══════════════════════════════════════════════════════════════

🎯 ARGUMENTOS PARA LA NEGOCIACIÓN:

1. "Mi coste real para la empresa es ${formatCurrency(totalCost)}, 
   no los ${formatCurrency(grossSalary)} que aparecen en mi nómina."

2. "Un aumento del 10% en mi bruto (${formatCurrency(grossSalary * 0.1)})
   representa solo un ${((grossSalary * 0.1 / totalCost) * 100).toFixed(1)}% 
   de aumento en mi coste total."

3. "Considerando la inflación y el aumento de cotizaciones de 2026,
   mantener mi poder adquisitivo requiere una revisión salarial."

4. "Los costes ocultos (vacaciones, equipamiento, bajas) ya están
   presupuestados. Mi aumento no los incrementa proporcionalmente."

═══════════════════════════════════════════════════════════════

💡 CONSEJO FINAL:
No negocies tu neto, negocia tu bruto. 
El neto es lo que queda después del saqueo.

Generado en: cuantolecuestoamijefe.com
Fecha: ${new Date().toLocaleDateString('es-ES')}
    `;

    const blob = new Blob([argumentText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "argumentario-subida-sueldo.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("¡Argumentario descargado!", {
      description: "Ahora ve y pide ese aumento con datos reales.",
    });
  };

  const handleShare = () => {
    const text = `🤯 Descubrí que cobro ${formatCurrency(netSalary)}/año pero le cuesto a mi jefe ${formatCurrency(totalCost)}. Multiplicador del dolor: x${(totalCost / netSalary).toFixed(2)} 

Calcula el tuyo: `;
    
    if (navigator.share) {
      navigator.share({
        title: "¿Cuánto le cuesto a mi jefe?",
        text: text,
        url: window.location.href,
      }).catch(() => {
        copyToClipboard(text);
      });
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text + window.location.href);
    toast.success("¡Copiado al portapapeles!", {
      description: "Ahora pégalo donde quieras llorar públicamente.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-black uppercase mb-2">
          ¿Y Ahora Qué?
        </h3>
        <p className="text-muted-foreground">
          Tienes los datos. Úsalos sabiamente (o no).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Download Button */}
        <button
          onClick={handleDownloadArguments}
          className="group relative p-6 border-4 border-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-left overflow-hidden"
        >
          <div className="relative z-10">
            <FileDown className="w-8 h-8 mb-3 text-primary group-hover:text-primary-foreground transition-colors" />
            <div className="font-black uppercase text-lg mb-1">
              Descargar Argumentario
            </div>
            <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">
              Para tu próxima negociación de aumento
            </p>
          </div>
          <div className="absolute inset-0 bg-primary transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 -z-0" />
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="group relative p-6 border-4 border-destructive bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 text-left overflow-hidden"
        >
          <div className="relative z-10">
            <Share2 className="w-8 h-8 mb-3 text-destructive group-hover:text-destructive-foreground transition-colors" />
            <div className="font-black uppercase text-lg mb-1">
              Llorar en la Oficina
            </div>
            <p className="text-sm text-muted-foreground group-hover:text-destructive-foreground/80 transition-colors">
              Comparte tu dolor en redes sociales
            </p>
          </div>
          <div className="absolute inset-0 bg-destructive transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 -z-0" />
        </button>
      </div>

      {/* Easter egg */}
      <div className="text-center pt-4">
        <button
          onClick={() => toast("🎉 ¡Ánimo! Al menos tienes trabajo...", {
            description: "Que no es poco en estos tiempos.",
            icon: <PartyPopper className="w-5 h-5" />,
          })}
          className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          o simplemente aceptar mi destino fiscal
        </button>
      </div>
    </div>
  );
}
