import React, { useState, useEffect, useMemo } from 'react';
import { AdminSection, AdminUser, Order, Product, VehicleItem, NeighborhoodItem, StoreConfig, AuditLogEntry } from '../../types';
import { 
  getStoredAdminSession, 
  clearAdminSession, 
  getStoredVehicles, 
  saveVehicles, 
  getStoredFreights, 
  saveFreights, 
  getStoredStoreConfig, 
  saveStoreConfig, 
  getStoredAdminUsers, 
  saveAdminUsers, 
  getStoredAuditLogs 
} from '../../utils/storage';
import {
  subscribeToVehicles,
  subscribeToFreights,
  subscribeToStoreConfig,
  subscribeToAdminUsers,
  subscribeToAuditLogs
} from '../../services/firebaseService';
import { AdminLogin } from './AdminLogin';
import { AdminMenuNav } from './AdminMenuNav';
import { AdminMetricsReputation } from './AdminMetricsReputation';
import { AdminOrdersManager } from './AdminOrdersManager';
import { AdminFleetManager } from './AdminFleetManager';
import { AdminStockManager } from './AdminStockManager';
import { AdminFreightsManager } from './AdminFreightsManager';
import { AdminStoreSettings } from './AdminStoreSettings';
import { AdminUsersManager } from './AdminUsersManager';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  onUpdateOrders: (updatedOrders: Order[]) => void;
  onUpdateProducts: (updatedProducts: Product[]) => void;
  onViewOrderReceipt: (order: Order) => void;
  onNavigateToCatalog?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  products,
  onUpdateOrders,
  onUpdateProducts,
  onViewOrderReceipt,
  onNavigateToCatalog
}) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => getStoredAdminSession());

  // Active Admin Menu Section
  const [currentSection, setCurrentSection] = useState<AdminSection>('metricas');

  // Shared Admin Collections
  const [vehicles, setVehicles] = useState<VehicleItem[]>(() => getStoredVehicles());
  const [freights, setFreights] = useState<NeighborhoodItem[]>(() => getStoredFreights());
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => getStoredStoreConfig());
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => getStoredAdminUsers());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => getStoredAuditLogs());

  // Keep state synced in real-time from Firestore
  useEffect(() => {
    const unsubVehicles = subscribeToVehicles((items) => setVehicles(items));
    const unsubFreights = subscribeToFreights((items) => setFreights(items));
    const unsubConfig = subscribeToStoreConfig((cfg) => setStoreConfig(cfg));
    const unsubUsers = subscribeToAdminUsers((users) => setAdminUsers(users));
    const unsubLogs = subscribeToAuditLogs((logs) => setAuditLogs(logs));

    return () => {
      unsubVehicles();
      unsubFreights();
      unsubConfig();
      unsubUsers();
      unsubLogs();
    };
  }, []);

  const handleUpdateVehicles = (updated: VehicleItem[]) => {
    setVehicles(updated);
    saveVehicles(updated);
  };

  const handleUpdateFreights = (updated: NeighborhoodItem[]) => {
    setFreights(updated);
    saveFreights(updated);
  };

  const handleUpdateStoreConfig = (updated: StoreConfig) => {
    setStoreConfig(updated);
    saveStoreConfig(updated);
  };

  const handleUpdateAdminUsers = (updated: AdminUser[]) => {
    setAdminUsers(updated);
    saveAdminUsers(updated);
  };

  const handleLogout = () => {
    clearAdminSession();
    setCurrentUser(null);
  };

  const handleExportData = () => {
    const exportBundle = {
      exportDate: new Date().toISOString(),
      store: storeConfig,
      orders,
      products,
      fleet: vehicles,
      freights
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vando_gestao_completa_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Metrics for Navigation Badges
  const pendingOrdersCount = useMemo(() => {
    return orders.filter(o => o.status === 'confirmado' || o.status === 'em_separacao' || o.status === 'saiu_para_entrega').length;
  }, [orders]);

  const lowStockCount = useMemo(() => {
    return products.filter(p => p.inStock <= 25).length;
  }, [products]);

  const activeVehiclesCount = useMemo(() => {
    return vehicles.filter(v => v.status === 'em_rota').length;
  }, [vehicles]);

  // If user is not authenticated, display login screen
  if (!currentUser) {
    return (
      <AdminLogin 
        onLoginSuccess={(user) => setCurrentUser(user)} 
        onCancelToCatalog={() => onNavigateToCatalog && onNavigateToCatalog()}
      />
    );
  }

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-6 text-neutral-800 animate-fadeIn dashboard-no-scrollbar no-scrollbar">
      
      {/* Comprehensive Administrative Menu Navigation Bar */}
      <AdminMenuNav
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        currentUser={currentUser}
        onLogout={handleLogout}
        pendingOrdersCount={pendingOrdersCount}
        lowStockCount={lowStockCount}
        activeVehiclesCount={activeVehiclesCount}
      />

      {/* Render Active Management Section */}
      <main className="transition-all duration-300">
        {currentSection === 'metricas' && (
          <AdminMetricsReputation
            orders={orders}
            onExportData={handleExportData}
          />
        )}

        {currentSection === 'pedidos' && (
          <AdminOrdersManager
            orders={orders}
            vehicles={vehicles}
            onUpdateOrders={onUpdateOrders}
            onViewOrderReceipt={onViewOrderReceipt}
          />
        )}

        {currentSection === 'logistica' && (
          <AdminFleetManager
            vehicles={vehicles}
            orders={orders}
            onUpdateVehicles={handleUpdateVehicles}
          />
        )}

        {currentSection === 'estoque' && (
          <AdminStockManager
            products={products}
            onUpdateProducts={onUpdateProducts}
          />
        )}

        {currentSection === 'fretes' && (
          <AdminFreightsManager
            freights={freights}
            onUpdateFreights={handleUpdateFreights}
          />
        )}

        {currentSection === 'configuracoes' && (
          <AdminStoreSettings
            storeConfig={storeConfig}
            onUpdateStoreConfig={handleUpdateStoreConfig}
          />
        )}

        {currentSection === 'usuarios' && (
          <AdminUsersManager
            users={adminUsers}
            auditLogs={auditLogs}
            currentUser={currentUser}
            onUpdateUsers={handleUpdateAdminUsers}
          />
        )}
      </main>

    </div>
  );
};
