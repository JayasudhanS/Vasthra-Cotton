import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import NativeSelectModal from './NativeSelectModal';

export default function NativeSelectField({ label, options, value, onChange, placeholder = 'Select an option' }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (val) => {
    // Call the onChange function mocking an event so it works seamlessly with existing handlers like `e => setForm({...})`
    if (onChange) {
      onChange({ target: { value: val } });
    }
  };

  return (
    <>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">{label}</label>
        <div
          onClick={() => setIsOpen(true)}
          className="input-field !h-12 !text-sm flex items-center justify-between cursor-pointer select-none bg-white transition-all hover:border-[#7B1E3A]/50"
        >
          <span className={value ? 'text-[#4A2C2A] font-medium truncate' : 'text-gray-400'}>
            {value || placeholder}
          </span>
          <FiChevronDown className="text-[#7B1E3A] flex-shrink-0 ml-2" />
        </div>
      </div>

      <NativeSelectModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={label.replace(' *', '')}
        options={options}
        value={value}
        onChange={handleSelect}
      />
    </>
  );
}
