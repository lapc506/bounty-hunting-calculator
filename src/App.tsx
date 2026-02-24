import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, FileText, Coins, Zap, Cpu, MousePointer2, Plus, Trash2, Copy, Moon, Sun } from 'lucide-react';

interface Bounty {
  id: number;
  name: string;
  value: number;
  weeks: number;
  editingValue?: boolean;
  editingWeeks?: boolean;
}

interface ChartData {
  periodo: string;
  deuda: number;
  nominal: number;
}

const App = () => {
  const [isDark, setIsDark] = useState(true);
  const [markup, setMarkup] = useState(30); 
  const [monthlyInterest, setMonthlyInterest] = useState(1.5); // Ahora es Interés Mensual
  const [gracePeriodWeeks, setGracePeriodWeeks] = useState(24); // Plazo en semanas
  const [mode, setMode] = useState<'agentic' | 'manual'>('agentic');
  const [agenticEfficiency, setAgenticEfficiency] = useState(4); // x4 por defecto

  // Lista de Bounties Individuales (Ahora con duración en semanas)
  const [bounties, setBounties] = useState<Bounty[]>([
    { id: 1, name: "Arquitectura & CI/CD", value: 1200, weeks: 1 },
    { id: 2, name: "Auth & Gestión de Usuarios", value: 800, weeks: 1.5 },
    { id: 3, name: "Core Engine (MVP)", value: 2500, weeks: 3 },
    { id: 4, name: "Dashboard & Analytics", value: 1500, weeks: 2 },
    { id: 5, name: "Integración de Pagos", value: 1200, weeks: 1.5 }
  ]);

  const [newBountyName, setNewBountyName] = useState("");
  const [newBountyValue, setNewBountyValue] = useState(1000);
  const [newBountyWeeks, setNewBountyWeeks] = useState(2);

  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const addBounty = () => {
    if (newBountyName) {
      setBounties([...bounties, { id: Date.now(), name: newBountyName, value: newBountyValue, weeks: newBountyWeeks }]);
      setNewBountyName("");
    }
  };

  const removeBounty = (id: number) => setBounties(bounties.filter(b => b.id !== id));

  const updateBountyValue = (id: number, newValue: number) => {
    setBounties(bounties.map(b => b.id === id ? { ...b, value: newValue } : b));
  };

  const updateBountyWeeks = (id: number, newWeeks: number) => {
    setBounties(bounties.map(b => b.id === id ? { ...b, weeks: newWeeks } : b));
  };

  const toggleEditValue = (id: number) => {
    setBounties(bounties.map(b => b.id === id ? { ...b, editingValue: !b.editingValue } : b));
  };

  const toggleEditWeeks = (id: number) => {
    setBounties(bounties.map(b => b.id === id ? { ...b, editingWeeks: !b.editingWeeks } : b));
  };

  useEffect(() => {
    const newData: ChartData[] = [];
    const bountyMarkupFactor = (1 + markup / 100);

    // Calcular en qué semana se completa cada hito
    let cumulativeWeeks = 0;
    const effectiveBounties = bounties.map(b => {
      // Si estamos en modo agéntico, dividimos el tiempo que tomaría manualmente por la eficiencia
      const actualWeeks = mode === 'agentic' ? b.weeks / agenticEfficiency : b.weeks;
      cumulativeWeeks += actualWeeks;
      return { ...b, actualWeeks, completionWeek: cumulativeWeeks };
    });

    const totalProjectWeeks = cumulativeWeeks;
    // Graficar hasta que se acabe el proyecto o el periodo de gracia (lo que sea mayor)
    const maxWeeksToGraph = Math.max(gracePeriodWeeks, Math.ceil(totalProjectWeeks));

    for (let w = 0; w <= maxWeeksToGraph; w++) {
      let nominalCompleted = 0;
      let debtWithInterest = 0;

      effectiveBounties.forEach((b: any) => {
        // Si la semana actual es mayor o igual a la semana en que se completó el hito
        if (w >= b.completionWeek) {
          nominalCompleted += b.value;
          
          // Semanas transcurridas desde que se entregó el PR
          const weeksPassed = w - b.completionWeek;
          
          const baseDebt = b.value * bountyMarkupFactor;
          
          // Interés compuesto semanal (aproximando el mensual pactado: tasa mensual / 4.33 semanas)
          const weeklyInterestRate = (monthlyInterest / 100) / 4.33;
          debtWithInterest += baseDebt * Math.pow(1 + weeklyInterestRate, weeksPassed);
        }
      });
      
      newData.push({
        periodo: `Sem ${w}`,
        deuda: Math.round(debtWithInterest),
        nominal: Math.round(nominalCompleted)
      });
    }
    setData(newData);
  }, [bounties, markup, monthlyInterest, gracePeriodWeeks, mode, agenticEfficiency]);

  const nominalTotal = bounties.reduce((acc, b) => acc + b.value, 0);
  const manualTotalWeeks = bounties.reduce((acc, b) => acc + b.weeks, 0);
  const estimatedDeliveryWeeks = mode === 'agentic' ? (manualTotalWeeks / agenticEfficiency) : manualTotalWeeks;
  const finalDebt = data[data.length - 1]?.deuda || 0;

  const contractTemplates: Record<'manual' | 'agentic', string> = {
    manual: `## 1. OBJETO Y MODALIDAD "BOUNTY"
El presente acuerdo regula el desarrollo de software bajo la modalidad de Bounties Atómicos. Las partes acuerdan que el valor del servicio reside en la entrega de hitos funcionales verificables.

## 3. DEFINITION OF DONE (DoD) Y ACEPTACIÓN
Un Bounty se considerará Entregado y Devengado en el momento en que el Pull Request (PR) correspondiente sea aprobado y fusionado (merged) en la rama principal (main/master) del repositorio.

## 4. ESTRUCTURA FINANCIERA (PAGO DIFERIDO)
El HUNTER acepta diferir el cobro de sus servicios bajo las siguientes condiciones:
- Cada Bounty incluye un Markup de Riesgo del ${markup}% sobre el valor nominal
- A partir de la fecha de cierre de cada PR, el monto devengará un Interés Mensual del ${monthlyInterest}% sobre el saldo insoluto

## 5. NATURALEZA DE LA RELACIÓN Y EXCLUSIÓN DE EQUITY
El presente acuerdo es de naturaleza estrictamente comercial y civil. La contraprestación consiste exclusivamente en el pago de la suma monetaria acordada (Principal + Markup + Intereses). NO representa participación accionaria, opciones de compra ni planes de vesting.

## 6. COLATERAL Y PROPIEDAD INTELECTUAL
- Licencia de Uso: LA STARTUP tendrá licencia de uso completa sobre el código desde el momento del merge
- Transferencia de Titularidad: La propiedad intelectual se transferirá únicamente tras el pago total de la deuda acumulada

MODALIDAD: Artesanal | Duración Estimada: ${manualTotalWeeks} semanas | Deuda Total Proyectada: $${finalDebt.toLocaleString()} USD`,
    
    agentic: `## 1. OBJETO Y MODALIDAD "BOUNTY"
El presente acuerdo regula el desarrollo de software bajo la modalidad de Bounties Atómicos. Las partes acuerdan que el valor del servicio reside en la entrega de hitos funcionales verificables.

## 2. METODOLOGÍA Y STACK AGÉNTICO
EL HUNTER declara el uso de un Stack de Desarrollo Agéntico (IA Generativa, Orquestadores de Código y Agentes de Programación). Esta metodología permite una eficiencia proyectada de x${agenticEfficiency} sobre el desarrollo artesanal.

El costo de cada Bounty es fijo y se basa en el valor de mercado del entregable, independientemente de que el uso de IA reduzca drásticamente las semanas de ejecución.

## 3. DEFINITION OF DONE (DoD) Y ACEPTACIÓN
Un Bounty se considerará Entregado y Devengado en el momento en que el Pull Request (PR) correspondiente sea aprobado y fusionado (merged) en la rama principal (main/master) del repositorio.

## 4. ESTRUCTURA FINANCIERA (PAGO DIFERIDO)
El HUNTER acepta diferir el cobro de sus servicios bajo las siguientes condiciones:
- Cada Bounty incluye un Markup de Riesgo del ${markup}% sobre el valor nominal (compensa velocidad GTM y riesgo de crédito)
- A partir de la fecha de cierre de cada PR, el monto devengará un Interés Mensual del ${monthlyInterest}% sobre el saldo insoluto, capitalizado mensualmente

## 5. NATURALEZA DE LA RELACIÓN Y EXCLUSIÓN DE EQUITY
El presente acuerdo es de naturaleza estrictamente comercial y civil. La contraprestación consiste exclusivamente en el pago de la suma monetaria acordada (Principal + Markup + Intereses). NO representa participación accionaria, acciones fantasma, opciones de compra ni planes de vesting.

## 6. COLATERAL Y PROPIEDAD INTELECTUAL
- Licencia de Uso: LA STARTUP tendrá licencia de uso completa sobre el código desde el momento del merge
- Transferencia de Titularidad: La propiedad intelectual se transferirá únicamente tras el pago total de la deuda acumulada

MODALIDAD: Agéntica (HIGH-SPEED) | Duración Estimada: ${estimatedDeliveryWeeks.toFixed(1)} semanas | Ahorro: ${(manualTotalWeeks - estimatedDeliveryWeeks).toFixed(1)} semanas vs Artesanal | Deuda Total Proyectada: $${finalDebt.toLocaleString()} USD`
  };

  const handleCopyContract = () => {
    const contractText = `CONTRATO DE SERVICIOS PROFESIONALES CON PAGO DIFERIDO

ENTRE: [TU NOMBRE] (El "Hunter") y [STARTUP] (La "Startup")

OBJETO: Desarrollo de ${bounties.length} hitos tecnológicos bajo modalidad de Bounty individual.

${contractTemplates[mode]}

TOTAL RECONOCIDO A FECHA DE CORTE (${gracePeriodWeeks} Semanas): $${finalDebt.toLocaleString()} USD.`;

    navigator.clipboard.writeText(contractText);
    alert('Contrato copiado al portapapeles');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-[#0f172a] text-[#e8f1ff]' : 'bg-[#f0f8ff] text-[#0f172a]'} p-4 md:p-8 font-sans transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <header className={`mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 ${isDark ? 'bg-[#1a2640] border-[#2d3f52]' : 'bg-white border-[#bae6fd]'} p-6 rounded-3xl shadow-sm border`}>
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-2 ${isDark ? 'text-[#e8f1ff]' : 'text-[#0f172a]'}`}>
              <Cpu className={mode === 'agentic' ? "text-purple-600" : "text-slate-500"} size={32} />
              Bounty Hunting Calculator
            </h1>
            <p className={`${isDark ? 'text-[#a8b8d0]' : 'text-[#64748b]'} mt-1`}>Valuación de bounties atómicos con pago diferido</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-xl transition-all ${isDark ? 'bg-[#263345] text-yellow-400 hover:bg-[#2d3f52]' : 'bg-[#e0f2fe] text-[#0f172a] hover:bg-[#bae6fd]'}`}
              title={isDark ? "Modo claro" : "Modo oscuro"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className={`flex p-1 ${isDark ? 'bg-[#263345] border-[#2d3f52]' : 'bg-[#e0f2fe] border-[#bae6fd]'} rounded-2xl w-fit border`}>
              <button onClick={() => setMode('manual')} className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all font-bold ${mode === 'manual' ? (isDark ? 'bg-[#3d4f63] text-white shadow-sm' : 'bg-white text-[#0f172a] shadow-sm') : (isDark ? 'text-[#a8b8d0]' : 'text-[#64748b]')}`}>
                <MousePointer2 size={16} /> Artesanal
              </button>
              <button onClick={() => setMode('agentic')} className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all font-bold ${mode === 'agentic' ? 'bg-[#7c5cef] text-white shadow-sm' : (isDark ? 'text-[#a8b8d0]' : 'text-[#64748b]')}`}>
                <Zap size={16} /> Agéntico
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Columna Izquierda: Gestión de Bounties */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`${isDark ? 'bg-[#1a2640] border-[#2d3f52]' : 'bg-white border-[#bae6fd]'} p-6 rounded-3xl shadow-sm border`}>
              <h3 className={`font-bold mb-4 flex items-center justify-between ${isDark ? 'text-[#e8f1ff]' : ''}`}>
                <span>Configuración del Pool</span>
                <Coins size={18} className="text-yellow-500" />
              </h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <input 
                    placeholder="Nombre del Bounty"
                    className={`w-full md:flex-1 p-2 text-sm rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-[#263345] border-[#2d3f52] text-[#e8f1ff]' : 'bg-[#f0f8ff] border-[#bae6fd]'} border`}
                    value={newBountyName}
                    onChange={(e) => setNewBountyName(e.target.value)}
                  />
                  <div className="flex gap-2 w-full md:w-auto">
                    <input 
                      type="number"
                      placeholder="USD"
                      title="Monto del hito en USD"
                      className={`w-24 p-2 text-sm rounded-lg ${isDark ? 'bg-[#263345] border-[#2d3f52] text-[#e8f1ff]' : 'bg-[#f0f8ff] border-[#bae6fd]'} border`}
                      value={newBountyValue}
                      onChange={(e) => setNewBountyValue(Number(e.target.value))}
                    />
                    <input 
                      type="number"
                      step="0.5"
                      placeholder="Sem"
                      title="Duración Base (Semanas)"
                      className={`w-16 p-2 text-sm rounded-lg ${isDark ? 'bg-[#263345] border-[#2d3f52] text-[#e8f1ff]' : 'bg-[#f0f8ff] border-[#bae6fd]'} border`}
                      value={newBountyWeeks}
                      onChange={(e) => setNewBountyWeeks(Number(e.target.value))}
                    />
                    <button onClick={addBounty} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors shrink-0">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                  {bounties.map((b) => (
                    <div key={b.id} className={`flex items-center justify-between p-3 rounded-xl group transition-colors ${isDark ? 'bg-[#263345] border-[#2d3f52] hover:border-[#3d4f63]' : 'bg-[#f0f8ff] border-[#e0f2fe] hover:border-[#00adee]'} border`}>
                      <div className={`text-xs flex-1 ${isDark ? 'text-[#a8b8d0]' : ''}`}>
                        <p className={`font-bold ${isDark ? 'text-[#e8f1ff]' : 'text-[#0f172a]'}`}>{b.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {b.editingValue ? (
                            <input 
                              type="number"
                              value={b.value}
                              onChange={(e) => updateBountyValue(b.id, Number(e.target.value))}
                              onBlur={() => toggleEditValue(b.id)}
                              autoFocus
                              className={`w-20 px-2 py-1 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500 border ${isDark ? 'bg-[#3d4f63] text-[#e8f1ff] border-blue-500' : 'bg-white text-[#0f172a] border-blue-400'}`}
                            />
                          ) : (
                            <span 
                              onClick={() => toggleEditValue(b.id)}
                              className={`cursor-pointer px-2 py-1 rounded transition-colors ${isDark ? 'hover:bg-[#3d4f63]' : 'hover:bg-blue-100'}`}
                            >
                              ${b.value.toLocaleString()} USD
                            </span>
                          )}
                          <span className="text-slate-400">•</span>
                          {b.editingWeeks ? (
                            <input 
                              type="number"
                              step="0.5"
                              value={b.weeks}
                              onChange={(e) => updateBountyWeeks(b.id, Number(e.target.value))}
                              onBlur={() => toggleEditWeeks(b.id)}
                              autoFocus
                              className={`w-16 px-2 py-1 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500 border ${isDark ? 'bg-[#3d4f63] text-[#e8f1ff] border-blue-500' : 'bg-white text-[#0f172a] border-blue-400'}`}
                            />
                          ) : (
                            <span 
                              onClick={() => toggleEditWeeks(b.id)}
                              className={`cursor-pointer px-2 py-1 rounded font-medium transition-colors ${isDark ? 'text-blue-400 hover:bg-[#3d4f63]' : 'text-blue-600 hover:bg-blue-100'}`}
                            >
                              {b.weeks} sem {mode === 'manual' ? `→ ${(b.weeks * agenticEfficiency).toFixed(1)} real` : '(⚡)'}
                            </span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => removeBounty(b.id)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-2">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`${isDark ? 'bg-[#1a2640] border-[#2d3f52]' : 'bg-white border-[#bae6fd]'} p-6 rounded-3xl shadow-sm border space-y-6`}>
              <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-[#e8f1ff]' : 'text-[#0f172a]'}`}>
                <Target size={18} className="text-blue-600" /> Parámetros de Riesgo
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">
                  Eficiencia Agéntica <span>x{agenticEfficiency}</span>
                </label>
                <input 
                  type="range" min="1" max="10" step="0.5" value={agenticEfficiency} 
                  onChange={(e) => setAgenticEfficiency(Number(e.target.value))}
                  className="w-full h-1.5 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">Multiplicador de velocidad vs desarrollo artesanal. Comprime el tiempo de entrega (ej. de 4 sem → 1 sem = 4x). Premia el GTM acelerado sin descontar valor nominal.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">
                  Markup de Riesgo <span>{markup}%</span>
                </label>
                <input 
                  type="range" min="0" max="100" value={markup} 
                  onChange={(e) => setMarkup(Number(e.target.value))}
                  className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">Sobreprecio por riesgo de impago (prima de seguro). Compensa que el Hunter acepta pago diferido sin colateral inmediato. Se aplica al momento del merge.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">
                  Interés Mensual <span>{monthlyInterest}%</span>
                </label>
                <input 
                  type="range" min="0" max="10" step="0.5" value={monthlyInterest} 
                  onChange={(e) => setMonthlyInterest(Number(e.target.value))}
                  className="w-full h-1.5 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">Costo del dinero por tiempo. Se aplica sobre la deuda acumulada (Principal + Markup) desde merge. Protege al Hunter contra inflación e incentiva liquidación rápida.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">
                  Gracia / Tracking (Semanas) <span>{gracePeriodWeeks} sem</span>
                </label>
                <input 
                  type="range" min="4" max="104" step="4" value={gracePeriodWeeks} 
                  onChange={(e) => setGracePeriodWeeks(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                />
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">Horizonte de planificación para flujo de caja. Define cuándo la Startup espera tener capital para liquidar pasivos. Herramienta para calcular reserva necesaria de próxima ronda.</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Gráfica y Contrato */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${isDark ? 'bg-[#0f172a] shadow-lg border-[#2d3f52]' : 'bg-[#f0f8ff] border-[#bae6fd]'} p-6 rounded-3xl ${isDark ? 'text-white' : 'text-[#0f172a]'} shadow-xl relative overflow-hidden border`}>
                <div className={`absolute -right-4 -top-4 ${isDark ? 'text-white/5' : 'text-[#0f172a]/5'}`}><Coins size={100} /></div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-[#a8b8d0]' : 'text-[#64748b]'}`}>Deuda Final Proyectada</p>
                <h2 className={`text-3xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>${finalDebt.toLocaleString()}</h2>
                <p className={`text-[10px] mt-2 ${isDark ? 'text-[#a8b8d0]' : 'text-[#64748b]'}`}>Nominal: ${nominalTotal.toLocaleString()} USD</p>
              </div>
              <div className={`${isDark ? 'bg-[#1a2640] border-[#2d3f52]' : 'bg-white border-[#bae6fd]'} p-6 rounded-3xl border`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-[#a8b8d0]' : 'text-[#64748b]'}`}>Diferencia x Riesgo</p>
                <h2 className={`text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>+${(finalDebt - nominalTotal).toLocaleString()}</h2>
                <p className={`text-[10px] mt-2 font-medium ${isDark ? 'text-[#a8b8d0]' : 'text-[#64748b]'}`}>Markup + Interés Mensual</p>
              </div>
              <div className={`${isDark ? 'bg-[#1a2640] border-[#2d3f52]' : 'bg-white border-[#bae6fd]'} p-6 rounded-3xl border`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-[#a8b8d0]' : 'text-[#64748b]'}`}>Cierre de Entregas</p>
                <h2 className={`text-3xl font-bold ${mode === 'agentic' ? (isDark ? "text-[#a78bfa]" : "text-purple-600") : (isDark ? "text-[#a8b8d0]" : "text-[#64748b]")}`}>
                  {estimatedDeliveryWeeks.toFixed(1)} <span className="text-lg">Sem</span>
                </h2>
                <p className={`text-[10px] mt-2 ${isDark ? 'text-[#a8b8d0]' : 'text-[#64748b]'}`}>
                  {mode === 'agentic' ? `Ahorras ${(manualTotalWeeks - estimatedDeliveryWeeks).toFixed(1)} semanas vs manual` : `Semanas efectivas de código`}
                </p>
              </div>
            </div>

            <div className={`${isDark ? 'bg-[#1a2640] border-[#2d3f52]' : 'bg-white border-[#bae6fd]'} p-8 rounded-3xl border`}>
              <h3 className={`font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-[#e8f1ff]' : 'text-[#0f172a]'}`}>
                <TrendingUp size={20} className="text-blue-500" /> Proyección de Pasivos (Resolución Semanal)
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={mode === 'agentic' ? "#7c5cef" : "#3d4f63"} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={mode === 'agentic' ? "#7c5cef" : "#3d4f63"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#2d3f52" : "#e0f2fe"} />
                    <XAxis dataKey="periodo" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: isDark ? "#a8b8d0" : "#64748b"}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: isDark ? "#a8b8d0" : "#64748b"}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', backgroundColor: isDark ? '#1a2640' : '#ffffff', color: isDark ? '#e8f1ff' : '#000000' }}
                      formatter={(val) => [`$${(val as number).toLocaleString()}`, "Monto"]}
                    />
                    <Area 
                      type="stepAfter" 
                      dataKey="deuda" 
                      stroke={mode === 'agentic' ? "#7c5cef" : "#3d4f63"} 
                      strokeWidth={3} 
                      fill="url(#colorDebt)"
                      name="Deuda con Hunter"
                    />
                    <Area 
                      type="stepAfter" 
                      dataKey="nominal" 
                      stroke={isDark ? "#a8b8d0" : "#64748b"} 
                      strokeWidth={2} 
                      strokeDasharray="4 4" 
                      fill="transparent"
                      name="Valor Nominal"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`${isDark ? 'bg-[#1a2640]' : 'bg-[#e0f2fe]'} rounded-3xl p-8 ${isDark ? 'text-[#e8f1ff]' : 'text-[#0f172a]'} relative`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FileText className={isDark ? "text-[#00adee]" : "text-blue-600"} /> Draft Contractual: {mode === 'agentic' ? "Modo Agéntico" : "Modo Artesanal"}
                </h3>
                <button onClick={handleCopyContract} className={`${isDark ? 'bg-[#263345] hover:bg-[#2d3f52]' : 'bg-[#bae6fd] hover:bg-[#a8d8f0]'} p-2 rounded-lg transition-all`}>
                  <Copy size={18} />
                </button>
              </div>
              <div className={`${isDark ? 'bg-[#0f172a]/50 border-[#2d3f52]' : 'bg-[#ffffff] border-[#bae6fd]'} p-6 rounded-2xl border font-mono text-xs leading-relaxed ${isDark ? 'text-[#a8b8d0]' : 'text-[#0f172a]'} whitespace-pre-wrap`}>
                <p className={`mb-4 ${isDark ? 'text-[#e8f1ff]' : 'text-[#0f172a]'} font-bold`}>CONTRATO DE SERVICIOS PROFESIONALES CON PAGO DIFERIDO</p>
                <p className="mb-4">ENTRE: [TU NOMBRE] (El "Hunter") y [STARTUP] (La "Startup")</p>
                <p className="mb-4">OBJETO: Desarrollo de {bounties.length} hitos tecnológicos bajo modalidad de Bounty individual.</p>
                <div className={`${isDark ? 'text-[#a78bfa] bg-[#7c5cef]/10 border-[#7c5cef]/30' : 'text-blue-700 bg-blue-50 border-blue-200'} p-4 rounded-lg border mb-4`}>
                  {contractTemplates[mode]}
                </div>
                <p>TOTAL RECONOCIDO A FECHA DE CORTE ({gracePeriodWeeks} Semanas): <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'} font-bold`}>${finalDebt.toLocaleString()} USD</span>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
