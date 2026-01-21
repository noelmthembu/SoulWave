import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-bold text-gray-300 mb-2 ml-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className="w-full px-4 py-3 bg-brand-dark/80 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition"
        {...props}
      />
    </div>
  );
};

export default Input;