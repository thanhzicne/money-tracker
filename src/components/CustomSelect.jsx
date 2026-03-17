import React, { useState, useRef, useEffect } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  icon: Icon, 
  placeholder = 'Chọn một mục', 
  className = '',
  menuClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none transition-all shadow-sm hover:border-emerald-500/30 group ${isOpen ? 'ring-4 ring-emerald-500/10 border-emerald-500/50' : ''}`}
      >
        <div className="flex items-center gap-3 truncate">
          {Icon && <Icon className="text-emerald-500 shrink-0" size={18} />}
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate text-zinc-700 dark:text-zinc-200">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <MdKeyboardArrowDown 
          className={`text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 z-50 glass rounded-2xl overflow-hidden shadow-2xl border border-white/40 dark:border-zinc-800/50 animate-fade-in max-h-64 overflow-y-auto custom-scrollbar ${menuClassName}`}>
          <div className="p-1.5">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${
                  value === option.value 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {option.icon && <span className="shrink-0">{option.icon}</span>}
                <span className="truncate">{option.label}</span>
                {value === option.value && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
