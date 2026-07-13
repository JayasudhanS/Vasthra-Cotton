import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiUploadCloud, FiCheckCircle, FiPlus, FiAlertCircle, FiX, FiImage, FiSearch, FiChevronDown } from 'react-icons/fi';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db, COLLECTIONS } from '../../firebase/config';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { uploadToCloudinary, validateImageFile, getCloudinaryThumbnail } from '../../utils/cloudinaryUpload';

export const PREDEFINED_WEAVES = [
  'Pure Silk',
  'Kanjivaram Silk',
  'Banarasi Silk',
  'Chiffon',
  'Georgette',
  'Cotton Silk',
  'Organza',
  'Tussar Silk',
  'Linen',
  'Handloom Cotton',
  'Mysore Silk',
  'Soft Silk',
  'Tissue Silk',
  'Chanderi',
  'Crepe',
  'Art Silk',
  'Semi Silk',
  'Designer Saree'
];

export default function AddProduct() {
  const { addProduct } = useProducts();
  const { user } = useAuth();
  
  // File upload refs & states
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    offerPrice: '',
    stock: '',
    description: '',
    fabric: 'Pure Silk',
    color: 'Gold',
    zariType: 'Pure Zari'
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Regional Category (Weave) Dropdown State
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Multi-image upload state (up to 3 images)
  // Each item: { id: string, file: File, previewUrl: string, name: string, size: number }
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgresses, setUploadProgresses] = useState({});
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [replaceTargetId, setReplaceTargetId] = useState(null);

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Close weave dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectWeave = (weaveName) => {
    setForm(prev => ({ ...prev, category: weaveName }));
    setDropdownOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!dropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setDropdownOpen(true);
        setActiveIdx(form.category ? PREDEFINED_WEAVES.indexOf(form.category) : 0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(prev => (prev + 1) % PREDEFINED_WEAVES.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(prev => (prev - 1 + PREDEFINED_WEAVES.length) % PREDEFINED_WEAVES.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (activeIdx >= 0 && activeIdx < PREDEFINED_WEAVES.length) {
        handleSelectWeave(PREDEFINED_WEAVES[activeIdx]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setDropdownOpen(false);
    }
  };

  // Process and add validated files up to limit of 3
  const processAndAddFiles = useCallback((files) => {
    setImageError('');
    if (!files || files.length === 0) return;

    const currentCount = selectedFiles.length;
    if (currentCount >= 3) {
      setImageError('You can upload a maximum of 3 images per product.');
      return;
    }

    const availableSlots = 3 - currentCount;
    const filesToProcess = Array.from(files).slice(0, availableSlots);

    if (files.length > availableSlots) {
      setImageError(`Only ${availableSlots} more image(s) allowed. Maximum is 3 images.`);
    }

    filesToProcess.forEach(file => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setImageError(validation.error);
        return;
      }

      const id = Math.random().toString(36).substring(2, 9) + Date.now();
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFiles(prev => {
          if (prev.length >= 3) return prev;
          return [...prev, {
            id,
            file,
            previewUrl: reader.result,
            name: file.name,
            size: file.size
          }];
        });
      };
      reader.readAsDataURL(file);
    });
  }, [selectedFiles.length]);

  const handleInputChange = (e) => {
    if (e.target.files) {
      processAndAddFiles(e.target.files);
      e.target.value = ''; // Reset input to allow re-selecting same files
    }
  };

  const handleRemoveImage = (idToRemove) => {
    setSelectedFiles(prev => prev.filter(item => item.id !== idToRemove));
    setImageError('');
    setUploadProgresses(prev => {
      const updated = { ...prev };
      delete updated[idToRemove];
      return updated;
    });
  };

  // Individual image replacement
  const handleReplaceClick = (idToReplace) => {
    setReplaceTargetId(idToReplace);
    replaceInputRef.current?.click();
  };

  const handleReplaceInputChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !replaceTargetId) return;

    setImageError('');
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setImageError(validation.error);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFiles(prev => prev.map(item => {
        if (item.id === replaceTargetId) {
          return {
            ...item,
            file,
            previewUrl: reader.result,
            name: file.name,
            size: file.size
          };
        }
        return item;
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
    setReplaceTargetId(null);
  };

  // Drag & drop handlers
  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processAndAddFiles(e.dataTransfer.files);
    }
  };

  const openFilePicker = () => {
    if (selectedFiles.length >= 3) {
      setImageError('Maximum limit of 3 images reached. Remove an image to add a different one.');
      return;
    }
    fileInputRef.current?.click();
  };

  // Calculate total combined upload progress
  const totalProgress = selectedFiles.length > 0
    ? Math.round(
        selectedFiles.reduce((acc, item) => acc + (uploadProgresses[item.id] || 0), 0) / selectedFiles.length
      )
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category) {
      setImageError('Please select a Regional Weave Category from the dropdown.');
      return;
    }

    if (selectedFiles.length === 0) {
      setImageError('Please upload at least 1 photograph (up to 3) before submitting.');
      return;
    }

    setSubmitting(true);
    setUploading(true);
    setUploadProgresses({});
    setImageError('');

    try {
      // 1. Upload all selected images to Cloudinary in parallel or sequentially with exact error handling
      const uploadPromises = selectedFiles.map(async (item) => {
        const result = await uploadToCloudinary(item.file, (progress) => {
          setUploadProgresses(prev => ({ ...prev, [item.id]: progress }));
        });
        return result.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      setUploading(false);

      // 2. Create Firestore product document only after all Cloudinary uploads succeed
      const productRef = doc(collection(db, COLLECTIONS.PRODUCTS));
      const primaryUrl = uploadedUrls[0];
      const productData = {
        id: productRef.id,
        name: form.name,
        category: form.category,
        fabric: form.fabric,
        zariType: form.zariType,
        color: form.color,
        price: Number(form.price) || 0,
        offerPrice: Number(form.offerPrice || form.price) || 0,
        stock: Number(form.stock) || 0,
        description: form.description,
        images: uploadedUrls, // Array of up to 3 Cloudinary URLs
        imageUrl: primaryUrl,
        image: primaryUrl,
        thumbnail: getCloudinaryThumbnail(primaryUrl),
        shopName: user?.shopName || user?.name || '',
        ownerName: user?.name || '',
        ownerId: user?.uid || user?.id || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      };

      await setDoc(productRef, productData);

      // 3. Update ProductContext state
      addProduct({
        ...productData,
        id: productRef.id,
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Product submission or upload error:', error);
      setImageError(error.message || 'Image upload failed. Product creation cancelled. Please try again.');
      setUploading(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-base p-12 text-center max-w-lg mx-auto my-12 bg-white border-2 border-[#2D8F5E]/30 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-[#2D8F5E]/10 text-[#2D8F5E] flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
          <FiCheckCircle />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] mb-2" style={{ fontFamily: 'Playfair Display' }}>
          Masterpiece Submitted!
        </h2>
        <span className="badge badge-warning text-xs font-bold px-4 py-1.5 mt-2">
          ⏳ Pending Quality Check & Silk Mark Verification
        </span>
        <p className="text-sm text-[#6B4A48] mt-4 leading-relaxed font-light">
          Your saree <strong className="text-[#7B1E3A] font-semibold">"{form.name}"</strong> with {selectedFiles.length} photograph(s) has been queued for admin review. Once verified, it will be live across all regional collections.
        </p>
        <div className="pt-6 mt-6 border-t border-[#D4AF37]/20 flex gap-4 justify-center">
          <button onClick={() => {
            setSubmitted(false);
            setForm({ name: '', category: '', price: '', offerPrice: '', stock: '', description: '', fabric: 'Pure Silk', color: 'Gold', zariType: 'Pure Zari' });
            setSelectedFiles([]);
            setImageError('');
            setUploadProgresses({});
          }} className="btn-golden !py-3 !px-6 !text-xs cursor-pointer shadow-md inline-flex items-center gap-2">
            <FiPlus /> Add Another Weave
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="mb-8 pb-4 border-b border-[#D4AF37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
            ✦ Weaver Catalogue Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>
            Add New Royal Saree
          </h1>
        </div>
        <span className="text-xs text-[#6B4A48] bg-[#FFF8F0] px-4 py-2 rounded-xl border border-[#D4AF37]/30 flex items-center gap-2 w-fit">
          <FiAlertCircle className="text-[#D4AF37]" /> Silk Mark Certification Required
        </span>
      </div>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} onSubmit={handleSubmit}
        className="card-base p-8 sm:p-10 space-y-8 bg-white border border-[#D4AF37]/20 shadow-lg">
        
        {/* Basic Details */}
        <div>
          <h3 className="text-base font-bold text-[#7B1E3A] uppercase tracking-wider mb-4 pb-2 border-b border-[#D4AF37]/15">
            1. Weave Details & Title
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Saree Title / Masterpiece Name *</label>
              <input type="text" required value={form.name} onChange={upd('name')} placeholder="e.g. Traditional Pure Kanjivaram Bridal Silk Saree with Crimson Zari Border" className="input-field !h-12 !text-sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Regional Category (Weave) Dropdown matching Reference Screenshot */}
              <div ref={dropdownRef} className="relative">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Regional Category (Weave) *</label>
                <div
                  tabIndex={0}
                  role="combobox"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="listbox"
                  onClick={() => {
                    if (!dropdownOpen) setActiveIdx(form.category ? PREDEFINED_WEAVES.indexOf(form.category) : 0);
                    setDropdownOpen(!dropdownOpen);
                  }}
                  onKeyDown={handleKeyDown}
                  className={`input-field !h-12 !text-sm flex items-center justify-between cursor-pointer select-none bg-white transition-all ${
                    dropdownOpen ? 'border-[#7B1E3A] ring-2 ring-[#7B1E3A]/15' : ''
                  }`}
                >
                  <span className={form.category ? 'text-[#4A2C2A] font-medium truncate' : 'text-gray-400'}>
                    {form.category || 'Select Weave Option'}
                  </span>
                  <FiChevronDown className={`text-[#7B1E3A] transition-transform duration-200 flex-shrink-0 ml-2 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.ul
                      role="listbox"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-[#1976D2] rounded-lg shadow-2xl max-h-72 overflow-y-auto py-1 select-none focus:outline-none scroll-smooth"
                    >
                      {PREDEFINED_WEAVES.map((weaveName, index) => {
                        const isSelected = form.category === weaveName;
                        const isHighlighted = activeIdx === index || isSelected;
                        return (
                          <li
                            key={weaveName}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => handleSelectWeave(weaveName)}
                            onMouseEnter={() => setActiveIdx(index)}
                            className={`px-4 py-2.5 text-sm sm:text-[15px] cursor-pointer transition-colors flex items-center justify-between font-medium leading-normal ${
                              isSelected
                                ? 'bg-[#1976D2] text-white font-semibold'
                                : isHighlighted
                                  ? 'bg-[#1976D2] text-white'
                                  : 'text-[#4A2C2A] hover:bg-[#1976D2] hover:text-white'
                            }`}
                          >
                            <span className="truncate">{weaveName}</span>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Primary Fabric *</label>
                <select value={form.fabric} onChange={upd('fabric')} className="select-field !h-12 !text-sm">
                  {['Pure Silk', 'Kanjivaram Silk', 'Banarasi Silk', 'Chiffon', 'Georgette', 'Cotton Silk', 'Organza', 'Tussar Silk', 'Linen', 'Handloom Cotton'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Zari Type</label>
                <select value={form.zariType} onChange={upd('zariType')} className="select-field !h-12 !text-sm">
                  {['Pure Zari', 'Half Fine Zari', 'Tested Zari', 'Antique Gold Zari', 'Silver Zari', 'No Zari'].map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div>
          <h3 className="text-base font-bold text-[#7B1E3A] uppercase tracking-wider mb-4 pb-2 border-b border-[#D4AF37]/15">
            2. Pricing & Inventory
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Original MRP (₹) *</label>
              <input type="number" required value={form.price} onChange={upd('price')} placeholder="e.g. 18000" className="input-field !h-12 !text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Offer Price (₹) *</label>
              <input type="number" required value={form.offerPrice || form.price} onChange={upd('offerPrice')} placeholder="e.g. 14500" className="input-field !h-12 !text-sm font-semibold text-[#2D8F5E]" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Available Stock (Weaves) *</label>
              <input type="number" required value={form.stock} onChange={upd('stock')} placeholder="e.g. 5" className="input-field !h-12 !text-sm" />
            </div>
          </div>
        </div>

        {/* Description & Care */}
        <div>
          <h3 className="text-base font-bold text-[#7B1E3A] uppercase tracking-wider mb-4 pb-2 border-b border-[#D4AF37]/15">
            3. Craftsmanship & Description
          </h3>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Detailed Description & Motif Story *</label>
            <textarea
              required
              value={form.description}
              onChange={upd('description')}
              rows={4}
              placeholder="Describe the weaving technique, motif inspiration (e.g. Peacock, Lotus), border style, and blouse piece specifications..."
              className="textarea-field !text-sm"
            />
          </div>
        </div>

        {/* Multiple Image Upload (up to 3 images) */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#D4AF37]/15">
            <h3 className="text-base font-bold text-[#7B1E3A] uppercase tracking-wider m-0">
              4. High-Resolution Photographs
            </h3>
            <span className="text-xs font-semibold text-[#6B4A48] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#D4AF37]/30">
              {selectedFiles.length} of 3 Selected
            </span>
          </div>

          {/* Hidden file input for multi addition */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleInputChange}
            className="hidden"
            id="saree-multi-upload"
          />

          {/* Hidden file input for single item replacement */}
          <input
            ref={replaceInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleReplaceInputChange}
            className="hidden"
            id="saree-single-replace"
          />

          {/* Grid of existing selected thumbnails + Dropzone if < 3 */}
          <div className="space-y-4">
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {selectedFiles.map((item, index) => (
                  <div key={item.id} className="relative rounded-2xl border-2 border-[#D4AF37]/40 bg-[#FFF8F0]/30 overflow-hidden group flex flex-col justify-between">
                    <div className="relative h-44 w-full overflow-hidden bg-white flex items-center justify-center">
                      <img
                        src={item.previewUrl}
                        alt={`Saree preview ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                      {/* Primary label for first image */}
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-[#7B1E3A] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                          Main Display
                        </span>
                      )}
                      {/* Hover / Overlay controls for Replace & Remove */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleReplaceClick(item.id)}
                          className="w-10 h-10 rounded-xl bg-white/95 text-[#7B1E3A] flex items-center justify-center cursor-pointer border-none shadow-md hover:scale-105 transition-all"
                          title="Replace this image"
                        >
                          <FiImage size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(item.id)}
                          className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center cursor-pointer border-none shadow-md hover:bg-red-700 hover:scale-105 transition-all"
                          title="Remove this image"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Info bar */}
                    <div className="px-3 py-2.5 bg-[#FFF8F0] border-t border-[#D4AF37]/20 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#7B1E3A] truncate max-w-[65%]" title={item.name}>
                        {index + 1}. {item.name}
                      </span>
                      <span className="text-[#6B4A48] font-mono">
                        {(item.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>

                    {/* Per-item upload progress bar */}
                    {uploading && (
                      <div className="h-1.5 w-full bg-[#D4AF37]/20">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#2D8F5E]"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgresses[item.id] || 0}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* Add more button tile if less than 3 */}
                {selectedFiles.length < 3 && !uploading && (
                  <div
                    onClick={openFilePicker}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="h-full min-h-[220px] rounded-2xl border-2 border-dashed border-[#D4AF37]/40 bg-[#FFF8F0]/20 hover:bg-[#FFF8F0]/60 hover:border-[#D4AF37] transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                      <FiPlus size={24} />
                    </div>
                    <span className="text-xs font-bold text-[#7B1E3A]">Add Photo ({selectedFiles.length}/3)</span>
                    <span className="text-[10px] text-[#6B4A48]/70 mt-1">Tap or drop image</span>
                  </div>
                )}
              </div>
            )}

            {/* If 0 images selected, show large primary dropzone */}
            {selectedFiles.length === 0 && (
              <div
                onClick={openFilePicker}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-3.5 p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center group ${
                  isDragging
                    ? 'border-[#7B1E3A] bg-[#7B1E3A]/5 scale-[1.01]'
                    : 'border-[#D4AF37]/40 bg-[#FFF8F0]/30 hover:bg-[#FFF8F0]/70 hover:border-[#D4AF37]'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform shadow-sm ${
                  isDragging
                    ? 'bg-[#7B1E3A]/10 text-[#7B1E3A] scale-110 rotate-3'
                    : 'bg-[#D4AF37]/10 text-[#D4AF37] group-hover:scale-110 group-hover:rotate-3'
                }`}>
                  <FiUploadCloud size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#7B1E3A] m-0">
                    {isDragging ? 'Drop your images here (up to 3)' : 'Click to upload or drag & drop up to 3 saree photographs'}
                  </p>
                  <p className="text-xs text-[#6B4A48]/80 m-0 mt-1.5">
                    Includes drape, pallu, and zari closeup (JPG, PNG, WEBP max 10MB each)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {imageError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2"
            >
              <FiAlertCircle size={14} className="flex-shrink-0" />
              {imageError}
            </motion.div>
          )}
        </div>

        <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row gap-4 justify-end items-center">
          {uploading && (
            <span className="text-xs font-semibold text-[#7B1E3A] animate-pulse">
              Uploading images to Cloudinary ({totalProgress}% average)...
            </span>
          )}
          <div className="flex gap-4 w-full sm:w-auto justify-end">
            <button type="button" onClick={() => window.history.back()} className="btn-outline-maroon !py-3.5 !px-8 !text-sm justify-center">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="btn-golden !py-3.5 !px-10 !text-sm cursor-pointer shadow-lg justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <><span className="inline-block w-4 h-4 border-2 border-[#4A2C2A]/30 border-t-[#4A2C2A] rounded-full animate-spin mr-2" /> Uploading...</>
              ) : submitting ? (
                <><span className="inline-block w-4 h-4 border-2 border-[#4A2C2A]/30 border-t-[#4A2C2A] rounded-full animate-spin mr-2" /> Saving...</>
              ) : (
                <><FiSave size={18} /> Submit Masterpiece for Review</>
              )}
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
