import React from 'react';
import { 
  Calculator, 
  Truck, 
  ShieldCheck, 
  Tag, 
  Users, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  HardHat,
  CheckCircle2,
  Zap,
  CreditCard,
  Building2,
  Wrench,
  Droplets,
  Layers,
  Palette,
  Flame,
  Award
} from 'lucide-react';
import { CategoryId, ActiveTab } from '../types';
import { CATEGORIES, STORE_INFO } from '../data/mockData';

interface HeroBannerProps {
  selectedCategory: CategoryId | 'todos';
  onSelectCategory: (cat: CategoryId | 'todos') => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  selectedCategory,
  onSelectCategory,
  onNavigate
}) => {
  return (
    <section className="bg-neutral-100 pt-2.5 sm:pt-4 pb-4 sm:pb-6 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-3 sm:space-y-5">
        
        {/* Main Brand Promotional Carousel Banner */}
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-[#08182B] via-[#0D243F] to-[#08182B] text-white shadow-md p-4 sm:p-8 border border-neutral-800">
          
          {/* Subtle lime glow & decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#72BF44]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-20 w-60 h-60 bg-[#72BF44]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center relative z-10">
            
            {/* Left Side: Campaign Message from Instagram Flyer */}
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">
              
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded bg-[#72BF44] text-[#08182B] text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                  VANDO CONSTRUÇÃO
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 rounded bg-white/10 text-[#72BF44] border border-[#72BF44]/30 text-[10px] sm:text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>TUDO PARA CONSTRUIR SEUS SONHOS</span>
                </span>
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-white uppercase">
                  DO ALICERCE AO ACABAMENTO,
                </h1>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-[#72BF44] uppercase">
                  AQUI TEM TUDO PARA SUA OBRA!
                </h2>
              </div>

              <p className="text-[11.5px] sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
                Faça o seu orçamento com rapidez e entrega garantida no seu canteiro de obras. Cimento, areia, brita, tijolos, tubos, ferragens e tintas com o melhor custo-benefício de Recife e região.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
                <button
                  id="hero-calculator-cta"
                  onClick={() => onNavigate('calculadora')}
                  className="flex items-center justify-center gap-2 bg-[#72BF44] hover:bg-[#62a738] text-[#08182B] font-black px-4 sm:px-5 py-2.5 rounded-md text-xs sm:text-sm transition-all shadow-sm active:scale-95 group"
                >
                  <Calculator className="w-4 h-4 text-[#08182B]" />
                  <span>Calcular Materiais da Obra</span>
                  <ArrowRight className="w-4 h-4 text-[#08182B] group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  id="hero-schedule-cta"
                  onClick={() => onNavigate('agendamento')}
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-4 py-2.5 rounded-md text-xs sm:text-sm transition-all active:scale-95"
                >
                  <Truck className="w-4 h-4 text-[#72BF44]" />
                  <span>Agendar Entrega no Canteiro</span>
                </button>
              </div>

            </div>

            {/* Right Side: The 3 Core Pillars from the Instagram flyer */}
            <div className="lg:col-span-4 bg-white/5 backdrop-blur-xs border border-white/15 rounded-xl p-4.5 space-y-3.5">
              <div className="text-xs font-black text-[#72BF44] uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-2">
                <Award className="w-4 h-4 text-[#72BF44]" />
                <span>Nossos Diferenciais</span>
              </div>

              <div className="space-y-3 text-xs text-neutral-100">
                {/* 1. Qualidade Comprovada */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#72BF44]/20 border border-[#72BF44]/30 text-[#72BF44] flex items-center justify-center font-black flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block text-xs font-black uppercase tracking-wide">QUALIDADE COMPROVADA</strong>
                    <span className="text-[11px] text-neutral-300">Marcas líderes e materiais normatizados</span>
                  </div>
                </div>

                {/* 2. Preços Justos */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#72BF44]/20 border border-[#72BF44]/30 text-[#72BF44] flex items-center justify-center font-black flex-shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block text-xs font-black uppercase tracking-wide">PREÇOS JUSTOS</strong>
                    <span className="text-[11px] text-neutral-300">Condições facilitadas no PIX e parcelamento</span>
                  </div>
                </div>

                {/* 3. Atendimento de Confiança */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#72BF44]/20 border border-[#72BF44]/30 text-[#72BF44] flex items-center justify-center font-black flex-shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block text-xs font-black uppercase tracking-wide">ATENDIMENTO DE CONFIANÇA</strong>
                    <span className="text-[11px] text-neutral-300">Equipe técnica pronta para orientar sua obra</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Category Circles / Chips Strip */}
        <div className="bg-white rounded-xl border border-neutral-200/90 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide flex items-center gap-1.5">
              <span>Categorias em Destaque</span>
            </span>
            {selectedCategory !== 'todos' && (
              <button
                onClick={() => onSelectCategory('todos')}
                className="text-xs text-[#72BF44] hover:underline font-bold"
              >
                Ver todos os produtos
              </button>
            )}
          </div>

          {/* Category Pills List */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => onSelectCategory('todos')}
              className={`flex-shrink-0 px-3.5 py-2 rounded-md text-xs font-bold transition-all ${
                selectedCategory === 'todos'
                  ? 'bg-[#08182B] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Todos os Materiais
            </button>

            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-chip-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#72BF44] text-[#08182B] shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
