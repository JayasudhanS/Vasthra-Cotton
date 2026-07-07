import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiPlus, FiSave, FiEdit2, FiTrash2, FiShield, FiSliders, FiBell, FiLock } from 'react-icons/fi';
import { products, shops, categories as initialCategories } from '../../data';

export function AdminPendingProducts() {
  const [items, setItems] = useState(products.filter(p => p.status === 'pending'));
  const act = (id, status) => {
    setItems(prev => prev.filter(p => p.id !== id));
    alert(`Saree ID #${id} has been ${status.toUpperCase()} and seller notified.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Verification Queue</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Pending Saree Approvals</h1>
        </div>
        <span className="badge badge-warning !text-xs font-bold px-3.5 py-1.5">
          {items.length} Awaiting Inspection
        </span>
      </div>

      {items.length === 0 ? (
        <div className="card-base p-16 text-center max-w-lg mx-auto bg-white border-dashed">
          <div className="w-16 h-16 rounded-full bg-[#2D8F5E]/10 text-[#2D8F5E] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
          <h3 className="text-xl font-bold text-[#7B1E3A] mb-1" style={{ fontFamily: 'Playfair Display' }}>Queue is Clear!</h3>
          <p className="text-sm text-[#6B4A48] m-0">All submitted sarees have been inspected and verified.</p>
        </div>
      ) : (
        <div className="table-container bg-white shadow-sm border border-[#D4AF37]/20">
          <table className="table-base w-full">
            <thead>
              <tr>
                <th className="!text-xs uppercase tracking-wider">Saree Masterpiece</th>
                <th className="!text-xs uppercase tracking-wider">Weave House / Shop</th>
                <th className="!text-xs uppercase tracking-wider">Offer Price</th>
                <th className="!text-xs uppercase tracking-wider">Verification Status</th>
                <th className="!text-xs uppercase tracking-wider text-right">Silk Mark Decision</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} className="hover:bg-[#FFF8F0]/50 transition-colors">
                  <td className="font-medium text-[#4A2C2A]">
                    <div className="flex items-center gap-3.5">
                      <img src={p.image} alt="" className="w-12 h-14 rounded-xl object-cover border border-[#D4AF37]/30 shadow-xs flex-shrink-0" />
                      <div>
                        <span className="font-bold text-[#7B1E3A] block text-sm">{p.name}</span>
                        <span className="text-[11px] text-[#6B4A48]/70">ID: #SV-{p.id}08 · {p.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-[#6B4A48] font-medium text-xs">{p.shopName}</td>
                  <td className="font-bold text-[#7B1E3A] text-sm">₹{p.offerPrice.toLocaleString()}</td>
                  <td><span className="badge badge-warning">⏳ Pending Inspection</span></td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => act(p.id, 'approved')} title="Approve & Certify"
                        className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center cursor-pointer border border-green-300 hover:bg-green-600 hover:text-white transition-all shadow-xs">
                        <FiCheck size={18} />
                      </button>
                      <button onClick={() => act(p.id, 'rejected')} title="Reject Weave"
                        className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center cursor-pointer border border-red-300 hover:bg-red-600 hover:text-white transition-all shadow-xs">
                        <FiX size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AdminApprovedProducts() {
  const approved = products.filter(p => p.status === 'approved');
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Live Catalogue</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Verified & Approved Sarees</h1>
        </div>
        <span className="badge badge-success !text-xs font-bold px-3.5 py-1.5">
          {approved.length} Masterpieces Live
        </span>
      </div>

      <div className="table-container bg-white shadow-sm border border-[#D4AF37]/20">
        <table className="table-base w-full">
          <thead>
            <tr>
              <th className="!text-xs uppercase tracking-wider">Saree Masterpiece</th>
              <th className="!text-xs uppercase tracking-wider">Weave House / Shop</th>
              <th className="!text-xs uppercase tracking-wider">Offer Price</th>
              <th className="!text-xs uppercase tracking-wider">Customer Rating</th>
              <th className="!text-xs uppercase tracking-wider text-right">Certification</th>
            </tr>
          </thead>
          <tbody>
            {approved.map(p => (
              <tr key={p.id} className="hover:bg-[#FFF8F0]/50 transition-colors">
                <td className="font-medium text-[#4A2C2A]">
                  <div className="flex items-center gap-3.5">
                    <img src={p.image} alt="" className="w-12 h-14 rounded-xl object-cover border border-[#D4AF37]/30 shadow-xs flex-shrink-0" />
                    <div>
                      <span className="font-bold text-[#7B1E3A] block text-sm">{p.name}</span>
                      <span className="text-[11px] text-[#6B4A48]/70">ID: #SV-{p.id}08 · {p.category}</span>
                    </div>
                  </div>
                </td>
                <td className="text-[#6B4A48] font-medium text-xs">{p.shopName}</td>
                <td className="font-bold text-[#7B1E3A] text-sm">₹{p.offerPrice.toLocaleString()}</td>
                <td className="text-[#6B4A48] font-semibold text-xs">⭐ {p.rating} <span className="text-[10px] text-[#6B4A48]/60">({p.reviews} rev.)</span></td>
                <td className="text-right">
                  <span className="badge badge-success">✓ Silk Mark Certified</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminPendingShops() {
  const [items, setItems] = useState(shops.filter(s => s.status === 'pending'));
  const act = (id, decision) => {
    setItems(prev => prev.filter(s => s.id !== id));
    alert(`Weaver House ID #${id} has been ${decision} and onboarded.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Artisan Verification</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Pending Weaver Houses</h1>
        </div>
        <span className="badge badge-warning !text-xs font-bold px-3.5 py-1.5">
          {items.length} Applications Pending
        </span>
      </div>

      {items.length === 0 ? (
        <div className="card-base p-16 text-center max-w-lg mx-auto bg-white border-dashed">
          <div className="w-16 h-16 rounded-full bg-[#2D8F5E]/10 text-[#2D8F5E] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
          <h3 className="text-xl font-bold text-[#7B1E3A] mb-1" style={{ fontFamily: 'Playfair Display' }}>No Pending Weavers</h3>
          <p className="text-sm text-[#6B4A48] m-0">All shopkeeper onboarding requests have been processed.</p>
        </div>
      ) : (
        <div className="table-container bg-white shadow-sm border border-[#D4AF37]/20">
          <table className="table-base w-full">
            <thead>
              <tr>
                <th className="!text-xs uppercase tracking-wider">Weave House / Brand</th>
                <th className="!text-xs uppercase tracking-wider">Master Artisan / Owner</th>
                <th className="!text-xs uppercase tracking-wider">Location & Contact</th>
                <th className="!text-xs uppercase tracking-wider">Status</th>
                <th className="!text-xs uppercase tracking-wider text-right">Onboarding Decision</th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => (
                <tr key={s.id} className="hover:bg-[#FFF8F0]/50 transition-colors">
                  <td className="font-medium text-[#4A2C2A]">
                    <div className="flex items-center gap-3.5">
                      <img src={s.logo} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]" />
                      <div>
                        <span className="font-bold text-[#7B1E3A] block text-sm">{s.name}</span>
                        <span className="text-[11px] text-[#6B4A48]/70">Applied: July 2026</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-[#6B4A48] font-bold text-xs">{s.owner}</td>
                  <td className="text-[#6B4A48] text-xs">
                    <span className="block font-medium">📍 {s.location}</span>
                    <span className="text-[11px] text-[#D4AF37] font-mono">+91 98765 43210</span>
                  </td>
                  <td><span className="badge badge-warning">⏳ KYC Pending</span></td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => act(s.id, 'Approved')} title="Approve Weaver"
                        className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center cursor-pointer border border-green-300 hover:bg-green-600 hover:text-white transition-all shadow-xs">
                        <FiCheck size={18} />
                      </button>
                      <button onClick={() => act(s.id, 'Rejected')} title="Reject Application"
                        className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center cursor-pointer border border-red-300 hover:bg-red-600 hover:text-white transition-all shadow-xs">
                        <FiX size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AdminUsers() {
  const users = [
    { name: 'Ananya Reddy', email: 'ananya@example.com', joined: '12 May 2026', orders: 8, tier: 'Royal Gold' },
    { name: 'Preethi Menon', email: 'preethi@example.com', joined: '20 Apr 2026', orders: 12, tier: 'Royal Gold' },
    { name: 'Divya Gupta', email: 'divya@example.com', joined: '01 Jun 2026', orders: 3, tier: 'Silver' },
    { name: 'Sneha Iyer', email: 'sneha@example.com', joined: '15 Mar 2026', orders: 15, tier: 'Platinum Connoisseur' },
    { name: 'Kavya Pillai', email: 'kavya@example.com', joined: '28 Jun 2026', orders: 1, tier: 'Member' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Community Roster</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Registered Connoisseurs</h1>
        </div>
        <span className="badge badge-success !text-xs font-bold px-3.5 py-1.5">
          {users.length} Active Members
        </span>
      </div>

      <div className="table-container bg-white shadow-sm border border-[#D4AF37]/20">
        <table className="table-base w-full">
          <thead>
            <tr>
              <th className="!text-xs uppercase tracking-wider">Member Name</th>
              <th className="!text-xs uppercase tracking-wider">Email Address</th>
              <th className="!text-xs uppercase tracking-wider">Member Tier</th>
              <th className="!text-xs uppercase tracking-wider">Joined Date</th>
              <th className="!text-xs uppercase tracking-wider text-right">Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-[#FFF8F0]/50 transition-colors">
                <td className="font-bold text-[#4A2C2A] text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center font-bold text-xs">
                      {u.name.charAt(0)}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td className="text-[#6B4A48] font-mono text-xs">{u.email}</td>
                <td>
                  <span className={`badge ${u.tier.includes('Platinum') || u.tier.includes('Gold') ? 'badge-warning' : 'badge-success'}`}>
                    ✦ {u.tier}
                  </span>
                </td>
                <td className="text-[#6B4A48] text-xs font-medium">{u.joined}</td>
                <td className="font-bold text-[#7B1E3A] text-sm text-right">{u.orders} Orders</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [newCat, setNewCat] = useState({ name: '', count: '120' });
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newCat.name.trim()) {
      setCategories([...categories, { id: Date.now(), name: newCat.name, count: +newCat.count, image: 'https://images.pexels.com/photos/2814808/pexels-photo-2814808.jpeg?auto=compress&cs=tinysrgb&w=800' }]);
      setNewCat({ name: '', count: '100' });
      setShowAdd(false);
      alert('New regional weave category added successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Taxonomy & Regional Weaves</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Saree Categories</h1>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-golden !py-2.5 !px-5 !text-xs cursor-pointer shadow-md inline-flex items-center gap-1.5 w-fit">
          <FiPlus size={16} /> Add Regional Category
        </button>
      </div>

      {showAdd && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleAdd}
          className="card-base p-6 bg-[#FFF8F0] border border-[#D4AF37]/40 shadow-md space-y-4 max-w-xl">
          <h3 className="text-base font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Create New Weave Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Category Title *</label>
              <input type="text" required placeholder="e.g. Chanderi Handloom" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} className="input-field !h-10 !text-xs bg-white" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Est. Masterpieces Count</label>
              <input type="number" required placeholder="100" value={newCat.count} onChange={e => setNewCat({ ...newCat, count: e.target.value })} className="input-field !h-10 !text-xs bg-white" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-outline-maroon !py-2 !px-4 !text-xs">Cancel</button>
            <button type="submit" className="btn-golden !py-2 !px-6 !text-xs cursor-pointer">Save Category</button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(c => (
          <div key={c.id} className="card-base p-5 bg-white border border-[#D4AF37]/20 shadow-sm flex flex-col justify-between group hover:border-[#D4AF37] transition-all">
            <div>
              <div className="h-40 rounded-xl overflow-hidden mb-4 relative bg-[#FFF8F0]">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {c.count} Weaves
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#7B1E3A] m-0 group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: 'Playfair Display' }}>
                {c.name}
              </h3>
              <p className="text-xs text-[#6B4A48] m-0 mt-1 font-light">Authentic Indian Handloom Cluster</p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#D4AF37]/15 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#2D8F5E]">✓ Active Collection</span>
              <button onClick={() => alert(`Edit category: ${c.name}`)} className="text-xs text-[#D4AF37] hover:text-[#7B1E3A] cursor-pointer bg-transparent border-none p-0 flex items-center gap-1 font-semibold">
                <FiEdit2 size={13} /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSettings() {
  const [settings, setSettings] = useState({
    autoApproveSilkMark: true,
    emailNotifications: true,
    maintenanceMode: false,
    commissionRate: '0',
    platformName: 'Vasthra Cotton Luxury Marketplace',
    supportEmail: 'concierge@vasthracotton.com'
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Platform ecosystem configuration updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-[#D4AF37]/20">
        <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ System Configuration</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Marketplace Settings</h1>
      </div>

      <motion.form initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="card-base p-6 sm:p-8 bg-white border border-[#D4AF37]/20 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-[#7B1E3A] uppercase tracking-wider pb-3 border-b border-[#D4AF37]/15 flex items-center gap-2 m-0">
            <FiSliders className="text-[#D4AF37]" /> General Ecosystem Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Platform Title</label>
              <input type="text" value={settings.platformName} onChange={e => setSettings({ ...settings, platformName: e.target.value })} className="input-field !h-12 !text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Concierge Support Email</label>
              <input type="email" value={settings.supportEmail} onChange={e => setSettings({ ...settings, supportEmail: e.target.value })} className="input-field !h-12 !text-sm" />
            </div>
          </div>
        </div>

        {/* Weaver & Commission Rules */}
        <div className="card-base p-6 sm:p-8 bg-white border border-[#D4AF37]/20 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-[#7B1E3A] uppercase tracking-wider pb-3 border-b border-[#D4AF37]/15 flex items-center gap-2 m-0">
            <FiShield className="text-[#D4AF37]" /> Weaver Commission & Verification Rules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Weaver Onboarding Commission (%)</label>
              <select value={settings.commissionRate} onChange={e => setSettings({ ...settings, commissionRate: e.target.value })} className="select-field !h-12 !text-sm font-bold text-[#2D8F5E]">
                <option value="0">0% (Special Handloom Promotion Tier)</option>
                <option value="5">5% Standard Marketplace Fee</option>
                <option value="10">10% Premium Concierge Tier</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#FFF8F0] rounded-xl border border-[#D4AF37]/30">
              <div>
                <span className="text-sm font-bold text-[#7B1E3A] block">Silk Mark Fast-Track</span>
                <span className="text-xs text-[#6B4A48] font-light">Auto-approve sarees from verified Silk Mark houses</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoApproveSilkMark}
                onChange={e => setSettings({ ...settings, autoApproveSilkMark: e.target.checked })}
                className="w-5 h-5 accent-[#7B1E3A] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Notifications & System State */}
        <div className="card-base p-6 sm:p-8 bg-white border border-[#D4AF37]/20 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-[#7B1E3A] uppercase tracking-wider pb-3 border-b border-[#D4AF37]/15 flex items-center gap-2 m-0">
            <FiBell className="text-[#D4AF37]" /> Notifications & Maintenance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-[#FFF8F0] rounded-xl border border-[#D4AF37]/30">
              <div>
                <span className="text-sm font-bold text-[#7B1E3A] block">Instant Weaver Alerts</span>
                <span className="text-xs text-[#6B4A48] font-light">Send email & SMS upon new order dispatch</span>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={e => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5 accent-[#7B1E3A] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50/70 rounded-xl border border-red-200">
              <div>
                <span className="text-sm font-bold text-red-800 block">Maintenance Mode</span>
                <span className="text-xs text-red-600 font-light">Temporarily pause checkout during system updates</span>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-5 h-5 accent-red-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="btn-golden !py-3.5 !px-10 !text-sm cursor-pointer shadow-lg inline-flex items-center gap-2">
            <FiSave size={18} /> Save Ecosystem Settings
          </button>
        </div>
      </motion.form>
    </div>
  );
}

