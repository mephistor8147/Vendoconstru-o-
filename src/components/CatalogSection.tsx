import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  ArrowUpDown, 
  Calculator, 
  Truck, 
  Sparkles,
  SlidersHorizontal,
  PackageOpen,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Product, BudgetItem, CategoryId, ActiveTab } from '../types';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/mockData';

interface CatalogSectionProps {
  products: Product[];
  budgetItems: BudgetItem[];
  selectedCategory: CategoryId | 'todos';
  onSelectCategory: (cat: CategoryId | 'todos') => void;
  onUpdateQuantity: (product: Product, quantity: number) => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  budgetItems,
  selectedCategory,
  onSelectCategory,
  onUpdateQuantity,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'name'>('popular');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'todos' || p.category === selectedCategory;
        const matchesSearch = 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const budgetItemMap = useMemo(() => {
    const map = new Map<string, BudgetItem>();
    budgetItems.forEach(item => map.set(item.product.id, item));
    return map;
  }, [budgetItems]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Search and Filters Bar in Mercado Livre Style */}
      <div className="bg-white p-3.5 rounded-lg border border-neutral-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            id="catalog-search-input"
            type="text"
            placeholder="Filtrar por nome do material (ex: cimento, tijolo, areia, tubos)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-300 rounded-sm pl-9 pr-4 py-1.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#3483FA] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2 text-xs text-neutral-400 hover:text-neutral-700"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-semibold flex-shrink-0">
            Ordenar por:
          </span>

          <select
            id="catalog-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-neutral-300 text-neutral-800 text-xs font-semibold rounded-sm px-3 py-1.5 focus:outline-none focus:border-[#3483FA] cursor-pointer"
          >
            <option value="popular">Mais Populares / Destaques</option>
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
            <option value="name">Nome (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Quick Calculator Callout Banner */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-[#FFE600] flex items-center justify-center text-[#2D3277] flex-shrink-0 shadow-xs">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 text-sm">
              Não sabe a quantidade exata de materiais para sua obra?
            </h4>
            <p className="text-xs text-neutral-600">
              Utilize nossa <strong>Calculadora de Obra em Tempo Real</strong> para paredes, contrapisos, pintura e lajes.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('calculadora')}
          className="flex-shrink-0 px-4 py-2 rounded-sm bg-[#3483FA] hover:bg-[#2968C8] text-white font-bold text-xs transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
        >
          <span>Calcular Agora</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span>Resultados de Materiais</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 font-semibold">
              {filteredProducts.length} itens disponíveis
            </span>
          </h2>
          <p className="text-xs text-neutral-500">
            {selectedCategory === 'todos' 
              ? 'Todos os materiais disponíveis para entrega imediata (FULL)' 
              : `Filtrado por: ${CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory}`}
          </p>
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currentBudgetItem={budgetItemMap.get(product.id)}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-3">
          <PackageOpen className="w-12 h-12 text-neutral-400 mx-auto" />
          <h3 className="font-bold text-sm text-neutral-900">
            Nenhum produto encontrado
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Não encontramos resultados para "{searchQuery}". Tente usar termos mais genéricos como "cimento", "areia", "tinta" ou "tubo".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('todos');
            }}
            className="px-4 py-2 rounded-sm bg-[#3483FA] text-white text-xs font-bold hover:bg-[#2968C8] transition-colors"
          >
            Limpar Filtros de Busca
          </button>
        </div>
      )}
    </section>
  );
};
