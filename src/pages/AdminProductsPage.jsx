import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Star } from 'lucide-react';
import productService from '../services/productService';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Winter Sweaters',
  'Handmade Sweaters',
  'Custom Designs',
  'Cardigans',
  'Shawls & Wraps',
  'Pullovers',
  'New Arrivals',
];

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const initialForm = {
    name: '',
    category: 'Winter Sweaters',
    subcategory: '',
    price: '',
    discountPrice: '',
    description: '',
    material: '100% Pure Merino Wool',
    design: 'Artisanal Handknit',
    stock: 10,
    lowStockThreshold: 5,
    sizes: 'S, M, L, XL',
    colors: 'Camel Sand, Natural Cream',
    images: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80',
    isFeatured: false,
    isUpcoming: false,
    isNewArrival: true,
  };

  const [form, setForm] = useState(initialForm);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts({ search, limit: 50 });
      if (res.data?.products) setProducts(res.data.products);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      subcategory: p.subcategory || '',
      price: p.price,
      discountPrice: p.discountPrice || '',
      description: p.description,
      material: p.material || '',
      design: p.design || '',
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold || 5,
      sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes,
      colors: Array.isArray(p.colors) ? p.colors.join(', ') : p.colors,
      images: Array.isArray(p.images) ? p.images.join(', ') : p.images,
      isFeatured: p.isFeatured || false,
      isUpcoming: p.isUpcoming || false,
      isNewArrival: p.isNewArrival || false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product from the atelier?')) return;
    try {
      await productService.deleteProduct(id);
      loadProducts();
    } catch (err) {
      // Handled
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
        stock: Number(form.stock),
        lowStockThreshold: Number(form.lowStockThreshold),
        sizes: form.sizes.split(',').map((s) => s.trim()),
        colors: form.colors.split(',').map((c) => c.trim()),
        images: form.images.split(',').map((img) => img.trim()),
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, payload);
      } else {
        await productService.createProduct(payload);
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      // Handled by apiRequest
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2A2923]">Product Management</h1>
          <p className="text-xs text-[#686558] mt-0.5">
            Add, edit, adjust stock, and curate the winter catalog.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
          Add New Product
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 border border-[#DDCBA4]/60 rounded-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-[#686558]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by title, design, or category..."
          className="w-full text-xs text-[#2A2923] focus:outline-none"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#DDCBA4]/60 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAEDCD]/40 text-[#2A2923] uppercase font-semibold border-b border-[#DDCBA4]/50">
              <tr>
                <th className="p-3">Creation</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price (₹)</th>
                <th className="p-3">Stock Status</th>
                <th className="p-3">Badges</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDCBA4]/30 text-[#2A2923]">
              {products.map((p) => {
                const isLow = p.stock <= (p.lowStockThreshold || 5);
                const isOut = p.stock <= 0;
                return (
                  <tr key={p._id} className="hover:bg-[#FAEDCD]/20">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnail || p.images?.[0]}
                          alt={p.name}
                          className="w-10 h-12 object-cover rounded-sm border border-[#DDCBA4]"
                        />
                        <div>
                          <p className="font-serif font-semibold text-[#2A2923] line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-[#686558]">{p.material}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3 font-semibold text-[#D4A373]">
                      ₹{(p.discountPrice || p.price).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3">
                      {isOut ? (
                        <Badge variant="outOfStock">Out of Stock (0)</Badge>
                      ) : isLow ? (
                        <Badge variant="lowStock">Low Stock ({p.stock})</Badge>
                      ) : (
                        <Badge variant="inStock">In Stock ({p.stock})</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {p.isFeatured && <Badge variant="accent" size="xs">Featured</Badge>}
                        {p.isUpcoming && <Badge variant="cream" size="xs">Upcoming</Badge>}
                        {p.isNewArrival && <Badge variant="sage" size="xs">New</Badge>}
                      </div>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1 text-[#686558] hover:text-[#D4A373]"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1 text-[#686558] hover:text-[#C86D51]"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProduct ? 'Edit Handcrafted Piece' : 'Add New Winter Creation'}
          subtitle="All fields directly sync with the atelier database"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#2A2923] block mb-1">Product Title *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="E.g., Artisanal Cashmere Cable-Knit Pullover"
                className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">Subcategory</label>
                <input
                  type="text"
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                  placeholder="Cable Knit, Chunky, Wrap..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">Price (₹) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  min={0}
                  placeholder="5999"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">Discount Price (₹)</label>
                <input
                  type="number"
                  value={form.discountPrice}
                  onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                  min={0}
                  placeholder="4999 (optional)"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                  min={0}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                  Low Stock Alert Threshold
                </label>
                <input
                  type="number"
                  value={form.lowStockThreshold}
                  onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                  min={1}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2A2923] block mb-1">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={3}
                placeholder="Narrative regarding the yarn, hours of needlework, and warmth..."
                className="w-full p-2.5 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">Material</label>
                <input
                  type="text"
                  value={form.material}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                  placeholder="100% Himalayan Cashmere"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">Design Information</label>
                <input
                  type="text"
                  value={form.design}
                  onChange={(e) => setForm({ ...form, design: e.target.value })}
                  placeholder="Diamond Cable, Phulkari motif"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                  Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  placeholder="XS, S, M, L, XL"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                  Colors (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.colors}
                  onChange={(e) => setForm({ ...form, colors: e.target.value })}
                  placeholder="Camel Sand, Natural Cream"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                Image URLs (comma-separated) *
              </label>
              <input
                type="text"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
              />
            </div>

            {/* Flags */}
            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="text-[#D4A373] focus:ring-[#D4A373]"
                />
                <span>Featured Piece</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isUpcoming}
                  onChange={(e) => setForm({ ...form, isUpcoming: e.target.checked })}
                  className="text-[#D4A373] focus:ring-[#D4A373]"
                />
                <span>Upcoming Preview</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isNewArrival}
                  onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })}
                  className="text-[#D4A373] focus:ring-[#D4A373]"
                />
                <span>New Arrival</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#DDCBA4]/50">
              <Button variant="warm" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving} disabled={isSaving}>
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminProductsPage;
