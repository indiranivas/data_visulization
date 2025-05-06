import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import { DepartmentStats } from '../../types';

interface KPICardsProps {
  stats: DepartmentStats;
}

const KPICards: React.FC<KPICardsProps> = ({ stats }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const kpiData = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: <Users className="text-blue-500" />,
      color: 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Placed Students',
      value: stats.placedStudents,
      icon: <CheckCircle className="text-green-500" />,
      color: 'from-green-50 to-green-100 dark:from-green-950 dark:to-green-900',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Placement Rate',
      value: `${stats.placementPercentage.toFixed(1)}%`,
      icon: <TrendingUp className="text-purple-500" />,
      color: 'from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Average Salary',
      value: formatCurrency(stats.averageSalary),
      icon: <DollarSign className="text-teal-500" />,
      color: 'from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900',
      textColor: 'text-teal-600 dark:text-teal-400'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {kpiData.map((kpi, index) => (
        <motion.div
          key={index}
          variants={item}
          className={`bg-gradient-to-br ${kpi.color} rounded-xl p-6 shadow-sm`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-1">{kpi.title}</p>
              <motion.h3 
                className={`text-2xl font-bold ${kpi.textColor}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  delay: 0.2 + index * 0.1
                }}
              >
                {kpi.value}
              </motion.h3>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 shadow-sm">
              {kpi.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default KPICards;