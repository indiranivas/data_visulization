import React from 'react';
import { motion } from 'framer-motion';

interface DepartmentSelectorProps {
  departments: string[];
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  departments,
  selectedDepartment,
  onDepartmentChange
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-3 text-slate-700 dark:text-slate-200">
        Select Department
      </h2>
      <div className="flex flex-wrap gap-2">
        {departments.map(department => (
          <button
            key={department}
            onClick={() => onDepartmentChange(department)}
            className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedDepartment === department
                ? 'text-white'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {selectedDepartment === department && (
              <motion.div
                layoutId="departmentBg"
                className="absolute inset-0 bg-blue-600 dark:bg-blue-700 rounded-lg"
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{department}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DepartmentSelector;