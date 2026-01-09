'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaRuler
} from 'react-icons/fa';
interface ProductSize {
  id: number;
  product_id: number;
  size: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
interface ProductSizesManagerProps {
  productId: number;
  productName: string;
}
export default function ProductSizesManager({ productId, productName }: ProductSizesManagerProps) {
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sizeToDelete, setSizeToDelete] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSize, setEditingSize] = useState<string | null>(null);
  const [newSize, setNewSize] = useState('');
  const [newStock, setNewStock] = useState(0);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editSizeData, setEditSizeData] = useState<{
    id?: number;
    originalSize: string;
    size: string;
    stock: number;
    isActive: boolean;
  } | null>(null);
  const fetchSizes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/products/${productId}/sizes`);
      const data = await response.json();
      if (data.success) {
        setSizes(data.data.sizes || []);
      } else {
        setError(data.error || 'Erro ao carregar tamanhos');
      }
    } catch (err: any) {
      setError('Erro de conexão: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [productId]);
  const handleAddSize = async () => {
    if (!newSize.trim()) {
      setError('Tamanho é obrigatório');
      return;
    }
    if (newStock < 0) {
      setError('Estoque deve ser maior ou igual a zero');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const response = await fetch(`/api/admin/products/${productId}/sizes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          size: newSize.trim(),
          stock_quantity: newStock
        })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Tamanho adicionado com sucesso!');
        setNewSize('');
        setNewStock(0);
        setShowAddForm(false);
        setError(null);
        await fetchSizes();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Erro ao adicionar tamanho');
      }
    } catch (err: any) {
      setError('Erro de conexão: ' + err.message);
    } finally {
      setSaving(false);
    }
  };
  const handleUpdateStock = async (size: string, stock: number) => {
    try {
      setSaving(true);
      setError(null);
      const current = sizes.find(s => s.size === size);
      const isActive = current ? current.is_active : true;
      const response = await fetch(`/api/admin/products/${productId}/sizes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          size,
          stock_quantity: stock,
          is_active: isActive
        })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Estoque atualizado com sucesso!');
        await fetchSizes();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Erro ao atualizar estoque');
      }
    } catch (err: any) {
      setError('Erro de conexão: ' + err.message);
    } finally {
      setSaving(false);
    }
  };
  const handleEditSize = (size: ProductSize) => {
    setEditSizeData({
      id: size.id,
      originalSize: size.size,
      size: size.size,
      stock: size.stock_quantity,
      isActive: size.is_active
    });
    setShowEditForm(true);
    setEditingSize(null); 
  };
  const handleSaveEdit = async () => {
    if (!editSizeData) return;
    try {
      setSaving(true);
      setError(null);
      const finalIsActive = editSizeData.stock === 0 ? false : editSizeData.isActive;
      const response = await fetch(`/api/admin/products/${productId}/sizes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editSizeData.id,
          original_size: editSizeData.originalSize,
          size: editSizeData.size,
          stock_quantity: editSizeData.stock,
          is_active: finalIsActive
        })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Tamanho atualizado com sucesso!');
        setShowEditForm(false);
        setEditSizeData(null);
        await fetchSizes();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Erro ao atualizar tamanho');
      }
    } catch (err: any) {
      setError('Erro de conexão: ' + err.message);
    } finally {
      setSaving(false);
    }
  };
  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditSizeData(null);
    setEditingSize(null);
    setError(null);
  };
  const handleRemoveSizeClick = (size: string) => {
    setSizeToDelete(size);
    setShowDeleteConfirm(true);
  };

  const handleRemoveSizeConfirm = async () => {
    if (!sizeToDelete) return;
    try {
      setSaving(true);
      setError(null);
      const response = await fetch(`/api/admin/products/${productId}/sizes?size=${encodeURIComponent(sizeToDelete)}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Tamanho removido com sucesso!');
        setShowDeleteConfirm(false);
        setSizeToDelete(null);
        await fetchSizes();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Erro ao remover tamanho');
        setShowDeleteConfirm(false);
        setSizeToDelete(null);
      }
    } catch (err: any) {
      setError('Erro de conexão: ' + err.message);
      setShowDeleteConfirm(false);
      setSizeToDelete(null);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSizeCancel = () => {
    setShowDeleteConfirm(false);
    setSizeToDelete(null);
  };
  const totalStock = sizes.reduce((sum, size) => sum + size.stock_quantity, 0);
  useEffect(() => {
    if (productId) {
      fetchSizes();
    }
  }, [productId, fetchSizes]);
  if (loading) {
    return (
      <div className="bg-white border border-primary-100 rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-primary-500 mr-3" size={20} />
          <span className="text-sage-700">Carregando tamanhos...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white border border-primary-100 rounded-xl p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-200 rounded-lg flex-shrink-0">
            <FaRuler className="text-primary-600" size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg md:text-xl font-semibold text-sage-900">Gerenciar Tamanhos</h3>
            <p className="text-sm text-sage-600 truncate">{productName}</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-60 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
        >
          <FaPlus size={16} />
          <span>Adicionar Tamanho</span>
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-200 border border-red-300 text-red-700 p-3 md:p-4 rounded-lg flex items-start md:items-center gap-2 text-sm md:text-base"
          >
            <FaExclamationTriangle className="flex-shrink-0 mt-0.5 md:mt-0" size={16} />
            <span className="break-words">{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-200 border border-green-300 text-green-700 p-3 md:p-4 rounded-lg flex items-start md:items-center gap-2 text-sm md:text-base"
          >
            <FaCheck className="flex-shrink-0 mt-0.5 md:mt-0" size={16} />
            <span className="break-words">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 md:p-5">
          <div className="text-2xl md:text-3xl font-bold text-sage-900 mb-1">{sizes.length}</div>
          <div className="text-xs md:text-sm text-sage-600">Tamanhos Cadastrados</div>
        </div>
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 md:p-5">
          <div className="text-2xl md:text-3xl font-bold text-sage-900 mb-1">{totalStock}</div>
          <div className="text-xs md:text-sm text-sage-600">Estoque Total</div>
        </div>
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 md:p-5">
          <div className="text-2xl md:text-3xl font-bold text-sage-900 mb-1">
            {sizes.filter(s => s.stock_quantity > 0).length}
          </div>
          <div className="text-xs md:text-sm text-sage-600">Tamanhos com Estoque</div>
        </div>
      </div>
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddForm(false);
              setNewSize('');
              setNewStock(0);
              setError(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl md:rounded-3xl w-full max-w-md border border-primary-100 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-primary-100">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-2 bg-primary-200 rounded-lg flex-shrink-0">
                    <FaPlus className="text-primary-600" size={18} />
                  </div>
                  <h3 className="text-base md:text-xl font-bold text-sage-900">Adicionar Novo Tamanho</h3>
                </div>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewSize('');
                    setNewStock(0);
                    setError(null);
                  }}
                  disabled={saving}
                  className="p-2 text-sage-600 hover:text-sage-900 hover:bg-primary-50 rounded-lg transition-all duration-300 disabled:opacity-50 flex-shrink-0"
                >
                  <FaTimes size={18} />
                </button>
              </div>
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-200 border border-red-300 text-red-700 p-3 rounded-lg flex items-start gap-2 text-sm"
                  >
                    <FaExclamationTriangle className="flex-shrink-0 mt-0.5" size={16} />
                    <span className="break-words">{error}</span>
                  </motion.div>
                )}
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-3">
                    Tamanho *
                  </label>
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => {
                      setNewSize(e.target.value);
                      setError(null);
                    }}
                    className="w-full bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 text-sage-900 placeholder-sage-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:bg-white transition-all duration-300"
                    placeholder="Ex: 38, 39, 40, P, M, G..."
                    maxLength={10}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-3">
                    Quantidade em Estoque *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newStock}
                    onChange={(e) => {
                      setNewStock(parseInt(e.target.value) || 0);
                      setError(null);
                    }}
                    className="w-full bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 text-sage-900 placeholder-sage-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:bg-white transition-all duration-300"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 md:gap-4 p-4 md:p-6 border-t border-primary-100">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewSize('');
                    setNewStock(0);
                    setError(null);
                  }}
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 text-sage-600 hover:text-sage-900 hover:bg-primary-50 rounded-xl transition-all duration-300 disabled:opacity-50 text-sm md:text-base"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddSize}
                  disabled={saving || !newSize.trim()}
                  className="w-full sm:w-auto px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" size={16} />
                      <span>Adicionando...</span>
                    </>
                  ) : (
                    <>
                      <FaSave size={16} />
                      <span>Adicionar Tamanho</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {sizes.length === 0 ? (
        <div className="text-center py-8 md:py-12 text-sage-600">
          <FaRuler size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-sm md:text-base font-medium mb-1">Nenhum tamanho cadastrado para este produto</p>
          <p className="text-xs md:text-sm">Clique em &quot;Adicionar Tamanho&quot; para começar</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h4 className="text-sage-900 font-medium text-sm md:text-base">Tamanhos Cadastrados</h4>
          <div className="grid gap-3">
            {sizes.map((size) => (
              <motion.div
                key={size.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary-50 border border-primary-100 rounded-lg p-3 md:p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <div className="bg-primary-500 text-white px-3 md:px-4 py-2 rounded-full font-bold text-base md:text-lg min-w-[2.5rem] md:min-w-[3rem] text-center flex-shrink-0">
                      {size.size}
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <label className="block text-xs text-sage-600 mb-1">Estoque</label>
                        {editingSize === size.size ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              defaultValue={size.stock_quantity}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const newStock = parseInt((e.target as HTMLInputElement).value) || 0;
                                  handleUpdateStock(size.size, newStock);
                                  setEditingSize(null);
                                } else if (e.key === 'Escape') {
                                  setEditingSize(null);
                                }
                              }}
                              onBlur={(e) => {
                                const newStock = parseInt(e.target.value) || 0;
                                if (newStock !== size.stock_quantity) {
                                  handleUpdateStock(size.size, newStock);
                                }
                                setEditingSize(null);
                              }}
                              className="w-16 md:w-20 bg-white border border-primary-200 rounded px-2 py-1 text-sage-900 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingSize(size.size)}
                            className="text-sage-900 hover:text-primary-600 transition-colors"
                          >
                            <span className="font-semibold text-sm md:text-base">{size.stock_quantity}</span>
                          </button>
                        )}
                      </div>
                      <div className={`px-2 md:px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        (size.is_active && size.stock_quantity > 0)
                          ? 'bg-green-200 text-green-700'
                          : 'bg-red-200 text-red-700'
                      }`}>
                        {(size.is_active && size.stock_quantity > 0) ? 'Disponível' : 'Esgotado'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end md:justify-start">
                     <button
                       onClick={() => handleEditSize(size)}
                       disabled={saving}
                       className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-100 rounded-lg transition-colors disabled:opacity-50"
                       title="Editar tamanho"
                     >
                       <FaEdit size={14} />
                     </button>
                    <button
                      onClick={() => handleRemoveSizeClick(size.size)}
                      disabled={saving}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Remover tamanho"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      <AnimatePresence>
        {showEditForm && editSizeData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl md:rounded-3xl w-full max-w-md border border-primary-100 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-primary-100 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                  <div className="p-2 bg-primary-200 rounded-lg flex-shrink-0">
                    <FaEdit className="text-primary-600" size={18} />
                  </div>
                  <h3 className="text-base md:text-xl font-bold text-sage-900 truncate">Editar Tamanho {editSizeData.size}</h3>
                </div>
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="p-2 text-sage-600 hover:text-sage-900 hover:bg-primary-50 rounded-lg transition-all duration-300 disabled:opacity-50 flex-shrink-0"
                >
                  <FaTimes size={18} />
                </button>
              </div>
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-3">
                    Tamanho
                  </label>
                  <input
                    type="text"
                    value={editSizeData.size}
                    onChange={(e) => setEditSizeData({ ...editSizeData, size: e.target.value })}
                    className="w-full bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 text-sage-900 placeholder-sage-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:bg-white transition-all duration-300"
                    placeholder="Ex: 38, 39, 40, P, M, G..."
                    maxLength={10}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-3">
                    Quantidade em Estoque
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editSizeData.stock}
                     onChange={(e) => {
                       const newStock = parseInt(e.target.value) || 0;
                       setEditSizeData({ 
                         ...editSizeData, 
                         stock: newStock,
                         isActive: newStock === 0 ? false : editSizeData.isActive
                       });
                     }}
                    className="w-full bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 text-sage-900 placeholder-sage-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:bg-white transition-all duration-300"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-3">
                    Status do Tamanho
                  </label>
                  <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={!editSizeData.isActive}
                          onChange={(e) => setEditSizeData({ ...editSizeData, isActive: !e.target.checked })}
                        />
                        <span className="toggle-slider"></span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sage-900 font-medium group-hover:text-red-600 transition-colors duration-300">
                          Esgotado
                        </div>
                        <div className="text-sm text-sage-600">
                          Tamanho indisponível (estoque zero)
                        </div>
                      </div>
                      {!editSizeData.isActive && (
                        <div className="text-red-600 animate-pulse">
                          <FaExclamationTriangle size={16} />
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 md:gap-4 p-4 md:p-6 border-t border-primary-100 sticky bottom-0 bg-white">
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 text-sage-600 hover:text-sage-900 hover:bg-primary-50 rounded-xl transition-all duration-300 disabled:opacity-50 text-sm md:text-base"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" size={16} />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <FaSave size={16} />
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={handleRemoveSizeCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl md:rounded-3xl w-full max-w-md border border-primary-100 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-primary-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-200 rounded-lg">
                    <FaTrash className="text-red-600" size={20} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-sage-900">Confirmar Exclusão</h3>
                </div>
                <button
                  onClick={handleRemoveSizeCancel}
                  className="p-2 text-sage-600 hover:text-sage-900 hover:bg-primary-50 rounded-lg transition-all duration-300"
                >
                  <FaTimes size={18} />
                </button>
              </div>
              <div className="p-4 md:p-6 space-y-4">
                <p className="text-sage-700 text-sm md:text-base">
                  Tem certeza que deseja remover o tamanho <strong>{sizeToDelete}</strong>?
                </p>
                <p className="text-sage-500 text-xs md:text-sm">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 md:gap-4 p-4 md:p-6 border-t border-primary-100">
                <button
                  onClick={handleRemoveSizeCancel}
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 text-sage-600 hover:text-sage-900 hover:bg-primary-50 rounded-xl transition-all duration-300 disabled:opacity-50 text-sm md:text-base"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRemoveSizeConfirm}
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" size={16} />
                      <span>Removendo...</span>
                    </>
                  ) : (
                    <>
                      <FaTrash size={16} />
                      <span>Remover Tamanho</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
