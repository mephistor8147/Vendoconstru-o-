import React, { useState, useMemo, useRef } from 'react';
import { 
  Boxes, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  Zap, 
  X, 
  ArrowUpDown,
  Percent,
  Layers,
  Tag,
  Upload,
  Image as ImageIcon,
  Camera,
  RefreshCw
} from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, formatWeight, addAuditLog } from '../../utils/storage';

interface AdminStockManagerProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

const COMMON_CONSTRUCTION_UNITS = [
  { group: 'Sacaria & Argamassas', units: ['Saco 50kg', 'Saco 25kg', 'Saco 20kg', 'Barrica 25kg', 'Balde 1kg'] },
  { group: 'Agregados & Granel', units: ['Metro Cúbico (m³)', 'Milheiro (1000 un)', 'Quilo (kg)'] },
  { group: 'Aço & Tubulações', units: ['Barra 12m', 'Barra 6m', 'Metro linear'] },
  { group: 'Tintas & Líquidos', units: ['Lata 18L', 'Galão 3.6L', 'Litro (L)'] },
  { group: 'Rolos & Malhas', units: ['Rolo 100m', 'Rolo 50m', 'Rolo 1kg', 'Painel 6m²'] },
  { group: 'Pisos & Revestimentos', units: ['m² (Metro Quadrado)', 'm² (Caixa c/ 2.12m²)', 'm² (Caixa c/ 1.5m²)'] },
  { group: 'Peças & Diversos', units: ['Unidade', 'Kit Completo', 'Par', 'Pacote c/ 10 un', 'Outra unidade...'] },
];

const PRESET_SAMPLE_IMAGES = [
  { label: 'Cimento', url: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Areia', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80' },
  { label: 'Brita', url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80' },
  { label: 'Tijolos', url: 'https://images.unsplash.com/photo-1584463699039-44e21d6df4b2?auto=format&fit=crop&w=600&q=80' },
  { label: 'Vergalhão', url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80' },
  { label: 'Tubos PVC', url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80' },
  { label: 'Tintas', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80' },
  { label: 'EPI / Capacete', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80' }
];

export const AdminStockManager: React.FC<AdminStockManagerProps> = ({
  products,
  onUpdateProducts
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showMassPriceModal, setShowMassPriceModal] = useState(false);
  const [massPercent, setMassPercent] = useState(5);
  const [massDirection, setMassDirection] = useState<'increase' | 'decrease'>('increase');

  // Product Form State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formCategory, setFormCategory] = useState<Product['category']>('materiais');
  const [formUnit, setFormUnit] = useState('Unidade');
  const [customUnit, setCustomUnit] = useState('');
  const [formWeightKg, setFormWeightKg] = useState(1);
  const [formInStock, setFormInStock] = useState(50);
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formIsMeliFull, setFormIsMeliFull] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'todos' || p.category === selectedCategory;
      const matchesLowStock = !onlyLowStock || p.inStock <= 25;
      return matchesSearch && matchesCategory && matchesLowStock;
    });
  }, [products, searchQuery, selectedCategory, onlyLowStock]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormPrice(29.90);
    setFormCategory('materiais');
    setFormUnit('Saco 50kg');
    setCustomUnit('');
    setFormWeightKg(50);
    setFormInStock(100);
    setFormDescription('');
    setFormImage('https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=600&q=80');
    setFormIsMeliFull(true);
    setShowProductModal(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormPrice(p.price);
    setFormCategory(p.category);
    
    // Check if unit is in predefined list
    const allKnownUnits = COMMON_CONSTRUCTION_UNITS.flatMap(g => g.units);
    if (allKnownUnits.includes(p.unit)) {
      setFormUnit(p.unit);
      setCustomUnit('');
    } else {
      setFormUnit('Outra unidade...');
      setCustomUnit(p.unit);
    }

    setFormWeightKg(p.weightKg);
    setFormInStock(p.inStock);
    setFormDescription(p.description);
    setFormImage(p.image || '');
    setFormIsMeliFull(p.isMeliChoice || false);
    setShowProductModal(true);
  };

  // Image Upload handler via FileReader
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione um arquivo de imagem válido (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice <= 0) return;

    const finalUnit = formUnit === 'Outra unidade...' ? (customUnit.trim() || 'Unidade') : formUnit;

    if (editingProduct) {
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formName,
            price: Number(formPrice),
            category: formCategory,
            unit: finalUnit,
            weightKg: Number(formWeightKg),
            inStock: Number(formInStock),
            description: formDescription,
            image: formImage || p.image,
            isMeliChoice: formIsMeliFull
          };
        }
        return p;
      });
      onUpdateProducts(updated);
      addAuditLog({
        userName: 'Gestor de Estoque',
        action: 'Atualização de Produto',
        details: `Material ${formName} atualizado (Preço: ${formatCurrency(formPrice)}, Estoque: ${formInStock}, Unidade: ${finalUnit})`,
        type: 'estoque'
      });
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: formName,
        price: Number(formPrice),
        category: formCategory,
        unit: finalUnit,
        weightKg: Number(formWeightKg),
        inStock: Number(formInStock),
        description: formDescription || 'Material de alta resistência Vando Construção.',
        image: formImage || 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=600&q=80',
        isMeliChoice: formIsMeliFull
      };
      onUpdateProducts([newProd, ...products]);
      addAuditLog({
        userName: 'Gestor de Estoque',
        action: 'Cadastro de Novo Material',
        details: `Novo produto ${formName} (${finalUnit}) adicionado ao catálogo com ${formInStock} unidades`,
        type: 'estoque'
      });
    }

    setShowProductModal(false);
  };

  const handleQuickStockChange = (productId: string, delta: number) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const next = Math.max(0, p.inStock + delta);
        return { ...p, inStock: next };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`Tem certeza que deseja remover o produto "${productName}" do catálogo?`)) {
      const updated = products.filter(p => p.id !== productId);
      onUpdateProducts(updated);
      addAuditLog({
        userName: 'Gestor de Estoque',
        action: 'Exclusão de Material',
        details: `Produto ${productName} removido do catálogo`,
        type: 'estoque'
      });
    }
  };

  const handleApplyMassPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const factor = massDirection === 'increase' ? (1 + massPercent / 100) : (1 - massPercent / 100);
    const updated = products.map(p => ({
      ...p,
      price: Math.round(p.price * factor * 100) / 100
    }));
    onUpdateProducts(updated);
    setShowMassPriceModal(false);
    addAuditLog({
      userName: 'Diretoria Comercial',
      action: 'Reajuste de Preços em Massa',
      details: `Todos os materiais reajustados em ${massDirection === 'increase' ? '+' : '-'}${massPercent}%`,
      type: 'estoque'
    });
  };

  return (
    <div className="space-y-4 text-neutral-800">
      
      {/* Header with Search and Action Buttons */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar material no estoque por nome, especificação ou marca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:outline-none focus:border-[#72BF44] focus:bg-white"
          />
        </div>

        {/* Category & Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-700 focus:outline-none"
          >
            <option value="todos">Todas as Categorias</option>
            <option value="materiais">Materiais Básicos</option>
            <option value="ferragens">Ferragens & Aço</option>
            <option value="hidraulica">Hidráulica</option>
            <option value="eletrica">Elétrica</option>
            <option value="acabamentos">Acabamentos</option>
            <option value="ferramentas">Ferramentas</option>
          </select>

          <button
            type="button"
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3 py-2 rounded text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              onlyLowStock ? 'bg-amber-500 text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Estoque Crítico</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMassPriceModal(true)}
            className="px-3 py-2 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300 text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1"
          >
            <Percent className="w-3.5 h-3.5 text-neutral-600" />
            <span>Reajuste em Massa</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-3.5 py-2 rounded bg-[#72BF44] hover:bg-[#62a738] text-white text-xs font-black transition-colors shadow-xs whitespace-nowrap flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Material</span>
          </button>
        </div>

      </div>

      {/* Mobile Materials Cards (visible on mobile / small screens) */}
      <div className="md:hidden space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-neutral-500 text-xs shadow-xs">
            Nenhum material encontrado com os filtros aplicados.
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isLow = p.inStock <= 25;

            return (
              <div 
                key={p.id}
                className="bg-white rounded-xl border border-neutral-200 shadow-xs p-3.5 space-y-3 hover:border-neutral-300 transition-all"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover border border-neutral-200 flex-shrink-0 bg-neutral-100 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <strong className="text-xs text-neutral-900 font-bold block truncate">{p.name}</strong>
                      {p.isMeliChoice && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-[#72BF44] text-[#08182B] flex-shrink-0">
                          <Zap className="w-2.5 h-2.5 fill-[#08182B]" />
                          <span>FULL</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-500 block truncate">{p.unit}</span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-semibold border border-neutral-200 capitalize">
                      {p.category}
                    </span>
                  </div>
                </div>

                {/* Pricing and Weight row */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-neutral-100">
                  <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-100">
                    <span className="text-[10px] text-neutral-400 block font-medium">Preço Unitário</span>
                    <strong className="text-sm font-black text-neutral-900 block">{formatCurrency(p.price)}</strong>
                  </div>

                  <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-100">
                    <span className="text-[10px] text-neutral-400 block font-medium">Peso Unitário</span>
                    <strong className="text-xs font-bold text-neutral-700 block">{formatWeight(p.weightKg)}</strong>
                  </div>
                </div>

                {/* Stock Controls & Actions */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  {/* Realtime Stock Changer */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-neutral-500 font-bold">Estoque:</span>
                    <div className="inline-flex items-center gap-1.5 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
                      <button
                        type="button"
                        onClick={() => handleQuickStockChange(p.id, -10)}
                        className="w-7 h-7 rounded-md bg-white hover:bg-neutral-200 text-neutral-800 font-black text-sm flex items-center justify-center border border-neutral-300 active:scale-95 transition-all shadow-2xs"
                        title="Diminuir 10"
                      >
                        -
                      </button>
                      <span className={`px-2 font-black text-xs min-w-[28px] text-center ${isLow ? 'text-amber-600' : 'text-neutral-900'}`}>
                        {p.inStock}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickStockChange(p.id, +10)}
                        className="w-7 h-7 rounded-md bg-white hover:bg-neutral-200 text-neutral-800 font-black text-sm flex items-center justify-center border border-neutral-300 active:scale-95 transition-all shadow-2xs"
                        title="Adicionar 10"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg border border-neutral-300 transition-colors"
                      title="Editar Material"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-colors"
                      title="Excluir Material"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isLow && (
                  <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 font-bold text-center">
                    Atenção: Estoque baixo (≤ 25 un). Reposição necessária.
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Stock Table */}
      <div className="hidden md:block bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100 text-neutral-600 font-bold border-b border-neutral-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Material / Imagem</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Preço Unitário</th>
                <th className="py-3 px-4">Peso Unit.</th>
                <th className="py-3 px-4 text-center">Estoque em Tempo Real</th>
                <th className="py-3 px-4 text-center">Badges</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProducts.map((p) => {
                const isLow = p.inStock <= 25;

                return (
                  <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                    
                    {/* Image & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded object-cover border border-neutral-200 flex-shrink-0 bg-neutral-100 shadow-2xs"
                        />
                        <div>
                          <strong className="text-neutral-900 block font-bold">{p.name}</strong>
                          <span className="text-[11px] text-[#08182B] font-semibold block truncate max-w-xs">{p.unit}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap capitalize text-neutral-600">
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-semibold border border-neutral-200">
                        {p.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <strong className="text-neutral-900 text-xs font-bold block">
                        {formatCurrency(p.price)}
                      </strong>
                    </td>

                    {/* Weight */}
                    <td className="py-3 px-4 whitespace-nowrap text-neutral-600">
                      {formatWeight(p.weightKg)}
                    </td>

                    {/* Stock + Fast Adjusters */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 bg-neutral-100 p-1 rounded-md border border-neutral-200">
                        <button
                          type="button"
                          onClick={() => handleQuickStockChange(p.id, -10)}
                          className="w-5 h-5 rounded bg-white hover:bg-neutral-200 text-neutral-700 font-black text-xs flex items-center justify-center border border-neutral-300"
                          title="Diminuir 10 unidades"
                        >
                          -
                        </button>
                        <span className={`px-2 font-bold text-xs ${isLow ? 'text-amber-600' : 'text-neutral-900'}`}>
                          {p.inStock}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickStockChange(p.id, +10)}
                          className="w-5 h-5 rounded bg-white hover:bg-neutral-200 text-neutral-700 font-black text-xs flex items-center justify-center border border-neutral-300"
                          title="Adicionar 10 unidades"
                        >
                          +
                        </button>
                      </div>
                      {isLow && (
                        <span className="block text-[10px] text-amber-600 font-bold mt-0.5">
                          Reposição Recomendada
                        </span>
                      )}
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {p.isMeliChoice ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-black bg-[#72BF44] text-white">
                          <Zap className="w-3 h-3 fill-white" />
                          <span>FULL</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-400">Padrão</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded border border-neutral-300"
                          title="Editar Material"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200"
                          title="Excluir Material"
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

      {/* Add / Edit Product Modal with Image Upload & Select Unit */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-neutral-200 shadow-2xl max-w-xl w-full overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#08182B] text-white p-4 flex items-center justify-between flex-shrink-0 border-b border-neutral-700">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#72BF44] text-white flex items-center justify-center font-bold">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {editingProduct ? 'Editar Material de Construção' : 'Cadastrar Novo Material'}
                  </h3>
                  <span className="text-[10px] text-[#72BF44] font-medium">Vando Construção • Gestão de Catálogo</span>
                </div>
              </div>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1 text-slate-300 hover:text-white rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
              
              {/* Product Name */}
              <div className="space-y-1">
                <label className="block font-bold text-neutral-700">Nome do Material / Produto:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cimento Nassau CP-II-Z-32 50kg"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:outline-none"
                />
              </div>

              {/* Price, Stock, Weight */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Preço Unitário (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded text-xs font-bold text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Estoque Inicial:</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formInStock}
                    onChange={(e) => setFormInStock(Number(e.target.value))}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Peso Unitário (Kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formWeightKg}
                    onChange={(e) => setFormWeightKg(Number(e.target.value))}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Unit (Dropdown Selection) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Category */}
                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Categoria:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Product['category'])}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44]"
                  >
                    <option value="materiais">Materiais Básicos (Cimento, Areia, Tijolos)</option>
                    <option value="ferragens">Ferragens & Aço (Vergalhão, Colunas)</option>
                    <option value="hidraulica">Hidráulica (Tubos, Caixas d'água)</option>
                    <option value="eletrica">Elétrica (Fios, Disjuntores)</option>
                    <option value="acabamentos">Acabamentos (Pisos, Tintas)</option>
                    <option value="ferramentas">Ferramentas & EPIs</option>
                  </select>
                </div>

                {/* Unit of Measure as SELECT */}
                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Unidade de Medida:</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded text-xs font-semibold text-neutral-900 focus:bg-white focus:border-[#72BF44]"
                  >
                    {COMMON_CONSTRUCTION_UNITS.map((group) => (
                      <optgroup key={group.group} label={group.group}>
                        {group.units.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  {formUnit === 'Outra unidade...' && (
                    <input
                      type="text"
                      required
                      placeholder="Especifique a unidade (ex: Caixa c/ 50 un)"
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      className="w-full mt-1.5 p-2 bg-white border border-[#72BF44] rounded text-xs text-neutral-900"
                    />
                  )}
                </div>
              </div>

              {/* IMAGE UPLOAD SECTION */}
              <div className="space-y-2 p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-neutral-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#72BF44]" />
                    <span>Foto do Material (Upload ou URL)</span>
                  </label>
                  {formImage && (
                    <button
                      type="button"
                      onClick={() => setFormImage('')}
                      className="text-[11px] text-red-600 hover:underline font-semibold"
                    >
                      Remover foto
                    </button>
                  )}
                </div>

                {/* Drag and Drop Zone + Upload Button */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-3.5 transition-all text-center flex flex-col sm:flex-row items-center gap-3.5 ${
                    isDragOver 
                      ? 'border-[#72BF44] bg-[#72BF44]/10' 
                      : 'border-neutral-300 bg-white hover:border-[#72BF44]/60'
                  }`}
                >
                  {/* Current Image Preview */}
                  <div className="w-20 h-20 rounded-md border border-neutral-200 bg-neutral-100 overflow-hidden flex-shrink-0 flex items-center justify-center relative group">
                    {formImage ? (
                      <img
                        src={formImage}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-neutral-300" />
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 text-left space-y-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#08182B] hover:bg-[#132B47] text-white text-xs font-bold transition-colors shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#72BF44]" />
                        <span>Fazer Upload de Foto</span>
                      </button>
                      <span className="text-[11px] text-neutral-500">ou arraste uma imagem aqui</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-600">
                      <span>Ou cole a URL:</span>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        className="flex-1 px-2 py-1 bg-neutral-50 border border-neutral-200 rounded text-[11px] text-neutral-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Fast Image Selection */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    Sugestões rápidas de fotos da obra:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_SAMPLE_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setFormImage(preset.url)}
                        className="px-2 py-0.5 rounded bg-white hover:bg-neutral-100 border border-neutral-300 text-[10px] font-medium text-neutral-700 transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Technical Description */}
              <div className="space-y-1">
                <label className="block font-bold text-neutral-700">Descrição Técnica e Aplicações:</label>
                <textarea
                  rows={2}
                  placeholder="Especificações, normas ABNT e aplicações recomendadas"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44]"
                />
              </div>

              {/* Meli FULL toggle */}
              <label className="flex items-center gap-2.5 p-2.5 rounded bg-emerald-50 border border-emerald-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsMeliFull}
                  onChange={(e) => setFormIsMeliFull(e.target.checked)}
                  className="w-4 h-4 text-[#72BF44] rounded border-emerald-300 focus:ring-[#72BF44]"
                />
                <div className="text-xs">
                  <strong className="text-emerald-900 block flex items-center gap-1 font-bold">
                    <Zap className="w-3.5 h-3.5 fill-[#72BF44] text-[#72BF44]" />
                    <span>Destaque Vando FULL (Entrega Expressa no Canteiro)</span>
                  </strong>
                  <span className="text-emerald-700 text-[11px]">Exibir selo de entrega prioritária no catálogo de materiais</span>
                </div>
              </label>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#72BF44] hover:bg-[#62a738] text-white font-black shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingProduct ? 'Salvar Alterações' : 'Cadastrar Material'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Mass Price Adjustment Modal */}
      {showMassPriceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-neutral-200 shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            
            <div className="bg-[#08182B] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-[#72BF44]" />
                <h3 className="font-bold text-sm">Reajuste de Preços em Massa</h3>
              </div>
              <button
                onClick={() => setShowMassPriceModal(false)}
                className="p-1 text-slate-300 hover:text-white rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyMassPrice} className="p-5 space-y-4 text-xs">
              <p className="text-neutral-600">
                Aplique uma porcentagem de reajuste automático para <strong>todos os {products.length} materiais</strong> cadastrados no catálogo.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Tipo de Reajuste:</label>
                  <select
                    value={massDirection}
                    onChange={(e) => setMassDirection(e.target.value as 'increase' | 'decrease')}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900"
                  >
                    <option value="increase">Aumento (+)</option>
                    <option value="decrease">Desconto (-)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-neutral-700">Porcentagem (%):</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={massPercent}
                    onChange={(e) => setMassPercent(Number(e.target.value))}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded text-xs font-bold text-neutral-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Esta alteração atualizará os preços imediatamente em todo o catálogo público e na calculadora.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowMassPriceModal(false)}
                  className="px-3.5 py-1.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#72BF44] hover:bg-[#62a738] text-white font-bold shadow-xs"
                >
                  Aplicar Reajuste
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
