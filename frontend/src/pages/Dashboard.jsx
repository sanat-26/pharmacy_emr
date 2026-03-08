import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import AddMedicineModal from '../components/AddMedicineModal';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import { DollarSign, ShoppingCart, AlertTriangle, Package, Plus, Search, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [inventory, setInventory] = useState([]); // Needed for searching
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({ supplier: '', amount: '' });

  // Sale states
  const [patientId, setPatientId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchData = async () => {
    try {
      const [summaryData, salesData, inventoryData] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/recent-sales?limit=5'),
        api.get('/inventory/medicines')
      ]);
      setSummary(summaryData);
      setRecentSales(salesData);
      setInventory(inventoryData);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  // --- Purchase Logic ---
  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/dashboard/purchase-orders', {
        supplier: purchaseForm.supplier,
        amount: parseFloat(purchaseForm.amount)
      });
      setIsPurchaseModalOpen(false);
      setPurchaseForm({ supplier: '', amount: '' });
      toast.success("Purchase order created!");
      fetchData(); // Refresh metrics
    } catch (err) {
      toast.error("Failed to create purchase order.");
    }
  };

  // --- Sale Logic ---
  const filteredInventory = useMemo(() => {
    if (!searchQuery) return [];
    return inventory.filter(m => 
      m.status === 'Active' && 
      m.quantity > 0 &&
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // top 5 results
  }, [searchQuery, inventory]);

  const addToCart = (medicine) => {
    const exists = cart.find(item => item.id === medicine.id);
    if (exists) {
      if (exists.cartQuantity < medicine.quantity) {
         setCart(cart.map(item => item.id === medicine.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item));
      }
    } else {
      setCart([...cart, { ...medicine, cartQuantity: 1 }]);
    }
    setSearchQuery('');
    setShowDropdown(false);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.mrp * item.cartQuantity), 0);

  const handleBill = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    try {
      const payload = {
        patient_id: patientId || "Walk-in Patient",
        payment_method: "Cash", // default for brevity
        items: cart.map(item => ({ medicine_id: item.id, quantity: item.cartQuantity }))
      };
      await api.post('/dashboard/sales', payload);
      setCart([]);
      setPatientId('');
      toast.success("Sale processed successfully!");
      fetchData();
    } catch (err) {
      toast.error("Failed to process sale");
    }
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Pharmacy CRM</h1>
          <p className="text-sm text-gray-500 mt-1">Manage inventory, sales, and purchase orders</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Export</Button>
          <Button onClick={() => setIsAddMedicineModalOpen(true)}>
            <Plus size={16} className="mr-1" /> Add Medicine
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <DollarSign size={24} />
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-xs font-semibold px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(summary?.today_sales || 0)}</h3>
            <p className="text-sm text-gray-500 mt-1">Today's Sales</p>
          </div>
        </Card>
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <ShoppingCart size={24} />
            </div>
            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">{summary?.items_sold_today || 0} Items</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{summary?.items_sold_today || 0}</h3>
            <p className="text-sm text-gray-500 mt-1">Items Sold Today</p>
          </div>
        </Card>
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
              <AlertTriangle size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{summary?.low_stock_items || 0}</h3>
            <p className="text-sm text-gray-500 mt-1">Low Stock Items</p>
          </div>
        </Card>
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-fuchsia-100 flex items-center justify-center text-fuchsia-600">
              <Package size={24} />
            </div>
            <span className="bg-fuchsia-50 text-fuchsia-600 text-xs font-semibold px-2 py-1 rounded-full">{summary?.pending_po_count || 0} Pending</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(summary?.purchase_orders || 0)}</h3>
            <p className="text-sm text-gray-500 mt-1">Purchase Orders</p>
          </div>
        </Card>
      </div>
      
      {/* Make a Sale Form */}
      <Card className="overflow-visible">
        <div className="border-b border-gray-100 p-4">
           <div className="flex items-center justify-between">
              <div className="flex space-x-6 text-sm">
                <button className="flex items-center text-gray-800 font-medium py-2 border-b-2 border-blue-600">
                  <ShoppingCart size={16} className="mr-2" /> Sales
                </button>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => document.getElementById('search-med').focus()} variant="primary" className="py-1.5 px-3 rounded text-sm bg-blue-600 text-white">
                   <Plus size={16} className="mr-1" /> New Sale
                </Button>
                <Button onClick={() => setIsPurchaseModalOpen(true)} variant="outline" className="py-1.5 px-3 rounded text-sm bg-white border border-gray-200">
                   <Plus size={16} className="mr-1 text-gray-400" /> New Purchase
                </Button>
              </div>
           </div>
        </div>

        <div className="p-6 bg-[#f0f9ff]">
          <h3 className="text-gray-800 font-medium mb-1">Make a Sale</h3>
          <p className="text-xs text-gray-500 mb-4">Select medicines from inventory</p>

          <div className="flex space-x-3 mb-6 relative">
            <div className="w-1/4">
              <input value={patientId} onChange={e => setPatientId(e.target.value)} type="text" placeholder="Patient Name / Id" className="w-full pl-3 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-blue-500 text-sm shadow-sm" />
            </div>
            <div className="flex-1 relative z-10">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                id="search-med"
                type="text" 
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                placeholder="Search medicines in stock..." 
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-blue-500 text-sm shadow-sm" 
              />
              
              {showDropdown && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden min-h-[50px]">
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map(med => (
                      <div key={med.id} onClick={() => addToCart(med)} className="p-3 border-b last:border-0 hover:bg-blue-50 cursor-pointer flex justify-between items-center group">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{med.name} <span className="text-xs text-gray-400 ml-2">({med.batch_no})</span></p>
                          <p className="text-xs text-green-600">{med.quantity} in stock</p>
                        </div>
                        <div className="text-right flex items-center space-x-3">
                          <span className="text-sm font-bold text-gray-800">{formatCurrency(med.mrp)}</span>
                          <kbd className="hidden group-hover:block bg-blue-100 text-blue-600 text-[10px] px-2 py-1 rounded">Add</kbd>
                        </div>
                      </div>
                    ))
                  ) : (
                     <div className="p-4 text-center text-sm text-gray-500">No active medicines found matching "{searchQuery}"</div>
                  )}
                </div>
              )}
            </div>
            <Button onClick={handleBill} disabled={cart.length === 0} className={`bg-[#d9381e] hover:bg-red-700 text-white px-8 ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : 'shadow-md'}`}>
              Bill {cartTotal > 0 && `(${formatCurrency(cartTotal)})`}
            </Button>
          </div>

          <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-[#f8fafc] text-xs text-gray-500 uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Medicine Name</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-4 py-3 text-center">Quantity</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name} <span className="block text-xs text-gray-400">{item.batch_no}</span></td>
                    <td className="px-4 py-3 text-right">{formatCurrency(item.mrp)}</td>
                    <td className="px-4 py-3 text-center w-32">
                      <div className="flex border rounded overflow-hidden">
                        <button onClick={() => setCart(cart.map(c => c.id === item.id ? {...c, cartQuantity: Math.max(1, c.cartQuantity - 1)} : c))} className="px-2 bg-gray-50 hover:bg-gray-100 border-r">-</button>
                        <input className="w-10 text-center text-xs" readOnly value={item.cartQuantity} />
                        <button onClick={() => setCart(cart.map(c => c.id === item.id ? {...c, cartQuantity: Math.min(item.quantity, c.cartQuantity + 1)} : c))} className="px-2 bg-gray-50 hover:bg-gray-100 border-l">+</button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(item.mrp * item.cartQuantity)}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
                {cart.length === 0 && (
                   <tr><td colSpan="5" className="px-4 py-8 text-center text-sm text-gray-400">Scan items or lookup inventory to begin sale.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Sales List */}
        <div className="p-6">
          <h3 className="text-gray-800 font-medium mb-4">Recent Sales</h3>
          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-[#f8fafc] hover:bg-white transition-colors">
                 <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                      <ShoppingCart size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{sale.invoice_no}</p>
                      <p className="text-xs text-gray-500">
                        {sale.patient_id || 'Walk-in Patient'} • {sale.items_count} items • {sale.payment_method}
                      </p>
                    </div>
                 </div>
                 <div className="text-right flex items-center space-x-4">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{formatCurrency(sale.total_amount)}</p>
                      <p className="text-xs text-gray-400">{new Date(sale.date).toISOString().split('T')[0]}</p>
                    </div>
                    <Badge type={sale.status}>{sale.status}</Badge>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* --- Modals --- */}
      
      {/* Purchase Order Modal */}
      <Modal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} title="Create Purchase Order">
        <form onSubmit={handlePurchaseSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
            <input required type="text" value={purchaseForm.supplier} onChange={e => setPurchaseForm({...purchaseForm, supplier: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Amount (INR)</label>
            <input required type="number" value={purchaseForm.amount} onChange={e => setPurchaseForm({...purchaseForm, amount: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="button" variant="outline" className="mr-2" onClick={() => setIsPurchaseModalOpen(false)}>Cancel</Button>
            <Button type="submit">Order Stock</Button>
          </div>
        </form>
      </Modal>

      {/* Add Medicine Modal */}
      <AddMedicineModal 
        isOpen={isAddMedicineModalOpen} 
        onClose={() => setIsAddMedicineModalOpen(false)} 
        onSuccess={fetchData} 
      />

    </div>
  );
}
