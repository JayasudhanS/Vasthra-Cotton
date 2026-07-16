import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiX, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

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

export function formatShortId(id) {
  if (!id) return 'ID: #N/A';
  const str = String(id).trim();
  if (str.length <= 8) return `ID: #${str.toUpperCase()}`;
  return `ID: #${str.slice(-6).toUpperCase()}`;
}

export function AdminProductDisplayCard({
  product,
  allShops = [],
  allUsers = [],
  pendingShops = [],
  actions = null,
  onApprove = null,
  onReject = null,
  onEdit = null,
  onDelete = null
}) {
  const { shopName, shopLogo, ownerName } = resolveShopInfo(product, allShops, allUsers, pendingShops);
  
  const statusStr = (product.status || '').toString().trim().toLowerCase();
  const isApproved = statusStr === 'approved';
  const isRejected = statusStr === 'rejected';
  const isPendingEdit = Boolean(product.pendingEdit && product.pendingEdit.editStatus === 'pending');
  const isPending = statusStr === 'pending' || isPendingEdit || (!isApproved && !isRejected);

  const badgeColor = isApproved ? 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]' :
                     isRejected ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]' :
                     'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
                     
  const badgeText = isApproved ? 'Approved' :
                    isRejected ? 'Rejected' :
                    isPendingEdit ? 'Pending Edit' :
                    'Pending';

  const uploadDate = product.date || (product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently');
  const shortId = formatShortId(product.id);

  return (
    <div className="card-base bg-white border border-[#D4AF37]/30 shadow-sm hover:shadow-md transition-all rounded-2xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden h-full">
      <div className="relative">
        {/* Optional top right small tools if onEdit/onDelete passed alongside 3-button action bar */}
        {(onEdit || onDelete) && (
          <div className="absolute top-0 right-0 flex items-center gap-1.5 z-10">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(product)}
                title="Edit Price/Details"
                className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center cursor-pointer border border-blue-200 hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
              >
                <FiEdit2 size={13} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => { if (window.confirm('Delete this saree completely?')) onDelete(product.id); }}
                title="Delete Saree"
                className="w-7 h-7 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center cursor-pointer border border-gray-200 hover:bg-gray-600 hover:text-white transition-all shadow-2xs"
              >
                <FiTrash2 size={13} />
              </button>
            )}
          </div>
        )}

        {/* LEFT SIDE Image + RIGHT SIDE Details */}
        <div className="flex flex-row gap-3.5 sm:gap-4 lg:gap-5 items-start mb-4">
          {/* Left Side: Product Image (100x100 desktop, 80x80 mobile) */}
          <div className="flex-shrink-0">
            <img
              src={product.thumbnail || product.image || product.imageUrl || product.images?.[0] || 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=150'}
              alt={product.name}
              className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-xl object-cover border border-[#D4AF37]/40 shadow-2xs bg-[#FFF8F0]"
            />
          </div>

          {/* Right Side: Details */}
          <div className="flex-1 min-w-0 flex flex-col gap-1 sm:gap-1.5">
            {/* Product Name (Largest text) + Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pr-12 sm:pr-0">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#7B1E3A] m-0 leading-tight truncate" style={{ fontFamily: 'Playfair Display' }}>
                {product.name}
              </h3>
              <span className={`inline-flex items-center self-start sm:self-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${badgeColor}`}>
                {badgeText}
              </span>
            </div>

            {/* Product ID (shortened version) */}
            <p className="text-xs text-gray-500 font-medium m-0 truncate" title={`Complete ID: ${product.id}`}>
              {shortId}
            </p>

            {/* Shop Owner Information */}
            <div className="flex items-center gap-2 mt-1 bg-[#FFF8F0]/90 p-2 sm:p-2.5 rounded-xl border border-[#D4AF37]/20">
              <img
                src={shopLogo}
                alt={shopName}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#D4AF37] shadow-2xs flex-shrink-0 bg-white"
              />
              <div className="min-w-0 flex-1 leading-snug">
                <span className="text-xs sm:text-sm font-bold text-[#7B1E3A] truncate block">
                  {shopName}
                </span>
                <span className="text-[11px] sm:text-xs text-[#6B4A48] font-medium truncate block">
                  Owner: <strong className="text-[#4A2C2A] font-bold">{ownerName}</strong>
                </span>
              </div>
            </div>

            {/* Uploaded Date & Status row */}
            <div className="flex items-center justify-between gap-2 text-xs text-[#6B4A48] pt-1">
              <div className="truncate">
                <span className="text-[11px] text-gray-500 mr-1">Uploaded:</span>
                <span className="font-semibold text-[#4A2C2A]">{uploadDate}</span>
              </div>
              <div>
                <span className="text-[11px] text-gray-500 mr-1">Status:</span>
                <span className="font-bold text-[#7B1E3A]">{badgeText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      {actions ? (
        <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-end gap-2 mt-auto flex-wrap">
          {actions}
        </div>
      ) : (onApprove || onReject || isPending) ? (
        <div className="pt-3.5 border-t border-[#D4AF37]/20 grid grid-cols-3 gap-2 sm:gap-2.5 w-full mt-auto">
          <button
            type="button"
            onClick={() => onApprove ? onApprove(product.id) : null}
            className="h-10 sm:h-11 rounded-xl bg-[#2D8F5E] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1 cursor-pointer hover:bg-[#23744b] transition-all shadow-2xs active:scale-98"
          >
            <FiCheck size={15} /> <span>Approve</span>
          </button>
          <button
            type="button"
            onClick={() => onReject ? onReject(product.id) : null}
            className="h-10 sm:h-11 rounded-xl bg-red-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1 cursor-pointer hover:bg-red-700 transition-all shadow-2xs active:scale-98"
          >
            <FiX size={15} /> <span>Reject</span>
          </button>
          <Link
            to={`/product/${product.id}`}
            target="_blank"
            className="h-10 sm:h-11 rounded-xl bg-[#FFF8F0] text-[#7B1E3A] border border-[#D4AF37]/40 text-xs sm:text-sm font-bold flex items-center justify-center gap-1 cursor-pointer hover:bg-[#D4AF37]/20 transition-all no-underline shadow-2xs active:scale-98"
          >
            <FiEye size={15} /> <span>View Details</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
