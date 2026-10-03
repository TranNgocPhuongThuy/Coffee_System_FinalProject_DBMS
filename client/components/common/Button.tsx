import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  variant = 'primary',
  fullWidth = true,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'py-3 px-4 rounded-xl font-semibold text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-[#6F4E37] hover:bg-[#5A3F2C] text-white disabled:bg-[#A89485]',
    secondary: 'bg-[#F5EBE6] hover:bg-[#EBDCD3] text-[#6F4E37] disabled:opacity-50',
    outline: 'border border-[#6F4E37] text-[#6F4E37] hover:bg-[#F5EBE6] disabled:opacity-50',
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Đang xử lý...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

