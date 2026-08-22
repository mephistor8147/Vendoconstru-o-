import { Order, Product, BudgetItem, OrderStatus, VehicleItem, NeighborhoodItem, StoreConfig, AdminUser, AuditLogEntry } from '../types';
import { INITIAL_ORDERS, INITIAL_PRODUCTS, NEIGHBORHOODS, STORE_INFO, VEHICLE_DETAILS } from '../data/mockData';
import { 
  saveOrderToFirestore, 
  updateOrderStatusInFirestore, 
  saveProductToFirestore, 
  saveVehicleToFirestore, 
  saveFreightToFirestore, 
  saveStoreConfigToFirestore, 
  saveAdminUserToFirestore, 
  addAuditLogToFirestore 
} from '../services/firebaseService';

const ORDERS_KEY = 'vando_construcao_orders_v1';
const PRODUCTS_KEY = 'vando_construcao_products_v2';
const BUDGET_KEY = 'vando_construcao_budget_v1';
const VEHICLES_KEY = 'vando_construcao_vehicles_v1';
const FREIGHTS_KEY = 'vando_construcao_freights_v1';
const STORE_CONFIG_KEY = 'vando_construcao_store_config_v1';
const USERS_KEY = 'vando_construcao_admin_users_v1';
const AUDIT_LOGS_KEY = 'vando_construcao_audit_logs_v1';
const ADMIN_SESSION_KEY = 'vando_admin_auth_session_v1';

// Initial default vehicles
export const INITIAL_VEHICLES: VehicleItem[] = [
  {
    id: 'veh-1',
    key: 'fiorino',
    name: 'Fiorino Express 01',
    label: 'Utilitário / Fiorino',
    capacity: 'Até 650 kg',
    maxWeightKg: 650,
    driver: 'Claudio Ferreira',
    plate: 'KLD-9A12',
    status: 'disponivel',
    description: 'Ideal para ferramentas, tintas, conexões hidráulicas e fios.',
    icon: 'Car'
  },
  {
    id: 'veh-2',
    key: 'caminhao_toco',
    name: 'Caminhão Toco 02 (2 Eixos)',
    label: 'Caminhão Toco (2 Eixos)',
    capacity: 'Até 6.000 kg',
    maxWeightKg: 6000,
    driver: 'Marcos Vinicius',
    plate: 'PEV-4H20',
    status: 'em_rota',
    description: 'Perfeito para cimento em sacos, pisos, ferragens e blocos.',
    icon: 'Truck'
  },
  {
    id: 'veh-3',
    key: 'caminhao_cacamba',
    name: 'Basculante Pesado 01',
    label: 'Caminhão Caçamba Basculante',
    capacity: 'Até 8 m³ (12 Toneladas)',
    maxWeightKg: 12000,
    driver: 'José Ribamar',
    plate: 'VND-2026',
    status: 'disponivel',
    description: 'Exclusivo para entrega a granel de areia lavada, brita e saibro.',
    icon: 'HardHat'
  },
  {
    id: 'veh-4',
    key: 'caminhao_truck',
    name: 'Truck Especial 03 (3 Eixos)',
    label: 'Caminhão Truck Pesado (3 Eixos)',
    capacity: 'Até 14.000 kg',
    maxWeightKg: 14000,
    driver: 'Valdomiro Silva',
    plate: 'RCF-7B88',
    status: 'disponivel',
    description: 'Para grandes obras, múltiplos milheiros de tijolos e carretas de aço.',
    icon: 'PackageCheck'
  }
];

// Initial default freights
export const INITIAL_FREIGHTS: NeighborhoodItem[] = NEIGHBORHOODS.map((n, idx) => ({
  id: `nh-${idx + 1}`,
  name: n.name,
  freight: n.freight,
  timeEst: n.timeEst,
  zone: n.zone || 'Região Metropolitana',
  active: true
}));

// Initial default store config
export const INITIAL_STORE_CONFIG: StoreConfig = {
  name: STORE_INFO.name,
  slogan: STORE_INFO.slogan,
  tagline: STORE_INFO.tagline,
  cnpj: '28.940.112/0001-44',
  phone: STORE_INFO.phone,
  whatsappRaw: STORE_INFO.whatsappRaw,
  address: STORE_INFO.address,
  openingHours: STORE_INFO.openingHours,
  pixKey: STORE_INFO.pixKey,
  pixName: STORE_INFO.pixName,
  pixDiscountPercent: 5,
  maxInstallments: 12,
  freeShippingThreshold: 500,
  defaultLossMarginPercent: 10
};

// Initial admin users
export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'Valdomiro "Vando" da Silva',
    email: 'admin@vando.com.br',
    role: 'admin_master',
    active: true,
    lastLogin: 'Hoje, às 08:30'
  },
  {
    id: 'usr-2',
    name: 'Amanda Vasconcelos',
    email: 'amanda.vendas@vando.com.br',
    role: 'gerente_vendas',
    active: true,
    lastLogin: 'Ontem, às 17:45'
  },
  {
    id: 'usr-3',
    name: 'Carlos Alberto Logística',
    email: 'logistica@vando.com.br',
    role: 'operador_logistico',
    active: true,
    lastLogin: 'Hoje, às 07:15'
  }
];

// Initial audit logs
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    userName: 'Valdomiro (Admin Master)',
    action: 'Status do Pedido Atualizado',
    details: 'Pedido VAND-2026-1050 alterado para "Em Separação no Galpão"',
    type: 'pedido'
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    userName: 'Carlos Alberto Logística',
    action: 'Alocação de Motorista',
    details: 'Caminhão Toco alocado para entrega no bairro Boa Viagem',
    type: 'veiculo'
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    userName: 'Amanda Vasconcelos',
    action: 'Ajuste de Preço de Estoque',
    details: 'Cimento CP-II 50kg atualizado para R$ 34,90',
    type: 'estoque'
  }
];

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading orders:', e);
    return INITIAL_ORDERS;
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders:', e);
  }
}

export function addOrder(newOrder: Order): Order[] {
  const current = getStoredOrders();
  const updated = [newOrder, ...current];
  saveOrders(updated);
  saveOrderToFirestore(newOrder).catch(console.error);
  return updated;
}

export function updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order[] {
  const current = getStoredOrders();
  const updated = current.map(ord => {
    if (ord.id === orderId) {
      const historyEntry = {
        status,
        timestamp: new Date().toISOString(),
        note: note || `Status alterado para ${formatStatusLabel(status)}`
      };
      return {
        ...ord,
        status,
        statusHistory: [...(ord.statusHistory || []), historyEntry]
      };
    }
    return ord;
  });
  saveOrders(updated);
  updateOrderStatusInFirestore(orderId, status, note).catch(console.error);
  return updated;
}

export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading products:', e);
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    // Background sync each updated product to Firestore
    products.forEach(p => saveProductToFirestore(p).catch(console.error));
  } catch (e) {
    console.error('Error saving products:', e);
  }
}

export function getStoredBudget(): BudgetItem[] {
  try {
    const raw = localStorage.getItem(BUDGET_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveBudget(items: BudgetItem[]): void {
  try {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving budget:', e);
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatWeight(weightKg: number): string {
  if (weightKg >= 1000) {
    return `${(weightKg / 1000).toFixed(2).replace('.', ',')} Toneladas`;
  }
  return `${weightKg.toLocaleString('pt-BR')} kg`;
}

export function formatStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'orcamento':
      return 'Orçamento Aberto';
    case 'confirmado':
      return 'Pedido Confirmado';
    case 'em_separacao':
      return 'Em Separação no Galpão';
    case 'saiu_para_entrega':
      return 'Em Rota de Entrega';
    case 'entregue':
      return 'Entregue na Obra';
    case 'cancelado':
      return 'Cancelado';
    default:
      return status;
  }
}

export function getStatusColor(status: OrderStatus): { bg: string; text: string; border: string; badge: string } {
  switch (status) {
    case 'orcamento':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', badge: 'bg-amber-500 text-slate-950' };
    case 'confirmado':
      return { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30', badge: 'bg-sky-500 text-white' };
    case 'em_separacao':
      return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', badge: 'bg-indigo-500 text-white' };
    case 'saiu_para_entrega':
      return { bg: 'bg-lime-500/10', text: 'text-lime-400', border: 'border-lime-500/30', badge: 'bg-lime-400 text-slate-950 font-bold' };
    case 'entregue':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', badge: 'bg-emerald-500 text-white' };
    case 'cancelado':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', badge: 'bg-rose-500 text-white' };
    default:
      return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', badge: 'bg-slate-500 text-white' };
  }
}

export function generateWhatsAppMessage(order: Order): string {
  const itemsText = order.items
    .map(i => `• ${i.quantity}x ${i.product.name} (${formatCurrency(i.product.price * i.quantity)})`)
    .join('\n');

  const text = `*🏗️ VANDO CONSTRUÇÃO - PEDIDO #${order.code}*
_Tudo para construir seus sonhos_

*👤 Cliente:* ${order.customer.name}
*📞 Contato:* ${order.customer.phone}
*📍 Entrega:* ${order.customer.street}, ${order.customer.number} - ${order.customer.neighborhood}, ${order.customer.city}
${order.customer.referencePoint ? `*📌 Ref:* ${order.customer.referencePoint}\n` : ''}
*📅 Data Agendada:* ${new Date(order.schedule.date + 'T12:00:00').toLocaleDateString('pt-BR')} (${order.schedule.shift.toUpperCase()})
*🚚 Veículo Alocado:* ${order.schedule.vehicleType}

*📦 ITENS SOLICITADOS:*
${itemsText}

*Subtotal:* ${formatCurrency(order.subtotal)}
*Desconto:* -${formatCurrency(order.discount)}
*Frete:* ${formatCurrency(order.freightCost)}
*💰 TOTAL GERAL:* ${formatCurrency(order.total)}
*💳 Forma de Pagamento:* ${order.paymentMethod.toUpperCase()}${order.installments ? ` (${order.installments}x)` : ''}

*Status Atual:* ${formatStatusLabel(order.status).toUpperCase()}
Dúvidas ou alterações? Chame nosso atendimento no (81) 98351-7307!`;

  return encodeURIComponent(text);
}

// ================= ADMIN & SYSTEM PERSISTENCE ================= //

export function getStoredVehicles(): VehicleItem[] {
  try {
    const raw = localStorage.getItem(VEHICLES_KEY);
    if (!raw) {
      localStorage.setItem(VEHICLES_KEY, JSON.stringify(INITIAL_VEHICLES));
      return INITIAL_VEHICLES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading vehicles:', e);
    return INITIAL_VEHICLES;
  }
}

export function saveVehicles(vehicles: VehicleItem[]): void {
  try {
    localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
    vehicles.forEach(v => saveVehicleToFirestore(v).catch(console.error));
  } catch (e) {
    console.error('Error saving vehicles:', e);
  }
}

export function getStoredFreights(): NeighborhoodItem[] {
  try {
    const raw = localStorage.getItem(FREIGHTS_KEY);
    if (!raw) {
      localStorage.setItem(FREIGHTS_KEY, JSON.stringify(INITIAL_FREIGHTS));
      return INITIAL_FREIGHTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading freights:', e);
    return INITIAL_FREIGHTS;
  }
}

export function saveFreights(freights: NeighborhoodItem[]): void {
  try {
    localStorage.setItem(FREIGHTS_KEY, JSON.stringify(freights));
    freights.forEach(f => saveFreightToFirestore(f).catch(console.error));
  } catch (e) {
    console.error('Error saving freights:', e);
  }
}

export function getStoredStoreConfig(): StoreConfig {
  try {
    const raw = localStorage.getItem(STORE_CONFIG_KEY);
    if (!raw) {
      localStorage.setItem(STORE_CONFIG_KEY, JSON.stringify(INITIAL_STORE_CONFIG));
      return INITIAL_STORE_CONFIG;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading store config:', e);
    return INITIAL_STORE_CONFIG;
  }
}

export function saveStoreConfig(config: StoreConfig): void {
  try {
    localStorage.setItem(STORE_CONFIG_KEY, JSON.stringify(config));
    saveStoreConfigToFirestore(config).catch(console.error);
  } catch (e) {
    console.error('Error saving store config:', e);
  }
}

export function getStoredAdminUsers(): AdminUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_ADMIN_USERS));
      return INITIAL_ADMIN_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading admin users:', e);
    return INITIAL_ADMIN_USERS;
  }
}

export function saveAdminUsers(users: AdminUser[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    users.forEach(u => saveAdminUserToFirestore(u).catch(console.error));
  } catch (e) {
    console.error('Error saving admin users:', e);
  }
}

export function getStoredAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading audit logs:', e);
    return INITIAL_AUDIT_LOGS;
  }
}

export function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
  try {
    const logs = getStoredAuditLogs();
    const newLog: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...logs].slice(0, 100);
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));
    addAuditLogToFirestore(entry).catch(console.error);
  } catch (e) {
    console.error('Error adding audit log:', e);
  }
}

export function getStoredAdminSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveAdminSession(user: AdminUser): void {
  try {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving admin session:', e);
  }
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (e) {
    console.error('Error clearing admin session:', e);
  }
}
