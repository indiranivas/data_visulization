import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DepartmentData } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CompanyBarChartProps {
  data: DepartmentData[];
}

const CompanyBarChart: React.FC<CompanyBarChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    // Count students per company
    const companyCount: Record<string, number> = {};
    data.forEach(student => {
      if (student.status === 'Placed' && student.company) {
        companyCount[student.company] = (companyCount[student.company] || 0) + 1;
      }
    });

    // Sort by count and take top 10
    const topCompanies = Object.entries(companyCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const labels = topCompanies.map(([company]) => company);
    const counts = topCompanies.map(([, count]) => count);

    // Calculate average salary per company
    const companySalaries: Record<string, number[]> = {};
    data.forEach(student => {
      if (student.status === 'Placed' && student.company && student.salary > 0) {
        if (!companySalaries[student.company]) {
          companySalaries[student.company] = [];
        }
        companySalaries[student.company].push(student.salary);
      }
    });

    const avgSalaries = labels.map(company => {
      const salaries = companySalaries[company] || [];
      return salaries.length > 0
        ? salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length / 100000 // Convert to Lakhs
        : 0;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Students Placed',
          data: counts,
          backgroundColor: 'rgba(37, 99, 235, 0.7)',
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 1,
          barPercentage: 0.5,
          categoryPercentage: 0.8,
          borderRadius: 4,
          yAxisID: 'y'
        },
        {
          label: 'Avg. Salary (Lakhs)',
          data: avgSalaries,
          backgroundColor: 'rgba(124, 58, 237, 0.7)',
          borderColor: 'rgba(124, 58, 237, 1)',
          borderWidth: 1,
          barPercentage: 0.5,
          categoryPercentage: 0.8,
          borderRadius: 4,
          yAxisID: 'y1'
        }
      ]
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#64748b'
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#64748b',
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Number of Students',
          color: '#64748b'
        },
        ticks: {
          color: '#64748b'
        },
        grid: {
          color: 'rgba(203, 213, 225, 0.2)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Avg. Salary (Lakhs)',
          color: '#64748b'
        },
        ticks: {
          color: '#64748b'
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="w-full h-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CompanyBarChart;