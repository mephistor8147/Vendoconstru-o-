import { Product, CategoryInfo, Order } from '../types';

export const STORE_INFO = {
  name: 'Vando Construção',
  slogan: 'TUDO PARA CONSTRUIR SEUS SONHOS.',
  tagline: 'DO ALICERCE AO ACABAMENTO, AQUI TEM TUDO PARA SUA OBRA!',
  phone: '81 98351-7307',
  whatsappRaw: '5581983517307',
  address: 'Av. Principal da Construção, 1500 - Recife / PE',
  openingHours: 'Segunda a Sexta: 07:00 às 17:30 | Sábado: 07:00 às 13:00',
  instagram: '@vandoconstrucao',
  pixKey: '81983517307',
  pixName: 'VANDO MATERIAIS DE CONSTRUÇÃO LTDA'
};

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'materiais',
    name: 'Materiais Básicos',
    shortDescription: 'Cimento, areia, brita, tijolos e argamassas',
    icon: 'Blocks'
  },
  {
    id: 'ferragens',
    name: 'Ferragens & Aço',
    shortDescription: 'Vergalhões, colunas armadas, estribos e telas',
    icon: 'Trowel'
  },
  {
    id: 'hidraulica',
    name: 'Hidráulica',
    shortDescription: 'Tubos, conexões, caixas d\'água e torneiras',
    icon: 'Droplets'
  },
  {
    id: 'eletrica',
    name: 'Elétrica',
    shortDescription: 'Fios, disjuntores, conduítes e iluminação LED',
    icon: 'Zap'
  },
  {
    id: 'acabamentos',
    name: 'Acabamentos',
    shortDescription: 'Pisos, porcelanatos, tintas e louças',
    icon: 'Home'
  },
  {
    id: 'ferramentas',
    name: 'Ferramentas',
    shortDescription: 'Pás, carrinhos de mão, colheres e EPIs',
    icon: 'Wrench'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // MATERIAIS BÁSICOS
  {
    id: 'mat-001',
    name: 'Cimento CP-II Todas as Obras 50kg',
    category: 'materiais',
    price: 36.90,
    unit: 'Saco 50kg',
    weightKg: 50,
    description: 'Cimento de alta resistência e secagem controlada para fundações, alvenaria e acabamento.',
    inStock: 850,
    popular: true,
    badge: 'Mais Vendido',
    image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mat-002',
    name: 'Areia Lavada Média (Massa e Concreto)',
    category: 'materiais',
    price: 110.00,
    unit: 'Metro Cúbico (m³)',
    weightKg: 1400,
    description: 'Areia limpa isenta de impurezas orgânicas, ideal para assentamento e reboco.',
    inStock: 45,
    popular: true,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mat-003',
    name: 'Brita 1 Granítica para Concreto',
    category: 'materiais',
    price: 125.00,
    unit: 'Metro Cúbico (m³)',
    weightKg: 1500,
    description: 'Pedra britada número 1 selecionada para lajes, vigas e sapatas estruturais.',
    inStock: 30,
    popular: true,
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mat-004',
    name: 'Tijolo Cerâmico 8 Furos (9x19x19cm)',
    category: 'materiais',
    price: 890.00,
    unit: 'Milheiro (1000 un)',
    weightKg: 2200,
    description: 'Tijolo de primeira linha com excelente isolamento térmico e precisão dimensional.',
    inStock: 18,
    popular: true,
    badge: 'Oferta Especial',
    image: 'https://images.unsplash.com/photo-1584463699039-44e21d6df4b2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mat-005',
    name: 'Argamassa Colante AC-II Externa/Interna 20kg',
    category: 'materiais',
    price: 24.50,
    unit: 'Saco 20kg',
    weightKg: 20,
    description: 'Indicada para cerâmicas e pisos em áreas internas e externas.',
    inStock: 320,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mat-006',
    name: 'Bloco de Concreto Estrutural 14x19x39cm',
    category: 'materiais',
    price: 4.80,
    unit: 'Unidade',
    weightKg: 12,
    description: 'Bloco de alta densidade para alvenaria de vedação e estrutural resistente.',
    inStock: 1400,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mat-007',
    name: 'Cal Hidratada CH-I para Reboco 20kg',
    category: 'materiais',
    price: 18.90,
    unit: 'Saco 20kg',
    weightKg: 20,
    description: 'Proporciona maior plasticidade e trabalhabilidade à massa de reboco.',
    inStock: 210,
    image: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=600&q=80'
  },

  // FERRAGENS & AÇO
  {
    id: 'fer-001',
    name: 'Vergalhão CA-50 Nervurado 5/16" (8.0mm) - Barra 12m',
    category: 'ferragens',
    price: 42.00,
    unit: 'Barra 12m',
    weightKg: 4.8,
    description: 'Aço de alta resistência soldado para vigas, pilares e sapatas de fundação.',
    inStock: 450,
    popular: true,
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'fer-002',
    name: 'Vergalhão CA-50 Nervurado 3/8" (10.0mm) - Barra 12m',
    category: 'ferragens',
    price: 64.90,
    unit: 'Barra 12m',
    weightKg: 7.4,
    description: 'Aço estrutural padrão ABNT para concreto armado com máxima aderência.',
    inStock: 380,
    image: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'fer-003',
    name: 'Coluna Armada Pronta 7x14cm com Estribos - 6m',
    category: 'ferragens',
    price: 98.00,
    unit: 'Unidade (6 metros)',
    weightKg: 14,
    description: 'Coluna montada e amarrada pronta para concretagem, agiliza a obra.',
    inStock: 120,
    badge: 'Praticidade na Obra',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'fer-004',
    name: 'Arame Recozido Torcido BWG 18 (1kg)',
    category: 'ferragens',
    price: 19.90,
    unit: 'Rolo 1kg',
    weightKg: 1,
    description: 'Arame maleável para amarração de ferragens e montagem de armaduras.',
    inStock: 200,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'fer-005',
    name: 'Tela Soldada para Contrapiso Q92 (Painel 2x3m)',
    category: 'ferragens',
    price: 85.00,
    unit: 'Painel 6m²',
    weightKg: 9,
    description: 'Evita trincas e fissuras na concretagem de pisos industriais e residenciais.',
    inStock: 75,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
  },

  // HIDRÁULICA
  {
    id: 'hid-001',
    name: 'Tubo PVC Soldável Marrom 25mm (3/4") - Barra 6m',
    category: 'hidraulica',
    price: 21.90,
    unit: 'Barra 6m',
    weightKg: 1.2,
    description: 'Tubo para condução de água fria predial com alta durabilidade e estanqueidade.',
    inStock: 300,
    popular: true,
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hid-002',
    name: 'Tubo de Esgoto Série Normal 100mm - Barra 6m',
    category: 'hidraulica',
    price: 49.90,
    unit: 'Barra 6m',
    weightKg: 3.5,
    description: 'Tubo de PVC rígido para esgoto sanitário e escoamento de águas pluviais.',
    inStock: 180,
    image: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hid-003',
    name: 'Caixa d\'Água Polietileno 1.000 Litros com Tampa',
    category: 'hidraulica',
    price: 489.00,
    unit: 'Unidade',
    weightKg: 19,
    description: 'Caixa com trava de segurança, proteção antibacteriana e alta durabilidade.',
    inStock: 25,
    badge: '10 Anos Garantia',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hid-004',
    name: 'Torneira Lavatório Bica Alta Metal Cromado 1/4 Volta',
    category: 'hidraulica',
    price: 89.90,
    unit: 'Unidade',
    weightKg: 0.8,
    description: 'Acabamento cromado anticorrosivo com mecanismo cerâmico econômico.',
    inStock: 65,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hid-005',
    name: 'Kit Válvula de Descarga + Tubo de Ligação',
    category: 'hidraulica',
    price: 135.00,
    unit: 'Kit Completo',
    weightKg: 1.5,
    description: 'Kit completo de acionamento suave com alta vazão.',
    inStock: 40,
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80'
  },

  // ELÉTRICA
  {
    id: 'ele-001',
    name: 'Cabo Flexível 2,5mm² 750V Anti-chama (Rolo 100m)',
    category: 'eletrica',
    price: 198.00,
    unit: 'Rolo 100m',
    weightKg: 3.2,
    description: 'Fio de cobre 100% puro para tomadas residenciais com certificação Inmetro.',
    inStock: 140,
    popular: true,
    badge: '100% Cobre Puro',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ele-002',
    name: 'Cabo Flexível 4,0mm² 750V para Chuveiro (Rolo 100m)',
    category: 'eletrica',
    price: 315.00,
    unit: 'Rolo 100m',
    weightKg: 4.8,
    description: 'Ideal para circuitos de maior potência como chuveiros e ar-condicionado.',
    inStock: 90,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ele-003',
    name: 'Disjuntor Bipolar DIN Curva C 40A',
    category: 'eletrica',
    price: 38.00,
    unit: 'Unidade',
    weightKg: 0.25,
    description: 'Proteção confiável contra sobrecargas e curtos-circuitos no quadro elétrico.',
    inStock: 115,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ele-004',
    name: 'Lâmpada LED Bulbo 12W Bivolt 6500K Branco Frio',
    category: 'eletrica',
    price: 9.90,
    unit: 'Unidade',
    weightKg: 0.1,
    description: 'Alta eficiência luminosa (1050lm), economiza até 85% de energia.',
    inStock: 450,
    popular: true,
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ele-005',
    name: 'Eletroduto Corrugado Amarelo 3/4" (Rolo 50m)',
    category: 'eletrica',
    price: 52.00,
    unit: 'Rolo 50m',
    weightKg: 2.1,
    description: 'Conduíte flexível para passagem embutida em paredes de alvenaria.',
    inStock: 95,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
  },

  // ACABAMENTOS
  {
    id: 'acb-001',
    name: 'Tinta Acrílica Fosca Lavável Premium 18L Branco Neve',
    category: 'acabamentos',
    price: 289.00,
    unit: 'Lata 18L',
    weightKg: 24,
    description: 'Super rendimento (até 500m² por demão), sem cheiro e excelente cobertura.',
    inStock: 70,
    popular: true,
    badge: 'Super Cobertura',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'acb-002',
    name: 'Massa Corrida PVA Premium 25kg',
    category: 'acabamentos',
    price: 46.00,
    unit: 'Barrica 25kg',
    weightKg: 25,
    description: 'Fácil de aplicar e lixar, proporciona acabamento liso e uniforme para paredes.',
    inStock: 110,
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'acb-003',
    name: 'Porcelanato Polido Retificado 84x84cm Calacatta Gold',
    category: 'acabamentos',
    price: 79.90,
    unit: 'm² (Caixa c/ 2.12m²)',
    weightKg: 22,
    description: 'Brilho espelhado e acabamento refinado com veios dourados marmorizados.',
    inStock: 240,
    popular: true,
    badge: 'Design Premium',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'acb-004',
    name: 'Rejunte Acrílico Pronto Bicomponente 1kg Branco',
    category: 'acabamentos',
    price: 32.50,
    unit: 'Balde 1kg',
    weightKg: 1,
    description: '100% impermeável, antimofo e não desbota. Pronto para uso imediato.',
    inStock: 180,
    image: 'https://images.unsplash.com/photo-1584463699039-44e21d6df4b2?auto=format&fit=crop&w=600&q=80'
  },

  // FERRAMENTAS
  {
    id: 'ferr-001',
    name: 'Colher de Pedreiro Canto Reto 8" Forjada Cabo Madeira',
    category: 'ferramentas',
    price: 34.90,
    unit: 'Unidade',
    weightKg: 0.45,
    description: 'Lâmina forjada em aço carbono de alta durabilidade com empunhadura ergonômica.',
    inStock: 85,
    popular: true,
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ferr-002',
    name: 'Carrinho de Mão Caçamba Reforçada 65L Chapa 18',
    category: 'ferramentas',
    price: 249.00,
    unit: 'Unidade',
    weightKg: 11,
    description: 'Estrutura tubular ultra resistente com pneu com câmara para transporte de cargas pesadas.',
    inStock: 35,
    badge: 'Ultra Reforçado',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ferr-003',
    name: 'Pá de Bico com Cabo de Madeira 120cm',
    category: 'ferramentas',
    price: 49.00,
    unit: 'Unidade',
    weightKg: 1.8,
    description: 'Aço temperado para escavação, corte de terra e carregamento de agregados.',
    inStock: 60,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ferr-004',
    name: 'Capacete de Segurança Aba Frontal Classe B Verde Limão',
    category: 'ferramentas',
    price: 28.00,
    unit: 'Unidade',
    weightKg: 0.35,
    description: 'EPI oficial Vando Construção com suspensão ajustável e teste de impacto aprovado.',
    inStock: 150,
    badge: 'Identidade Vando',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
  }
];

export const NEIGHBORHOODS = [
  { name: 'Centro / Boa Vista', freight: 35.00, timeEst: '1h - 2h', zone: 'Zona Central' },
  { name: 'Boa Viagem / Pina', freight: 45.00, timeEst: '2h - 3h', zone: 'Zona Sul' },
  { name: 'Casa Forte / Espinheiro', freight: 40.00, timeEst: '2h', zone: 'Zona Norte' },
  { name: 'Caxangá / Várzea / CDU', freight: 50.00, timeEst: '2h - 3h', zone: 'Zona Oeste' },
  { name: 'Afogados / Imbiribeira', freight: 40.00, timeEst: '1h - 2h', zone: 'Zona Sul' },
  { name: 'Olinda / Bairro Novo', freight: 55.00, timeEst: '3h', zone: 'Região Metropolitana' },
  { name: 'Jaboatão dos Guararapes', freight: 65.00, timeEst: '3h - 4h', zone: 'Região Metropolitana' },
  { name: 'Camaragibe / São Lourenço', freight: 70.00, timeEst: '3h - 4h', zone: 'Região Metropolitana' },
  { name: 'Paulista / Abreu e Lima', freight: 75.00, timeEst: '4h', zone: 'Região Metropolitana' },
  { name: 'Retirada na Loja (Balcão)', freight: 0.00, timeEst: 'Imediato', zone: 'Própria Loja' }
];

export const VEHICLE_DETAILS: Record<string, { label: string; name: string; capacity: string; maxWeightKg: number; driver: string; plate: string; description: string; icon: string }> = {
  fiorino: {
    label: 'Utilitário / Fiorino',
    name: 'Fiorino Express',
    capacity: 'Até 650 kg',
    maxWeightKg: 650,
    driver: 'Claudio Ferreira',
    plate: 'KLD-9A12',
    description: 'Ideal para ferramentas, tintas, conexões hidráulicas e fios.',
    icon: 'Car'
  },
  caminhao_toco: {
    label: 'Caminhão Toco (2 Eixos)',
    name: 'Caminhão Toco 02',
    capacity: 'Até 6.000 kg',
    maxWeightKg: 6000,
    driver: 'Marcos Vinicius',
    plate: 'PEV-4H20',
    description: 'Perfeito para cimento em sacos, pisos, ferragens e blocos.',
    icon: 'Truck'
  },
  caminhao_cacamba: {
    label: 'Caminhão Caçamba Basculante',
    name: 'Basculante Pesado 01',
    capacity: 'Até 8 m³ (12 Toneladas)',
    maxWeightKg: 12000,
    driver: 'José Ribamar',
    plate: 'VND-2026',
    description: 'Exclusivo para entrega a granel de areia lavada, brita e saibro.',
    icon: 'HardHat'
  },
  caminhao_truck: {
    label: 'Caminhão Truck Pesado (3 Eixos)',
    name: 'Truck Especial 03',
    capacity: 'Até 14.000 kg',
    maxWeightKg: 14000,
    driver: 'Valdomiro Silva',
    plate: 'RCF-7B88',
    description: 'Para grandes obras, múltiplos milheiros de tijolos e carretas de aço.',
    icon: 'PackageCheck'
  }
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    code: 'VAND-2026-1048',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    customer: {
      name: 'Eng. Ricardo Silveira (Obra Residencial Alphaville)',
      phone: '(81) 99876-5432',
      document: '042.891.234-55',
      street: 'Alameda das Palmeiras',
      number: '420',
      neighborhood: 'Boa Viagem / Pina',
      city: 'Recife - PE',
      referencePoint: 'Próximo à guarita 2',
      receiverName: 'Mestre Gilberto',
      receiverPhone: '(81) 98765-1122',
      notes: 'Descarregar cimento coberto na garagem para proteger de chuva.'
    },
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 40 }, // 40 sacos cimento
      { product: INITIAL_PRODUCTS[1], quantity: 4 },  // 4m³ areia
      { product: INITIAL_PRODUCTS[7], quantity: 15 }, // 15 barras vergalhão
      { product: INITIAL_PRODUCTS[4], quantity: 10 }  // 10 argamassas
    ],
    schedule: {
      date: new Date().toISOString().split('T')[0],
      shift: 'tarde',
      vehicleType: 'caminhao_toco',
      freightCost: 45.00,
      driverName: 'Marcos Vinicius (Caminhão 02)',
      vehiclePlate: 'PEV-4H20',
      unloadingNotes: 'Acesso liberado para caminhão toco.'
    },
    subtotal: 2791.00,
    discount: 139.55, // 5% PIX
    freightCost: 45.00,
    total: 2696.45,
    paymentMethod: 'pix',
    status: 'saiu_para_entrega',
    adminNotes: 'Carga conferida pelo encarregado de expedição. Cliente VIP.',
    statusHistory: [
      { status: 'orcamento', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), note: 'Orçamento gerado pelo site' },
      { status: 'confirmado', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), note: 'Pagamento via PIX confirmado' },
      { status: 'em_separacao', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'Materiais carregados no galpão central' },
      { status: 'saiu_para_entrega', timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(), note: 'Motorista Marcos em rota de entrega' }
    ]
  },
  {
    id: 'ord-2',
    code: 'VAND-2026-1049',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    customer: {
      name: 'Marta Helena Cavalcanti',
      phone: '(81) 98442-9900',
      street: 'Rua Real da Torre',
      number: '112',
      complement: 'Apto 402 - Reforma Banheiros',
      neighborhood: 'Casa Forte / Espinheiro',
      city: 'Recife - PE',
      referencePoint: 'Em frente à padaria artesanal',
      receiverName: 'Marta Helena',
      notes: 'Ligar 15 minutos antes de chegar para autorizar portaria.'
    },
    items: [
      { product: INITIAL_PRODUCTS[18], quantity: 18 }, // 18m² porcelanato
      { product: INITIAL_PRODUCTS[19], quantity: 6 },  // 6 rejuntes
      { product: INITIAL_PRODUCTS[16], quantity: 2 },  // 2 latas tinta
      { product: INITIAL_PRODUCTS[13], quantity: 1 }   // 1 torneira
    ],
    schedule: {
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Amanhã
      shift: 'manha',
      vehicleType: 'fiorino',
      freightCost: 40.00,
      driverName: 'Claudio Ferreira',
      vehiclePlate: 'KLD-9A12'
    },
    subtotal: 2191.10,
    discount: 0,
    freightCost: 40.00,
    total: 2231.10,
    paymentMethod: 'cartao_credito',
    installments: 6,
    status: 'confirmado',
    adminNotes: 'Separar caixas de porcelanato do mesmo lote de fabricação.',
    statusHistory: [
      { status: 'orcamento', timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), note: 'Orçamento solicitado' },
      { status: 'confirmado', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), note: 'Aprovado no cartão de crédito em 6x' }
    ]
  },
  {
    id: 'ord-3',
    code: 'VAND-2026-1050',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    customer: {
      name: 'Construtora Horizonte Norte',
      phone: '(81) 99112-3344',
      document: '12.345.678/0001-90',
      street: 'Av. Conselheiro Aguiar',
      number: '2800',
      neighborhood: 'Boa Viagem / Pina',
      city: 'Recife - PE',
      referencePoint: 'Canteiro Edifício Mar Azul',
      receiverName: 'Encarregado Valdir',
      receiverPhone: '(81) 98112-9988',
      notes: 'Entrega de areia e brita basculada direto na baia.'
    },
    items: [
      { product: INITIAL_PRODUCTS[1], quantity: 6 }, // 6m³ areia
      { product: INITIAL_PRODUCTS[2], quantity: 6 }, // 6m³ brita
      { product: INITIAL_PRODUCTS[3], quantity: 3 }  // 3 milheiros tijolo
    ],
    schedule: {
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      shift: 'manha',
      vehicleType: 'caminhao_cacamba',
      freightCost: 90.00
    },
    subtotal: 4080.00,
    discount: 204.00,
    freightCost: 90.00,
    total: 3966.00,
    paymentMethod: 'faturado_boleto',
    status: 'em_separacao',
    statusHistory: [
      { status: 'orcamento', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'Cotação corporativa' },
      { status: 'confirmado', timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), note: 'Boleto faturado 28 dias' },
      { status: 'em_separacao', timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(), note: 'Agendado carregamento na pedreira/porto' }
    ]
  }
];
