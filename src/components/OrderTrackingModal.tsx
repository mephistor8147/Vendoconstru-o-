import React, { useState } from 'react';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Package, 
  AlertCircle, 
  FileText,
  ShieldCheck,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { STORE_INFO, VEHICLE_DETAILS } from '../data/mockData';
import { formatCurrency, formatWeight, formatStatusLabel, getStatusColor } from '../utils/storage';

interface OrderTrackingProps {
  orders: Order[];
  onOpenReceipt: (order: Order) => void;
  onNavigateToCatalog: () => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'orcamento', label: 'Cotação Criada', description: 'Orçamento gerado no sistema' },
  { status: 'confirmado', label: 'Pagamento Aprovado', description: 'Pedido recebido no galpão' },
  { status: 'em_separacao', label: 'Em Separação (FULL)', description: 'Materiais carregados no caminhão' },
  { status: 'saiu_para_entrega', label: 'A Caminho (Flex)', description: 'Motorista em trânsito para a obra' },
  { status: 'entregue', label: 'Entregue no Canteiro', description: 'Descarga concluída com sucesso' }
];

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  orders,
  onOpenReceipt,
  onNavigateToCatalog
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');

  const activeOrder = orders.find(o => 
    o.id === selectedOrderId || 
    (searchCode.trim() && o.code.toLowerCase().includes(searchCode.trim().toLowerCase()))
  ) || orders[0];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'orcamento': return 0;
      case 'confirmado': return 1;
      case 'em_separacao': return 2;
      case 'saiu_para_entrega': return 3;
      case 'entregue': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.status) : 0;
  const totalWeightKg = activeOrder ? activeOrder.items.reduce((s, it) => s + (it.product.weightKg * it.quantity), 0) : 0;
  const vehicle = activeOrder ? (VEHICLE_DETAILS[activeOrder.schedule.vehicleType] || VEHICLE_DETAILS.fiorino) : VEHICLE_DETAILS.fiorino;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-neutral-800">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08182B] text-[#72BF44] border border-[#72BF44]/30 text-xs font-black uppercase mb-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>Vando Express • Rastreamento</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase">
            Acompanhe o Envio da sua Carga
          </h1>
          <p className="text-xs text-neutral-500">
            Consulte a previsão de chegada do caminhão, turno agendado e motorista responsável.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por código (#VAND)..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
          />
        </div>
      </div>

      {activeOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Tracking Stepper & Map Box */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Status Highlight Banner */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-3 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#72BF44]/20 text-[#08182B] flex items-center justify-center border border-[#72BF44]/40">
                    <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      {activeOrder.status === 'entregue' ? 'Entrega Concluída' : 'Chegará no seu Canteiro de Obras'}
                    </h3>
                    <span className="text-xs text-emerald-600 font-bold">
                      Previsão: {activeOrder.schedule.date ? new Date(activeOrder.schedule.date).toLocaleDateString('pt-BR') : 'Hoje'} ({activeOrder.schedule.shift === 'manha' ? 'Turno da Manhã' : 'Turno da Tarde'})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenReceipt(activeOrder)}
                  className="px-3.5 py-2 rounded-lg bg-[#08182B] hover:bg-[#050F1C] text-[#72BF44] border border-[#72BF44]/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5 text-[#72BF44]" />
                  <span className="text-white">DANFE / Recibo</span>
                </button>
              </div>

              {/* Visual Timeline */}
              <div className="py-2 overflow-x-auto">
                <div className="relative flex items-center justify-between min-w-[320px] px-2">
                  {/* Background line */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-200 -translate-y-1/2 z-0" />
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-[#72BF44] -translate-y-1/2 z-0 transition-all duration-500" 
                    style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                  />

                  {STATUS_STEPS.map((stepItem, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={stepItem.status} className="relative z-10 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          isDone 
                            ? 'bg-[#72BF44] border-[#72BF44] text-[#08182B] font-bold shadow-xs' 
                            : 'bg-white border-neutral-300 text-neutral-400'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4 text-[#08182B]" /> : <Clock className="w-4 h-4" />}
                        </div>
                        <span className={`text-[11px] mt-1.5 font-bold text-center max-w-20 hidden sm:block ${
                          isCurrent ? 'text-neutral-900' : isDone ? 'text-neutral-700' : 'text-neutral-400'
                        }`}>
                          {stepItem.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status details card */}
              <div className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-200 text-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <strong className="text-neutral-900 font-bold">{STATUS_STEPS[currentStepIdx]?.label}</strong>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-600">{STATUS_STEPS[currentStepIdx]?.description}</span>
                </div>
                <div className="text-[11px] text-neutral-500">
                  Transportadora: <strong>Frota Própria Vando Construção</strong> • Veículo: <strong>{vehicle.label} {activeOrder.schedule.vehiclePlate ? `(Placa ${activeOrder.schedule.vehiclePlate})` : ''}</strong> • Motorista: <strong>{activeOrder.schedule.driverName || 'Marcos Vinicius'}</strong>
                </div>
              </div>

            </div>

            {/* Items in this shipment */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                Materiais Inclusos no Envio ({activeOrder.items.length})
              </h3>

              <div className="space-y-2">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-10 h-10 object-cover rounded-lg border border-neutral-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <strong className="text-neutral-900 block font-bold">{item.product.name}</strong>
                        <span className="text-[11px] text-neutral-500">{item.product.unit}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-neutral-900 block">{item.quantity} unidades</span>
                      <span className="text-[11px] text-neutral-500">{formatCurrency(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Buyer & Destination Info */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-3 text-xs">
              <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                Destino e Comprador
              </h3>

              <div className="space-y-2 text-neutral-700">
                <div>
                  <span className="text-[11px] text-neutral-400 block">Comprador:</span>
                  <strong className="text-neutral-900 text-xs">{activeOrder.customer.name}</strong>
                </div>

                <div>
                  <span className="text-[11px] text-neutral-400 block">WhatsApp:</span>
                  <span className="text-neutral-800">{activeOrder.customer.phone}</span>
                </div>

                <div>
                  <span className="text-[11px] text-neutral-400 block">Endereço da Obra:</span>
                  <p className="text-neutral-800">
                    {activeOrder.customer.street}, {activeOrder.customer.number}
                    {activeOrder.customer.complement && ` (${activeOrder.customer.complement})`}
                  </p>
                  <p className="text-neutral-500 font-semibold">{activeOrder.customer.neighborhood} - {activeOrder.customer.city}</p>
                </div>

                {activeOrder.customer.referencePoint && (
                  <div>
                    <span className="text-[11px] text-neutral-400 block">Referência:</span>
                    <span className="text-neutral-600">{activeOrder.customer.referencePoint}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Valor dos Materiais:</span>
                  <span>{formatCurrency(activeOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Frete:</span>
                  <span>{formatCurrency(activeOrder.freightCost)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-neutral-900 pt-1 border-t border-neutral-200">
                  <span>Total da Venda:</span>
                  <span>{formatCurrency(activeOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-[#08182B] text-white p-5 rounded-xl border border-[#72BF44]/30 text-xs space-y-3">
              <strong className="text-white block font-black text-sm">Precisa falar com o motorista?</strong>
              <p className="text-neutral-300 text-xs">
                Nossa central de logística está à disposição para ajustes de horário e descarregamento no canteiro.
              </p>
              <a
                href={`https://wa.me/${STORE_INFO.whatsappRaw}?text=${encodeURIComponent(`Olá, gostaria de informações sobre o pedido ${activeOrder.code}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-lg bg-[#72BF44] hover:bg-[#62a738] text-[#08182B] font-black text-xs transition-all shadow-xs active:scale-95"
              >
                <Phone className="w-4 h-4 text-[#08182B]" />
                <span>WhatsApp Logística</span>
              </a>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg border border-neutral-200 text-center text-neutral-500 space-y-3">
          <Package className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="font-bold text-sm text-neutral-800">Nenhum pedido selecionado</h3>
          <p className="text-xs text-neutral-500">Pesquise pelo código do seu pedido acima.</p>
        </div>
      )}

    </div>
  );
};
