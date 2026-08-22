import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Layers, 
  Sparkles, 
  Plus, 
  Check, 
  HelpCircle, 
  ArrowRight, 
  Flame, 
  Droplet, 
  Info, 
  Wrench, 
  Weight, 
  DollarSign, 
  ShoppingCart,
  Bot,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Product, BudgetItem, CalculatorMasonryInput, CalculatorFloorInput, CalculatorPaintInput, CalculatorRoofSlabInput } from '../types';
import { calculateMasonry, calculateFloor, calculatePaint, calculateRoofSlab, CalculationResult } from '../utils/calculatorFormulas';
import { formatCurrency, formatWeight } from '../utils/storage';
import { INITIAL_PRODUCTS } from '../data/mockData';

interface RealTimeCalculatorProps {
  onAddMultipleItems: (items: { product: Product; quantity: number }[]) => void;
  onOpenBudget: () => void;
}

type CalcMode = 'alvenaria' | 'piso' | 'pintura' | 'laje' | 'ia_mestre';

export const RealTimeCalculator: React.FC<RealTimeCalculatorProps> = ({
  onAddMultipleItems,
  onOpenBudget
}) => {
  const [activeMode, setActiveMode] = useState<CalcMode>('alvenaria');
  const [addedNotification, setAddedNotification] = useState(false);

  // Masonry State
  const [masonryInput, setMasonryInput] = useState<CalculatorMasonryInput>({
    wallLength: 10,
    wallHeight: 2.8,
    brickType: '8furos',
    includePlaster: true
  });

  // Floor State
  const [floorInput, setFloorInput] = useState<CalculatorFloorInput>({
    areaM2: 35,
    slabThicknessCm: 5,
    mixRatio: 'medio',
    includeTile: true,
    tileWasteMarginPercent: 10
  });

  // Paint State
  const [paintInput, setPaintInput] = useState<CalculatorPaintInput>({
    wallAreaM2: 70,
    coats: 2,
    surfaceCondition: 'nova',
    paintType: 'acrilica'
  });

  // Slab State
  const [slabInput, setSlabInput] = useState<CalculatorRoofSlabInput>({
    areaM2: 50,
    thicknessCm: 10,
    loadType: 'residencial'
  });

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('Quero construir um muro de 20 metros de comprimento por 2,20m de altura com reboco.');
  const [aiIsCalculating, setAiIsCalculating] = useState(false);
  const [aiCustomEstimate, setAiCustomEstimate] = useState<CalculationResult | null>(null);

  // Compute results in real time
  const currentResult: CalculationResult = useMemo(() => {
    switch (activeMode) {
      case 'alvenaria':
        return calculateMasonry(masonryInput);
      case 'piso':
        return calculateFloor(floorInput);
      case 'pintura':
        return calculatePaint(paintInput);
      case 'laje':
        return calculateRoofSlab(slabInput);
      case 'ia_mestre':
        return aiCustomEstimate || calculateMasonry(masonryInput);
      default:
        return calculateMasonry(masonryInput);
    }
  }, [activeMode, masonryInput, floorInput, paintInput, slabInput, aiCustomEstimate]);

  const handleAddResultToBudget = () => {
    const itemsToAdd: { product: Product; quantity: number }[] = [];

    currentResult.items.forEach(calcItem => {
      const foundProduct = INITIAL_PRODUCTS.find(p => p.id === calcItem.productId);
      if (foundProduct) {
        itemsToAdd.push({
          product: foundProduct,
          quantity: calcItem.quantity
        });
      }
    });

    if (itemsToAdd.length > 0) {
      onAddMultipleItems(itemsToAdd);
      setAddedNotification(true);
      setTimeout(() => setAddedNotification(false), 3000);
    }
  };

  const handleSimulateAiMestre = () => {
    setAiIsCalculating(true);
    setTimeout(() => {
      const lower = aiPrompt.toLowerCase();
      let res: CalculationResult;

      if (lower.includes('muro') || lower.includes('parede') || lower.includes('alvenaria')) {
        res = calculateMasonry({
          wallLength: 20,
          wallHeight: 2.2,
          brickType: '8furos',
          includePlaster: true
        });
        res.title = 'Orçamento Estimado: Muro 20m x 2.20m';
        res.summary = 'Calculado pelo Mestre de Obras Virtual Vando com margem para pilares e travamento.';
      } else if (lower.includes('piso') || lower.includes('garagem') || lower.includes('porcelanato')) {
        res = calculateFloor({
          areaM2: 45,
          slabThicknessCm: 6,
          mixRatio: 'forte',
          includeTile: true,
          tileWasteMarginPercent: 10
        });
        res.title = 'Orçamento Estimado: Pavimentação e Revestimento (45m²)';
      } else if (lower.includes('laje') || lower.includes('teto')) {
        res = calculateRoofSlab({
          areaM2: 60,
          thicknessCm: 10,
          loadType: 'residencial'
        });
        res.title = 'Orçamento Estimado: Laje Maciça Residencial (60m²)';
      } else {
        res = calculatePaint({
          wallAreaM2: 120,
          coats: 2,
          surfaceCondition: 'repintura',
          paintType: 'acrilica'
        });
        res.title = 'Orçamento Estimado: Pintura Completa (120m²)';
      }

      setAiCustomEstimate(res);
      setAiIsCalculating(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-neutral-800">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08182B] text-[#72BF44] border border-[#72BF44]/30 text-xs font-black uppercase mb-1.5">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador de Engenharia em Tempo Real</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase">
            Calculadora de Materiais para sua Obra
          </h1>
          <p className="text-xs text-neutral-500">
            Calcule a quantidade exata de sacos de cimento, tijolos, areia, brita e argamassa para evitar desperdícios.
          </p>
        </div>

        <button
          onClick={onOpenBudget}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#08182B] hover:bg-[#050F1C] text-[#72BF44] border border-[#72BF44]/30 text-xs font-bold transition-all shadow-xs active:scale-95 flex-shrink-0"
        >
          <ShoppingCart className="w-4 h-4 text-[#72BF44]" />
          <span className="text-white">Ver Carrinho da Obra</span>
        </button>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'alvenaria', label: 'Alvenaria / Paredes', icon: <Layers className="w-4 h-4" /> },
          { id: 'piso', label: 'Contrapiso & Piso', icon: <Wrench className="w-4 h-4" /> },
          { id: 'pintura', label: 'Pintura & Selador', icon: <Droplet className="w-4 h-4" /> },
          { id: 'laje', label: 'Laje & Concreto', icon: <Flame className="w-4 h-4" /> },
          { id: 'ia_mestre', label: 'Mestre de Obras Virtual', icon: <Bot className="w-4 h-4" />, highlight: true }
        ].map((tab) => {
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id as CalcMode)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#72BF44] text-[#08182B] font-black shadow-xs'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Form Controls */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
          
          {/* ALVENARIA */}
          {activeMode === 'alvenaria' && (
            <div className="space-y-4">
              <div className="border-b border-neutral-100 pb-2">
                <h3 className="text-sm font-bold text-neutral-900">Dimensões da Parede / Muro</h3>
                <p className="text-[11px] text-neutral-500">Informe o comprimento e a altura para calcular tijolos, cimento e areia.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Comprimento (metros):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={masonryInput.wallLength}
                    onChange={(e) => setMasonryInput({ ...masonryInput, wallLength: Math.max(0.5, parseFloat(e.target.value) || 0) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-bold focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Altura / Pé-direito (metros):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={masonryInput.wallHeight}
                    onChange={(e) => setMasonryInput({ ...masonryInput, wallHeight: Math.max(0.5, parseFloat(e.target.value) || 0) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-bold focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="block font-bold text-neutral-700">Tipo de Tijolo / Bloco:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: '8furos', label: 'Tijolo 8 Furos (9x19x19)' },
                    { id: '6furos', label: 'Tijolo 6 Furos (9x14x19)' },
                    { id: 'bloco_concreto_14', label: 'Bloco Concreto (14x19x39)' }
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setMasonryInput({ ...masonryInput, brickType: b.id as any })}
                      className={`p-2.5 rounded-lg text-left border transition-all ${
                        masonryInput.brickType === b.id
                          ? 'bg-[#72BF44]/20 text-[#08182B] border-[#72BF44] font-black ring-1 ring-[#72BF44]'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={masonryInput.includePlaster}
                    onChange={(e) => setMasonryInput({ ...masonryInput, includePlaster: e.target.checked })}
                    className="w-4 h-4 text-[#72BF44] rounded border-neutral-300 focus:ring-[#72BF44]"
                  />
                  <span>Incluir argamassa de reboco / emboço para ambas as faces</span>
                </label>
              </div>
            </div>
          )}

          {/* PISO */}
          {activeMode === 'piso' && (
            <div className="space-y-4">
              <div className="border-b border-neutral-100 pb-2">
                <h3 className="text-sm font-bold text-neutral-900">Dimensões do Piso / Contrapiso</h3>
                <p className="text-[11px] text-neutral-500">Calcule cimento, areia, brita, argamassa colante e porcelanato.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Área Total (m²):</label>
                  <input
                    type="number"
                    value={floorInput.areaM2}
                    onChange={(e) => setFloorInput({ ...floorInput, areaM2: Math.max(1, parseFloat(e.target.value) || 0) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-bold focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Espessura do Contrapiso (cm):</label>
                  <input
                    type="number"
                    value={floorInput.slabThicknessCm}
                    onChange={(e) => setFloorInput({ ...floorInput, slabThicknessCm: Math.max(2, parseFloat(e.target.value) || 0) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-bold focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={floorInput.includeTile}
                    onChange={(e) => setFloorInput({ ...floorInput, includeTile: e.target.checked })}
                    className="w-4 h-4 text-[#72BF44] rounded border-neutral-300 focus:ring-[#72BF44]"
                  />
                  <span>Incluir Porcelanato e Argamassa AC-III (+10% recorte)</span>
                </label>
              </div>
            </div>
          )}

          {/* PINTURA */}
          {activeMode === 'pintura' && (
            <div className="space-y-4">
              <div className="border-b border-neutral-100 pb-2">
                <h3 className="text-sm font-bold text-neutral-900">Área de Paredes e Teto</h3>
                <p className="text-[11px] text-neutral-500">Cálculo de latas de tinta látex acrílica e rolos de pintura.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Área a Pintar (m²):</label>
                  <input
                    type="number"
                    value={paintInput.wallAreaM2}
                    onChange={(e) => setPaintInput({ ...paintInput, wallAreaM2: Math.max(5, parseFloat(e.target.value) || 0) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-bold focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Demãos de Tinta:</label>
                  <select
                    value={paintInput.coats}
                    onChange={(e) => setPaintInput({ ...paintInput, coats: parseInt(e.target.value) || 2 })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-bold focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  >
                    <option value={2}>2 Demãos (Padrão)</option>
                    <option value={3}>3 Demãos (Super Cobertura)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* LAJE */}
          {activeMode === 'laje' && (
            <div className="space-y-4">
              <div className="border-b border-neutral-100 pb-2">
                <h3 className="text-sm font-bold text-neutral-900">Dimensões da Laje</h3>
                <p className="text-[11px] text-neutral-500">Cálculo de concreto estrutural, barras de aço CA-50 e cimento CP-II.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Área da Laje (m²):</label>
                  <input
                    type="number"
                    value={slabInput.areaM2}
                    onChange={(e) => setSlabInput({ ...slabInput, areaM2: Math.max(5, parseFloat(e.target.value) || 0) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-bold focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Espessura Concreto (cm):</label>
                  <input
                    type="number"
                    value={slabInput.thicknessCm}
                    onChange={(e) => setSlabInput({ ...slabInput, thicknessCm: Math.max(8, parseFloat(e.target.value) || 0) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-bold focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* IA MESTRE */}
          {activeMode === 'ia_mestre' && (
            <div className="space-y-4">
              <div className="border-b border-neutral-100 pb-2">
                <div className="flex items-center gap-1.5 text-[#08182B] font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-[#72BF44]" />
                  <span>Mestre de Obras Virtual com IA</span>
                </div>
                <p className="text-[11px] text-neutral-500">Descreva sua reforma ou construção em linguagem natural.</p>
              </div>

              <div className="space-y-2 text-xs">
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ex: Vou construir um muro de 25 metros com 2,5m de altura e reboco nos dois lados..."
                  className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                />

                <button
                  onClick={handleSimulateAiMestre}
                  disabled={aiIsCalculating}
                  className="w-full py-2.5 rounded-lg bg-[#08182B] hover:bg-[#050F1C] text-[#72BF44] border border-[#72BF44]/30 font-black transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-[#72BF44]" />
                  <span className="text-white">{aiIsCalculating ? 'Calculando Insumos...' : 'Calcular com IA da Construção'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right: Real-Time Materials Breakdown & Order Action */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  {currentResult.title}
                </h3>
                <p className="text-[11px] text-neutral-500">
                  {currentResult.summary}
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#72BF44]/20 text-[#08182B] text-xs font-bold border border-[#72BF44]/40">
                {currentResult.items.length} materiais
              </span>
            </div>

            {/* Calculated Materials List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {currentResult.items.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-neutral-900 block">{item.productName}</strong>
                    <span className="text-[11px] text-neutral-500">{item.purpose}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-extrabold text-neutral-900 text-sm block">
                      {item.quantity} {item.unit}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Totals & Add to Cart Button */}
          <div className="pt-4 border-t border-neutral-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-neutral-500 block text-[11px]">Carga Total Estimada:</span>
                <strong className="text-neutral-900 text-sm">{formatWeight(currentResult.estimatedWeightKg)}</strong>
              </div>

              <div className="text-right">
                <span className="text-neutral-500 block text-[11px]">Custo Estimado dos Materiais:</span>
                <span className="text-xl font-black text-neutral-900 block">
                  {formatCurrency(currentResult.totalCost)}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">
                  5% de desconto no PIX
                </span>
              </div>
            </div>

            {addedNotification && (
              <div className="p-2.5 rounded-lg bg-[#72BF44]/20 border border-[#72BF44]/40 text-[#08182B] text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Materiais adicionados com sucesso ao seu carrinho!</span>
              </div>
            )}

            <button
              onClick={handleAddResultToBudget}
              className="w-full py-3 rounded-lg bg-[#72BF44] hover:bg-[#62a738] text-[#08182B] font-black text-xs transition-all shadow-xs active:scale-98 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#08182B]" />
              <span>Adicionar Todos os Materiais ao Carrinho</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
