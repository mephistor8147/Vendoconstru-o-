import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  History, 
  CheckCircle2, 
  UserCheck, 
  Lock, 
  X,
  AlertCircle,
  Key
} from 'lucide-react';
import { AdminUser, AuditLogEntry } from '../../types';
import { addAuditLog } from '../../utils/storage';

interface AdminUsersManagerProps {
  users: AdminUser[];
  auditLogs: AuditLogEntry[];
  currentUser: AdminUser;
  onUpdateUsers: (users: AdminUser[]) => void;
}

export const AdminUsersManager: React.FC<AdminUsersManagerProps> = ({
  users,
  auditLogs,
  currentUser,
  onUpdateUsers
}) => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<AdminUser['role']>('gerente_vendas');

  const getRoleBadge = (role: AdminUser['role']) => {
    switch (role) {
      case 'admin_master':
        return { text: 'Admin Master / Diretor', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'gerente_vendas':
        return { text: 'Gerente Comercial', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'operador_logistico':
        return { text: 'Operador Logístico', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      default:
        return { text: role, bg: 'bg-neutral-100 text-neutral-800 border-neutral-200' };
    }
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormRole('gerente_vendas');
    setShowUserModal(true);
  };

  const handleOpenEditModal = (u: AdminUser) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormRole(u.role);
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    if (editingUser) {
      const updated = users.map(u => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            name: formName,
            email: formEmail.trim(),
            role: formRole
          };
        }
        return u;
      });
      onUpdateUsers(updated);
      addAuditLog({
        userName: currentUser.name,
        action: 'Atualização de Usuário',
        details: `Conta ${formName} (${formEmail}) atualizada`,
        type: 'auth'
      });
    } else {
      const newUser: AdminUser = {
        id: `usr-${Date.now()}`,
        name: formName,
        email: formEmail.trim(),
        role: formRole,
        active: true,
        lastLogin: 'Nunca'
      };
      onUpdateUsers([...users, newUser]);
      addAuditLog({
        userName: currentUser.name,
        action: 'Criação de Usuário',
        details: `Novo operador administrativo ${formName} cadastrado`,
        type: 'auth'
      });
    }

    setShowUserModal(false);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (userId === currentUser.id) {
      alert('Você não pode excluir a sua própria conta ativa.');
      return;
    }

    if (confirm(`Tem certeza que deseja remover o acesso do usuário "${userName}"?`)) {
      const updated = users.filter(u => u.id !== userId);
      onUpdateUsers(updated);
      addAuditLog({
        userName: currentUser.name,
        action: 'Exclusão de Usuário',
        details: `Acesso do usuário ${userName} revogado`,
        type: 'auth'
      });
    }
  };

  return (
    <div className="space-y-6 text-neutral-800">
      
      {/* Users Section Header */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#72BF44]" />
            <span>Equipe Administrativa & Controle de Acessos</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Contas de operadores, supervisores e permissões do Painel Seller Central.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#08182B] hover:bg-[#050F1C] text-[#72BF44] border border-[#72BF44]/30 text-xs font-bold transition-all shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#72BF44]" />
          <span className="text-white">Adicionar Novo Operador</span>
        </button>
      </div>

      {/* Users List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map((u) => {
          const roleInfo = getRoleBadge(u.role);
          const isMe = u.id === currentUser.id;

          return (
            <div 
              key={u.id}
              className="bg-white rounded-xl border border-neutral-200 shadow-xs p-4 space-y-3 hover:border-[#72BF44]/50 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#08182B] text-[#72BF44] border border-[#72BF44]/40 font-bold text-xs flex items-center justify-center">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <strong className="text-xs text-neutral-900 block font-bold">{u.name}</strong>
                      {isMe && <span className="text-[10px] text-[#72BF44] font-black">(Você)</span>}
                    </div>
                    <span className="text-[11px] text-neutral-500 block truncate">{u.email}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${roleInfo.bg}`}>
                  {roleInfo.text}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-100 text-[11px] text-neutral-600 flex items-center justify-between">
                <span>Último Acesso:</span>
                <strong className="text-neutral-900">{u.lastLogin || 'Recente'}</strong>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acesso Ativo</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(u)}
                    className="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-md hover:bg-neutral-100"
                    title="Editar Usuário"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {!isMe && (
                    <button
                      onClick={() => handleDeleteUser(u.id, u.name)}
                      className="p-1.5 text-red-600 hover:text-red-700 rounded-md hover:bg-red-50"
                      title="Excluir Usuário"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Audit Logs Section */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden space-y-3 p-5">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#72BF44]" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Histórico de Auditoria & Ações Administrativas</h3>
              <p className="text-xs text-neutral-500">Registro cronológico de alterações de pedidos, estoque, preços e acessos.</p>
            </div>
          </div>
          <span className="text-xs text-neutral-500 font-semibold">
            Últimas {auditLogs.length} atividades
          </span>
        </div>

        <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto no-scrollbar">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-neutral-900 font-bold">{log.action}</strong>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {log.type}
                  </span>
                </div>
                <p className="text-neutral-600 text-[11px]">{log.details}</p>
                <span className="text-[10px] text-neutral-400">Por: <strong>{log.userName}</strong></span>
              </div>

              <div className="text-right text-[10px] text-neutral-400 whitespace-nowrap flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{new Date(log.timestamp).toLocaleDateString('pt-BR')} {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            
            <div className="bg-[#08182B] text-white p-4 border-b border-[#72BF44]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#72BF44]" />
                <h3 className="font-bold text-sm">
                  {editingUser ? 'Editar Usuário do Sistema' : 'Cadastrar Novo Operador'}
                </h3>
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-1 text-slate-300 hover:text-white rounded-md hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <label className="block font-bold text-neutral-700">Nome Completo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Amanda Vasconcelos"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-neutral-700">E-mail de Acesso Corporativo:</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: amanda.vendas@vando.com.br"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-neutral-700">Nível de Permissão & Cargo:</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as AdminUser['role'])}
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:bg-white focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:outline-none"
                >
                  <option value="admin_master">Diretor Geral / Admin Master (Acesso Total)</option>
                  <option value="gerente_vendas">Gerente Comercial (Vendas & Estoque)</option>
                  <option value="operador_logistico">Operador Logístico (Frota & Entregas)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#08182B] hover:bg-[#050F1C] text-[#72BF44] border border-[#72BF44]/30 font-bold shadow-xs active:scale-98"
                >
                  <span className="text-white">{editingUser ? 'Salvar Alterações' : 'Cadastrar Operador'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
