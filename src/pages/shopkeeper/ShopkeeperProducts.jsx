import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

export function ShopkeeperProducts() {
  const { products, deleteProduct, editProduct } = useProducts();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('approved'); // 'approved' | 'pending' | 'rejected'

  const myProducts = products.filter(p => !user?.name || p.shopName === user?.name || p.shopName === user?.shopName || true);
  const filteredProducts = myProducts.filter(p => p.status === activeTab);

  const handleEdit = (p) => {
    const newPrice = prompt('Enter new offer price for ' + p.name + ':', p.offerPrice || p.price);
    if (newPrice !== null && !isNaN(newPrice)) {
      editProduct(p.id, { offerPrice: Number(newPrice) });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to completely remove this saree from the system?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Weaver Inventory</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>My Sarees</h1>
        </div>
        <span className="badge badge-warning !text-xs font-bold px-3.5 py-1.5">
          {filteredProducts.length} {activeTab === 'approved' ? 'Approved' : activeTab === 'pending' ? 'Pending' : 'Rejected'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2.5 pb-2">
        {[
          { key: 'approved', label: 'Approved Sarees', count: myProducts.filter(p => p.status === 'approved').length },
          { key: 'pending', label: 'Pending Approval', count: myProducts.filter(p => p.status === 'pending').length },
          { key: 'rejected', label: 'Rejected Sarees', count: myProducts.filter(p => p.status === 'rejected').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border flex items-center gap-2 ${activeTab === tab.key ? 'bg-[#7B1E3A] text-white border-[#7B1E3A] shadow-md' : 'bg-white text-[#6B4A48] border-[#D4AF37]/30 hover:border-[#7B1E3A]'}`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-[#FFF8F0] text-[#7B1E3A]'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="table-container bg-white shadow-sm border border-[#D4AF37]/20">
        <table className="table-base w-full">
          <thead>
            <tr>
              <th className="!text-xs uppercase tracking-wider">Product Image & Name</th>
              <th className="!text-xs uppercase tracking-wider">Category</th>
              <th className="!text-xs uppercase tracking-wider">Price</th>
              <th className="!text-xs uppercase tracking-wider">Upload Date</th>
              <th className="!text-xs uppercase tracking-wider">Current Status</th>
              <th className="!text-xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#6B4A48] italic">No products found in this category.</td>
              </tr>
            ) : (
              filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-[#FFF8F0]/50 transition-colors">
                  <td className="font-medium text-[#4A2C2A]">
                    <div className="flex items-center gap-3.5">
                      <img src={p.image} alt="" className="w-12 h-14 rounded-xl object-cover border border-[#D4AF37]/30 shadow-xs flex-shrink-0" />
                      <div>
                        <span className="font-bold text-[#7B1E3A] block text-sm">{p.name}</span>
                        <span className="text-[11px] text-[#6B4A48]/70">ID: #VC-{p.id} · {p.fabric || 'Pure Silk'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-[#6B4A48] font-medium text-xs">
                    <span className="bg-[#FFF8F0] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/20 font-medium">
                      {p.category || 'Silk'}
                    </span>
                  </td>
                  <td className="font-bold text-[#7B1E3A] text-sm">₹{(p.offerPrice || p.price || 14500).toLocaleString()}</td>
                  <td className="text-xs text-[#6B4A48] font-mono">{p.date || '09 Jul 2026'}</td>
                  <td>
                    <span className={`badge !text-[11px] font-bold px-3.5 py-1.5 ${p.status === 'approved' ? 'badge-success' : p.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                      {p.status === 'approved' ? 'Approved' : p.status === 'rejected' ? 'Rejected' : 'Pending Approval'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/product/${p.id}`}
                        title="View"
                        className="p-2 rounded-lg bg-[#FFF8F0] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors border border-[#D4AF37]/30 inline-flex items-center justify-center"
                      >
                        <FiEye size={15} />
                      </Link>
                      <button
                        onClick={() => handleEdit(p)}
                        title="Edit"
                        className="p-2 rounded-lg bg-[#FFF8F0] text-[#2D8F5E] hover:bg-[#2D8F5E] hover:text-white transition-colors border border-[#2D8F5E]/30 cursor-pointer inline-flex items-center justify-center"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        title="Delete"
                        className="p-2 rounded-lg bg-[#FFF8F0] text-red-600 hover:bg-red-600 hover:text-white transition-colors border border-red-300 cursor-pointer inline-flex items-center justify-center"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

