import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, FileText, Coins, Zap, Cpu, MousePointer2, Plus, Trash2, Copy } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Cpu className={mode === 'agentic' ? "text-purple-600" : "text-slate-500"} size={32} />
              Agéntic Hunter OS
            </h1>
            <p className="text-slate-600 mt-1">Valuación de Bounties Atómicos & Pago Diferido</p>
          </div>
          <div className="flex p-1 bg-slate-100 rounded-2xl w-fit border border-slate-200">
            <button onClick={() => setMode('manual')} className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all font-bold ${mode === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
              <MousePointer2 size={16} /> Artesanal
            </button>
            <button onClick={() => setMode('agentic')} className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all font-bold ${mode === 'agentic' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-500'}`}>
              <Zap size={16} /> Agéntico
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Columna Izquierda: Gestión de Bounties */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="font-bold mb-4 flex items-center justify-between">
                <span>Configuración del Pool</span>
                <Coins size={18} className="text-yellow-500" />
              </h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <input 
                    placeholder="Nombre del Bounty"
                    className="w-full md:flex-1 p-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={newBountyName}
                    onChange={(e) => setNewBountyName(e.target.value)}
                  />
                  <div className="flex gap-2 w-full md:w-auto">
                    <input 
                      type="number"
                      placeholder="USD"
                      title="Monto del hito en USD"
                      className="w-24 p-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                      value={newBountyValue}
                      onChange={(e) => setNewBountyValue(Number(e.target.value))}
                    />
                    <input 
                      type="number"
                      step="0.5"
                      placeholder="Sem"
                      title="Duración Base (Semanas)"
                      className="w-16 p-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
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
                    <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-blue-300 transition-colors">
                      <div className="text-xs flex-1">
                        <p className="font-bold text-slate-700">{b.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {b.editingValue ? (
                            <input 
                              type="number"
                              value={b.value}
                              onChange={(e) => updateBountyValue(b.id, Number(e.target.value))}
                              onBlur={() => toggleEditValue(b.id)}
                              autoFocus
                              className="w-20 px-2 py-1 text-xs bg-white border border-blue-400 rounded outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            <span 
                              onClick={() => toggleEditValue(b.id)}
                              className="cursor-pointer px-2 py-1 rounded hover:bg-blue-100 transition-colors"
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
                              className="w-16 px-2 py-1 text-xs bg-white border border-blue-400 rounded outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            <span 
                              onClick={() => toggleEditWeeks(b.id)}
                              className="cursor-pointer px-2 py-1 rounded text-blue-600 font-medium hover:bg-blue-100 transition-colors"
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

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
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
              <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-white/5"><Coins size={100} /></div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Deuda Final Proyectada</p>
                <h2 className="text-3xl font-bold text-yellow-400">${finalDebt.toLocaleString()}</h2>
                <p className="text-[10px] mt-2 text-slate-400">Nominal: ${nominalTotal.toLocaleString()} USD</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Diferencia x Riesgo</p>
                <h2 className="text-3xl font-bold text-green-600">+${(finalDebt - nominalTotal).toLocaleString()}</h2>
                <p className="text-[10px] mt-2 text-slate-500 font-medium">Markup + Interés Mensual</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Cierre de Entregas</p>
                <h2 className={`text-3xl font-bold ${mode === 'agentic' ? "text-purple-600" : "text-slate-700"}`}>
                  {estimatedDeliveryWeeks.toFixed(1)} <span className="text-lg">Sem</span>
                </h2>
                <p className="text-[10px] mt-2 text-slate-500">
                  {mode === 'agentic' ? `Ahorras ${(manualTotalWeeks - estimatedDeliveryWeeks).toFixed(1)} semanas vs manual` : `Semanas efectivas de código`}
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" /> Proyección de Pasivos (Resolución Semanal)
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={mode === 'agentic' ? "#8b5cf6" : "#475569"} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={mode === 'agentic' ? "#8b5cf6" : "#475569"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="periodo" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      formatter={(val) => [`$${(val as number).toLocaleString()}`, "Monto"]}
                    />
                    <Area 
                      type="stepAfter" 
                      dataKey="deuda" 
                      stroke={mode === 'agentic' ? "#8b5cf6" : "#475569"} 
                      strokeWidth={3} 
                      fill="url(#colorDebt)"
                      name="Deuda con Hunter"
                    />
                    <Area 
                      type="stepAfter" 
                      dataKey="nominal" 
                      stroke="#cbd5e1" 
                      strokeWidth={2} 
                      strokeDasharray="4 4" 
                      fill="transparent"
                      name="Valor Nominal"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 text-white relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="text-blue-400" /> Draft Contractual: {mode === 'agentic' ? "Modo Agéntico" : "Modo Artesanal"}
                </h3>
                <button onClick={handleCopyContract} className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition-all">
                  <Copy size={18} />
                </button>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
                <p className="mb-4 text-slate-100 font-bold">CONTRATO DE SERVICIOS PROFESIONALES CON PAGO DIFERIDO</p>
                <p className="mb-4">ENTRE: [TU NOMBRE] (El "Hunter") y [STARTUP] (La "Startup")</p>
                <p className="mb-4">OBJETO: Desarrollo de {bounties.length} hitos tecnológicos bajo modalidad de Bounty individual.</p>
                <div className="text-blue-300 bg-blue-900/20 p-4 rounded-lg border border-blue-800/50 mb-4">
                  {contractTemplates[mode]}
                </div>
                <p>TOTAL RECONOCIDO A FECHA DE CORTE ({gracePeriodWeeks} Semanas): <span className="text-yellow-400 font-bold">${finalDebt.toLocaleString()} USD</span>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
