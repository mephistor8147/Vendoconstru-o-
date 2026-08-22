import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  DollarSign, 
  Search, 
  CheckCircle2, 
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { NeighborhoodItem } from '../../types';
import { formatCurrency, addAuditLog } from '../../utils/storage';

interface AdminFreightsManagerProps {
  freights: NeighborhoodItem[];
  onUpdateFreights: (freights: NeighborhoodItem[]) => void;
}

export const AdminFreightsManager: React.FC<AdminFreightsManagerProps> = ({
  freights,
  onUpdateFreights
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NeighborhoodItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formFreight, setFormFreight] = useState(40);
  const [formTimeEst, setFormTimeEst] = useState('2h');
  const [formZone, setFormZone] = useState('Zona Sul');

  const filteredFreights = freights.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormFreight(45.00);
    setFormTimeEst('2h - 3h');
    setFormZone('Região Metropolitana');
    setShowModal(true);
  };

  const handleOpenEditModal = (item: NeighborhoodItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormFreight(item.freight);
    setFormTimeEst(item.timeEst);
    setFormZone(item.zone);
    setShowModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      const updated = freights.map(f => {
        if (f.id === editingItem.id) {
          return {
            ...f,
            name: formName,
            freight: Number(formFreight),
            timeEst: formTimeEst,
            zone: formZone
          };
        }
        return f;
      });
      onUpdateFreights(updated);
      addAuditLog({
        userName: 'Gestor de Logística',
        action: 'Atualização de Frete',
        details: `Bairro ${formName} atualizado para frete ${formatCurrency(formFreight)}`,
        type: 'frete'
      });
    } else {
      const newItem: NeighborhoodItem = {
        id: `nh-${Date.now()}`,
        name: formName,
        freight: Number(formFreight),
        timeEst: formTimeEst,
        zone: formZone,
        active: true
      };
      onUpdateFreights([...freights, newItem]);
      addAuditLog({
        userName: 'Gestor de Logística',
        action: 'Novo Bairro Cadastrado',
        details: `Bairro ${formName} adicionado à tabela de fretes`,
        type: 'frete'
      });
    }

    setShowModal(false);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`Remover "${name}" da tabela de fretes?`)) {
      const updated = freights.filter(f => f.id !== id);
      onUpdateFreights(updated);
      addAuditLog({
        userName: 'Gestor de Logística',
        action: 'Exclusão de Bairro',
        details: `Bairro ${name} removido da tabela de fretes`,
        type: 'frete'
      });
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = freights.map(f => f.id === id ? { ...f, active: !f.active } : f);
    onUpdateFreights(updated);
  };

  return (
    <div className="space-y-4 text-neutral-800">
      
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-neutral-900 flex items-center gap-2 uppercase">
            <MapPin className="w-5 h-5 text-[#72BF44]" />
            <span>Tabela de Fretes & Zonas de Entrega (RMR)</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Valores de frete base e prazos médios de entrega calculados para a Região Metropolitana do Recife.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#72BF44] hover:bg-[#62a738] text-[#08182B] text-xs font-black transition-all shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#08182B]" />
          <span>Cadastrar Novo Bairro / Região</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por bairro, cidade ou zona..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-[#72BF44] focus:bg-white"
          />
        </div>
      </div>

      {/* Mobile Freights Cards (visible on small screens) */}
      <div className="md:hidden space-y-3">
        {filteredFreights.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-neutral-500 text-xs shadow-xs">
            Nenhum bairro ou região encontrada.
          </div>
        ) : (
          filteredFreights.map((f) => (
            <div 
              key={f.id}
              className="bg-white rounded-xl border border-neutral-200 shadow-xs p-3.5 space-y-2.5 hover:border-neutral-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <strong className="text-xs font-black text-neutral-900 block">{f.name}</strong>
                  <span className="text-[10px] text-neutral-500 font-semibold">{f.zone}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleActive(f.id)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                    f.active !== false
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-neutral-100 text-neutral-500 border-neutral-300'
                  }`}
                >
                  {f.active !== false ? 'Ativo' : 'Inativo'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-neutral-100">
                <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-100">
                  <span className="text-[10px] text-neutral-400 block font-medium">Frete</span>
                  {f.freight === 0 ? (
                    <strong className="text-xs font-black text-emerald-700 block">GRÁTIS / BALCÃO</strong>
                  ) : (
                    <strong className="text-xs font-black text-neutral-900 block">{formatCurrency(f.freight)}</strong>
                  )}
                </div>

                <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-100">
                  <span className="text-[10px] text-neutral-400 block font-medium">Prazo de Entrega</span>
                  <div className="flex items-center gap-1 text-neutral-700 font-bold text-xs mt-0.5">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span>{f.timeEst}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-100">
                <button
                  onClick={() => handleOpenEditModal(f)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg border border-neutral-300 text-xs font-bold transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDeleteItem(f.id, f.name)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Freights Table */}
      <div className="hidden md:block bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs min-w-[550px]">
            <thead className="bg-[#08182B] text-white font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Bairro / Região</th>
                <th className="py-3 px-4">Zona Logística</th>
                <th className="py-3 px-4">Valor do Frete (R$)</th>
                <th className="py-3 px-4">Prazo Estimado</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredFreights.map((f) => {
                return (
                  <tr key={f.id} className="hover:bg-neutral-50/80 transition-colors">
                    
                    <td className="py-3 px-4 font-bold text-neutral-900">
                      {f.name}
                    </td>

                    <td className="py-3 px-4 text-neutral-600">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[10px] font-semibold">
                        {f.zone}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {f.freight === 0 ? (
                        <span className="px-2 py-0.5 rounded bg-[#72BF44]/20 text-[#08182B] font-black text-[10px]">
                          GRÁTIS / BALCÃO
                        </span>
                      ) : (
                        <strong className="text-neutral-900 text-xs font-bold">
                          {formatCurrency(f.freight)}
                        </strong>
                      )}
                    </td>

                    <td className="py-3 px-4 text-neutral-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{f.timeEst}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(f.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                          f.active !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-neutral-100 text-neutral-500 border-neutral-300'
                        }`}
                      >
                        {f.active !== false ? 'Ativo na Loja' : 'Inativo'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(f)}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg border border-neutral-300 transition-colors"
                          title="Editar Frete"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(f.id, f.name)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-colors"
                          title="Remover Bairro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Neighborhood Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            
            <div className="bg-[#08182B] text-white p-4 flex items-center justify-between border-b border-[#72BF44]/30">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#72BF44]" />
                <h3 className="font-black text-sm text-white uppercase">
                  {editingItem ? 'Editar Frete do Bairro' : 'Cadastrar Bairro / Região'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-neutral-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-5 space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <label className="block font-bold text-neutral-700">Nome do Bairro / Cidade:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Boa Viagem / Pina ou Olinda"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Valor do Frete (R$):</label>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    required
                    value={formFreight}
                    onChange={(e) => setFormFreight(Number(e.target.value))}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-900 focus:bg-white focus:border-[#72BF44]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Prazo Estimado:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 2h ou 2h - 3h"
                    value={formTimeEst}
                    onChange={(e) => setFormTimeEst(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-neutral-700">Zona Logística:</label>
                <select
                  value={formZone}
                  onChange={(e) => setFormZone(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44]"
                >
                  <option value="Zona Central">Zona Central</option>
                  <option value="Zona Sul">Zona Sul</option>
                  <option value="Zona Norte">Zona Norte</option>
                  <option value="Zona Oeste">Zona Oeste</option>
                  <option value="Região Metropolitana">Região Metropolitana</option>
                  <option value="Própria Loja">Própria Loja (Balcão)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#72BF44] hover:bg-[#62a738] text-[#08182B] font-black shadow-xs"
                >
                  {editingItem ? 'Salvar Alterações' : 'Cadastrar Bairro'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
