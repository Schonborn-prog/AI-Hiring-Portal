import React from 'react';
import { motion } from 'framer-motion';
// FIX: Add 'type' here so Vite knows not to look for a real JS object
import type { HTMLMotionProps } from 'framer-motion'; 
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Card Component ---
interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl hover:shadow-orange-500/10 transition-shadow duration-300", 
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);

// --- Button Component ---
interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyle = "px-6 py-3 rounded-xl font-bold transition-all duration-300 transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/50 border border-orange-400/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-orange-500/50",
    outline: "bg-transparent border-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={cn(baseStyle, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// --- Input Component ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="text-xs text-slate-400 font-bold ml-1 uppercase tracking-wider">{label}</label>}
    <input 
      className={cn(
        "bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-600",
        className
      )}
      {...props}
    />
  </div>
);

// --- TextArea Component ---
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className, ...props }) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="text-xs text-slate-400 font-bold ml-1 uppercase tracking-wider">{label}</label>}
    <textarea 
      className={cn(
        "bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-600 min-h-[120px]",
        className
      )}
      {...props}
    />
  </div>
);