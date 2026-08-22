import {
  db,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from '../lib/firebase';
import { 
  Order, 
  Product, 
  VehicleItem, 
  NeighborhoodItem, 
  StoreConfig, 
  AdminUser, 
  AuditLogEntry, 
  OrderStatus 
} from '../types';
import { 
  INITIAL_ORDERS, 
  INITIAL_PRODUCTS, 
  STORE_INFO 
} from '../data/mockData';
import { 
  INITIAL_VEHICLES, 
  INITIAL_FREIGHTS, 
  INITIAL_STORE_CONFIG, 
  INITIAL_ADMIN_USERS, 
  INITIAL_AUDIT_LOGS,
  saveProducts,
  saveOrders,
  saveVehicles,
  saveFreights,
  saveStoreConfig,
  saveAdminUsers
} from '../utils/storage';

// Collection references
const PRODUCTS_COL = 'products';
const ORDERS_COL = 'orders';
const VEHICLES_COL = 'vehicles';
const FREIGHTS_COL = 'freights';
const STORE_CONFIG_COL = 'storeConfig';
const ADMIN_USERS_COL = 'adminUsers';
const AUDIT_LOGS_COL = 'auditLogs';

// Helper to seed initial collections into Firestore
export async function seedFirestoreIfEmpty(): Promise<void> {
  try {
    // 1. Check products
    const productsSnap = await getDocs(collection(db, PRODUCTS_COL));
    if (productsSnap.empty) {
      console.log('Seeding initial products into Firestore...');
      const batch = writeBatch(db);
      INITIAL_PRODUCTS.forEach((p) => {
        const ref = doc(db, PRODUCTS_COL, p.id);
        batch.set(ref, p);
      });
      await batch.commit();
    }

    // 2. Check orders
    const ordersSnap = await getDocs(collection(db, ORDERS_COL));
    if (ordersSnap.empty) {
      console.log('Seeding initial orders into Firestore...');
      const batch = writeBatch(db);
      INITIAL_ORDERS.forEach((o) => {
        const ref = doc(db, ORDERS_COL, o.id);
        batch.set(ref, o);
      });
      await batch.commit();
    }

    // 3. Check vehicles
    const vehiclesSnap = await getDocs(collection(db, VEHICLES_COL));
    if (vehiclesSnap.empty) {
      console.log('Seeding initial vehicles into Firestore...');
      const batch = writeBatch(db);
      INITIAL_VEHICLES.forEach((v) => {
        const ref = doc(db, VEHICLES_COL, v.id);
        batch.set(ref, v);
      });
      await batch.commit();
    }

    // 4. Check freights
    const freightsSnap = await getDocs(collection(db, FREIGHTS_COL));
    if (freightsSnap.empty) {
      console.log('Seeding initial freights into Firestore...');
      const batch = writeBatch(db);
      INITIAL_FREIGHTS.forEach((f) => {
        const ref = doc(db, FREIGHTS_COL, f.id);
        batch.set(ref, f);
      });
      await batch.commit();
    }

    // 5. Check store config
    const configSnap = await getDocs(collection(db, STORE_CONFIG_COL));
    if (configSnap.empty) {
      console.log('Seeding store config into Firestore...');
      await setDoc(doc(db, STORE_CONFIG_COL, 'main'), INITIAL_STORE_CONFIG);
    }

    // 6. Check admin users
    const usersSnap = await getDocs(collection(db, ADMIN_USERS_COL));
    if (usersSnap.empty) {
      console.log('Seeding admin users into Firestore...');
      const batch = writeBatch(db);
      INITIAL_ADMIN_USERS.forEach((u) => {
        const ref = doc(db, ADMIN_USERS_COL, u.id);
        batch.set(ref, u);
      });
      await batch.commit();
    }

    // 7. Check audit logs
    const logsSnap = await getDocs(collection(db, AUDIT_LOGS_COL));
    if (logsSnap.empty) {
      console.log('Seeding initial audit logs into Firestore...');
      const batch = writeBatch(db);
      INITIAL_AUDIT_LOGS.forEach((l) => {
        const ref = doc(db, AUDIT_LOGS_COL, l.id);
        batch.set(ref, l);
      });
      await batch.commit();
    }
  } catch (error) {
    console.error('Error during Firestore seeding:', error);
  }
}

// Subscribe to Products collection
export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  try {
    const q = query(collection(db, PRODUCTS_COL));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Product));
        saveProducts(items);
        callback(items);
      }
    }, (err) => {
      console.warn('Firestore products subscription error (using cached):', err);
    });
  } catch (e) {
    console.error('Error initializing products subscription:', e);
    return () => {};
  }
}

// Subscribe to Orders collection
export function subscribeToOrders(callback: (orders: Order[]) => void): () => void {
  try {
    const q = query(collection(db, ORDERS_COL));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Order));
        // Sort newest first
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        saveOrders(items);
        callback(items);
      }
    }, (err) => {
      console.warn('Firestore orders subscription error (using cached):', err);
    });
  } catch (e) {
    console.error('Error initializing orders subscription:', e);
    return () => {};
  }
}

// Subscribe to Vehicles collection
export function subscribeToVehicles(callback: (vehicles: VehicleItem[]) => void): () => void {
  try {
    const q = query(collection(db, VEHICLES_COL));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as VehicleItem));
        saveVehicles(items);
        callback(items);
      }
    }, (err) => {
      console.warn('Firestore vehicles subscription error:', err);
    });
  } catch (e) {
    console.error('Error initializing vehicles subscription:', e);
    return () => {};
  }
}

// Subscribe to Freights collection
export function subscribeToFreights(callback: (freights: NeighborhoodItem[]) => void): () => void {
  try {
    const q = query(collection(db, FREIGHTS_COL));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as NeighborhoodItem));
        saveFreights(items);
        callback(items);
      }
    }, (err) => {
      console.warn('Firestore freights subscription error:', err);
    });
  } catch (e) {
    console.error('Error initializing freights subscription:', e);
    return () => {};
  }
}

// Subscribe to Store Config
export function subscribeToStoreConfig(callback: (config: StoreConfig) => void): () => void {
  try {
    return onSnapshot(doc(db, STORE_CONFIG_COL, 'main'), (snapshot) => {
      if (snapshot.exists()) {
        const config = snapshot.data() as StoreConfig;
        saveStoreConfig(config);
        callback(config);
      }
    }, (err) => {
      console.warn('Firestore store config subscription error:', err);
    });
  } catch (e) {
    console.error('Error initializing store config subscription:', e);
    return () => {};
  }
}

// Subscribe to Admin Users
export function subscribeToAdminUsers(callback: (users: AdminUser[]) => void): () => void {
  try {
    const q = query(collection(db, ADMIN_USERS_COL));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as AdminUser));
        saveAdminUsers(items);
        callback(items);
      }
    }, (err) => {
      console.warn('Firestore admin users subscription error:', err);
    });
  } catch (e) {
    console.error('Error initializing admin users subscription:', e);
    return () => {};
  }
}

// Subscribe to Audit Logs
export function subscribeToAuditLogs(callback: (logs: AuditLogEntry[]) => void): () => void {
  try {
    const q = query(collection(db, AUDIT_LOGS_COL));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as AuditLogEntry));
        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        callback(items);
      }
    }, (err) => {
      console.warn('Firestore audit logs subscription error:', err);
    });
  } catch (e) {
    console.error('Error initializing audit logs subscription:', e);
    return () => {};
  }
}

// ---------------- CRUD Operations in Firestore ----------------

export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    await setDoc(doc(db, ORDERS_COL, order.id), order);
  } catch (e) {
    console.error('Failed to save order to Firestore:', e);
  }
}

export async function updateOrderStatusInFirestore(orderId: string, status: OrderStatus, note?: string): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COL, orderId);
    const historyEntry = {
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status alterado para ${status}`
    };
    
    // Read current order to append history
    const snap = await getDocs(query(collection(db, ORDERS_COL)));
    const target = snap.docs.find(d => d.id === orderId);
    if (target) {
      const currentData = target.data() as Order;
      const history = [...(currentData.statusHistory || []), historyEntry];
      await updateDoc(orderRef, {
        status,
        statusHistory: history
      });
    } else {
      await updateDoc(orderRef, { status });
    }
  } catch (e) {
    console.error('Failed to update order status in Firestore:', e);
  }
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, PRODUCTS_COL, product.id), product);
  } catch (e) {
    console.error('Failed to save product to Firestore:', e);
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PRODUCTS_COL, productId));
  } catch (e) {
    console.error('Failed to delete product from Firestore:', e);
  }
}

export async function saveVehicleToFirestore(vehicle: VehicleItem): Promise<void> {
  try {
    await setDoc(doc(db, VEHICLES_COL, vehicle.id), vehicle);
  } catch (e) {
    console.error('Failed to save vehicle to Firestore:', e);
  }
}

export async function deleteVehicleFromFirestore(vehicleId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, VEHICLES_COL, vehicleId));
  } catch (e) {
    console.error('Failed to delete vehicle from Firestore:', e);
  }
}

export async function saveFreightToFirestore(freight: NeighborhoodItem): Promise<void> {
  try {
    await setDoc(doc(db, FREIGHTS_COL, freight.id), freight);
  } catch (e) {
    console.error('Failed to save freight to Firestore:', e);
  }
}

export async function deleteFreightFromFirestore(freightId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, FREIGHTS_COL, freightId));
  } catch (e) {
    console.error('Failed to delete freight from Firestore:', e);
  }
}

export async function saveStoreConfigToFirestore(config: StoreConfig): Promise<void> {
  try {
    await setDoc(doc(db, STORE_CONFIG_COL, 'main'), config);
  } catch (e) {
    console.error('Failed to save store config to Firestore:', e);
  }
}

export async function saveAdminUserToFirestore(user: AdminUser): Promise<void> {
  try {
    await setDoc(doc(db, ADMIN_USERS_COL, user.id), user);
  } catch (e) {
    console.error('Failed to save admin user to Firestore:', e);
  }
}

export async function deleteAdminUserFromFirestore(userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, ADMIN_USERS_COL, userId));
  } catch (e) {
    console.error('Failed to delete admin user from Firestore:', e);
  }
}

export async function addAuditLogToFirestore(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
  try {
    const id = `log-${Date.now()}`;
    const logItem: AuditLogEntry = {
      ...entry,
      id,
      timestamp: new Date().toISOString()
    };
    await setDoc(doc(db, AUDIT_LOGS_COL, id), logItem);
  } catch (e) {
    console.error('Failed to add audit log to Firestore:', e);
  }
}
