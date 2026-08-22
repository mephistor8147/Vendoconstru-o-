import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Truck, 
  Weight, 
  Award, 
  Zap, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  Clock,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';
import { Order } from '../../types';
import { formatCurrency, formatWeight } from '../../utils/storage';

interface AdminMetricsReputationProps {
  orders: Order[];
  onExportData: () => void;
}

export const AdminMetricsReputation: React.FC<AdminMetricsReputationProps> = ({
  orders,
  onExportData
}) => {
  // Metrics Calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelado' ? o.total : 0), 0);
  const confirmedOrders = orders.filter(o => o.status !== 'cancelado' && o.status !== 'orcamento');
  const deliveredOrders = orders.filter(o => o.status === 'entregue');
  const inTransitOrders = orders.filter(o => o.status === 'saiu_para_entrega' || o.status === 'em_separacao');
  
  const totalWeightDelivered = orders.reduce((sum, o) => {
    const ordWeight = o.items.reduce((s, it) => s + (it.product.weightKg * it.quantity), 0);
    return sum + ordWeight;
  }, 0);

  const averageTicket = confirmedOrders.length > 0 ? totalRevenue / confirmedOrders.length : 0;
  const monthlyGoal = 250000;
  const goalProgress = Math.min(100, Math.round((totalRevenue / monthlyGoal) * 100));

  return (
    <div className="space-y-6 text-neutral-800">
      
      {/* Reputation & Performance Overview Card */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-neutral-900 uppercase">
                Termômetro de Reputação & Pontualidade
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#72BF44] text-[#08182B] flex items-center gap-1">
                <Zap className="w-3 h-3 fill-[#08182B]" />
                <span>NÍVEL PLATINUM VANDO</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Desempenho operacional de carregamento, entrega rápida no canteiro e pontualidade na RMR.
            </p>
          </div>

          <button
            onClick={onExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold border border-neutral-300 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Relatório (.JSON)</span>
          </button>
        </div>

        {/* 5-Color Reputation Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-800">Nível do Termômetro:</span>
            <span className="text-[#72BF44] font-extrabold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verde Máximo (Melhor Padrão de Entrega)</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex-1 h-3 rounded-l-full bg-red-200 opacity-60" title="Vermelho" />
            <div className="flex-1 h-3 bg-orange-200 opacity-60" title="Laranja" />
            <div className="flex-1 h-3 bg-yellow-200 opacity-60" title="Amarelo" />
            <div className="flex-1 h-3 bg-lime-300 opacity-70" title="Verde Claro" />
            <div className="flex-1 h-3 rounded-r-full bg-[#72BF44] shadow-xs relative" title="Verde Escuro">
              <span className="absolute -top-1 right-2 w-3 h-5 bg-[#08182B] rounded-sm ring-2 ring-white" />
            </div>
          </div>
        </div>

        {/* 4 Official Meli Seller Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-center text-xs">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1">
            <span className="text-[11px] text-neutral-500 block font-semibold">Vendas Concluídas</span>
            <strong className="text-sm text-neutral-900 font-black block">
              {orders.length + 148} pedidos
            </strong>
            <span className="text-[10px] text-emerald-700 font-bold">Sem atrasos</span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1">
            <span className="text-[11px] text-neutral-500 block font-semibold">Entregas no Prazo</span>
            <strong className="text-sm text-emerald-700 font-black block">98.8%</strong>
            <span className="text-[10px] text-neutral-500 font-medium">Meta: ≥ 97%</span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1">
            <span className="text-[11px] text-neutral-500 block font-semibold">Índice de Reclamações</span>
            <strong className="text-sm text-emerald-700 font-black block">0.3%</strong>
            <span className="text-[10px] text-neutral-500 font-medium">Limite: ≤ 1.0%</span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1">
            <span className="text-[11px] text-neutral-500 block font-semibold">Cancelamento</span>
            <strong className="text-sm text-emerald-700 font-black block">0.0%</strong>
            <span className="text-[10px] text-neutral-500 font-medium">Limite: ≤ 0.5%</span>
          </div>
        </div>
      </div>

      {/* Main Financial & Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Faturamento Bruto</span>
            <div className="w-8 h-8 rounded-lg bg-[#72BF44]/20 text-[#08182B] flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4 text-[#08182B]" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900 tracking-tight">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs. mês anterior</span>
          </div>
        </div>

        {/* Average Ticket */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Ticket Médio por Obra</span>
            <div className="w-8 h-8 rounded-lg bg-[#08182B] text-[#72BF44] flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4 text-[#72BF44]" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900 tracking-tight">
            {formatCurrency(averageTicket)}
          </div>
          <span className="text-[11px] text-neutral-500 block">
            Baseado em {confirmedOrders.length} pedidos confirmados
          </span>
        </div>

        {/* Dispatched Weight */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Carga Total Despachada</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
              <Weight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900 tracking-tight">
            {formatWeight(totalWeightDelivered)}
          </div>
          <span className="text-[11px] text-neutral-500 block">
            Cimento, agregados e ferragens
          </span>
        </div>

        {/* Active Loads in Transit */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Cargas Ativas em Rota</span>
            <div className="w-8 h-8 rounded-lg bg-[#08182B] text-[#72BF44] flex items-center justify-center font-bold">
              <Truck className="w-4 h-4 text-[#72BF44]" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900 tracking-tight">
            {inTransitOrders.length} caminhões
          </div>
          <span className="text-[11px] text-neutral-500 block">
            {deliveredOrders.length} entregas concluídas hoje
          </span>
        </div>

      </div>

      {/* Monthly Sales Goal & Logistics Efficiency Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Monthly Target Progress */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-neutral-900 uppercase">
                Meta de Vendas Mensal (Agosto 2026)
              </h3>
              <p className="text-xs text-neutral-500">
                Progresso acumulado de vendas e faturamento da loja.
              </p>
            </div>
            <span className="text-sm font-black text-[#08182B] bg-[#72BF44]/20 px-2.5 py-1 rounded-lg">{goalProgress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#72BF44] rounded-full transition-all duration-500" 
              style={{ width: `${goalProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-600 pt-1">
            <span>Realizado: <strong>{formatCurrency(totalRevenue)}</strong></span>
            <span>Meta: <strong>{formatCurrency(monthlyGoal)}</strong></span>
          </div>
        </div>

        {/* Quick Operational Highlights */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-3">
          <h3 className="text-sm font-black text-neutral-900 uppercase">
            Destaques Operacionais do Galpão
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
              <span className="text-neutral-600 font-medium">Tempo Médio de Separação (FULL):</span>
              <strong className="text-neutral-900 font-bold">35 minutos</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
              <span className="text-neutral-600 font-medium">Bairro com Maior Volume de Entregas:</span>
              <strong className="text-neutral-900 font-bold">Boa Viagem / Pina</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
              <span className="text-neutral-600 font-medium">Material Mais Vendido:</span>
              <strong className="text-neutral-900 font-bold">Cimento Nassau CP-II 50kg</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
