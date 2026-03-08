import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { api } from '../services/api';
import AddMedicineModal from '../components/AddMedicineModal';
import UpdateMedicineModal from '../components/UpdateMedicineModal';
import { Search, Filter, Download, Plus, AlertTriangle, Box, CheckCircle, DollarSign, Edit } from 'lucide-react';

export default function Inventory() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [medicineToUpdate, setMedicineToUpdate] = useState(null);

  const fetchData = async () => {
    try {
      const data = await api.get('/inventory/medicines');
      setMedicines(data);
    } catch (error) {
      console.error("Error fetching inventory data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const filteredMedicines = useMemo(() => {
    return medicines.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.generic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.batch_no.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "All" || m.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [medicines, searchQuery, filterStatus]);

  const overview = useMemo(() => {
    const activeStat = medicines.filter(m => m.status === 'Active').length;
    const lowStockStat = medicines.filter(m => m.status === 'Low Stock').length;
    const totalVal = medicines.reduce((acc, curr) => acc + (curr.quantity * curr.cost_price), 0);
    return {
      totalItems: medicines.length,
      activeStock: activeStat,
      lowStock: lowStockStat,
      totalValue: totalVal
    };
  }, [medicines]);

  if (loading) {
    return <div className="animate-pulse">Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Pharmacy CRM</h1>
          <p className="text-sm text-gray-500 mt-1">Manage inventory, sales, and purchase orders</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button variant="primary" onClick={() => setIsAddMedicineModalOpen(true)}>
            <Plus size={16} className="mr-2" /> Add Medicine
          </Button>
        </div>
      </div>

      <Card className="p-6 bg-[#f0fdfaf0] border-[#ccfbf1]">
        <h3 className="text-gray-600 font-medium mb-4">Inventory Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500">Total Items</span>
              <Box size={16} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{overview.totalItems}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500">Active Stock</span>
              <CheckCircle size={16} className="text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{overview.activeStock}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500">Low Stock</span>
              <AlertTriangle size={16} className="text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{overview.lowStock}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500">Total Value</span>
              <DollarSign size={16} className="text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(overview.totalValue)}</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center mt-8 mb-4">
        <h3 className="font-medium text-gray-800">Complete Inventory</h3>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-blue-500 w-64"
            />
          </div>
          <div className="relative">
            <Button variant="outline" className="bg-white" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} className="mr-2" /> Filter {filterStatus !== "All" && `(${filterStatus})`}
            </Button>
            {showFilters && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-20 overflow-hidden">
                <div className="p-3 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter by Status</h3>
                </div>
                <div className="p-2 flex flex-col">
                  {['All', 'Active', 'Low Stock', 'Out of Stock'].map(status => (
                    <label key={status} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                      <input 
                        type="radio" 
                        name="status_filter" 
                        checked={filterStatus === status} 
                        onChange={() => { setFilterStatus(status); setShowFilters(false); }}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button variant="outline" className="bg-white">
            <Download size={16} className="mr-2" /> Export
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs uppercase bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Medicine Name</th>
                <th className="px-6 py-4">Generic Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Batch No</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Cost Price</th>
                <th className="px-6 py-4">MRP</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMedicines.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-gray-500">{item.generic_name}</td>
                  <td className="px-6 py-4 text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 text-gray-500">{item.batch_no}</td>
                  <td className="px-6 py-4 text-gray-500">{item.expiry_date}</td>
                  <td className={`px-6 py-4 font-medium ${item.quantity <= 10 && item.quantity > 0 ? 'text-orange-500' : item.quantity === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatCurrency(item.cost_price)}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{formatCurrency(item.mrp)}</td>
                  <td className="px-6 py-4 text-gray-500">{item.supplier}</td>
                  <td className="px-6 py-4">
                    <Badge type={item.status}>{item.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => { setMedicineToUpdate(item); setIsUpdateModalOpen(true); }}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Update Medicine"
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMedicines.length === 0 && (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                    No medicines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AddMedicineModal 
        isOpen={isAddMedicineModalOpen} 
        onClose={() => setIsAddMedicineModalOpen(false)} 
        onSuccess={fetchData} 
      />

      {medicineToUpdate && (
        <UpdateMedicineModal
          isOpen={isUpdateModalOpen}
          initialData={medicineToUpdate}
          onClose={() => { setIsUpdateModalOpen(false); setMedicineToUpdate(null); }}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
