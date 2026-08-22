import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Calculator, 
  Truck, 
  Search, 
  ShieldCheck, 
  Phone, 
  Menu, 
  X,
  Layers,
  MapPin,
  ChevronDown,
  Sparkles,
  Zap,
  Tag,
  Headphones,
  Store,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Logo } from './Logo';
import { ActiveTab, BudgetItem } from '../types';
import { STORE_INFO } from '../data/mockData';
import { formatCurrency } from '../utils/storage';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  budgetItems: BudgetItem[];
  onOpenBudgetDrawer: () => void;
  pendingOrdersCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  budgetItems,
  onOpenBudgetDrawer,
  pendingOrdersCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const totalItemsCount = budgetItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalSubtotal = budgetItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const navLinks: { id: ActiveTab; label: string; shortLabel: string; icon: React.ReactNode; badge?: number; highlight?: boolean }[] = [
    { id: 'catalogo', label: 'Catálogo de Produtos', shortLabel: 'Catálogo', icon: <Layers className="w-4 h-4" /> },
    { id: 'calculadora', label: 'Calculadora de Obra', shortLabel: 'Calculadora', icon: <Calculator className="w-4 h-4" /> },
    { id: 'agendamento', label: 'Agendar Entrega (Flex)', shortLabel: 'Entrega', icon: <Truck className="w-4 h-4" /> },
    { id: 'rastreamento', label: 'Rastrear Envio', shortLabel: 'Rastrear', icon: <Search className="w-4 h-4" /> },
    { id: 'admin', label: 'Área Administrativa', shortLabel: 'Admin', icon: <ShieldCheck className="w-4 h-4" />, badge: pendingOrdersCount, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#08182B] border-b border-[#72BF44]/40 shadow-md text-white">
      
      {/* Top Banner (Micro announcement on mobile and full bar on desktop) */}
      <div className="bg-[#050F1C] text-white text-[10px] sm:text-[11px] font-semibold px-2.5 sm:px-4 py-1 sm:py-1.5 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Mobile concise banner */}
          <div className="flex sm:hidden items-center justify-between w-full text-[10.5px]">
            <span className="flex items-center gap-1 text-[#72BF44] font-bold truncate">
              <Zap className="w-3 h-3 flex-shrink-0 fill-[#72BF44]" />
              <span>VANDO EXPRESS: Entregas em até 24h</span>
            </span>
            <a 
              href={`https://wa.me/${STORE_INFO.whatsappRaw}?text=${encodeURIComponent('Olá Vando Construção! Gostaria de falar com um atendente.')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#72BF44] font-bold flex-shrink-0 hover:underline"
            >
              <Phone className="w-3 h-3" />
              <span>(81) 98351-7307</span>
            </a>
          </div>

          {/* Desktop full banner */}
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#72BF44]">
              <Zap className="w-3.5 h-3.5 fill-[#72BF44]" />
              <span><strong>VANDO EXPRESS:</strong> Entregas rápidas no canteiro de obras em até 24h</span>
            </span>
            <span className="text-slate-500 text-[11px]">|</span>
            <span className="text-neutral-300">5% de desconto imediato pagando no PIX</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs">
            <a 
              href={`https://wa.me/${STORE_INFO.whatsappRaw}?text=${encodeURIComponent('Olá Vando Construção! Gostaria de falar com um atendente.')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#72BF44] hover:text-[#88dc55] font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp: (81) 98351-7307</span>
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-neutral-400">Seg a Sex 07h às 17h30 • Sáb até 12h</span>
          </div>
        </div>
      </div>

      {/* Main Top Header: Logo + Search Bar + Actions (Optimized for Mobile Touch) */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo Area */}
          <div 
            className="cursor-pointer transition-transform hover:opacity-95 flex-shrink-0"
            onClick={() => {
              setActiveTab('catalogo');
              setMobileMenuOpen(false);
            }}
          >
            {/* On small phones, render compact logo */}
            <div className="block sm:hidden">
              <Logo size="sm" variant="dark" showSlogan={false} />
            </div>
            <div className="hidden sm:block">
              <Logo size="md" variant="dark" />
            </div>
          </div>

          {/* Centered Search Bar (Desktop) */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative flex items-center shadow-xs rounded-md overflow-hidden bg-white border border-neutral-300 focus-within:border-[#72BF44] focus-within:ring-2 focus-within:ring-[#72BF44]/20 transition-all">
              <input
                type="text"
                placeholder="Buscar cimento, areia, brita, ferragens, tubos, tintas..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setActiveTab('catalogo');
                  }
                }}
                className="w-full px-4 py-2 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 bg-transparent focus:outline-none"
              />
              <button
                onClick={() => setActiveTab('catalogo')}
                className="px-4 py-2.5 bg-[#72BF44] hover:bg-[#62a738] text-white transition-colors flex items-center justify-center font-bold"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Right Area: WhatsApp Link + Cart Button + Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            
            {/* WhatsApp Quick Button (Desktop & Tablet) */}
            <a 
              href={`https://wa.me/${STORE_INFO.whatsappRaw}?text=${encodeURIComponent('Olá! Gostaria de fazer um orçamento de materiais.')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 bg-[#72BF44]/15 border border-[#72BF44]/40 hover:bg-[#72BF44]/25 px-3 py-1.5 rounded-md text-xs transition-colors"
            >
              <Phone className="w-4 h-4 text-[#72BF44]" />
              <div className="leading-tight text-left">
                <span className="font-bold text-[#72BF44] block text-[11px]">(81) 98351-7307</span>
                <span className="text-[10px] text-neutral-300">Orçamento no WhatsApp</span>
              </div>
            </a>

            {/* Direct WhatsApp icon button on mobile */}
            <a 
              href={`https://wa.me/${STORE_INFO.whatsappRaw}?text=${encodeURIComponent('Olá Vando Construção! Gostaria de fazer um orçamento.')}`}
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="WhatsApp Vando Construção"
              className="flex sm:hidden p-2 rounded-md bg-[#72BF44]/20 hover:bg-[#72BF44]/30 text-[#72BF44] border border-[#72BF44]/40"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Cart Button */}
            <button
              id="open-budget-drawer-btn"
              onClick={onOpenBudgetDrawer}
              className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white p-2 sm:px-3.5 sm:py-2 rounded-md border border-white/20 shadow-xs transition-all active:scale-95 group"
              aria-label="Abrir Orçamento e Carrinho"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-200 group-hover:text-[#72BF44] transition-colors" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-[#72BF44] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </div>

              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-neutral-300 font-medium">
                  Carrinho / Orçamento
                </span>
                <span className="text-xs font-black text-[#72BF44] mt-0.5">
                  {totalSubtotal > 0 ? formatCurrency(totalSubtotal) : 'R$ 0,00'}
                </span>
              </div>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 active:scale-95"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input bar (Always accessible right below header on phones) */}
        <div className="block md:hidden mt-2">
          <div className="relative flex items-center shadow-xs rounded-md overflow-hidden bg-white border border-neutral-300 focus-within:border-[#72BF44]">
            <input
              type="text"
              placeholder="Buscar cimento, areia, tubos, tintas..."
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setActiveTab('catalogo');
                }
              }}
              className="w-full pl-8 pr-2 py-1.5 text-xs text-neutral-900 placeholder-neutral-400 bg-transparent focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <button
              onClick={() => setActiveTab('catalogo')}
              className="px-3 py-1.5 bg-[#72BF44] hover:bg-[#62a738] text-white text-[11px] font-bold transition-colors flex items-center justify-center flex-shrink-0"
              aria-label="Buscar"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Header Navigation Bar / Quick Tabs Horizontal Scroll for Mobile */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 pb-1.5 sm:pb-2 pt-1 border-t border-white/10">
        <div className="flex items-center justify-between text-xs gap-2">
          
          {/* Location selector */}
          <div className="flex items-center gap-1 text-neutral-300 hover:text-white cursor-pointer group py-0.5 sm:py-1 flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[#72BF44] flex-shrink-0" />
            <div className="leading-tight">
              <span className="text-[9px] sm:text-[10px] text-neutral-400 block">Entregas em</span>
              <span className="font-semibold text-[11px] sm:text-xs text-white group-hover:underline truncate max-w-[140px] sm:max-w-none block">
                Recife e R.M. (PE)
              </span>
            </div>
          </div>

          {/* Quick horizontal scrollable tabs on mobile & full tabs on desktop */}
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-tab-${link.id}`}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`relative flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[11px] sm:text-xs transition-all font-medium flex-shrink-0 whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#72BF44] text-white font-bold shadow-xs' 
                      : 'text-neutral-300 hover:text-white hover:bg-white/10'
                  } ${link.highlight && !isActive ? 'text-[#72BF44] font-semibold border border-[#72BF44]/30' : ''}`}
                >
                  {link.icon}
                  {/* Short label on small screen, full label on md+ */}
                  <span className="sm:hidden">{link.shortLabel}</span>
                  <span className="hidden sm:inline">{link.label}</span>
                  {link.badge && link.badge > 0 ? (
                    <span className="px-1 py-0.2 text-[9px] font-bold rounded-full bg-rose-500 text-white">
                      {link.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Fast Contact Callout (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-neutral-300 flex-shrink-0">
            <span className="text-[11px] font-semibold text-[#72BF44] flex items-center gap-1">
              <Store className="w-3.5 h-3.5" />
              <span>Loja Oficial Vando Construção</span>
            </span>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A1C33] border-t border-white/10 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in duration-200">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 px-1">
            Menu de Navegação
          </div>

          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#72BF44] text-white font-bold shadow-xs'
                    : 'text-neutral-200 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.badge && link.badge > 0 ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                    {link.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          <div className="pt-3 border-t border-white/10 mt-3 space-y-2">
            <a 
              href={`https://wa.me/${STORE_INFO.whatsappRaw}?text=${encodeURIComponent('Olá! Gostaria de falar com o atendimento da Vando Construção.')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-[#72BF44] hover:bg-[#62a738] text-white font-black text-xs shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp: (81) 98351-7307</span>
            </a>

            <div className="flex items-center justify-between text-[10.5px] text-neutral-300 px-1 pt-1">
              <span className="flex items-center gap-1 text-[#72BF44]">
                <Clock className="w-3.5 h-3.5" />
                <span>07h às 17h30 (Seg-Sex)</span>
              </span>
              <span>Sábado: até 12h</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

