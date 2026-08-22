import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Truck, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  HardHat,
  Sparkles,
  QrCode,
  CreditCard,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { BudgetItem, CustomerInfo, DeliverySchedule, DeliveryShift, Order, PaymentMethod, VehicleType } from '../types';
import { NEIGHBORHOODS, STORE_INFO, VEHICLE_DETAILS } from '../data/mockData';
import { formatCurrency, formatWeight } from '../utils/storage';
import { useToast } from '../context/ToastContext';

interface DeliverySchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BudgetItem[];
  initialNeighborhood?: string;
  initialFreightCost?: number;
  initialPaymentMethod?: PaymentMethod;
  initialDiscount?: number;
  onOrderCompleted: (order: Order) => void;
}

export const DeliverySchedulingModal: React.FC<DeliverySchedulingModalProps> = ({
  isOpen,
  onClose,
  items,
  initialNeighborhood,
  initialFreightCost = 40.00,
  initialPaymentMethod = 'pix',
  initialDiscount = 0,
  onOrderCompleted
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('(81) ');
  const [document, setDocument] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState(initialNeighborhood || NEIGHBORHOODS[0].name);
  const [city, setCity] = useState('Recife / PE');
  const [referencePoint, setReferencePoint] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [unloadingNotes, setUnloadingNotes] = useState('');

  // Scheduling State
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [deliveryDate, setDeliveryDate] = useState(tomorrow);
  const [shift, setShift] = useState<DeliveryShift>('manha');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod);
  const [installments, setInstallments] = useState(1);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalWeightKg = items.reduce((sum, item) => sum + (item.product.weightKg * item.quantity), 0);
  
  const selectedNhObj = NEIGHBORHOODS.find(n => n.name === neighborhood) || NEIGHBORHOODS[0];
  const freightCost = selectedNhObj.freight;
  const discount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  const grandTotal = Math.max(0, subtotal - discount + freightCost);

  // Determine truck
  const recommendedVehicle: VehicleType = React.useMemo(() => {
    const hasBulkAggregate = items.some(i => i.product.id === 'mat-002' || i.product.id === 'mat-003');
    if (hasBulkAggregate) return 'caminhao_cacamba';
    if (totalWeightKg > 6000) return 'caminhao_truck';
    if (totalWeightKg > 650) return 'caminhao_toco';
    return 'fiorino';
  }, [items, totalWeightKg]);

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(recommendedVehicle);
  const toast = useToast();

  const handleSubmitSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !street.trim() || !number.trim()) {
      toast.warning('Por favor, preencha os campos obrigatórios (Nome, Telefone, Rua e Número).', 'Campos Incompletos');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `VAND-2026-${randomNum}`;

    const customer: CustomerInfo = {
      name,
      phone,
      document,
      street,
      number,
      complement,
      neighborhood,
      city,
      referencePoint,
      receiverName: receiverName || name,
      receiverPhone: receiverPhone || phone,
      notes: unloadingNotes
    };

    const schedule: DeliverySchedule = {
      date: deliveryDate,
      shift,
      vehicleType: selectedVehicle,
      freightCost,
      driverName: 'Marcos Silva (Frota Vando)',
      vehiclePlate: 'PEV-4H20',
      unloadingNotes
    };

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      code: orderCode,
      customer,
      items: [...items],
      schedule,
      subtotal,
      freightCost,
      discount,
      total: grandTotal,
      paymentMethod,
      installments: paymentMethod === 'cartao_credito' ? installments : undefined,
      status: 'confirmado',
      createdAt: new Date().toISOString(),
      statusHistory: [
        { status: 'orcamento', timestamp: new Date().toISOString(), note: 'Pedido criado no site' },
        { status: 'confirmado', timestamp: new Date().toISOString(), note: 'Pagamento aprovado' }
      ]
    };

    setCreatedOrder(newOrder);
    onOrderCompleted(newOrder);
    setStep('success');

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-neutral-200 shadow-2xl max-w-2xl w-full p-6 space-y-4 text-neutral-800 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#08182B] flex items-center justify-center text-[#72BF44] border border-[#72BF44]/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-neutral-900 leading-none uppercase">
                {step === 'form' ? 'Finalizar Compra & Agendar Entrega' : 'Pedido Confirmado com Sucesso!'}
              </h3>
              <span className="text-[11px] text-neutral-500 font-medium">
                {step === 'form' ? 'Vando Express • Entrega Rápida e Direta no Canteiro' : `Código: ${createdOrder?.code}`}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmitSchedule} className="space-y-4 text-xs">
            
            {/* Customer Contact */}
            <div className="space-y-2">
              <strong className="text-xs text-neutral-900 font-bold block border-b border-neutral-100 pb-1">
                1. Dados do Comprador / Responsável pela Obra:
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Nome Completo *:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo de Souza"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-medium focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">WhatsApp / Telefone *:</label>
                  <input
                    type="tel"
                    required
                    placeholder="(81) 98765-4321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-medium focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-2">
              <strong className="text-xs text-neutral-900 font-bold block border-b border-neutral-100 pb-1">
                2. Endereço do Canteiro / Local de Descarga:
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-700 mb-1">Rua / Avenida *:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Av. Governador Agamenon Magalhães"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-medium focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Número *:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 1420"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-medium focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Bairro de Entrega (RMR):</label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-medium focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  >
                    {NEIGHBORHOODS.map((nh) => (
                      <option key={nh.name} value={nh.name}>
                        {nh.name} (Frete {formatCurrency(nh.freight)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Ponto de Referência:</label>
                  <input
                    type="text"
                    placeholder="Ex: Próximo à praça / portão azul"
                    value={referencePoint}
                    onChange={(e) => setReferencePoint(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-medium focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Date & Shift */}
            <div className="space-y-2">
              <strong className="text-xs text-neutral-900 font-bold block border-b border-neutral-100 pb-1">
                3. Data e Turno da Entrega:
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Data Agendada:</label>
                  <input
                    type="date"
                    required
                    min={tomorrow}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-bold focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Turno de Descarga:</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as DeliveryShift)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-bold focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                  >
                    <option value="manha">Manhã (07:00h às 12:00h)</option>
                    <option value="tarde">Tarde (13:00h às 17:30h)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Summary & Submit Button */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-neutral-500 block">Total a Pagar:</span>
                <span className="text-lg font-black text-neutral-900 block">
                  {formatCurrency(grandTotal)}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">
                  {paymentMethod === 'pix' ? '5% OFF aplicado no PIX' : 'Cartão em até 12x'}
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#72BF44] hover:bg-[#62a738] text-[#08182B] font-black text-xs transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Confirmar e Agendar</span>
                <ArrowRight className="w-4 h-4 text-[#08182B]" />
              </button>
            </div>

          </form>
        ) : (
          /* Success Screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#72BF44]/20 text-[#08182B] flex items-center justify-center mx-auto border border-[#72BF44]/40">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-neutral-900 uppercase">
                Pedido Realizado no Vando Construção!
              </h3>
              <p className="text-xs text-neutral-600 max-w-md mx-auto">
                Sua entrega está agendada para <strong>{deliveryDate ? new Date(deliveryDate).toLocaleDateString('pt-BR') : 'amanhã'} ({shift === 'manha' ? 'Manhã' : 'Tarde'})</strong> com a frota própria da Vando Construção.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs max-w-md mx-auto text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Código do Pedido:</span>
                <strong className="text-neutral-900">{createdOrder?.code}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Valor Total:</span>
                <strong className="text-neutral-900">{formatCurrency(grandTotal)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Local de Entrega:</span>
                <span className="text-neutral-800">{neighborhood}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-[#08182B] text-[#72BF44] border border-[#72BF44]/30 font-black text-xs hover:bg-[#050F1C] transition-all shadow-xs"
              >
                Concluir e Voltar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
