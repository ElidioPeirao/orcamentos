import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  FileText, 
  Plus, 
  Trash2, 
  Printer, 
  Save, 
  Search, 
  X, 
  ChevronRight,
  LayoutDashboard,
  DollarSign,
  Settings,
  History,
  Loader2,
  Eye,
  LogOut,
  LogIn,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

// --- CONFIGURAÇÃO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyDnpVYSC2v3Pbr4DGOxf-sKvcRhFFqtWRE",
  authDomain: "maintence-6ef08.firebaseapp.com",
  projectId: "maintence-6ef08",
  storageBucket: "maintence-6ef08.firebasestorage.app",
  messagingSenderId: "1085348103519",
  appId: "1:1085348103519:web:06c21952276975ab5022ea",
  measurementId: "G-31S2V238QE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'orcamento-app-prod';

// --- COMPONENTE DE MODAL (Novo) ---
const Modal = ({ isOpen, type, title, message, onConfirm, onClose }) => {
  if (!isOpen) return null;

  const isConfirm = type === 'confirm';
  const isError = type === 'error';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
            isError ? 'bg-red-100 text-red-600' : 
            isConfirm ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
          }`}>
            {isError ? <XCircle size={32} /> : 
             isConfirm ? <AlertTriangle size={32} /> : <CheckCircle size={32} />}
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-500 mb-6 text-sm leading-relaxed">{message}</p>
          
          <div className="flex gap-3 w-full">
            {isConfirm ? (
              <>
                <button 
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => { onConfirm(); onClose(); }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                >
                  Confirmar
                </button>
              </>
            ) : (
              <button 
                onClick={onClose}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
              >
                Entendido
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE DE LOGIN (Atualizado: Sem Cadastro) ---
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('E-mail ou senha incorretos.');
      } else {
        setError('Erro ao conectar. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
            <LogIn size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Acessar Sistema</h2>
          <p className="text-slate-500 text-sm mt-2">Gerador de Orçamentos EPROJECTS</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-200 text-center flex items-center justify-center gap-2">
            <AlertTriangle size={16}/> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 ring-orange-500/50 transition-all"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 ring-orange-500/50 transition-all"
              placeholder="******"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estado do Modal Global
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'success', // success, error, confirm
    title: '',
    message: '',
    onConfirm: null
  });

  // Dados
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([]);
  const [quotesHistory, setQuotesHistory] = useState([]);

  // Info Empresa
  const [companyInfo] = useState({
    name: 'EPROJECTS', 
    email: 'eprojects.contato@gmail.com',
    phone: '(47) 98834-1912',
    logoUrl: 'https://imgur.com/0R6PeB0.png', 
    primaryColor: '#ea580c' 
  });

  // Orçamento Atual
  const [currentQuote, setCurrentQuote] = useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    items: [], 
    notes: 'Pagamento em até 5 dias úteis. Orçamento válido por 15 dias.',
    status: 'draft'
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- HELPER FUNCS PARA MODAL ---
  const showAlert = (title, message, type = 'success') => {
    setModalConfig({ isOpen: true, type, title, message, onConfirm: null });
  };
  
  const showConfirm = (title, message, onConfirm) => {
    setModalConfig({ isOpen: true, type: 'confirm', title, message, onConfirm });
  };

  const closeMyModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  // --- AUTH LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- DATA LISTENERS ---
  useEffect(() => {
    if (!user) return;

    const clientsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'clients');
    const itemsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'items');
    const quotesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'quotes');

    const unsubClients = onSnapshot(clientsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClients(data.sort((a, b) => a.name.localeCompare(b.name)));
    }, (error) => console.error("Erro Clientes:", error));

    const unsubItems = onSnapshot(itemsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data.sort((a, b) => a.name.localeCompare(b.name)));
    }, (error) => console.error("Erro Itens:", error));

    const unsubQuotes = onSnapshot(quotesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuotesHistory(data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    }, (error) => console.error("Erro Histórico:", error));

    return () => {
      unsubClients();
      unsubItems();
      unsubQuotes();
    };
  }, [user]);

  // --- ACTIONS ---
  const handleLogout = () => {
    showConfirm('Sair', 'Deseja realmente sair do sistema?', () => {
      signOut(auth);
      setClients([]);
      setItems([]);
      setQuotesHistory([]);
    });
  };

  // CRUD Clientes
  const [newClient, setNewClient] = useState({ name: '', document: '', email: '', phone: '', address: '' });
  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!user || !newClient.name) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'clients'), { ...newClient, createdAt: serverTimestamp() });
      setNewClient({ name: '', document: '', email: '', phone: '', address: '' });
      showAlert('Sucesso', 'Cliente cadastrado com sucesso!');
    } catch (error) { showAlert('Erro', `Erro ao salvar: ${error.message}`, 'error'); }
  };
  
  const handleDeleteClient = (id) => {
    showConfirm('Excluir Cliente', 'Tem certeza? Isso não apagará os orçamentos antigos deste cliente.', async () => {
      try { await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'clients', id)); } 
      catch(e){ showAlert('Erro', 'Erro ao excluir cliente', 'error'); }
    });
  };

  // CRUD Itens
  const [newItem, setNewItem] = useState({ name: '', price: '', type: 'service', unit: 'unid' });
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!user || !newItem.name) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'items'), { 
        ...newItem, price: parseFloat(newItem.price), createdAt: serverTimestamp() 
      });
      setNewItem({ name: '', price: '', type: 'service', unit: 'unid' });
      showAlert('Sucesso', 'Item adicionado ao catálogo!');
    } catch (error) { showAlert('Erro', `Erro ao salvar item: ${error.message}`, 'error'); }
  };
  
  const handleDeleteItem = (id) => {
    showConfirm('Excluir Item', 'Tem certeza que deseja remover este item?', async () => {
      try { await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'items', id)); } 
      catch(e){ showAlert('Erro', 'Erro ao excluir item', 'error'); }
    });
  };

  // Orçamentos
  const handleSaveQuote = async () => {
    if (!user || !currentQuote.clientId) return;
    setIsSaving(true);
    try {
      const clientData = clients.find(c => c.id === currentQuote.clientId);
      const total = currentQuote.items.reduce((acc, i) => acc + (i.price * i.qty), 0);
      
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'quotes'), {
        ...currentQuote,
        clientSnapshot: clientData,
        totalValue: total,
        createdAt: serverTimestamp(),
        quoteNumber: Math.floor(Math.random() * 100000)
      });
      setIsSaving(false);
      showAlert('Sucesso', 'Orçamento salvo no histórico com sucesso!');
    } catch (error) {
      setIsSaving(false);
      showAlert('Erro', `Erro ao salvar orçamento: ${error.message}`, 'error');
    }
  };

  const handleRestoreQuote = (q) => {
    showConfirm('Abrir Orçamento', 'Carregar este orçamento substituirá o que você está editando agora. Continuar?', () => {
      setCurrentQuote({ ...q, date: new Date().toISOString().split('T')[0], status: 'saved' });
      setActiveTab('quote');
    });
  };
  
  const handleDeleteQuote = (id) => {
    showConfirm('Excluir Histórico', 'Deseja apagar este orçamento permanentemente?', async () => {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'quotes', id));
    });
  };

  // Helpers
  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const addItemToQuote = (id) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const exists = currentQuote.items.find(i => i.id === id);
    if (exists) {
      setCurrentQuote({...currentQuote, items: currentQuote.items.map(i => i.id === id ? {...i, qty: i.qty + 1} : i)});
    } else {
      setCurrentQuote({...currentQuote, items: [...currentQuote.items, {...item, qty: 1}]});
    }
  };
  const updateQty = (id, q) => {
    if (q < 1) return;
    setCurrentQuote({...currentQuote, items: currentQuote.items.map(i => i.id === id ? {...i, qty: q} : i)});
  };
  const removeItem = (id) => setCurrentQuote({...currentQuote, items: currentQuote.items.filter(i => i.id !== id)});

  // --- RENDER ---
  if (loading) return <div className="h-screen flex items-center justify-center text-slate-500 gap-2"><Loader2 className="animate-spin"/> Carregando...</div>;

  // Se não estiver logado, mostra Login
  if (!user) {
    return <LoginScreen />;
  }

  // Se estiver logado, mostra App
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <style>{`
        @media print { 
          .no-print { display: none !important; } 
          .print-only { display: block !important; } 
          body { background: white; -webkit-print-color-adjust: exact; } 
          @page { margin: 0; size: auto; } 
        }
        .print-only { display: none; }
      `}</style>

      {/* COMPONENTE MODAL GLOBAL */}
      <Modal 
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onClose={closeMyModal}
      />

      {/* MODAL PDF PREVIEW */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 overflow-y-auto no-print flex items-start justify-center p-4">
          <div className="relative w-full max-w-[210mm] mt-10 mb-10 animate-in slide-in-from-bottom-10 duration-300">
            <div className="absolute top-0 right-0 -mt-12 -mr-4 flex gap-2">
              <button onClick={() => window.print()} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-medium transition-transform active:scale-95">
                <Printer size={18} /> Imprimir / Salvar PDF
              </button>
              <button onClick={() => setIsPreviewOpen(false)} className="bg-white hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-medium transition-transform active:scale-95">
                <X size={18} /> Fechar
              </button>
            </div>
            {/* Invoice Component Inline */}
            <div className="bg-white p-8 max-w-[210mm] min-h-[297mm] shadow-lg text-slate-800">
              <div className="flex justify-between items-start mb-8 border-b pb-6 border-slate-200">
                <div>
                  <img src={companyInfo.logoUrl} alt="Logo" className="h-20 object-contain mb-2" />
                  <p className="text-slate-500">Orçamento #{currentQuote.quoteNumber || 'Novo'}</p>
                </div>
                <div className="text-right">
                  <h2 className="font-bold text-xl text-orange-600">{companyInfo.name}</h2>
                  <p className="text-sm text-slate-500">{companyInfo.email}</p>
                  <p className="text-sm text-slate-500">{companyInfo.phone}</p>
                </div>
              </div>
              <div className="flex justify-between mb-8">
                <div className="w-1/2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Cliente</h3>
                  {(() => {
                    let c = clients.find(cl => cl.id === currentQuote.clientId);
                    if (!c && currentQuote.clientSnapshot) c = currentQuote.clientSnapshot;
                    if (!c) return <p className="text-red-500">Selecione um cliente</p>;
                    return (
                      <>
                        <p className="font-bold text-lg">{c.name}</p>
                        <p className="text-sm text-slate-600">{c.document}</p>
                        <p className="text-sm text-slate-600">{c.email}</p>
                      </>
                    );
                  })()}
                </div>
                <div className="w-1/2 text-right">
                  <div className="mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Data</span>
                    <span className="font-medium">{new Date(currentQuote.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Validade</span>
                    <span className="font-medium">{new Date(currentQuote.expirationDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-orange-600">
                    <th className="text-left py-2 text-sm uppercase">Item</th>
                    <th className="text-right py-2 text-sm uppercase">Qtd</th>
                    <th className="text-right py-2 text-sm uppercase">Preço</th>
                    <th className="text-right py-2 text-sm uppercase">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {currentQuote.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="py-3 text-slate-700 font-medium">{item.name}</td>
                      <td className="py-3 text-right text-slate-700">{item.qty}</td>
                      <td className="py-3 text-right text-slate-700">{formatCurrency(item.price)}</td>
                      <td className="py-3 text-right font-bold text-slate-900">{formatCurrency(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="pt-4 text-right font-bold text-slate-500 uppercase text-sm">Total</td>
                    <td className="pt-4 text-right font-bold text-2xl text-orange-600">
                      {formatCurrency(currentQuote.items.reduce((acc, i) => acc + (i.price * i.qty), 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
              {currentQuote.notes && (
                <div className="mt-12 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Observações</h3>
                  <p className="text-sm text-slate-600 whitespace-pre-line">{currentQuote.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN PRINT */}
      <div className="print-only">
         {/* Same layout as preview */}
         <div className="bg-white p-8 max-w-[210mm] text-slate-800">
            <div className="flex justify-between items-start mb-8 border-b pb-6 border-slate-200">
                <div><img src={companyInfo.logoUrl} className="h-20 object-contain mb-2"/><p>Orçamento</p></div>
                <div className="text-right"><h2 className="font-bold text-xl">{companyInfo.name}</h2></div>
            </div>
            <table className="w-full mb-8">
              <thead><tr className="border-b-2 border-black"><th className="text-left">Item</th><th className="text-right">Total</th></tr></thead>
              <tbody>
                {currentQuote.items.map((item, i) => (
                  <tr key={i}><td className="py-2">{item.name} (x{item.qty})</td><td className="text-right">{formatCurrency(item.price * item.qty)}</td></tr>
                ))}
              </tbody>
              <tfoot><tr><td className="pt-4 font-bold text-right">Total: {formatCurrency(currentQuote.items.reduce((acc, i) => acc + (i.price * i.qty), 0))}</td></tr></tfoot>
            </table>
         </div>
      </div>

      <div className="no-print flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <img src={companyInfo.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
          </div>
          
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {[
              { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
              { id: 'clients', label: 'Clientes', icon: Users },
              { id: 'items', label: 'Produtos', icon: Package },
              { id: 'quote', label: 'Orçamento', icon: Plus },
              { id: 'history', label: 'Histórico', icon: History },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400 font-bold uppercase">Usuário</p>
              <p className="text-sm font-medium text-slate-700 truncate max-w-[150px]">{user.email || 'Anônimo'}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Sair do sistema"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => setActiveTab('clients')} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md cursor-pointer transition-all">
                  <div className="p-4 bg-orange-100 text-orange-600 rounded-full"><Users size={24}/></div>
                  <div><p className="text-slate-500 text-sm font-medium">Clientes</p><p className="text-2xl font-bold">{clients.length}</p></div>
                </div>
                <div onClick={() => setActiveTab('items')} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md cursor-pointer transition-all">
                  <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full"><Package size={24}/></div>
                  <div><p className="text-slate-500 text-sm font-medium">Produtos</p><p className="text-2xl font-bold">{items.length}</p></div>
                </div>
                <div onClick={() => setActiveTab('history')} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md cursor-pointer transition-all">
                  <div className="p-4 bg-purple-100 text-purple-600 rounded-full"><History size={24}/></div>
                  <div><p className="text-slate-500 text-sm font-medium">Salvos</p><p className="text-2xl font-bold">{quotesHistory.length}</p></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-600 to-slate-800 p-8 rounded-2xl shadow-lg text-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Bem-vindo, {user.email?.split('@')[0] || 'Visitante'}!</h2>
                  <p className="text-white/80">Selecione uma opção acima ou comece um novo orçamento agora.</p>
                </div>
                <button onClick={() => setActiveTab('quote')} className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <Plus size={20}/> Criar Novo
                </button>
              </div>
            </div>
          )}

          {/* CLIENTES TAB */}
          {activeTab === 'clients' && (
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Plus size={18} className="text-orange-600"/> Cadastrar Cliente</h3>
                <form onSubmit={handleAddClient} className="space-y-3">
                  <input required className="w-full p-2 border rounded outline-none focus:ring-2 ring-orange-500/50" placeholder="Nome *" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
                  <input className="w-full p-2 border rounded outline-none focus:ring-2 ring-orange-500/50" placeholder="CPF/CNPJ" value={newClient.document} onChange={e => setNewClient({...newClient, document: e.target.value})} />
                  <input className="w-full p-2 border rounded outline-none focus:ring-2 ring-orange-500/50" placeholder="Email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
                  <input className="w-full p-2 border rounded outline-none focus:ring-2 ring-orange-500/50" placeholder="Telefone" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
                  <input className="w-full p-2 border rounded outline-none focus:ring-2 ring-orange-500/50" placeholder="Endereço" value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} />
                  <button className="w-full bg-slate-800 text-white py-2 rounded font-medium hover:bg-slate-900 transition-colors">Salvar</button>
                </form>
              </div>
              <div className="lg:col-span-2 space-y-3">
                {clients.map(c => (
                  <div key={c.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                    <div><h4 className="font-bold">{c.name}</h4><p className="text-sm text-slate-500">{c.phone} - {c.email}</p></div>
                    <button onClick={() => handleDeleteClient(c.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
                  </div>
                ))}
                {clients.length === 0 && <p className="text-center text-slate-400 py-8">Nenhum cliente cadastrado.</p>}
              </div>
            </div>
          )}

          {/* PRODUTOS TAB */}
          {activeTab === 'items' && (
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Plus size={18} className="text-orange-600"/> Cadastrar Item</h3>
                <form onSubmit={handleAddItem} className="space-y-3">
                  <input required className="w-full p-2 border rounded outline-none focus:ring-2 ring-orange-500/50" placeholder="Nome do Item *" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                  <div className="grid grid-cols-2 gap-2">
                    <input required type="number" step="0.01" className="w-full p-2 border rounded outline-none focus:ring-2 ring-orange-500/50" placeholder="Preço" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                    <input className="w-full p-2 border rounded outline-none focus:ring-2 ring-orange-500/50" placeholder="Unid (h, cx)" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} />
                  </div>
                  <button className="w-full bg-slate-800 text-white py-2 rounded font-medium hover:bg-slate-900 transition-colors">Salvar</button>
                </form>
              </div>
              <div className="lg:col-span-2 space-y-3">
                {items.map(i => (
                  <div key={i.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                    <div><h4 className="font-bold">{i.name}</h4><p className="text-sm text-slate-500">{formatCurrency(i.price)} / {i.unit}</p></div>
                    <button onClick={() => handleDeleteItem(i.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
                  </div>
                ))}
                {items.length === 0 && <p className="text-center text-slate-400 py-8">Nenhum item cadastrado.</p>}
              </div>
            </div>
          )}

          {/* HISTÓRICO TAB */}
          {activeTab === 'history' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <h3 className="font-bold text-xl">Histórico de Orçamentos</h3>
              {quotesHistory.length === 0 && <p className="text-center text-slate-400 py-12 border-2 border-dashed rounded-xl">Nenhum orçamento salvo.</p>}
              {quotesHistory.map(q => (
                <div key={q.id} className="bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-lg">{q.clientSnapshot?.name || 'Cliente Removido'} <span className="text-xs bg-slate-100 px-2 py-1 rounded ml-2 text-slate-500">#{q.quoteNumber}</span></h4>
                    <p className="text-sm text-slate-500">Data: {q.createdAt ? new Date(q.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : '--'}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase text-slate-400">Total</p>
                      <p className="text-xl font-bold text-orange-600">{formatCurrency(q.totalValue)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleRestoreQuote(q)} className="bg-slate-100 hover:bg-slate-200 p-2 rounded text-slate-600" title="Ver/Imprimir"><Eye size={20}/></button>
                      <button onClick={() => handleDeleteQuote(q.id)} className="text-red-300 hover:text-red-500 p-2" title="Excluir"><Trash2 size={20}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ORÇAMENTO TAB */}
          {activeTab === 'quote' && (
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
              {/* Esquerda */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-sm text-slate-500 uppercase mb-4">1. Dados do Cliente</h3>
                  <select 
                    className="w-full p-3 bg-slate-50 border rounded-lg mb-4 outline-none focus:ring-2 ring-orange-500/50"
                    value={currentQuote.clientId} 
                    onChange={e => setCurrentQuote({...currentQuote, clientId: e.target.value})}
                  >
                    <option value="">Selecione um cliente...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Data</label>
                      <input type="date" className="w-full p-2 border rounded bg-slate-50" value={currentQuote.date} onChange={e => setCurrentQuote({...currentQuote, date: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Vencimento</label>
                      <input type="date" className="w-full p-2 border rounded bg-slate-50" value={currentQuote.expirationDate} onChange={e => setCurrentQuote({...currentQuote, expirationDate: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1 min-h-[300px] flex flex-col">
                  <h3 className="font-bold text-sm text-slate-500 uppercase mb-4">2. Adicionar Itens</h3>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-3 text-slate-400" size={16}/>
                    <input className="w-full pl-10 p-2.5 border rounded-lg bg-slate-50 outline-none focus:ring-2 ring-orange-500/50" placeholder="Buscar item..." />
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {items.map(i => (
                      <div key={i.id} onClick={() => addItemToQuote(i.id)} className="flex justify-between items-center p-3 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded cursor-pointer transition-colors group">
                        <div><p className="font-medium text-slate-800">{i.name}</p><p className="text-xs text-slate-500">{formatCurrency(i.price)}</p></div>
                        <Plus size={18} className="text-orange-600 bg-orange-50 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"/>
                      </div>
                    ))}
                    {items.length === 0 && <p className="text-center text-slate-400 text-sm mt-4">Nenhum item cadastrado.</p>}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-sm text-slate-500 uppercase mb-2">3. Observações</h3>
                  <textarea 
                    className="w-full p-3 bg-slate-50 border rounded-lg h-24 text-sm resize-none outline-none focus:ring-2 ring-orange-500/50" 
                    placeholder="Condições de pagamento, entrega, etc..."
                    value={currentQuote.notes}
                    onChange={e => setCurrentQuote({...currentQuote, notes: e.target.value})}
                  ></textarea>
                </div>
              </div>

              {/* Direita (Resumo) */}
              <div className="lg:col-span-7 flex flex-col h-full">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex-1 flex flex-col overflow-hidden">
                  <div className="p-5 border-b bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2"><FileText size={20}/> Orçamento Atual</h3>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 uppercase block">Valor Total</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {formatCurrency(currentQuote.items.reduce((acc, i) => acc + (i.price * i.qty), 0))}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50 space-y-3">
                    {currentQuote.items.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-60">
                        <div className="bg-slate-200 p-6 rounded-full"><Search size={40}/></div>
                        <p>Adicione itens da lista para começar</p>
                      </div>
                    )}
                    {currentQuote.items.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="bg-white p-4 rounded-lg border shadow-sm flex items-center gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">{formatCurrency(item.price)} un.</p>
                        </div>
                        <div className="flex items-center bg-slate-100 rounded-lg px-2 py-1 gap-3">
                          <button onClick={() => updateQty(item.id, item.qty - 1)} className="font-bold text-slate-500 hover:text-slate-800">-</button>
                          <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)} className="font-bold text-slate-500 hover:text-slate-800">+</button>
                        </div>
                        <div className="w-24 text-right font-bold text-slate-700">{formatCurrency(item.price * item.qty)}</div>
                        <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 bg-white border-t border-slate-200 grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleSaveQuote}
                      disabled={isSaving || !currentQuote.clientId}
                      className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="animate-spin"/> : <Save size={20}/>} Salvar
                    </button>
                    <button 
                      onClick={() => setIsPreviewOpen(true)}
                      disabled={!currentQuote.clientId}
                      className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      <Printer size={20}/> Gerar PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}