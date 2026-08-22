import { INITIAL_PRODUCTS } from '../data/mockData';
import { BudgetItem, CalculatorMasonryInput, CalculatorFloorInput, CalculatorPaintInput, CalculatorRoofSlabInput } from '../types';

export interface CalculationResult {
  title: string;
  summary: string;
  estimatedWeightKg: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    purpose: string;
  }[];
  totalCost: number;
  technicalTips: string[];
}

export function calculateMasonry(input: CalculatorMasonryInput): CalculationResult {
  const areaM2 = Math.max(1, input.wallLength * input.wallHeight);
  
  let brickMultiplier = 28; // 8 furos
  let brickUnitName = 'Milheiro (1000 un)';
  let targetBrickId = 'mat-004'; // 8 furos
  let rawBrickCount = 0;
  let brickQtyFormatted = 0;

  if (input.brickType === '8furos') {
    brickMultiplier = 28; // por m²
    rawBrickCount = Math.ceil(areaM2 * brickMultiplier * 1.10); // 10% perda
    brickQtyFormatted = Math.max(1, Math.ceil(rawBrickCount / 1000)); // em milheiros
    targetBrickId = 'mat-004';
  } else if (input.brickType === 'bloco_concreto_14') {
    brickMultiplier = 13;
    rawBrickCount = Math.ceil(areaM2 * brickMultiplier * 1.05); // 5% perda
    brickQtyFormatted = rawBrickCount;
    targetBrickId = 'mat-006';
  } else {
    // 6 furos ou maciço
    brickMultiplier = 35;
    rawBrickCount = Math.ceil(areaM2 * brickMultiplier * 1.10);
    brickQtyFormatted = Math.max(1, Math.ceil(rawBrickCount / 1000));
    targetBrickId = 'mat-004';
  }

  // Cimento para assentamento (aproximadamente 0.12 sacos por m²)
  let cementBags = Math.ceil(areaM2 * 0.14);
  // Areia para assentamento (aproximadamente 0.03 m³ por m²)
  let sandM3 = Number((areaM2 * 0.032).toFixed(1));
  if (sandM3 < 0.5) sandM3 = 0.5;

  // Se incluir reboco em ambos os lados
  let calBags = 0;
  if (input.includePlaster) {
    cementBags += Math.ceil(areaM2 * 2 * 0.10); // 2 lados
    sandM3 = Number((sandM3 + areaM2 * 2 * 0.025).toFixed(1));
    calBags = Math.ceil(areaM2 * 2 * 0.12);
  }

  const items = [];
  let totalCost = 0;
  let totalWeight = 0;

  // Tijolo / Bloco
  const brickProd = INITIAL_PRODUCTS.find(p => p.id === targetBrickId) || INITIAL_PRODUCTS[3];
  const brickTotal = brickQtyFormatted * brickProd.price;
  items.push({
    productId: brickProd.id,
    productName: brickProd.name,
    quantity: brickQtyFormatted,
    unit: brickProd.unit,
    unitPrice: brickProd.price,
    totalPrice: brickTotal,
    purpose: `Levantamento de ${areaM2.toFixed(1)}m² de parede (${rawBrickCount} unidades com margem de quebra)`
  });
  totalCost += brickTotal;
  totalWeight += brickQtyFormatted * brickProd.weightKg;

  // Cimento
  const cementProd = INITIAL_PRODUCTS.find(p => p.id === 'mat-001')!;
  const cementTotal = cementBags * cementProd.price;
  items.push({
    productId: cementProd.id,
    productName: cementProd.name,
    quantity: cementBags,
    unit: cementProd.unit,
    unitPrice: cementProd.price,
    totalPrice: cementTotal,
    purpose: input.includePlaster ? 'Assentamento e reboco de ambas as faces' : 'Assentamento das fiadas'
  });
  totalCost += cementTotal;
  totalWeight += cementBags * cementProd.weightKg;

  // Areia
  const sandProd = INITIAL_PRODUCTS.find(p => p.id === 'mat-002')!;
  const sandTotal = Math.ceil(sandM3) * sandProd.price;
  items.push({
    productId: sandProd.id,
    productName: sandProd.name,
    quantity: Math.ceil(sandM3),
    unit: sandProd.unit,
    unitPrice: sandProd.price,
    totalPrice: sandTotal,
    purpose: `Massa de liga e emboço (${sandM3}m³ calculados)`
  });
  totalCost += sandTotal;
  totalWeight += Math.ceil(sandM3) * sandProd.weightKg;

  // Cal se selecionado
  if (calBags > 0) {
    const calProd = INITIAL_PRODUCTS.find(p => p.id === 'mat-007') || INITIAL_PRODUCTS[0];
    const calTotal = calBags * calProd.price;
    items.push({
      productId: calProd.id,
      productName: calProd.name,
      quantity: calBags,
      unit: calProd.unit,
      unitPrice: calProd.price,
      totalPrice: calTotal,
      purpose: 'Plasticidade e aderência do reboco (evita trincas)'
    });
    totalCost += calTotal;
    totalWeight += calBags * calProd.weightKg;
  }

  return {
    title: `Alvenaria para ${areaM2.toFixed(1)} m² de Parede`,
    summary: `${input.wallLength}m de comprimento x ${input.wallHeight}m de altura. Inclui margem de segurança e perdas de corte.`,
    estimatedWeightKg: totalWeight,
    items,
    totalCost,
    technicalTips: [
      'Molhe os tijolos antes do assentamento para evitar que absorvam a água da argamassa.',
      'Utilize prumo e nível de bolha a cada 2 fiadas.',
      'Aguarde a cura do emboço (no mínimo 72h) antes de aplicar pintura ou acabamento.'
    ]
  };
}

export function calculateFloor(input: CalculatorFloorInput): CalculationResult {
  const areaM2 = Math.max(1, input.areaM2);
  const thicknessM = input.slabThicknessCm / 100;
  const volumeM3 = areaM2 * thicknessM * 1.12; // 12% expansão/desnível

  // Traço médio (1 cimento : 3 areia : 3 brita)
  const cementBags = Math.ceil(volumeM3 * 6.5); // ~6.5 sacos por m³
  const sandM3 = Number((volumeM3 * 0.65).toFixed(1));
  const stoneM3 = Number((volumeM3 * 0.75).toFixed(1));

  const items = [];
  let totalCost = 0;
  let totalWeight = 0;

  // Cimento
  const cementProd = INITIAL_PRODUCTS.find(p => p.id === 'mat-001')!;
  const cementTotal = cementBags * cementProd.price;
  items.push({
    productId: cementProd.id,
    productName: cementProd.name,
    quantity: cementBags,
    unit: cementProd.unit,
    unitPrice: cementProd.price,
    totalPrice: cementTotal,
    purpose: `Base resistente do contrapiso (${input.slabThicknessCm}cm de espessura)`
  });
  totalCost += cementTotal;
  totalWeight += cementBags * cementProd.weightKg;

  // Areia
  const sandProd = INITIAL_PRODUCTS.find(p => p.id === 'mat-002')!;
  const sandQty = Math.max(1, Math.ceil(sandM3));
  const sandTotal = sandQty * sandProd.price;
  items.push({
    productId: sandProd.id,
    productName: sandProd.name,
    quantity: sandQty,
    unit: sandProd.unit,
    unitPrice: sandProd.price,
    totalPrice: sandTotal,
    purpose: `Agregado miúdo para regularização (${sandM3}m³ volume real)`
  });
  totalCost += sandTotal;
  totalWeight += sandQty * sandProd.weightKg;

  // Brita
  const stoneProd = INITIAL_PRODUCTS.find(p => p.id === 'mat-003')!;
  const stoneQty = Math.max(1, Math.ceil(stoneM3));
  const stoneTotal = stoneQty * stoneProd.price;
  items.push({
    productId: stoneProd.id,
    productName: stoneProd.name,
    quantity: stoneQty,
    unit: stoneProd.unit,
    unitPrice: stoneProd.price,
    totalPrice: stoneTotal,
    purpose: `Agregado graúdo para corpo estrutural (${stoneM3}m³ volume real)`
  });
  totalCost += stoneTotal;
  totalWeight += stoneQty * stoneProd.weightKg;

  // Revestimento Porcelanato / Piso
  if (input.includeTile) {
    const tileMargin = 1 + (input.tileWasteMarginPercent / 100);
    const tileAreaTotal = Math.ceil(areaM2 * tileMargin);
    const tileProd = INITIAL_PRODUCTS.find(p => p.id === 'acb-003')!;
    const tileTotal = tileAreaTotal * tileProd.price;
    items.push({
      productId: tileProd.id,
      productName: tileProd.name,
      quantity: tileAreaTotal,
      unit: tileProd.unit,
      unitPrice: tileProd.price,
      totalPrice: tileTotal,
      purpose: `Revestimento com ${input.tileWasteMarginPercent}% de margem para rodapés e recortes`
    });
    totalCost += tileTotal;
    totalWeight += tileAreaTotal * tileProd.weightKg;

    // Argamassa AC-II (1 saco de 20kg para cada 4m²)
    const mortarBags = Math.ceil(tileAreaTotal / 4);
    const mortarProd = INITIAL_PRODUCTS.find(p => p.id === 'mat-005')!;
    const mortarTotal = mortarBags * mortarProd.price;
    items.push({
      productId: mortarProd.id,
      productName: mortarProd.name,
      quantity: mortarBags,
      unit: mortarProd.unit,
      unitPrice: mortarProd.price,
      totalPrice: mortarTotal,
      purpose: 'Assentamento do porcelanato/piso cerâmico'
    });
    totalCost += mortarTotal;
    totalWeight += mortarBags * mortarProd.weightKg;

    // Rejunte (1 balde para cada 4m²)
    const groutBuckets = Math.ceil(tileAreaTotal / 4);
    const groutProd = INITIAL_PRODUCTS.find(p => p.id === 'acb-004')!;
    const groutTotal = groutBuckets * groutProd.price;
    items.push({
      productId: groutProd.id,
      productName: groutProd.name,
      quantity: groutBuckets,
      unit: groutProd.unit,
      unitPrice: groutProd.price,
      totalPrice: groutTotal,
      purpose: 'Vedação e acabamento estético impermeável das juntas'
    });
    totalCost += groutTotal;
    totalWeight += groutBuckets * groutProd.weightKg;
  }

  return {
    title: `Piso e Contrapiso para ${areaM2.toFixed(1)} m²`,
    summary: `Espessura de ${input.slabThicknessCm}cm com traço equilibrado${input.includeTile ? ' + Revestimento e assentamento' : ''}.`,
    estimatedWeightKg: totalWeight,
    items,
    totalCost,
    technicalTips: [
      'Molhe e limpe a base antes de lançar o contrapiso para garantir aderência.',
      'Utilize desempenadeira dentada adequada para dupla colagem em porcelanatos maiores que 60x60cm.',
      'Respeite as juntas de dilatação recomendadas pelo fabricante do piso.'
    ]
  };
}

export function calculatePaint(input: CalculatorPaintInput): CalculationResult {
  const areaM2 = Math.max(1, input.wallAreaM2);
  const totalPaintingArea = areaM2 * input.coats;

  // Tinta 18L rende ~110m² com 2 demãos acabadas
  const paintCans18L = Math.max(1, Math.ceil(totalPaintingArea / 220));
  
  // Massa corrida se for parede nova ou repintura
  const plasterBarricas25kg = input.surfaceCondition === 'nova' 
    ? Math.max(1, Math.ceil(areaM2 / 35))
    : input.surfaceCondition === 'repintura'
      ? Math.max(1, Math.ceil(areaM2 / 70))
      : 0;

  const items = [];
  let totalCost = 0;
  let totalWeight = 0;

  // Tinta Acrílica
  const paintProd = INITIAL_PRODUCTS.find(p => p.id === 'acb-001')!;
  const paintTotal = paintCans18L * paintProd.price;
  items.push({
    productId: paintProd.id,
    productName: paintProd.name,
    quantity: paintCans18L,
    unit: paintProd.unit,
    unitPrice: paintProd.price,
    totalPrice: paintTotal,
    purpose: `Pintura de ${areaM2}m² com ${input.coats} demãos de acabamento fosco premium`
  });
  totalCost += paintTotal;
  totalWeight += paintCans18L * paintProd.weightKg;

  // Massa Corrida
  if (plasterBarricas25kg > 0) {
    const plasterProd = INITIAL_PRODUCTS.find(p => p.id === 'acb-002')!;
    const plasterTotal = plasterBarricas25kg * plasterProd.price;
    items.push({
      productId: plasterProd.id,
      productName: plasterProd.name,
      quantity: plasterBarricas25kg,
      unit: plasterProd.unit,
      unitPrice: plasterProd.price,
      totalPrice: plasterTotal,
      purpose: `Nivelamento e correção de imperfeições da parede (${input.surfaceCondition === 'nova' ? '2 demãos' : 'retoques pontuais'})`
    });
    totalCost += plasterTotal;
    totalWeight += plasterBarricas25kg * plasterProd.weightKg;
  }

  return {
    title: `Pintura e Preparação para ${areaM2.toFixed(1)} m²`,
    summary: `${input.coats} demãos recomendadas para acabamento uniforme e sem manchas.`,
    estimatedWeightKg: totalWeight,
    items,
    totalCost,
    technicalTips: [
      'Lixe a superfície e remova todo o pó com pano úmido antes de aplicar a primeira demão.',
      'Aguarde o intervalo de 4 horas entre cada demão de tinta.',
      'Para paredes novas, aplique selador acrílico antes da massa corrida para evitar consumo excessivo.'
    ]
  };
}

export function calculateRoofSlab(input: CalculatorRoofSlabInput): CalculationResult {
  const areaM2 = Math.max(1, input.areaM2);
  const thicknessM = input.thicknessCm / 100;
  const volumeM3 = areaM2 * thicknessM * 1.10; // 10% perda/vigas

  const cementBags = Math.ceil(volumeM3 * 7.5); // Concreto FCK 25
  const sandM3 = Number((volumeM3 * 0.70).toFixed(1));
  const stoneM3 = Number((volumeM3 * 0.85).toFixed(1));
  
  // Aço CA-50 8mm e 10mm (aproximadamente 1 barra de 12m para cada 1.5m² de laje)
  const steelBars8mm = Math.ceil(areaM2 * 0.7);
  const steelBars10mm = Math.ceil(areaM2 * 0.4);

  const items = [];
  let totalCost = 0;
  let totalWeight = 0;

  // Cimento
  const cementProd = INITIAL_PRODUCTS.find(p => p.id === 'mat-001')!;
  const cementTotal = cementBags * cementProd.price;
  items.push({
    productId: cementProd.id,
    productName: cementProd.name,
    quantity: cementBags,
    unit: cementProd.unit,
    unitPrice: cementProd.price,
    totalPrice: cementTotal,
    purpose: `Concreto estrutural de alta resistência para laje (${volumeM3.toFixed(2)}m³)`
  });
  totalCost += cementTotal;
  totalWeight += cementBags * cementProd.weightKg;

  // Areia
  const sandProd = INITIAL_PRODUCTS.find(p => p.id === 'mat-002')!;
  const sandQty = Math.max(1, Math.ceil(sandM3));
  const sandTotal = sandQty * sandProd.price;
  items.push({
    productId: sandProd.id,
    productName: sandProd.name,
    quantity: sandQty,
    unit: sandProd.unit,
    unitPrice: sandProd.price,
    totalPrice: sandTotal,
    purpose: `Areia lavada para concreto armado (${sandM3}m³)`
  });
  totalCost += sandTotal;
  totalWeight += sandQty * sandProd.weightKg;

  // Brita
  const stoneProd = INITIAL_PRODUCTS.find(p => p.id === 'mat-003')!;
  const stoneQty = Math.max(1, Math.ceil(stoneM3));
  const stoneTotal = stoneQty * stoneProd.price;
  items.push({
    productId: stoneProd.id,
    productName: stoneProd.name,
    quantity: stoneQty,
    unit: stoneProd.unit,
    unitPrice: stoneProd.price,
    totalPrice: stoneTotal,
    purpose: `Pedra britada 1 selecionada (${stoneM3}m³)`
  });
  totalCost += stoneTotal;
  totalWeight += stoneQty * stoneProd.weightKg;

  // Vergalhão 5/16 (8mm)
  const steel8Prod = INITIAL_PRODUCTS.find(p => p.id === 'fer-001')!;
  const steel8Total = steelBars8mm * steel8Prod.price;
  items.push({
    productId: steel8Prod.id,
    productName: steel8Prod.name,
    quantity: steelBars8mm,
    unit: steel8Prod.unit,
    unitPrice: steel8Prod.price,
    totalPrice: steel8Total,
    purpose: 'Malha de distribuição da laje (combate fissuração)'
  });
  totalCost += steel8Total;
  totalWeight += steelBars8mm * steel8Prod.weightKg;

  // Vergalhão 3/8 (10mm)
  const steel10Prod = INITIAL_PRODUCTS.find(p => p.id === 'fer-002')!;
  const steel10Total = steelBars10mm * steel10Prod.price;
  items.push({
    productId: steel10Prod.id,
    productName: steel10Prod.name,
    quantity: steelBars10mm,
    unit: steel10Prod.unit,
    unitPrice: steel10Prod.price,
    totalPrice: steel10Total,
    purpose: 'Armadura positiva principal de tração'
  });
  totalCost += steel10Total;
  totalWeight += steelBars10mm * steel10Prod.weightKg;

  return {
    title: `Estrutura de Laje Maciça para ${areaM2.toFixed(1)} m²`,
    summary: `Espessura de ${input.thicknessCm}cm com malha de aço e concreto fck 25MPa.`,
    estimatedWeightKg: totalWeight,
    items,
    totalCost,
    technicalTips: [
      'Faça o escoramento adequado com no mínimo 1 pontalete a cada metro.',
      'Molhe a laje 3 vezes ao dia durante os primeiros 7 dias de cura úmida.',
      'Não desmonte o escoramento antes de 21 dias após a concretagem.'
    ]
  };
}
