import React from 'react';

export function resolveShopInfo(p, allShops = [], allUsers = [], pendingShops = []) {
  // 1. Match by exact ID or UID
  let shopDoc = allShops.find(s => (s.id && s.id === p.shopId) || (s.uid && s.uid === p.shopId) || (s.id && s.id === p.ownerId) || (s.uid && s.uid === p.ownerId));
  if (!shopDoc) {
    shopDoc = pendingShops.find(s => (s.id && s.id === p.shopId) || (s.uid && s.uid === p.shopId) || (s.id && s.id === p.ownerId) || (s.uid && s.uid === p.ownerId));
  }
  if (!shopDoc) {
    // 2. Match across all registered users whose role is shopkeeper / shopOwner
    shopDoc = allUsers.find(u => (u.role === 'shopOwner' || u.role === 'shopkeeper') && ((u.id && (u.id === p.shopId || u.id === p.ownerId)) || (u.uid && (u.uid === p.shopId || u.uid === p.ownerId))));
  }
  if (!shopDoc && p.shopName) {
    // 3. Match by shop name if IDs didn't resolve directly
    const lowerName = p.shopName.toString().trim().toLowerCase();
    shopDoc = allShops.find(s => (s.shopName || s.name || '').toString().trim().toLowerCase() === lowerName) ||
              pendingShops.find(s => (s.shopName || s.name || '').toString().trim().toLowerCase() === lowerName) ||
              allUsers.find(u => (u.role === 'shopOwner' || u.role === 'shopkeeper') && (u.shopName || u.name || '').toString().trim().toLowerCase() === lowerName);
  }

  const shopName = shopDoc?.shopName || shopDoc?.name || p.shopName || 'Weaver Studio Partner';
  const shopLogo = shopDoc?.shopLogo || shopDoc?.logo || shopDoc?.profileImage || 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=150';
  const ownerName = shopDoc?.ownerName || shopDoc?.owner || shopDoc?.name || p.ownerName || 'Verified Artisan';
  const shopStatus = shopDoc?.status || 'Active';

  return { shopName, shopLogo, ownerName, shopStatus, shopDoc };
}

export function AdminProductDisplayCard({ product, allShops = [], allUsers = [], pendingShops = [], actions = null }) {
  const { shopName, shopLogo, ownerName, shopStatus } = resolveShopInfo(product, allShops, allUsers, pendingShops);
  
  const statusStr = (product.status || '').toString().trim().toLowerCase();
  const isApproved = statusStr === 'approved';
  const isRejected = statusStr === 'rejected';
  const isPendingEdit = Boolean(product.pendingEdit && product.pendingEdit.editStatus === 'pending');

  const badgeColor = isApproved ? 'bg-[#2D8F5E] text-white border-[#2D8F5E]' :
                     isRejected ? 'bg-red-600 text-white border-red-600' :
                     isPendingEdit ? 'bg-blue-600 text-white border-blue-600' :
                     'bg-[#D4AF37] text-[#4A2C2A] border-[#D4AF37]';
                     
  const badgeText = isApproved ? 'Approved' :
                    isRejected ? 'Rejected' :
                    isPendingEdit ? 'Pending Review' :
                    'Pending Review';

  const uploadDate = product.date || (product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently');

  return (
    <div className="card-base bg-white border border-[#D4AF37]/30 shadow-sm hover:shadow-md transition-all rounded-2xl p-5 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top bar: Product Image & Name + Badge */}
        <div className="flex items-start gap-3.5 mb-4 pb-4 border-b border-[#D4AF37]/15">
          <img
            src={product.thumbnail || product.image || product.imageUrl}
            alt={product.name}
            className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl object-cover border border-[#D4AF37]/40 shadow-xs flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1.5 shadow-xs ${badgeColor}`}>
              {badgeText}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#7B1E3A] m-0 leading-snug break-words" style={{ fontFamily: 'Playfair Display' }}>
              {product.name}
            </h3>
            <p className="text-xs font-semibold text-[#6B4A48]/80 m-0 mt-1 truncate">
              ID: #{product.id} · {product.category || 'Pure Silk'}
            </p>
          </div>
        </div>

        {/* Shop & Owner Info Block (Large and bold as requested) */}
        <div className="bg-[#FFF8F0]/80 rounded-xl p-3.5 border border-[#D4AF37]/25 mb-4 space-y-2.5">
          <div className="flex items-center gap-3">
            <img
              src={shopLogo}
              alt={shopName}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37] shadow-xs flex-shrink-0 bg-white"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${shopStatus.toLowerCase() === 'active' || shopStatus.toLowerCase() === 'approved' ? 'bg-[#2D8F5E]' : 'bg-[#D4AF37]'}`} />
                <span className="text-sm sm:text-base font-bold text-[#7B1E3A] truncate block leading-tight">
                  {shopName}
                </span>
              </div>
              <span className="text-xs text-[#6B4A48] font-medium truncate block mt-0.5">
                Owner : <strong className="text-[#4A2C2A] font-bold text-xs sm:text-sm">{ownerName}</strong>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#D4AF37]/15 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B4A48]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">Uploaded :</span>
              <span className="font-semibold text-[#4A2C2A]">{uploadDate}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">Status :</span>
              <span className="font-bold text-[#7B1E3A]">{badgeText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons inside card */}
      {actions && (
        <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-end gap-2 mt-auto flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}
