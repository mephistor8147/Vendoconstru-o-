import React, { useState } from 'react';
import { 
  Truck, 
  Car, 
  HardHat, 
  PackageCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  ShieldCheck, 
  X,
  Weight,
  Layers,
  Sparkles
} from 'lucide-react';
import { VehicleItem, Order } from '../../types';
import { formatWeight, addAuditLog } from '../../utils/storage';

interface AdminFleetManagerProps {
  vehicles: VehicleItem[];
  orders: Order[];
  onUpdateVehicles: (vehicles: VehicleItem[]) => void;
}

export const AdminFleetManager: React.FC<AdminFleetManagerProps> = ({
  vehicles,
  orders,
  onUpdateVehicles
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formLabel, setFormLabel] = useState('');
  const [formCapacity, setFormCapacity] = useState('');
  const [formMaxWeightKg, setFormMaxWeightKg] = useState(6000);
  const [formDriver, setFormDriver] = useState('');
  const [formPlate, setFormPlate] = useState('');
  const [formStatus, setFormStatus] = useState<VehicleItem['status']>('disponivel');
  const [formDesc, setFormDesc] = useState('');

  const getVehicleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car':
        return <Car className="w-5 h-5 text-sky-600" />;
      case 'HardHat':
        return <HardHat className="w-5 h-5 text-amber-600" />;
      case 'PackageCheck':
        return <PackageCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <Truck className="w-5 h-5 text-[#3483FA]" />;
    }
  };

  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setFormName('');
    setFormLabel('Caminhão / Utilitário');
    setFormCapacity('Até 4.000 kg');
    setFormMaxWeightKg(4000);
    setFormDriver('');
    setFormPlate('');
    setFormStatus('disponivel');
    setFormDesc('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (v: VehicleItem) => {
    setEditingVehicle(v);
    setFormName(v.name);
    setFormLabel(v.label);
    setFormCapacity(v.capacity);
    setFormMaxWeightKg(v.maxWeightKg);
    setFormDriver(v.driver);
    setFormPlate(v.plate);
    setFormStatus(v.status);
    setFormDesc(v.description);
    setShowAddModal(true);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPlate.trim()) return;

    if (editingVehicle) {
      const updated = vehicles.map(v => {
        if (v.id === editingVehicle.id) {
          return {
            ...v,
            name: formName,
            label: formLabel,
            capacity: formCapacity,
            maxWeightKg: Number(formMaxWeightKg),
            driver: formDriver,
            plate: formPlate.toUpperCase(),
            status: formStatus,
            description: formDesc || v.description
          };
        }
        return v;
      });
      onUpdateVehicles(updated);
      addAuditLog({
        userName: 'Operador Logístico',
        action: 'Atualização de Veículo',
        details: `Veículo ${formName} (${formPlate}) atualizado com sucesso`,
        type: 'veiculo'
      });
    } else {
      const newVeh: VehicleItem = {
        id: `veh-${Date.now()}`,
        key: `custom_${Date.now()}`,
        name: formName,
        label: formLabel,
        capacity: formCapacity,
        maxWeightKg: Number(formMaxWeightKg),
        driver: formDriver || 'A designar',
        plate: formPlate.toUpperCase(),
        status: formStatus,
        description: formDesc || 'Veículo integrado à frota oficial Vando Construção.',
        icon: 'Truck'
      };
      onUpdateVehicles([...vehicles, newVeh]);
      addAuditLog({
        userName: 'Operador Logístico',
        action: 'Cadastro de Novo Veículo',
        details: `Novo veículo ${formName} adicionado à frota`,
        type: 'veiculo'
      });
    }

    setShowAddModal(false);
  };

  const handleDeleteVehicle = (vehId: string, vehName: string) => {
    if (confirm(`Tem certeza que deseja desativar/remover o veículo "${vehName}" da frota?`)) {
      const updated = vehicles.filter(v => v.id !== vehId);
      onUpdateVehicles(updated);
      addAuditLog({
        userName: 'Operador Logístico',
        action: 'Exclusão de Veículo',
        details: `Veículo ${vehName} removido da frota`,
        type: 'veiculo'
      });
    }
  };

  const handleToggleStatus = (vehId: string, currentStatus: VehicleItem['status']) => {
    const nextStatus: VehicleItem['status'] = 
      currentStatus === 'disponivel' ? 'em_rota' :
      currentStatus === 'em_rota' ? 'manutencao' : 'disponivel';

    const updated = vehicles.map(v => v.id === vehId ? { ...v, status: nextStatus } : v);
    onUpdateVehicles(updated);
  };

  return (
    <div className="space-y-6 text-neutral-800">
      
      {/* Fleet Header */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-neutral-900 flex items-center gap-2 uppercase">
            <Truck className="w-5 h-5 text-[#72BF44]" />
            <span>Gestão da Frota Própria & Motoristas</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Controle de capacidade de carga, placas, motoristas dedicados e disponibilidade.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#72BF44] hover:bg-[#62a738] text-[#08182B] text-xs font-black transition-all shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#08182B]" />
          <span>Cadastrar Novo Veículo</span>
        </button>
      </div>

      {/* Vehicles Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((v) => {
          // Count active deliveries for this vehicle
          const activeOrders = orders.filter(
            o => (o.schedule.vehiclePlate === v.plate || o.schedule.vehicleType === v.key) && 
                 (o.status === 'em_separacao' || o.status === 'saiu_para_entrega')
          );

          const statusBadge = 
            v.status === 'disponivel' ? { bg: 'bg-[#72BF44]/20 text-[#08182B] border-[#72BF44]/40', text: 'Disponível no Galpão' } :
            v.status === 'em_rota' ? { bg: 'bg-[#08182B] text-[#72BF44] border-[#72BF44]/30', text: 'Em Rota de Entrega' } :
            { bg: 'bg-amber-100 text-amber-800 border-amber-300', text: 'Em Manutenção / Revisão' };

          return (
            <div 
              key={v.id}
              className="bg-white rounded-xl border border-neutral-200 shadow-xs p-4 sm:p-5 space-y-3.5 hover:border-neutral-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#08182B] text-[#72BF44] flex items-center justify-center border border-[#72BF44]/30">
                    <Truck className="w-5 h-5 text-[#72BF44]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-neutral-900 uppercase">{v.name}</h3>
                    <span className="text-xs text-neutral-500 font-semibold">{v.label}</span>
                  </div>
                </div>

                {/* Status Toggle Badge */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(v.id, v.status)}
                  title="Clique para alternar o status do veículo"
                  className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all ${statusBadge.bg}`}
                >
                  {statusBadge.text}
                </button>
              </div>

              {/* Specs & Driver info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                  <span className="text-[10px] text-neutral-500 block">Motorista Responsável</span>
                  <strong className="text-neutral-900 block truncate font-bold">{v.driver}</strong>
                </div>

                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                  <span className="text-[10px] text-neutral-500 block">Placa Registrada</span>
                  <strong className="text-neutral-900 font-mono block font-bold">{v.plate}</strong>
                </div>

                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                  <span className="text-[10px] text-neutral-500 block">Capacidade Máxima</span>
                  <strong className="text-neutral-900 block font-bold">{v.capacity}</strong>
                </div>

                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                  <span className="text-[10px] text-neutral-500 block">Cargas em Andamento</span>
                  <strong className="text-emerald-700 block font-bold">{activeOrders.length} ordens ativas</strong>
                </div>
              </div>

              <p className="text-xs text-neutral-600 italic">
                {v.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                <span className="text-[10px] text-neutral-400 font-mono">ID: {v.id}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(v)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-neutral-700 hover:bg-neutral-100 border border-neutral-300 font-semibold transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => handleDeleteVehicle(v.id, v.name)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 font-semibold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remover</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
            
            <div className="bg-[#08182B] text-white p-4 flex items-center justify-between border-b border-[#72BF44]/30">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#72BF44]" />
                <h3 className="font-black text-sm text-white uppercase">
                  {editingVehicle ? 'Editar Veículo da Frota' : 'Cadastrar Novo Veículo'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-neutral-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="p-5 space-y-3.5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Nome de Identificação:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Toco 03 ou Fiorino 02"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Categoria do Veículo:</label>
                  <input
                    type="text"
                    placeholder="Ex: Caminhão Toco (2 Eixos)"
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Motorista Responsável:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Marcos Vinicius"
                    value={formDriver}
                    onChange={(e) => setFormDriver(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Placa do Veículo:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: PEV-4H20"
                    value={formPlate}
                    onChange={(e) => setFormPlate(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-mono uppercase text-neutral-900 focus:bg-white focus:border-[#72BF44]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Capacidade Texto:</label>
                  <input
                    type="text"
                    placeholder="Ex: Até 6.000 kg (6 Toneladas)"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Status Operacional:</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as VehicleItem['status'])}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44]"
                  >
                    <option value="disponivel">Disponível no Galpão</option>
                    <option value="em_rota">Em Rota de Entrega</option>
                    <option value="manutencao">Em Manutenção</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-neutral-700">Finalidade / Descrição dos Materiais Transportados:</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Perfeito para cimento em sacos, pisos, ferragens e blocos de alvenaria."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#72BF44] hover:bg-[#62a738] text-[#08182B] font-black shadow-xs"
                >
                  {editingVehicle ? 'Salvar Modificações' : 'Cadastrar Veículo'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
