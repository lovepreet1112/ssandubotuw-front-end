import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import productService from '../services/productService';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { Layers, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await adminService.getInventory();
      if (res.data?.inventory) setInventory(res.data.inventory);
    } catch (err) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleStockAdjust = async (productId, newStock) => {
    if (newStock < 0) return;
    try {
      setUpdatingId(productId);
      await productService.updateProduct(productId, { stock: newStock });
      setInventory((prev) =>
        prev.map((item) => (item._id === productId ? { ...item, stock: newStock } : item))
      );
      toast.success('Stock quantity updated');
    } catch (err) {
      toast.error('Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2A2923]">Inventory Audit & Thresholds</h1>
          <p className="text-xs text-[#686558] mt-0.5">
            Monitor live stock numbers and replenish threshold levels for winter yarn items.
          </p>
        </div>

        <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadInventory}>
          Refresh Stock
        </Button>
      </div>

      <div className="bg-white border border-[#DDCBA4]/60 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAEDCD]/40 text-[#2A2923] uppercase font-semibold border-b border-[#DDCBA4]/50">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Threshold</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDCBA4]/30 text-[#2A2923]">
              {inventory.map((item) => {
                const isOut = item.stock <= 0;
                const isLow = item.stock > 0 && item.stock <= (item.lowStockThreshold || 5);

                return (
                  <tr key={item._id} className="hover:bg-[#FAEDCD]/20">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-10 h-12 object-cover rounded-sm border border-[#DDCBA4]"
                        />
                        <span className="font-serif font-semibold text-[#2A2923]">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3 font-semibold text-[#2A2923]">
                      <span className={isOut ? 'text-red-700' : isLow ? 'text-amber-700' : ''}>
                        {item.stock} units
                      </span>
                    </td>
                    <td className="p-3 text-[#686558]">{item.lowStockThreshold || 5} units</td>
                    <td className="p-3">
                      {isOut ? (
                        <Badge variant="outOfStock">Out of Stock</Badge>
                      ) : isLow ? (
                        <Badge variant="lowStock">Low Stock Alert</Badge>
                      ) : (
                        <Badge variant="inStock">Healthy Inventory</Badge>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleStockAdjust(item._id, item.stock - 1)}
                          disabled={item.stock <= 0 || updatingId === item._id}
                          className="w-7 h-7 rounded border border-[#DDCBA4] hover:bg-[#FAEDCD] flex items-center justify-center font-bold disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{item.stock}</span>
                        <button
                          onClick={() => handleStockAdjust(item._id, item.stock + 5)}
                          disabled={updatingId === item._id}
                          className="px-2 h-7 rounded border border-[#DDCBA4] hover:bg-[#D4A373] hover:text-white transition-colors text-xs font-semibold"
                          title="Add 5 units"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventoryPage;
