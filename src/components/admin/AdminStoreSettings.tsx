import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  Percent, 
  ShieldCheck, 
  Save, 
  Calculator,
  Building2,
  Sparkles
} from 'lucide-react';
import { StoreConfig } from '../../types';
import { addAuditLog } from '../../utils/storage';

interface AdminStoreSettingsProps {
  storeConfig: StoreConfig;
  onUpdateStoreConfig: (config: StoreConfig) => void;
}

export const AdminStoreSettings: React.FC<AdminStoreSettingsProps> = ({
  storeConfig,
  onUpdateStoreConfig
}) => {
  const [formData, setFormData] = useState<StoreConfig>({ ...storeConfig });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);

    addAuditLog({
      userName: 'Administrador Geral',
      action: 'Atualização de Configurações da Loja',
      details: 'Parâmetros comerciais e dados da empresa atualizados',
      type: 'config'
    });
  };

  return (
    <div className="space-y-6 text-neutral-800">
      
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#72BF44]" />
            <span>Configurações Gerais & Parâmetros Comerciais</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Gerencie dados cadastrais da Vando Construção, contatos de atendimento, descontos e taxas de cálculo.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Company Identity */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
            <Building2 className="w-4 h-4 text-[#72BF44]" />
            <h3 className="text-sm font-bold text-neutral-900">Identificação da Empresa & Razão Social</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-neutral-700">Nome Fantasia da Loja:</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-neutral-700">CNPJ Oficial:</label>
              <input
                type="text"
                required
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-mono text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-neutral-700">Slogan Principal:</label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-neutral-700">Tagline de Marca:</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contacts & Logistics Location */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
            <Phone className="w-4 h-4 text-[#72BF44]" />
            <h3 className="text-sm font-bold text-neutral-900">Atendimento, WhatsApp & Galpão</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-neutral-700">Telefone Fixo / Comercial:</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-neutral-700">WhatsApp de Vendas e Expedição (apenas dígitos com DDD):</label>
              <input
                type="text"
                value={formData.whatsappRaw}
                onChange={(e) => setFormData({ ...formData, whatsappRaw: e.target.value })}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-mono text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block font-bold text-neutral-700">Endereço do Centro de Distribuição / Galpão:</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block font-bold text-neutral-700">Horários de Operação e Carga:</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Commercial & Calculator Parameters */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
            <Percent className="w-4 h-4 text-[#72BF44]" />
            <h3 className="text-sm font-bold text-neutral-900">Parâmetros Financeiros, Descontos & Calculadora de Obra</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-neutral-700">Desconto Pagamento PIX (%):</label>
              <input
                type="number"
                min="0"
                max="30"
                value={formData.pixDiscountPercent}
                onChange={(e) => setFormData({ ...formData, pixDiscountPercent: Number(e.target.value) })}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-neutral-700">Parcelamento Máximo sem Juros (x):</label>
              <input
                type="number"
                min="1"
                max="24"
                value={formData.maxInstallments}
                onChange={(e) => setFormData({ ...formData, maxInstallments: Number(e.target.value) })}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-neutral-700">Margem de Perda Padrão da Calculadora (%):</label>
              <input
                type="number"
                min="0"
                max="25"
                value={formData.defaultLossMarginPercent}
                onChange={(e) => setFormData({ ...formData, defaultLossMarginPercent: Number(e.target.value) })}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block font-bold text-neutral-700">Chave PIX Oficial:</label>
              <input
                type="text"
                value={formData.pixKey}
                onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-mono text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-neutral-700">Beneficiário da Chave PIX:</label>
              <input
                type="text"
                value={formData.pixName}
                onChange={(e) => setFormData({ ...formData, pixName: e.target.value })}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 p-4 bg-white rounded-xl border border-neutral-200 shadow-xs">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#08182B] hover:bg-[#050F1C] text-[#72BF44] border border-[#72BF44]/30 text-xs font-bold transition-all shadow-xs active:scale-98"
          >
            <Save className="w-4 h-4 text-[#72BF44]" />
            <span className="text-white">Salvar Todas as Configurações</span>
          </button>
        </div>

      </form>

    </div>
  );
};
