import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  Phone, 
  FileText, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Truck, 
  CreditCard,
  QrCode,
  Zap,
  Building2
} from 'lucide-react';
import { Order, BudgetItem } from '../types';
import { STORE_INFO, VEHICLE_DETAILS } from '../data/mockData';
import { formatCurrency, formatWeight, formatStatusLabel, getStatusColor } from '../utils/storage';
import { Logo } from './Logo';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
  budgetItems?: BudgetItem[];
  freightCost?: number;
  discount?: number;
  customerName?: string;
  deliveryNeighborhood?: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  order,
  budgetItems = [],
  freightCost = 40,
  discount = 0,
  customerName = 'Cliente da Obra',
  deliveryNeighborhood = 'Recife / PE'
}) => {
  if (!isOpen) return null;

  const items = order ? order.items : budgetItems;
  const subtotal = items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
  const totalWeightKg = items.reduce((sum, i) => sum + (i.product.weightKg * i.quantity), 0);
  const finalDiscount = order ? order.discount : discount;
  const finalFreight = order ? order.freightCost : freightCost;
  const total = order ? order.total : Math.max(0, subtotal - finalDiscount + finalFreight);
  const orderCode = order ? order.code : `ORC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderDate = order ? new Date(order.createdAt).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 no-print">
      <div className="relative w-full max-w-3xl bg-white rounded-lg border border-neutral-300 shadow-2xl overflow-hidden my-8 text-neutral-800">
        
        {/* Modal Toolbar (hidden on print) */}
        <div className="p-3.5 bg-[#08182B] text-white border-b border-[#72BF44]/30 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-200">
            <FileText className="w-4 h-4 text-[#72BF44]" />
            <span>Documento Auxiliar / DANFE Simplificada Vando Construção</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#72BF44] hover:bg-[#62a738] text-[#08182B] text-xs font-black transition-all shadow-xs active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#08182B]" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-300 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet (Standard A4 / DANFE format) */}
        <div className="p-6 sm:p-8 bg-white text-neutral-900 print-area space-y-5 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-neutral-900 pb-4">
            <div className="space-y-1">
              <Logo size="md" variant="dark" />
              <div className="text-xs text-neutral-600 space-y-0.5 mt-1">
                <p className="font-semibold">{STORE_INFO.name} - CNPJ: 28.940.112/0001-44</p>
                <p>📍 {STORE_INFO.address}</p>
                <p>📞 WhatsApp / Central de Vendas: <strong>(81) 98351-7307</strong></p>
              </div>
            </div>

            <div className="text-right bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Número do Pedido</span>
              <strong className="text-base font-extrabold text-neutral-900 block">{orderCode}</strong>
              <span className="text-xs text-neutral-500">Emissão: {orderDate}</span>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-neutral-50 p-3.5 rounded-lg border border-neutral-200">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">Dados do Cliente / Obra:</span>
              <p className="font-bold text-neutral-900 text-sm mt-0.5">{order ? order.customer.name : customerName}</p>
              <p className="text-neutral-600">WhatsApp: {order ? order.customer.phone : '(81) 98351-7307'}</p>
              {order?.customer.document && <p className="text-neutral-600">CPF/CNPJ: {order.customer.document}</p>}
            </div>

            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">Local de Entrega & Despacho:</span>
              <p className="text-neutral-800 font-semibold mt-0.5">
                {order ? `${order.customer.street}, ${order.customer.number}` : 'A Combinar'}
              </p>
              <p className="text-neutral-600">
                Bairro: <strong>{order ? order.customer.neighborhood : deliveryNeighborhood}</strong>
              </p>
              <p className="text-neutral-600">
                Previsão: <strong>{order?.schedule.date ? new Date(order.schedule.date).toLocaleDateString('pt-BR') : 'Imediata'} ({order?.schedule.shift === 'manha' ? 'Manhã' : 'Tarde'})</strong>
              </p>
            </div>
          </div>

          {/* Table of Materials */}
          <div className="border border-neutral-200 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[480px]">
              <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                <tr>
                  <th className="p-2.5">Item / Descrição do Material</th>
                  <th className="p-2.5 text-center">Qtd</th>
                  <th className="p-2.5 text-right">Unitário</th>
                  <th className="p-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5">
                      <strong className="block text-neutral-900">{it.product.name}</strong>
                      <span className="text-[10px] text-neutral-500">{it.product.unit} • {formatWeight(it.product.weightKg)}</span>
                    </td>
                    <td className="p-2.5 text-center font-bold text-neutral-800">{it.quantity}</td>
                    <td className="p-2.5 text-right text-neutral-700">{formatCurrency(it.product.price)}</td>
                    <td className="p-2.5 text-right font-bold text-neutral-900">{formatCurrency(it.product.price * it.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t border-neutral-200 pt-3 text-xs">
            <div className="space-y-1 text-neutral-600">
              <p>Forma de Pagamento: <strong>{order?.paymentMethod === 'pix' ? 'PIX (5% de desconto)' : 'Cartão de Crédito'}</strong></p>
              <p>Peso Total da Carga: <strong>{formatWeight(totalWeightKg)}</strong></p>
              <p>Transporte: <strong>Vando Express (Frota Própria)</strong></p>
            </div>

            <div className="w-full sm:w-64 space-y-1 text-right bg-neutral-50 p-3.5 rounded-lg border border-neutral-200">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal dos Materiais:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {finalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Desconto PIX:</span>
                  <span>- {formatCurrency(finalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Frete Express:</span>
                <span>{formatCurrency(finalFreight)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-neutral-900 pt-1 border-t border-neutral-200">
                <span>Total a Pagar:</span>
                <span className="text-[#08182B]">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-dashed border-neutral-300 grid grid-cols-2 gap-8 text-center text-xs text-neutral-500">
            <div>
              <div className="border-t border-neutral-400 mx-auto w-40 pt-1" />
              <span>Assinatura do Recebedor na Obra</span>
            </div>
            <div>
              <div className="border-t border-neutral-400 mx-auto w-40 pt-1" />
              <span>Vando Construção - Expedição</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
