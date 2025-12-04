'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaFilter,
  FaEye,
  FaFileAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaBug,
  FaClock,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaRedo,
  FaDownload,
  FaTrash
} from 'react-icons/fa';

interface LogEntry {
  id: string;
  level: 'info' | 'warning' | 'error' | 'success' | 'debug';
  message: string;
  context?: string;
  userId?: string;
  userName?: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    error: 0,
    warning: 0,
    info: 0,
    success: 0,
    debug: 0
  });


  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '50',
          ...(levelFilter !== 'all' && { level: levelFilter }),
          ...(dateFilter !== 'all' && { date: dateFilter }),
          ...(searchTerm && { search: searchTerm })
        });
        
        const response = await fetch(`/api/admin/logs?${params.toString()}`);
        const data = await response.json();
        
        if (data.success) {
          setLogs(data.data.logs || []);
          setTotalLogs(data.data.pagination.total || 0);
          setTotalPages(data.data.pagination.pages || 1);
          if (data.data.stats) {
            setStats(data.data.stats);
          }
        } else {
          setError(data.error || 'Erro ao carregar logs');
          setLogs([]);
        }
      } catch (err: any) {
        setError('Erro ao carregar logs');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, [currentPage, levelFilter, dateFilter, searchTerm]);


  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <FaTimesCircle className="text-red-600" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-600" />;
      case 'success':
        return <FaCheckCircle className="text-green-600" />;
      case 'debug':
        return <FaBug className="text-purple-600" />;
      default:
        return <FaInfoCircle className="text-blue-600" />;
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'success':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'debug':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };


  if (loading && logs.length === 0) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-2 border-transparent border-b-primary-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-sage-900 mb-1">Logs do Sistema</h1>
          <p className="text-sage-600 text-xs md:text-sm">Visualize e monitore todos os eventos e ações do sistema</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {}}
            disabled={loading}
            className="px-3 py-2 bg-white border border-primary-100 text-sage-600 rounded-xl hover:text-primary-600 hover:bg-primary-100 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <FaDownload size={12} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button
            onClick={() => {
              setCurrentPage(1);
              const fetchLogs = async () => {
                try {
                  setLoading(true);
                  setError(null);
                  
                  const params = new URLSearchParams({
                    page: '1',
                    limit: '50',
                    ...(levelFilter !== 'all' && { level: levelFilter }),
                    ...(dateFilter !== 'all' && { date: dateFilter }),
                    ...(searchTerm && { search: searchTerm })
                  });
                  
                  const response = await fetch(`/api/admin/logs?${params.toString()}`);
                  const data = await response.json();
                  
                  if (data.success) {
                    setLogs(data.data.logs || []);
                    setTotalLogs(data.data.pagination.total || 0);
                    setTotalPages(data.data.pagination.pages || 1);
                    if (data.data.stats) {
                      setStats(data.data.stats);
                    }
                  } else {
                    setError(data.error || 'Erro ao carregar logs');
                    setLogs([]);
                  }
                } catch (err: any) {
                  setError('Erro ao carregar logs');
                  setLogs([]);
                } finally {
                  setLoading(false);
                }
              };
              fetchLogs();
            }}
            disabled={loading}
            className="px-3 py-2 bg-white border border-primary-100 text-sage-600 rounded-xl hover:text-primary-600 hover:bg-primary-100 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <FaRedo className={loading ? 'animate-spin' : ''} size={12} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </div>
      </motion.div>

      {/* Estatísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4"
      >
        <div className="bg-white border border-primary-100 rounded-xl p-3 lg:p-4 border-l-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sage-600 text-xs">Total</p>
              <p className="text-lg lg:text-xl font-bold text-sage-900">
                {stats.total}
              </p>
            </div>
            <div className="bg-primary-200 p-2 rounded-full">
              <FaFileAlt className="text-primary-600" size={14} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-primary-100 rounded-xl p-3 lg:p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sage-600 text-xs">Erros</p>
              <p className="text-lg lg:text-xl font-bold text-sage-900">
                {stats.error}
              </p>
            </div>
            <div className="bg-red-200 p-2 rounded-full">
              <FaTimesCircle className="text-red-600" size={14} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-primary-100 rounded-xl p-3 lg:p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sage-600 text-xs">Avisos</p>
              <p className="text-lg lg:text-xl font-bold text-sage-900">
                {stats.warning}
              </p>
            </div>
            <div className="bg-yellow-200 p-2 rounded-full">
              <FaExclamationTriangle className="text-yellow-600" size={14} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-primary-100 rounded-xl p-3 lg:p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sage-600 text-xs">Info</p>
              <p className="text-lg lg:text-xl font-bold text-sage-900">
                {stats.info}
              </p>
            </div>
            <div className="bg-blue-200 p-2 rounded-full">
              <FaInfoCircle className="text-blue-600" size={14} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-primary-100 rounded-xl p-3 lg:p-4 border-l-4 border-green-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sage-600 text-xs">Sucesso</p>
              <p className="text-lg lg:text-xl font-bold text-sage-900">
                {stats.success}
              </p>
            </div>
            <div className="bg-green-200 p-2 rounded-full">
              <FaCheckCircle className="text-green-600" size={14} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filtros e Busca */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white border border-primary-100 rounded-xl p-4"
      >
        {isMobile && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-3 text-sage-900 mb-4 bg-primary-50 rounded-lg"
          >
            <span className="flex items-center gap-2">
              <FaFilter size={14} />
              Filtros
            </span>
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        )}
        <div className={`space-y-4 ${isMobile && !showFilters ? 'hidden' : ''}`}>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-500 text-sm" />
              <input
                type="text"
                placeholder="Buscar por mensagem, contexto ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-primary-50 border border-primary-100 rounded-lg text-sage-900 placeholder-sage-500 focus:outline-none focus:border-primary-500 focus:bg-white text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 bg-primary-50 border border-primary-100 rounded-lg text-sage-900 text-sm focus:outline-none focus:border-primary-500 focus:bg-white"
            >
              <option value="all">Todos os Níveis</option>
              <option value="error">Erro</option>
              <option value="warning">Aviso</option>
              <option value="info">Info</option>
              <option value="success">Sucesso</option>
              <option value="debug">Debug</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-primary-50 border border-primary-100 rounded-lg text-sage-900 text-sm focus:outline-none focus:border-primary-500 focus:bg-white"
            >
              <option value="today">Hoje</option>
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
              <option value="all">Todos</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setLevelFilter('all');
                setDateFilter('today');
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-white border border-primary-100 rounded-lg text-sage-600 text-sm hover:text-primary-600 hover:bg-primary-100 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabela de Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white border border-primary-100 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-primary-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-sage-700 uppercase tracking-wider">
                  Nível
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-sage-700 uppercase tracking-wider">
                  Mensagem
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-sage-700 uppercase tracking-wider">
                  Contexto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-sage-700 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-sage-700 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-sage-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <FaFileAlt className="text-4xl text-sage-400 mx-auto mb-4" />
                    <p className="text-sage-600">Nenhum log encontrado</p>
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-primary-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {getLevelIcon(log.level)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelBadgeColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sage-900 text-sm font-medium max-w-md truncate">
                        {log.message}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      {log.context ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sage-100 text-sage-700 border border-sage-200">
                          {log.context}
                        </span>
                      ) : (
                        <span className="text-sage-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {log.userName ? (
                        <div className="flex items-center gap-2">
                          <FaUser className="text-sage-400" size={12} />
                          <span className="text-sage-700 text-sm">{log.userName}</span>
                        </div>
                      ) : (
                        <span className="text-sage-400 text-xs">Sistema</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sage-600 text-xs">
                        <FaClock size={12} />
                        <span>{formatDate(log.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-100 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <FaEye size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal de Detalhes */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-primary-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getLevelIcon(selectedLog.level)}
                <h2 className="text-xl font-bold text-sage-900">Detalhes do Log</h2>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 text-sage-400 hover:text-sage-600 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <FaTimesCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1">Nível</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${getLevelBadgeColor(selectedLog.level)}`}>
                  {selectedLog.level.toUpperCase()}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1">Mensagem</label>
                <p className="text-sage-900 bg-primary-50 px-4 py-3 rounded-lg border border-primary-100">
                  {selectedLog.message}
                </p>
              </div>
              {selectedLog.context && (
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-1">Contexto</label>
                  <p className="text-sage-900 bg-primary-50 px-4 py-3 rounded-lg border border-primary-100">
                    {selectedLog.context}
                  </p>
                </div>
              )}
              {selectedLog.userName && (
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-1">Usuário</label>
                  <p className="text-sage-900 bg-primary-50 px-4 py-3 rounded-lg border border-primary-100">
                    {selectedLog.userName} {selectedLog.userId && `(${selectedLog.userId})`}
                  </p>
                </div>
              )}
              {selectedLog.ip && (
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-1">IP</label>
                  <p className="text-sage-900 bg-primary-50 px-4 py-3 rounded-lg border border-primary-100 font-mono">
                    {selectedLog.ip}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1">Data/Hora</label>
                <p className="text-sage-900 bg-primary-50 px-4 py-3 rounded-lg border border-primary-100">
                  {formatDate(selectedLog.createdAt)}
                </p>
              </div>
              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-1">Metadados</label>
                  <pre className="text-xs text-sage-900 bg-primary-50 px-4 py-3 rounded-lg border border-primary-100 overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-primary-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors text-sm font-medium"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-between"
        >
          <p className="text-sage-600 text-sm">
            Mostrando {logs.length} de {totalLogs} logs
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              className="px-3 py-2 bg-white border border-primary-100 text-sage-600 rounded-lg hover:text-primary-600 hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Anterior
            </button>
            <span className="px-3 py-2 bg-primary-500 text-white rounded-lg text-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || loading}
              className="px-3 py-2 bg-white border border-primary-100 text-sage-600 rounded-lg hover:text-primary-600 hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Próxima
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

