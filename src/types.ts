export type CategoryId = 'materiais' | 'ferragens' | 'hidraulica' | 'eletrica' | 'acabamentos' | 'ferramentas';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortDescription: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  unit: string;
  weightKg: number;
  description: string;
  inStock: number;
  minOrder?: number;
  popular?: boolean;
  badge?: string;
  image?: string;
  isMeliChoice?: boolean;
}

export interface BudgetItem {
  product: Product;
  quantity: number;
}

export type DeliveryShift = 'manha' | 'tarde' | 'expresso';

export type VehicleType = 'fiorino' | 'caminhao_toco' | 'caminhao_cacamba' | 'caminhao_truck';

export type PaymentMethod = 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'faturado_boleto';

export type OrderStatus = 
  | 'orcamento'
  | 'confirmado' 
  | 'em_separacao' 
  | 'saiu_para_entrega' 
  | 'entregue' 
  | 'cancelado';

export interface CustomerInfo {
  name: string;
  phone: string;
  document?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  referencePoint?: string;
  receiverName?: string;
  receiverPhone?: string;
  notes?: string;
}

export interface DeliverySchedule {
  date: string;
  shift: DeliveryShift;
  vehicleType: VehicleType;
  freightCost: number;
  driverName?: string;
  vehiclePlate?: string;
  unloadingNotes?: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  code: string;
  createdAt: string;
  customer: CustomerInfo;
  items: BudgetItem[];
  schedule: DeliverySchedule;
  subtotal: number;
  discount: number;
  freightCost: number;
  total: number;
  paymentMethod: PaymentMethod;
  installments?: number;
  status: OrderStatus;
  adminNotes?: string;
  statusHistory: StatusHistoryEntry[];
}

export interface CalculatorMasonryInput {
  wallLength: number;
  wallHeight: number;
  brickType: '8furos' | '6furos' | 'bloco_concreto_14' | 'tijolo_macico';
  includePlaster: boolean;
}

export interface CalculatorFloorInput {
  areaM2: number;
  slabThicknessCm: number; // e.g. 5cm for contrapiso
  mixRatio: 'forte' | 'medio' | 'economico';
  includeTile: boolean;
  tileWasteMarginPercent: number; // default 10%
}

export interface CalculatorPaintInput {
  wallAreaM2: number;
  coats: number; // demãos (2 ou 3)
  surfaceCondition: 'nova' | 'repintura' | 'porosa';
  paintType: 'acrilica' | 'latex' | 'esmalte';
}

export interface CalculatorRoofSlabInput {
  areaM2: number;
  thicknessCm: number;
  loadType: 'leve' | 'residencial' | 'comercial';
}

export type ActiveTab = 'catalogo' | 'calculadora' | 'agendamento' | 'rastreamento' | 'admin';

export type AdminSection = 
  | 'metricas' 
  | 'pedidos' 
  | 'logistica' 
  | 'estoque' 
  | 'fretes' 
  | 'configuracoes' 
  | 'usuarios';

export interface VehicleItem {
  id: string;
  key: string;
  name: string;
  label: string;
  capacity: string;
  maxWeightKg: number;
  driver: string;
  plate: string;
  status: 'disponivel' | 'em_rota' | 'manutencao';
  description: string;
  icon: string;
}

export interface NeighborhoodItem {
  id: string;
  name: string;
  freight: number;
  timeEst: string;
  zone: string;
  active: boolean;
}

export interface StoreConfig {
  name: string;
  slogan: string;
  tagline: string;
  cnpj: string;
  phone: string;
  whatsappRaw: string;
  address: string;
  openingHours: string;
  pixKey: string;
  pixName: string;
  pixDiscountPercent: number;
  maxInstallments: number;
  freeShippingThreshold: number;
  defaultLossMarginPercent: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin_master' | 'gerente_vendas' | 'operador_logistico';
  avatar?: string;
  active: boolean;
  lastLogin?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  action: string;
  details: string;
  type: 'pedido' | 'estoque' | 'frete' | 'veiculo' | 'config' | 'auth';
}
