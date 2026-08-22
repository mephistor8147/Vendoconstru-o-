import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Package, 
  Truck, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Edit3, 
  Eye, 
  X, 
  Send, 
  Printer, 
  UserCheck, 
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  MapPin,
  DollarSign
} from 'lucide-react';
import { Order, OrderStatus, VehicleItem } from '../../types';
import { formatCurrency, formatWeight, formatStatusLabel, getStatusColor, updateOrderStatus, addAuditLog } from '../../utils/storage';

interface AdminOrdersManagerProps {
  orders: Order[];
  vehicles: VehicleItem[];
  onUpdateOrders: (orders: Order[]) => void;
  onViewOrderReceipt: (order: Order) => void;
}

export const AdminOrdersManager: React.FC<AdminOrdersManagerProps> = ({
  orders,
  vehicles,
  onUpdateOrders,
  onViewOrderReceipt
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'todos'>('todos');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Selected Order for Edit Details
  const [editDriverName, setEditDriverName] = useState('');
  const [editPlate, setEditPlate] = useState('');
  const [editVehicleType, setEditVehicleType] = useState('');

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      const matchesStatus = statusFilter === 'todos' || ord.status === statusFilter;
      const matchesSearch = 
        ord.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customer.phone.includes(searchQuery) ||
        ord.customer.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  // Handle Quick Status Change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus, `Atualizado via Painel Administrativo do Vendedor`);
    onUpdateOrders(updated);
    
    // Also update selectedOrder in modal if open
    if (selectedOrder && selectedOrder.id === orderId) {
      const found = updated.find(o => o.id === orderId);
      if (found) setSelectedOrder(found);
    }

    addAuditLog({
      userName: 'Operador Administrativo',
      action: 'Alteração de Status de Pedido',
      details: `Pedido #${orderId} alterado para "${formatStatusLabel(newStatus)}"`,
      type: 'pedido'
    });
  };

  // Open Edit Modal
  const handleOpenDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setEditDriverName(order.schedule.driverName || '');
    setEditPlate(order.schedule.vehiclePlate || '');
    setEditVehicleType(order.schedule.vehicleType || 'caminhao_toco');
    setAdminNoteInput(order.adminNotes || '');
  };

  // Save changes from Edit Modal
  const handleSaveOrderDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const updated = orders.map(ord => {
      if (ord.id === selectedOrder.id) {
        return {
          ...ord,
          adminNotes: adminNoteInput,
          schedule: {
            ...ord.schedule,
            driverName: editDriverName || ord.schedule.driverName,
            vehiclePlate: editPlate || ord.schedule.vehiclePlate,
            vehicleType: editVehicleType || ord.schedule.vehicleType
          }
        };
      }
      return ord;
    });

    onUpdateOrders(updated);
    const updatedSelected = updated.find(o => o.id === selectedOrder.id) || null;
    setSelectedOrder(updatedSelected);
    setIsEditingSchedule(false);

    addAuditLog({
      userName: 'Operador Administrativo',
      action: 'Edição de Dados de Pedido',
      details: `Atribuição logística e notas salvas para o pedido #${selectedOrder.code}`,
      type: 'pedido'
    });
  };

  // Assign vehicle preset
  const handleSelectVehiclePreset = (v: VehicleItem) => {
    setEditDriverName(v.driver);
    setEditPlate(v.plate);
    setEditVehicleType(v.key);
  };

  return (
    <div className="space-y-4 text-neutral-800">
      
      {/* Search & Filter Header Bar */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por código (#VAND-), cliente, telefone ou bairro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          <span className="text-xs text-neutral-500 font-bold flex items-center gap-1 pl-1">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Status:</span>
          </span>

          {(['todos', 'orcamento', 'confirmado', 'em_separacao', 'saiu_para_entrega', 'entregue', 'cancelado'] as const).map((st) => {
            const isSelected = statusFilter === st;
            const count = st === 'todos' ? orders.length : orders.filter(o => o.status === st).length;
            
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-[#08182B] text-[#72BF44] border border-[#72BF44]/40 shadow-2xs' 
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                <span>{st === 'todos' ? 'Todos' : formatStatusLabel(st)}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isSelected ? 'bg-[#72BF44] text-[#08182B]' : 'bg-neutral-200 text-neutral-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Mobile Orders Card View (visible on mobile / small screens) */}
      <div className="md:hidden space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-neutral-500 text-xs shadow-xs">
            Nenhum pedido encontrado para os filtros selecionados.
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const statusColors = getStatusColor(ord.status);
            const totalWeight = ord.items.reduce((s, it) => s + (it.product.weightKg * it.quantity), 0);

            return (
              <div 
                key={ord.id}
                className="bg-white rounded-xl border border-neutral-200 shadow-xs p-4 space-y-3 hover:border-neutral-300 transition-all"
              >
                {/* Top Row: Code, Date & Status */}
                <div className="flex items-start justify-between gap-2 border-b border-neutral-100 pb-2.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-sm text-[#08182B]">#{ord.code}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      {new Date(ord.createdAt).toLocaleDateString('pt-BR')} às {new Date(ord.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <select
                    value={ord.status}
                    onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                    className={`text-[11px] font-black px-2.5 py-1 rounded-lg border shadow-2xs focus:outline-none cursor-pointer ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                  >
                    <option value="orcamento">Orçamento Aberto</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="em_separacao">Separação FULL</option>
                    <option value="saiu_para_entrega">Em Rota Flex</option>
                    <option value="entregue">Entregue na Obra</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                {/* Customer & Location */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-neutral-900 font-bold block">{ord.customer.name}</strong>
                    <span className="text-[10px] text-neutral-500 font-mono">{ord.customer.phone}</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 truncate">
                    {ord.customer.neighborhood} - {ord.customer.street}, {ord.customer.number}
                  </p>
                </div>

                {/* Logistics & Financial Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-100">
                    <span className="text-[10px] text-neutral-400 block font-medium">Itens & Peso</span>
                    <strong className="text-neutral-800 font-bold block">
                      {ord.items.length} itens ({formatWeight(totalWeight)})
                    </strong>
                  </div>

                  <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-100">
                    <span className="text-[10px] text-neutral-400 block font-medium">Valor Total</span>
                    <strong className="text-neutral-900 font-black text-xs block">
                      {formatCurrency(ord.total)}
                    </strong>
                  </div>
                </div>

                {/* Delivery schedule / driver info */}
                <div className="flex items-center justify-between text-[11px] bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100">
                  <div className="flex items-center gap-1.5 text-neutral-700">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{new Date(ord.schedule.date + 'T12:00:00').toLocaleDateString('pt-BR')} ({ord.schedule.shift.toUpperCase()})</span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-600 font-medium">
                    <Truck className="w-3 h-3 text-[#72BF44]" />
                    <span className="truncate max-w-[120px]">{ord.schedule.driverName || 'Sem alocação'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-100">
                  <button
                    onClick={() => handleOpenDetailModal(ord)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detalhes / Frota</span>
                  </button>

                  <button
                    onClick={() => onViewOrderReceipt(ord)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#08182B] hover:bg-[#050F1C] text-[#72BF44] text-xs font-bold transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>DANFE / Cupom</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Desktop Orders Table (visible on md: screens and larger) */}
      <div className="hidden md:block bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-[#08182B] text-[#72BF44] font-black uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Código / Data</th>
                <th className="py-3 px-4">Cliente & Destino</th>
                <th className="py-3 px-4">Itens & Peso</th>
                <th className="py-3 px-4">Total & Pagamento</th>
                <th className="py-3 px-4">Agendamento & Frota</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    Nenhum pedido encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const statusColors = getStatusColor(ord.status);
                  const totalWeight = ord.items.reduce((s, it) => s + (it.product.weightKg * it.quantity), 0);

                  return (
                    <tr key={ord.id} className="hover:bg-neutral-50/80 transition-colors">
                      
                      {/* Code & Date */}
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#08182B] font-black">#{ord.code}</span>
                        </div>
                        <div className="text-[11px] font-normal text-neutral-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(ord.createdAt).toLocaleDateString('pt-BR')} {new Date(ord.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>

                      {/* Customer & Address */}
                      <td className="py-3 px-4 max-w-[220px]">
                        <strong className="text-neutral-900 block truncate" title={ord.customer.name}>
                          {ord.customer.name}
                        </strong>
                        <span className="text-neutral-500 text-[11px] block truncate">
                          {ord.customer.neighborhood} - {ord.customer.street}, {ord.customer.number}
                        </span>
                        <span className="text-[10px] text-neutral-400 block font-mono">
                          {ord.customer.phone}
                        </span>
                      </td>

                      {/* Items & Weight */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-neutral-800">
                          {ord.items.length} {ord.items.length === 1 ? 'material' : 'materiais'}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Peso: <strong>{formatWeight(totalWeight)}</strong>
                        </div>
                      </td>

                      {/* Total & Payment */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <strong className="text-neutral-900 text-xs font-bold block">
                          {formatCurrency(ord.total)}
                        </strong>
                        <span className="text-[11px] text-neutral-500 uppercase font-medium">
                          {ord.paymentMethod.replace('_', ' ')}
                          {ord.installments ? ` (${ord.installments}x)` : ''}
                        </span>
                      </td>

                      {/* Schedule & Fleet */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-neutral-700 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{new Date(ord.schedule.date + 'T12:00:00').toLocaleDateString('pt-BR')} ({ord.schedule.shift.toUpperCase()})</span>
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-[#72BF44]" />
                          <span>{ord.schedule.driverName || 'Pendente de Alocação'}</span>
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border shadow-2xs focus:outline-none cursor-pointer ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                        >
                          <option value="orcamento">Orçamento Aberto</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="em_separacao">Separação FULL</option>
                          <option value="saiu_para_entrega">Em Rota Flex</option>
                          <option value="entregue">Entregue na Obra</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetailModal(ord)}
                            title="Ver Detalhes e Gerenciar Logística"
                            className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg border border-neutral-300 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onViewOrderReceipt(ord)}
                            title="Imprimir DANFE / Romaneio de Carga"
                            className="p-1.5 bg-[#08182B] hover:bg-[#050F1C] text-[#72BF44] rounded-lg border border-[#72BF44]/30 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Fleet Assignment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
            
            {/* Modal Header */}
            <div className="bg-[#08182B] text-white p-4 flex items-center justify-between border-b border-[#72BF44]/30">
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-[#72BF44]" />
                <div>
                  <h3 className="font-black text-sm text-white uppercase">
                    Gestão do Pedido #{selectedOrder.code}
                  </h3>
                  <span className="text-[11px] text-neutral-300 block">
                    Cadastrado em {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-neutral-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Status and Fast Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 gap-3">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Status Atual do Envio:</span>
                  <strong className="text-sm font-black text-[#08182B]">
                    {formatStatusLabel(selectedOrder.status)}
                  </strong>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedOrder.status !== 'entregue' && selectedOrder.status !== 'cancelado' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedOrder.status === 'orcamento') handleStatusChange(selectedOrder.id, 'confirmado');
                        else if (selectedOrder.status === 'confirmado') handleStatusChange(selectedOrder.id, 'em_separacao');
                        else if (selectedOrder.status === 'em_separacao') handleStatusChange(selectedOrder.id, 'saiu_para_entrega');
                        else if (selectedOrder.status === 'saiu_para_entrega') handleStatusChange(selectedOrder.id, 'entregue');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#72BF44] hover:bg-[#62a738] text-[#08182B] font-black transition-all flex items-center gap-1 shadow-xs active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#08182B]" />
                      <span>Avançar Etapa</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onViewOrderReceipt(selectedOrder)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold transition-colors flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir DANFE</span>
                  </button>
                </div>
              </div>

              {/* Customer & Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="font-bold text-[#08182B] block text-xs">Dados do Cliente</span>
                  <p className="text-neutral-700"><strong>Nome:</strong> {selectedOrder.customer.name}</p>
                  <p className="text-neutral-700"><strong>Telefone:</strong> {selectedOrder.customer.phone}</p>
                  {selectedOrder.customer.document && (
                    <p className="text-neutral-700"><strong>CPF/CNPJ:</strong> {selectedOrder.customer.document}</p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="font-bold text-[#08182B] block text-xs">Endereço de Entrega</span>
                  <p className="text-neutral-700">
                    {selectedOrder.customer.street}, {selectedOrder.customer.number}
                  </p>
                  <p className="text-neutral-700">
                    {selectedOrder.customer.neighborhood} - {selectedOrder.customer.city}
                  </p>
                  {selectedOrder.customer.referencePoint && (
                    <p className="text-neutral-500 italic text-[11px]">
                      Ref: {selectedOrder.customer.referencePoint}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items List */}
              <div className="space-y-1.5">
                <span className="font-bold text-[#08182B] block text-xs">Materiais Solicitados ({selectedOrder.items.length})</span>
                <div className="border border-neutral-200 rounded-xl divide-y divide-neutral-100 max-h-36 overflow-y-auto">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#72BF44]/20 text-[#08182B] font-bold flex items-center justify-center text-[10px]">
                          {it.quantity}x
                        </span>
                        <span className="font-medium text-neutral-900">{it.product.name}</span>
                      </div>
                      <span className="font-bold text-neutral-900">
                        {formatCurrency(it.product.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500">Subtotal: {formatCurrency(selectedOrder.subtotal)} | Frete: {formatCurrency(selectedOrder.freightCost)}</span>
                  {selectedOrder.discount > 0 && (
                    <span className="text-emerald-600 block font-semibold">Desconto: -{formatCurrency(selectedOrder.discount)}</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 block text-[10px]">Total Geral</span>
                  <strong className="text-base text-neutral-900 font-black">
                    {formatCurrency(selectedOrder.total)}
                  </strong>
                </div>
              </div>

              {/* Fleet & Driver Assignment Form */}
              <form onSubmit={handleSaveOrderDetails} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#08182B] flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#72BF44]" />
                    <span>Alocação Logística de Frota & Motorista</span>
                  </span>
                  <span className="text-[10px] text-neutral-500">Selecione um veículo cadastrado:</span>
                </div>

                {/* Fast vehicle select pill buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {vehicles.map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleSelectVehiclePreset(v)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                        editPlate === v.plate 
                          ? 'bg-[#08182B] text-[#72BF44] border-[#72BF44]/40' 
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                      }`}
                    >
                      {v.name} ({v.plate})
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700">Nome do Motorista:</label>
                    <input
                      type="text"
                      value={editDriverName}
                      onChange={(e) => setEditDriverName(e.target.value)}
                      placeholder="Ex: Claudio Ferreira"
                      className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-[#72BF44]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700">Placa do Veículo:</label>
                    <input
                      type="text"
                      value={editPlate}
                      onChange={(e) => setEditPlate(e.target.value)}
                      placeholder="Ex: KLD-9A12"
                      className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 font-mono focus:outline-none focus:border-[#72BF44]"
                    />
                  </div>
                </div>

                {/* Internal Notes */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700">Observações Internas do Vendedor / Expedição:</label>
                  <textarea
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="Instruções de carregamento, notas da obra, etc."
                    rows={2}
                    className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-[#72BF44]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#72BF44] hover:bg-[#62a738] text-[#08182B] font-black text-xs transition-colors shadow-xs"
                  >
                    Salvar Alterações do Pedido
                  </button>
                </div>
              </form>

            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-neutral-100 border-t border-neutral-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
