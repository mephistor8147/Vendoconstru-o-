import React, { useState, useMemo } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Truck, 
  CreditCard, 
  QrCode, 
  ArrowRight, 
  Weight, 
  AlertCircle, 
  FileText, 
  Share2, 
  Phone, 
  CheckCircle, 
  HelpCircle,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { BudgetItem, PaymentMethod, Product } from '../types';
import { NEIGHBORHOODS, STORE_INFO, VEHICLE_DETAILS } from '../data/mockData';
import { formatCurrency, formatWeight } from '../utils/storage';

interface BudgetSummaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: BudgetItem[];
  onUpdateQuantity: (product: Product, quantity: number) => void;
  onClearBudget: () => void;
  onProceedToSchedule: (data: {
    neighborhood: string;
    freightCost: number;
    paymentMethod: PaymentMethod;
    discount: number;
  }) => void;
  onOpenReceipt: () => void;
}

export const BudgetSummaryDrawer: React.FC<BudgetSummaryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearBudget,
  onProceedToSchedule,
  onOpenReceipt
}) => {
  const [selectedNeighborhoodIndex, setSelectedNeighborhoodIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');

  const selectedNeighborhood = NEIGHBORHOODS[selectedNeighborhoodIndex] || NEIGHBORHOODS[0];
  const freightCost = selectedNeighborhood.freight;

  // Calculate totals
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [items]);

  const totalWeightKg = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.product.weightKg * item.quantity), 0);
  }, [items]);

  // Determine appropriate delivery truck
  const recommendedVehicle = useMemo(() => {
    const hasBulkAggregate = items.some(i => i.product.id === 'mat-002' || i.product.id === 'mat-003');
    if (hasBulkAggregate) return 'caminhao_cacamba';
    if (totalWeightKg > 6000) return 'caminhao_truck';
    if (totalWeightKg > 650) return 'caminhao_toco';
    return 'fiorino';
  }, [items, totalWeightKg]);

  const vehicleInfo = VEHICLE_DETAILS[recommendedVehicle] || VEHICLE_DETAILS.fiorino;

  // 5% discount for PIX
  const discount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  const grandTotal = Math.max(0, subtotal - discount + freightCost);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md md:max-w-lg bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between text-neutral-800">
          
          {/* Header */}
          <div className="p-4 border-b border-[#72BF44]/30 flex items-center justify-between bg-[#08182B] text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#72BF44] flex items-center justify-center text-[#08182B] shadow-xs">
                <ShoppingBag className="w-5 h-5 text-[#08182B]" />
              </div>
              <div>
                <h3 className="font-black text-base text-white uppercase leading-none">
                  Carrinho da Obra
                </h3>
                <span className="text-xs text-neutral-300 font-medium">
                  {items.length} {items.length === 1 ? 'material selecionado' : 'materiais selecionados'}
                </span>
              </div>
            </div>

            <button
              id="close-budget-drawer-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Empty State */}
            {items.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
                <h4 className="font-bold text-sm text-neutral-800">Seu carrinho está vazio</h4>
                <p className="text-xs text-neutral-500">
                  Navegue pelo catálogo ou use nossa calculadora de obra para adicionar cimento, tijolos e insumos.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-[#72BF44] text-[#08182B] font-black text-xs hover:bg-[#62a738] transition-colors"
                >
                  Ir para o Catálogo
                </button>
              </div>
            ) : (
              <>
                {/* Free shipping banner if over R$ 150 */}
                <div className="p-3 rounded-lg bg-[#72BF44]/20 border border-[#72BF44]/40 flex items-center gap-2.5 text-xs">
                  <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0 fill-emerald-600" />
                  <div>
                    <span className="font-black text-[#08182B] block uppercase tracking-wider text-[11px]">Vando Express Flex</span>
                    <span className="text-neutral-700 text-[11px]">Entregas expressas no canteiro de obras da RMR com frota própria.</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-neutral-500 font-bold border-b border-neutral-100 pb-1">
                    <span>Materiais no Carrinho</span>
                    <button
                      onClick={onClearBudget}
                      className="text-red-500 hover:text-red-700 hover:underline font-semibold"
                    >
                      Esvaziar Carrinho
                    </button>
                  </div>

                  {items.map((item) => (
                    <div 
                      key={item.product.id}
                      className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-lg border border-neutral-200 flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <strong className="text-neutral-900 block truncate font-bold">{item.product.name}</strong>
                        <span className="text-[11px] text-neutral-500">
                          {formatCurrency(item.product.price)} / {item.product.unit}
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-1.5 flex-shrink-0 bg-white border border-neutral-300 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product, item.quantity - 1)}
                          className="w-6 h-6 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-neutral-900 text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-[#72BF44] text-[#08182B] font-bold flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right flex-shrink-0 min-w-16">
                        <strong className="text-neutral-900 block font-bold">
                          {formatCurrency(item.product.price * item.quantity)}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Neighborhood / Freight Selector */}
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#72BF44]" />
                      <span>Calcular Frete por Bairro:</span>
                    </span>
                    <strong className="text-neutral-900">{formatCurrency(freightCost)}</strong>
                  </div>

                  <select
                    value={selectedNeighborhoodIndex}
                    onChange={(e) => setSelectedNeighborhoodIndex(parseInt(e.target.value))}
                    className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-semibold focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20"
                  >
                    {NEIGHBORHOODS.map((nh, idx) => (
                      <option key={nh.name} value={idx}>
                        {nh.name} ({nh.timeEst}) - Frete: {formatCurrency(nh.freight)}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                    <span>Veículo Recomendado: <strong>{vehicleInfo.label}</strong></span>
                    <span>Carga: <strong>{formatWeight(totalWeightKg)}</strong></span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs">
                  <span className="font-bold text-neutral-800 block">Forma de Pagamento:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-2.5 rounded-lg text-center border transition-all ${
                        paymentMethod === 'pix'
                          ? 'bg-[#72BF44]/20 border-[#72BF44] text-[#08182B] font-black ring-1 ring-[#72BF44]'
                          : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <QrCode className="w-4 h-4 text-emerald-600" />
                        <span>PIX (5% OFF)</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cartao_credito')}
                      className={`p-2.5 rounded-lg text-center border transition-all ${
                        paymentMethod === 'cartao_credito'
                          ? 'bg-[#08182B] border-[#08182B] text-[#72BF44] font-black'
                          : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-[#72BF44]" />
                        <span>Cartão em 12x</span>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Footer Summary & Checkout Actions */}
          {items.length > 0 && (
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal dos Materiais:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Desconto PIX (5%):</span>
                    <span>- {formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Frete ({selectedNeighborhood.name}):</span>
                  <span>{formatCurrency(freightCost)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-1 border-t border-neutral-200">
                  <span>Total da Compra:</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={onOpenReceipt}
                  className="py-2.5 px-3 rounded-lg bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold border border-neutral-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-neutral-600" />
                  <span>Ver DANFE / PDF</span>
                </button>

                <button
                  onClick={() => onProceedToSchedule({
                    neighborhood: selectedNeighborhood.name,
                    freightCost,
                    paymentMethod,
                    discount
                  })}
                  className="py-2.5 px-3 rounded-lg bg-[#72BF44] hover:bg-[#62a738] text-[#08182B] text-xs font-black transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>Continuar a Compra</span>
                  <ArrowRight className="w-4 h-4 text-[#08182B]" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
