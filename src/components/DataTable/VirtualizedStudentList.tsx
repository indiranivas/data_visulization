import React, { useState, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { DepartmentData } from '../../types';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface VirtualizedStudentListProps {
  data: DepartmentData[];
}

const VirtualizedStudentList: React.FC<VirtualizedStudentListProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DepartmentData | null;
    direction: 'ascending' | 'descending';
  }>({
    key: null,
    direction: 'ascending'
  });

  const handleSort = (key: keyof DepartmentData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    let dataToProcess = [...data];
    
    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      dataToProcess = dataToProcess.filter(student => {
        return (
          student.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          student.company.toLowerCase().includes(lowerCaseSearchTerm) ||
          student.role.toLowerCase().includes(lowerCaseSearchTerm) ||
          student.domain.toLowerCase().includes(lowerCaseSearchTerm) ||
          student.status.toLowerCase().includes(lowerCaseSearchTerm)
        );
      });
    }
    
    // Sort data
    if (sortConfig.key) {
      dataToProcess.sort((a, b) => {
        const valueA = a[sortConfig.key as keyof DepartmentData];
        const valueB = b[sortConfig.key as keyof DepartmentData];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          if (sortConfig.direction === 'ascending') {
            return valueA.localeCompare(valueB);
          } else {
            return valueB.localeCompare(valueA);
          }
        } else if (typeof valueA === 'number' && typeof valueB === 'number') {
          if (sortConfig.direction === 'ascending') {
            return valueA - valueB;
          } else {
            return valueB - valueA;
          }
        }
        
        return 0;
      });
    }
    
    return dataToProcess;
  }, [data, searchTerm, sortConfig]);

  const getSortIcon = (key: keyof DepartmentData) => {
    if (sortConfig.key !== key) {
      return null;
    }
    
    return sortConfig.direction === 'ascending' ? (
      <ChevronUp size={16} className="inline-block" />
    ) : (
      <ChevronDown size={16} className="inline-block" />
    );
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(salary);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Placed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Not Placed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'In Process':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const student = filteredData[index];
    return (
      <div
        style={style}
        className={`flex items-center text-sm p-3 border-b border-slate-100 dark:border-slate-700 ${
          index % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800'
        }`}
      >
        <div className="w-1/5 overflow-hidden text-ellipsis">{student.name}</div>
        <div className="w-1/5 overflow-hidden text-ellipsis">{student.company || '-'}</div>
        <div className="w-1/5 overflow-hidden text-ellipsis">{student.role || '-'}</div>
        <div className="w-1/5 overflow-hidden">
          {student.salary ? formatSalary(student.salary) : '-'}
        </div>
        <div className="w-1/5 text-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(student.status)}`}>
            {student.status}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search students..."
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        />
      </div>
      
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <div className="flex font-medium text-sm bg-slate-100 dark:bg-slate-700 p-3 border-b border-slate-200 dark:border-slate-600">
          <div 
            className="w-1/5 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => handleSort('name')}
          >
            Name {getSortIcon('name')}
          </div>
          <div 
            className="w-1/5 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => handleSort('company')}
          >
            Company {getSortIcon('company')}
          </div>
          <div 
            className="w-1/5 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => handleSort('role')}
          >
            Role {getSortIcon('role')}
          </div>
          <div 
            className="w-1/5 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => handleSort('salary')}
          >
            Salary {getSortIcon('salary')}
          </div>
          <div 
            className="w-1/5 text-center cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => handleSort('status')}
          >
            Status {getSortIcon('status')}
          </div>
        </div>
        
        {filteredData.length > 0 ? (
          <List
            height={400}
            itemCount={filteredData.length}
            itemSize={48}
            width="100%"
          >
            {Row}
          </List>
        ) : (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400">
            No students found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualizedStudentList;