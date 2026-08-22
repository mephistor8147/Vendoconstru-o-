import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  Truck, 
  Boxes, 
  MapPin, 
  Settings, 
  Users, 
  LogOut, 
  Zap, 
  Award, 
  ShieldCheck,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { AdminSection, AdminUser } from '../../types';

interface AdminMenuNavProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  currentUser: AdminUser;
  onLogout: () => void;
  pendingOrdersCount: number;
  lowStockCount: number;
  activeVehiclesCount: number;
}

export const AdminMenuNav: React.FC<AdminMenuNavProps> = ({
  currentSection,
  onSelectSection,
  currentUser,
  onLogout,
  pendingOrdersCount,
  lowStockCount,
  activeVehiclesCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems: {
    id: AdminSection;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'metricas',
      label: 'Métricas & Reputação',
      description: 'KPIs, faturamento e termômetro Platinum',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'pedidos',
      label: 'Gestão de Pedidos',
      description: 'Fluxo de vendas, status e DANFE',
      icon: <Package className="w-4 h-4" />,
      badge: pendingOrdersCount,
      badgeColor: 'bg-[#72BF44] text-[#08182B]'
    },
    {
      id: 'logistica',
      label: 'Logística & Frota',
      description: 'Caminhões, motoristas e rotas',
      icon: <Truck className="w-4 h-4" />,
      badge: activeVehiclesCount,
      badgeColor: 'bg-[#72BF44] text-[#08182B]'
    },
    {
      id: 'estoque',
      label: 'Estoque & Catálogo',
      description: 'Preços, quantidades e novos materiais',
      icon: <Boxes className="w-4 h-4" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'fretes',
      label: 'Tabela de Fretes & Bairros',
      description: 'Valores e prazos por bairro na RMR',
      icon: <MapPin className="w-4 h-4" />
    },
    {
      id: 'configuracoes',
      label: 'Configurações da Loja',
      description: 'Dados da empresa, PIX e prazos',
      icon: <Settings className="w-4 h-4" />
    },
    {
      id: 'usuarios',
      label: 'Equipe & Auditoria',
      description: 'Contas de acesso e histórico de ações',
      icon: <Users className="w-4 h-4" />
    }
  ];

  const getRoleLabel = (role: AdminUser['role']) => {
    switch (role) {
      case 'admin_master':
        return 'Diretoria / Admin Master';
      case 'gerente_vendas':
        return 'Gerência Comercial';
      case 'operador_logistico':
        return 'Operações & Logística';
      default:
        return 'Administrador';
    }
  };

  const activeItem = menuItems.find(item => item.id === currentSection) || menuItems[0];

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
      
      {/* Top Header Row with Seller Info and Current User */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Store Title & Platinum Badge */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#08182B] flex items-center justify-center text-[#72BF44] shadow-xs flex-shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-black text-neutral-900 leading-tight uppercase">
                  Vando Construção
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-[#72BF44] text-[#08182B] flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 fill-[#08182B]" />
                  <span>PLATINUM</span>
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-neutral-500 block truncate max-w-[240px] sm:max-w-none">
                Painel Administrativo & Logístico
              </span>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold border border-neutral-200 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span className="text-[11px]">Módulos</span>
          </button>
        </div>

        {/* Right: Authenticated User Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-neutral-100">
          
          {/* User Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 sm:py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#08182B] text-[#72BF44] flex items-center justify-center font-black text-xs flex-shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left min-w-0">
              <div className="flex items-center gap-1">
                <strong className="text-[11px] sm:text-xs text-neutral-900 block truncate max-w-[110px] sm:max-w-[140px]">
                  {currentUser.name}
                </strong>
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#72BF44] flex-shrink-0" />
              </div>
              <span className="text-[9px] sm:text-[10px] text-neutral-500 block font-medium truncate max-w-[110px] sm:max-w-none">
                {getRoleLabel(currentUser.role)}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            id="admin-logout-btn"
            onClick={onLogout}
            title="Sair do Painel Administrativo"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[11px]">Sair</span>
          </button>

        </div>

      </div>

      {/* Mobile Drawer/Accordion of Menu Modules */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-100/90 p-2.5 border-b border-neutral-200 space-y-1.5 animate-fadeIn">
          <div className="text-[10px] uppercase font-black tracking-wider text-neutral-500 px-1">
            Selecione o Módulo de Gestão:
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {menuItems.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-[#08182B] text-white shadow-xs' 
                      : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#72BF44]' : 'text-neutral-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-[#72BF44] text-[#08182B]' : (item.badgeColor || 'bg-neutral-200 text-neutral-800')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Administrative Navigation Menu (Horizontal Scroll on Mobile, Flex on Desktop) */}
      <div className="bg-neutral-50/80 p-2 border-b border-neutral-200">
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {menuItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                id={`admin-menu-${item.id}`}
                onClick={() => onSelectSection(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#08182B] text-white shadow-xs'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200/80'
                }`}
              >
                <span className={isActive ? 'text-[#72BF44]' : 'text-neutral-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>

                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-[#72BF44] text-[#08182B]' : (item.badgeColor || 'bg-neutral-200 text-neutral-800')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

    </div>
  );
};
