import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  HeroBanner 
} from './components/HeroBanner';
import { 
  CatalogSection 
} from './components/CatalogSection';
import { 
  RealTimeCalculator 
} from './components/RealTimeCalculator';
import { 
  BudgetSummaryDrawer 
} from './components/BudgetSummaryDrawer';
import { 
  DeliverySchedulingModal 
} from './components/DeliverySchedulingModal';
import { 
  OrderTracking 
} from './components/OrderTrackingModal';
import { 
  AdminDashboard 
} from './components/admin/AdminDashboard';
import { 
  ReceiptModal 
} from './components/ReceiptModal';
import { 
  Logo 
} from './components/Logo';
import { 
  ActiveTab, 
  BudgetItem, 
  CategoryId, 
  Order, 
  PaymentMethod, 
  Product 
} from './types';
import { 
  CATEGORIES, 
  STORE_INFO 
} from './data/mockData';
import { 
  addOrder, 
  getStoredBudget, 
  getStoredOrders, 
  getStoredProducts, 
  saveBudget, 
  saveOrders, 
  saveProducts 
} from './utils/storage';
import { 
  ensureFirebaseAuth 
} from './lib/firebase';
import { 
  seedFirestoreIfEmpty, 
  subscribeToProducts, 
  subscribeToOrders 
} from './services/firebaseService';
import { useToast } from './context/ToastContext';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Layers, 
  Calculator, 
  Truck, 
  ArrowUp,
  MessageSquare,
  Zap,
  CreditCard,
  Building2,
  CheckCircle2,
  Lock,
  CloudCheck
} from 'lucide-react';

export default function App() {
  // Navigation & Category States
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalogo');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'todos'>('todos');

  // Core Data States with localStorage & Firebase Firestore synchronization
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => getStoredBudget());
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  // Modals & Drawers States
  const [isBudgetDrawerOpen, setIsBudgetDrawerOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Schedule handover state
  const [scheduleConfig, setScheduleConfig] = useState<{
    neighborhood?: string;
    freightCost?: number;
    paymentMethod?: PaymentMethod;
    discount?: number;
  }>({});

  // Initialize Firebase Auth, Firestore auto-seed and Realtime Subscriptions
  useEffect(() => {
    let isMounted = true;

    async function initFirebase() {
      try {
        await ensureFirebaseAuth();
        await seedFirestoreIfEmpty();
        if (isMounted) setIsFirebaseReady(true);
      } catch (err) {
        console.warn('Firebase initialization note:', err);
      }
    }

    initFirebase();

    // Subscribe to real-time changes
    const unsubProducts = subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });

    const unsubOrders = subscribeToOrders((cloudOrders) => {
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders(cloudOrders);
      }
    });

    return () => {
      isMounted = false;
      unsubProducts();
      unsubOrders();
    };
  }, []);

  const toast = useToast();

  // Save budget changes
  const handleUpdateQuantity = (product: Product, quantity: number) => {
    const existing = budgetItems.find(i => i.product.id === product.id);
    const prevQty = existing?.quantity || 0;
    
    let updated: BudgetItem[];
    if (quantity <= 0) {
      updated = budgetItems.filter(i => i.product.id !== product.id);
      if (prevQty > 0) {
        toast.info(`"${product.name}" foi removido do carrinho.`, 'Item Removido');
      }
    } else {
      if (existing) {
        updated = budgetItems.map(i => i.product.id === product.id ? { ...i, quantity } : i);
        // If increased from existing
        if (quantity > prevQty) {
          toast.success(`Quantidade atualizada para ${quantity} ${product.unit}`, product.name);
        }
      } else {
        updated = [...budgetItems, { product, quantity }];
        toast.success(`Produto adicionado ao carrinho! (${quantity} ${product.unit})`, product.name, {
          label: 'Ver Carrinho',
          onClick: () => setIsBudgetDrawerOpen(true)
        });
      }
    }
    setBudgetItems(updated);
    saveBudget(updated);
  };

  // Add multiple calculated items
  const handleAddMultipleItems = (itemsToAdd: { product: Product; quantity: number }[]) => {
    if (!itemsToAdd || itemsToAdd.length === 0) return;
    
    let current = [...budgetItems];
    itemsToAdd.forEach(({ product, quantity }) => {
      const idx = current.findIndex(i => i.product.id === product.id);
      if (idx >= 0) {
        current[idx] = { ...current[idx], quantity: current[idx].quantity + quantity };
      } else {
        current.push({ product, quantity });
      }
    });
    setBudgetItems(current);
    saveBudget(current);

    toast.success(
      `${itemsToAdd.length} tipos de materiais foram adicionados ao seu orçamento!`,
      'Calculadora de Obra',
      {
        label: 'Abrir Carrinho',
        onClick: () => setIsBudgetDrawerOpen(true)
      }
    );
  };

  // Clear Budget
  const handleClearBudget = () => {
    if (budgetItems.length > 0) {
      toast.info('Seu carrinho de materiais foi esvaziado.', 'Carrinho Vazio');
    }
    setBudgetItems([]);
    saveBudget([]);
  };

  // Handlers for proceeding from Budget Drawer to Scheduling
  const handleProceedToSchedule = (config: {
    neighborhood: string;
    freightCost: number;
    paymentMethod: PaymentMethod;
    discount: number;
  }) => {
    setScheduleConfig(config);
    setIsBudgetDrawerOpen(false);
    setIsScheduleModalOpen(true);
  };

  // Order created handler
  const handleOrderCompleted = (newOrder: Order) => {
    const updated = addOrder(newOrder);
    setOrders(updated);
    handleClearBudget();
    toast.success(
      `Pedido #${newOrder.code} agendado com sucesso para ${newOrder.customer.neighborhood}!`,
      'Agendamento Confirmado 🎉',
      {
        label: 'Ver Comprovante / DANFE',
        onClick: () => handleViewReceipt(newOrder)
      }
    );
  };

  // View Receipt handler
  const handleViewReceipt = (order?: Order) => {
    setReceiptOrder(order || null);
    setIsReceiptModalOpen(true);
  };

  const pendingOrdersCount = orders.filter(o => o.status === 'orcamento' || o.status === 'confirmado').length;

  return (
    <div className="min-h-screen bg-[#EDEDED] text-neutral-800 flex flex-col justify-between selection:bg-[#FFE600] selection:text-neutral-900">
      
      {/* Top Fixed Mercado Livre Signature Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        budgetItems={budgetItems}
        onOpenBudgetDrawer={() => setIsBudgetDrawerOpen(true)}
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* Main App Body */}
      <main className="flex-1">
        
        {/* Tab 1: CATÁLOGO DE PRODUTOS */}
        {activeTab === 'catalogo' && (
          <div>
            <HeroBanner
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <CatalogSection
              products={products}
              budgetItems={budgetItems}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onUpdateQuantity={handleUpdateQuantity}
              onNavigate={setActiveTab}
            />
          </div>
        )}

        {/* Tab 2: CALCULADORA DE MATERIAIS */}
        {activeTab === 'calculadora' && (
          <RealTimeCalculator
            onAddMultipleItems={handleAddMultipleItems}
            onOpenBudget={() => setIsBudgetDrawerOpen(true)}
          />
        )}

        {/* Tab 3: AGENDAMENTO DE ENTREGA */}
        {activeTab === 'agendamento' && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFE600] text-[#2D3277] text-xs font-bold uppercase">
                <Truck className="w-3.5 h-3.5" />
                <span>Mercado Envios Vando • Agendamento no Canteiro</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                Agendamento de Entrega de Materiais
              </h2>
              <p className="text-xs text-neutral-500 max-w-lg mx-auto">
                Escolha o dia, o turno (manhã ou tarde) e receba descarregado diretamente no seu endereço.
              </p>
            </div>

            {budgetItems.length > 0 ? (
              <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900">
                      Materiais no seu Carrinho ({budgetItems.length})
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Pronto para agendar o caminhão adequado para o descarregamento.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="px-4 py-2 bg-[#3483FA] hover:bg-[#2968C8] text-white font-bold text-xs rounded-sm transition-all shadow-xs"
                  >
                    Prosseguir para Agendamento
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {budgetItems.map(item => (
                    <div key={item.product.id} className="p-3 bg-neutral-50 rounded border border-neutral-200 flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-neutral-900 block">{item.quantity}x {item.product.name}</strong>
                        <span className="text-[11px] text-neutral-500">{item.product.unit}</span>
                      </div>
                      <span className="font-bold text-neutral-900">
                        {item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-lg border border-neutral-200 shadow-xs text-center space-y-3">
                <Truck className="w-12 h-12 text-[#3483FA] mx-auto" />
                <h3 className="font-bold text-base text-neutral-900">
                  Seu carrinho de materiais está vazio
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Para agendar uma entrega, primeiro selecione os materiais no catálogo ou utilize a calculadora de obras.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('catalogo')}
                    className="px-4 py-2 bg-[#3483FA] text-white font-bold text-xs rounded-sm hover:bg-[#2968C8]"
                  >
                    Ver Catálogo
                  </button>
                  <button
                    onClick={() => setActiveTab('calculadora')}
                    className="px-4 py-2 bg-neutral-100 text-neutral-800 font-bold text-xs rounded-sm border border-neutral-300 hover:bg-neutral-200"
                  >
                    Usar Calculadora
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: RASTREAMENTO DE PEDIDO */}
        {activeTab === 'rastreamento' && (
          <OrderTracking
            orders={orders}
            onOpenReceipt={handleViewReceipt}
            onNavigateToCatalog={() => setActiveTab('catalogo')}
          />
        )}

        {/* Tab 5: PAINEL ADMINISTRATIVO (MERCADO LIVRE SELLER CENTRAL) */}
        {activeTab === 'admin' && (
          <AdminDashboard
            orders={orders}
            products={products}
            onUpdateOrders={(updated) => {
              setOrders(updated);
              saveOrders(updated);
            }}
            onUpdateProducts={(updated) => {
              setProducts(updated);
              saveProducts(updated);
            }}
            onViewOrderReceipt={handleViewReceipt}
            onNavigateToCatalog={() => setActiveTab('catalogo')}
          />
        )}

      </main>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={`https://wa.me/${STORE_INFO.whatsappRaw}?text=${encodeURIComponent('Olá Vando Construção! Gostaria de falar com um atendente sobre materiais e entregas.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 p-3 bg-[#00A650] hover:bg-[#008744] text-white rounded-full shadow-lg flex items-center gap-2 font-bold text-xs transition-all duration-200 hover:scale-105 active:scale-95 no-print"
        aria-label="Falar no WhatsApp"
      >
        <Phone className="w-4 h-4 fill-white" />
        <span className="hidden sm:inline">WhatsApp (81) 98351-7307</span>
      </a>

      {/* MODALS & DRAWERS */}
      <BudgetSummaryDrawer
        isOpen={isBudgetDrawerOpen}
        onClose={() => setIsBudgetDrawerOpen(false)}
        items={budgetItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearBudget={handleClearBudget}
        onProceedToSchedule={handleProceedToSchedule}
        onOpenReceipt={() => handleViewReceipt()}
      />

      <DeliverySchedulingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        items={budgetItems}
        initialNeighborhood={scheduleConfig.neighborhood}
        initialFreightCost={scheduleConfig.freightCost}
        initialPaymentMethod={scheduleConfig.paymentMethod}
        initialDiscount={scheduleConfig.discount}
        onOrderCompleted={handleOrderCompleted}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => {
          setIsReceiptModalOpen(false);
          setReceiptOrder(null);
        }}
        order={receiptOrder}
        budgetItems={budgetItems}
      />

      {/* Mercado Livre Standard Footer */}
      <footer className="bg-white border-t border-neutral-200 text-neutral-600 text-xs mt-12 no-print">
        
        {/* Top Assurance bar */}
        <div className="border-b border-neutral-100 py-6 bg-neutral-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFE600] flex items-center justify-center text-[#2D3277] flex-shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-neutral-900 block font-bold">Pague com PIX ou Cartão</strong>
                <span className="text-[11px] text-neutral-500">5% OFF no PIX ou parcele em até 12x</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00A650]/20 flex items-center justify-center text-[#00A650] flex-shrink-0">
                <Zap className="w-5 h-5 fill-[#00A650]" />
              </div>
              <div>
                <strong className="text-neutral-900 block font-bold">Mercado Envios Vando</strong>
                <span className="text-[11px] text-neutral-500">Frete express com frota própria</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3483FA]/20 flex items-center justify-center text-[#3483FA] flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-neutral-900 block font-bold">Compra Garantida</strong>
                <span className="text-[11px] text-neutral-500">Receba no canteiro ou seu dinheiro de volta</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-700 flex-shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-neutral-900 block font-bold">Cálculo de Obras em Tempo Real</strong>
                <span className="text-[11px] text-neutral-500">Sem sobras ou falta de material</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1 */}
            <div className="space-y-2">
              <Logo size="sm" variant="meli" />
              <p className="text-neutral-500 text-xs mt-2">
                Tudo para sua construção e reforma do alicerce ao acabamento com frota própria e entrega rápida.
              </p>
              <div className="text-[11px] text-neutral-500 pt-1">
                <strong>CNPJ:</strong> 28.940.112/0001-44 • Loja Oficial Mercado Livre
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2 text-xs">
              <strong className="font-bold text-neutral-900 uppercase block tracking-wide">
                Categorias de Materiais
              </strong>
              <ul className="space-y-1.5 text-neutral-600">
                {CATEGORIES.map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveTab('catalogo');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-[#3483FA] text-left transition-colors"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2 text-xs">
              <strong className="font-bold text-neutral-900 uppercase block tracking-wide">
                Simuladores & Ferramentas
              </strong>
              <ul className="space-y-1.5 text-neutral-600">
                <li>
                  <button onClick={() => setActiveTab('calculadora')} className="hover:text-[#3483FA]">
                    Calculadora de Alvenaria e Tijolos
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('calculadora')} className="hover:text-[#3483FA]">
                    Calculadora de Piso e Argamassa
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('rastreamento')} className="hover:text-[#3483FA]">
                    Rastrear Envio do Pedido
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('admin')} className="hover:text-[#3483FA] font-semibold text-neutral-800">
                    Portal do Vendedor / Dashboard
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-2 text-xs">
              <strong className="font-bold text-neutral-900 uppercase block tracking-wide">
                Central de Vendas & Galpão
              </strong>
              <div className="space-y-1.5 text-neutral-600">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#3483FA] flex-shrink-0 mt-0.5" />
                  <span>{STORE_INFO.address}</span>
                </p>
                <p className="flex items-center gap-1.5 font-bold text-neutral-800">
                  <Phone className="w-3.5 h-3.5 text-[#00A650] flex-shrink-0" />
                  <a href={`https://wa.me/${STORE_INFO.whatsappRaw}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp: (81) 98351-7307
                  </a>
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                  <span>{STORE_INFO.openingHours}</span>
                </p>
              </div>
            </div>

          </div>

          <div className="mt-8 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-2">
            <p>© {new Date().getFullYear()} Vando Construção - Loja Oficial. Todos os direitos reservados.</p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
                <span>{isFirebaseReady ? 'Firebase Firestore Conectado' : 'Conectando Nuvem...'}</span>
              </span>
              <p className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#00A650]" />
                <span>Ambiente 100% Seguro</span>
              </p>
            </div>
          </div>
        </div>

      </footer>

    </div>
  );
}
