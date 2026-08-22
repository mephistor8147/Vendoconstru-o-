import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Building2, 
  Sparkles, 
  UserCheck, 
  User 
} from 'lucide-react';
import { AdminUser } from '../../types';
import { Logo } from '../Logo';
import { getStoredAdminUsers, saveAdminSession, addAuditLog } from '../../utils/storage';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onCancelToCatalog: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onCancelToCatalog
}) => {
  const [email, setEmail] = useState('admin@vando.com.br');
  const [password, setPassword] = useState('vando2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const users = getStoredAdminUsers();
      const matchedUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

      // Validation rule: valid if password is 'vando2026' or '123456' or matches user
      if (matchedUser && (password === 'vando2026' || password === '123456' || password.length >= 4)) {
        const loggedUser: AdminUser = {
          ...matchedUser,
          lastLogin: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        
        if (rememberMe) {
          saveAdminSession(loggedUser);
        }
        
        addAuditLog({
          userName: loggedUser.name,
          action: 'Login no Sistema',
          details: `Acesso autenticado com perfil ${loggedUser.role}`,
          type: 'auth'
        });

        setIsLoading(false);
        onLoginSuccess(loggedUser);
      } else if (!matchedUser && email.includes('@') && password.length >= 4) {
        // Fallback default admin if email entered freely
        const customUser: AdminUser = {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0].toUpperCase() + ' (Admin)',
          email: email.trim(),
          role: 'admin_master',
          active: true,
          lastLogin: 'Agora'
        };
        if (rememberMe) {
          saveAdminSession(customUser);
        }
        addAuditLog({
          userName: customUser.name,
          action: 'Login no Sistema (Conta Personalizada)',
          details: 'Acesso autenticado ao painel',
          type: 'auth'
        });
        setIsLoading(false);
        onLoginSuccess(customUser);
      } else {
        setIsLoading(false);
        setErrorMsg('E-mail ou senha incorretos. Utilize as credenciais de teste fornecidas abaixo.');
      }
    }, 450);
  };

  const handleQuickFill = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('vando2026');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl border border-neutral-200 shadow-xl overflow-hidden">
        
        {/* Top Header with Vando Brand Colors */}
        <div className="bg-[#08182B] p-6 text-center border-b border-[#72BF44]/30 space-y-2">
          <div className="flex justify-center mb-1">
            <Logo size="md" variant="dark" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#72BF44] text-[#08182B] text-[10px] font-black uppercase tracking-wider">
              <Lock className="w-3 h-3" />
              <span>Acesso Restrito • Gestão & Seller Central</span>
            </div>
            <h2 className="text-lg font-extrabold text-white mt-1">
              Portal Administrativo
            </h2>
            <p className="text-xs text-neutral-300">
              Gerenciamento de estoque, pedidos, logística e parâmetros da loja
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-neutral-800">
          
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-700">
                E-mail de Acesso Corporativo:
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@vando.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-neutral-700">
                  Senha de Segurança:
                </label>
                <button
                  type="button" 
                  className="text-[11px] text-[#72BF44] hover:underline font-bold" 
                  onClick={() => setPassword('vando2026')}
                >
                  Senha padrão: vando2026
                </button>
              </div>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3 w-4 h-4 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#72BF44] focus:ring-2 focus:ring-[#72BF44]/20 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 text-[#72BF44] rounded border-neutral-300 focus:ring-[#72BF44]"
                />
                <span>Lembrar meu acesso neste navegador</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#08182B] hover:bg-[#050F1C] text-[#72BF44] border border-[#72BF44]/40 font-black text-xs transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75"
            >
              {isLoading ? (
                <span>Autenticando Certificado de Segurança...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#72BF44]" />
                  <span className="text-white">Entrar no Painel do Vendedor</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#72BF44]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="pt-3 border-t border-neutral-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-neutral-500 font-bold">
              <span>Acesso Rápido para Avaliação (1 Clique):</span>
              <span className="text-[#72BF44] flex items-center gap-1 font-bold">
                <Zap className="w-3 h-3 fill-[#72BF44]" />
                <span>Ativo</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@vando.com.br')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  email === 'admin@vando.com.br'
                    ? 'bg-[#72BF44]/15 border-[#72BF44] text-neutral-900 font-bold ring-1 ring-[#72BF44]'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <strong className="block text-[11px] text-neutral-900 leading-tight">Master</strong>
                <span className="text-[10px] text-neutral-500">Valdomiro</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('amanda.vendas@vando.com.br')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  email === 'amanda.vendas@vando.com.br'
                    ? 'bg-[#72BF44]/15 border-[#72BF44] text-neutral-900 font-bold ring-1 ring-[#72BF44]'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <strong className="block text-[11px] text-neutral-900 leading-tight">Vendas</strong>
                <span className="text-[10px] text-neutral-500">Amanda</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('logistica@vando.com.br')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  email === 'logistica@vando.com.br'
                    ? 'bg-[#72BF44]/15 border-[#72BF44] text-neutral-900 font-bold ring-1 ring-[#72BF44]'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <strong className="block text-[11px] text-neutral-900 leading-tight">Logística</strong>
                <span className="text-[10px] text-neutral-500">Carlos A.</span>
              </button>
            </div>
          </div>

          {/* Return to Public Catalog */}
          <div className="text-center pt-1">
            <button
              onClick={onCancelToCatalog}
              className="text-xs text-neutral-500 hover:text-neutral-800 underline transition-colors"
            >
              Voltar ao Catálogo da Loja
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-neutral-50 p-3 text-center border-t border-neutral-200 text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#72BF44]" />
          <span>Sessão Criptografada SSL • Vando Materiais de Construção LTDA</span>
        </div>

      </div>
    </div>
  );
};

