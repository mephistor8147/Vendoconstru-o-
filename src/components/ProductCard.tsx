import React from 'react';
import { 
  Plus, 
  Minus, 
  Check, 
  Weight, 
  Truck, 
  Star, 
  Sparkles, 
  Zap,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { Product, BudgetItem } from '../types';
import { formatCurrency, formatWeight } from '../utils/storage';

interface ProductCardProps {
  product: Product;
  currentBudgetItem?: BudgetItem;
  onUpdateQuantity: (product: Product, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentBudgetItem,
  onUpdateQuantity
}) => {
  const currentQuantity = currentBudgetItem?.quantity || 0;
  const isSelected = currentQuantity > 0;

  // Installments calculation (e.g. 10x sem juros)
  const installmentCount = 10;
  const installmentValue = product.price / installmentCount;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="bg-white rounded-xl border border-neutral-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-[#72BF44]"
    >
      {/* Product Image Container */}
      <div className="relative w-full pt-[80%] bg-neutral-100/70 border-b border-neutral-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges: Mais Vendido & VANDO FULL */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.popular && (
            <span className="px-2 py-0.5 rounded-md bg-[#08182B] text-[#72BF44] text-[10px] font-black tracking-wide shadow-xs uppercase border border-[#72BF44]/30">
              Mais Vendido 🏆
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-[#72BF44] text-[#08182B] text-[10px] font-black tracking-wide shadow-xs flex items-center gap-0.5">
            <Zap className="w-3 h-3 fill-[#08182B]" />
            <span>FULL EXPRESS</span>
          </span>
        </div>

        {/* Stock / Weight pill */}
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-semibold text-neutral-600 border border-neutral-200 shadow-2xs">
          {formatWeight(product.weightKg)}
        </div>
      </div>

      {/* Product Body Information */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        
        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 leading-tight group-hover:text-[#08182B] transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-neutral-500 line-clamp-1">
            {product.description}
          </p>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 text-xs">
          <div className="flex text-amber-400">
            <Star className="w-3 h-3 fill-amber-400" />
            <Star className="w-3 h-3 fill-amber-400" />
            <Star className="w-3 h-3 fill-amber-400" />
            <Star className="w-3 h-3 fill-amber-400" />
            <Star className="w-3 h-3 fill-amber-400" />
          </div>
          <span className="text-[11px] font-bold text-neutral-700">4.9</span>
          <span className="text-[10px] text-neutral-400">(420)</span>
        </div>

        {/* Price & Installment Display */}
        <div className="pt-1 border-t border-neutral-100 space-y-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-black text-neutral-900 leading-none">
              {formatCurrency(product.price)}
            </span>
            <span className="text-[11px] font-bold text-[#5fa636]">
              5% OFF no PIX
            </span>
          </div>

          <div className="text-[11px] text-neutral-600">
            em <strong className="text-neutral-800">{installmentCount}x {formatCurrency(installmentValue)}</strong> sem juros
          </div>

          {/* Delivery Tag */}
          <div className="text-[11px] font-bold text-[#5fa636] flex items-center gap-1 pt-0.5">
            <Truck className="w-3.5 h-3.5 text-[#72BF44]" />
            <span>Chega amanhã • Frete Rápido</span>
          </div>
        </div>

        {/* Cart / Quantity Controller */}
        <div className="pt-2">
          {isSelected ? (
            <div className="flex items-center justify-between bg-neutral-50 rounded-lg border border-neutral-300 p-1">
              <button
                id={`btn-decrease-${product.id}`}
                onClick={() => onUpdateQuantity(product, currentQuantity - 1)}
                className="w-7 h-7 rounded bg-white hover:bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center border border-neutral-200 transition-colors active:scale-95"
                aria-label="Diminuir quantidade"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="text-center px-2">
                <span className="text-xs font-black text-neutral-900">
                  {currentQuantity} {product.unit}
                </span>
                <span className="block text-[10px] text-[#08182B] font-bold">
                  {formatCurrency(product.price * currentQuantity)}
                </span>
              </div>

              <button
                id={`btn-increase-${product.id}`}
                onClick={() => onUpdateQuantity(product, currentQuantity + 1)}
                className="w-7 h-7 rounded bg-[#72BF44] hover:bg-[#62a738] text-[#08182B] font-bold flex items-center justify-center transition-colors active:scale-95 shadow-xs"
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id={`btn-add-product-${product.id}`}
              onClick={() => onUpdateQuantity(product, 1)}
              className="w-full py-2.5 px-3 rounded-lg bg-[#72BF44] hover:bg-[#62a738] text-[#08182B] text-xs font-black transition-all shadow-xs active:scale-98 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar ao carrinho</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
