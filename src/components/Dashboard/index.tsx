import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, BarChart } from 'lucide-react';
import DepartmentSelector from './DepartmentSelector';
import KPICards from '../Charts/KPICards';
import CompanyBarChart from '../Charts/CompanyBarChart';
import SkillRadarChart from '../Charts/SkillRadarChart';
import CompanyDistributionChart from '../Charts/CompanyDistributionChart';
import DomainSunburstChart from '../Charts/DomainSunburstChart';
import RecruiterNetwork from '../Charts/RecruiterNetwork';
import StudentFlowSankey from '../Charts/StudentFlowSankey';
import VirtualizedStudentList from '../DataTable/VirtualizedStudentList';
import { exportToPDF } from '../../services/pdfExport';
import { DepartmentData } from '../../types';
import { useCalculateDepartmentStats } from '../../hooks/useCalculateDepartmentStats';

interface DashboardProps {
  departmentData: Record<string, DepartmentData[]>;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  departmentData, 
  selectedDepartment, 
  onDepartmentChange 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students'>('overview');
  const dashboardRef = useRef<HTMLDivElement>(null);
  const departmentStats = useCalculateDepartmentStats(
    selectedDepartment ? departmentData[selectedDepartment] : []
  );

  const handleExportPDF = async () => {
    if (dashboardRef.current) {
      await exportToPDF(dashboardRef.current, `${selectedDepartment}-Placement-Report`);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center">
            <BarChart className="mr-2 text-blue-600 dark:text-blue-400" size={28} />
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
              Placement Analytics Dashboard
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            2024-2025 Placement Records
          </p>
        </div>
        
        <div className="flex mt-4 md:mt-0">
          <button
            onClick={handleExportPDF}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
          >
            <Download size={18} className="mr-2" />
            Export PDF
          </button>
        </div>
      </header>

      <DepartmentSelector
        departments={Object.keys(departmentData)}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={onDepartmentChange}
      />

      <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 border-b-2 transition-colors duration-200 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-2 px-4 border-b-2 transition-colors duration-200 ${
              activeTab === 'students'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        ref={dashboardRef}
      >
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
              <KPICards stats={departmentStats} />
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow p-4 h-[400px]">
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Company-wise Placements</h2>
              <CompanyBarChart data={departmentData[selectedDepartment] || []} />
            </div>

            <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow p-4 h-[400px]">
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Skill Gap Analysis</h2>
              <SkillRadarChart data={departmentStats.skillGaps} />
            </div>

            <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow p-4 h-[400px]">
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Company Distribution</h2>
              <CompanyDistributionChart data={departmentStats.topCompanies} />
            </div>

            <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow p-4 h-[400px]">
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Domain Distribution</h2>
              <DomainSunburstChart data={departmentData[selectedDepartment] || []} />
            </div>

            <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow p-4 h-[400px]">
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Recruiter Network</h2>
              <RecruiterNetwork data={departmentData[selectedDepartment] || []} />
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white dark:bg-slate-800 rounded-xl shadow p-4 h-[400px]">
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Student Flow</h2>
              <StudentFlowSankey data={departmentData[selectedDepartment] || []} />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Student List</h2>
            <VirtualizedStudentList data={departmentData[selectedDepartment] || []} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;