import React from 'react';
import { motion } from 'framer-motion';
import { BarChart } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }} 
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-6 inline-block"
        >
          <BarChart size={64} className="text-blue-600 dark:text-blue-400" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold text-slate-800 dark:text-white mb-2"
        >
          Placement Analytics
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-slate-600 dark:text-slate-300 mb-8"
        >
          Loading placement data...
        </motion.p>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="h-1 bg-blue-500 rounded-full w-64 mx-auto"
        />
      </motion.div>
    </div>
  );
};