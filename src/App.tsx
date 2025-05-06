import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { LoadingScreen } from './components/common/LoadingScreen';
import { useMockExcelData } from './hooks/useMockExcelData';
import { DepartmentData } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { data, isLoading: dataLoading } = useMockExcelData();
  const [departmentData, setDepartmentData] = useState<Record<string, DepartmentData[]>>({});
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  useEffect(() => {
    if (!dataLoading && data) {
      setDepartmentData(data);
      if (Object.keys(data).length > 0) {
        setSelectedDepartment(Object.keys(data)[0]);
      }
      // Simulate loading time
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [data, dataLoading]);

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Dashboard 
          departmentData={departmentData}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={handleDepartmentChange}
        />
      )}
    </div>
  );
};

export default App;