import React from 'react';
import { VictoryPie, VictoryLegend, VictoryContainer, VictoryLabel } from 'victory';

interface CompanyDistributionChartProps {
  data: Array<{ name: string; count: number }>;
}

const CompanyDistributionChart: React.FC<CompanyDistributionChartProps> = ({ data }) => {
  // Ensure we have data and limit to top 5 for clarity
  const displayData = data.slice(0, 5);
  
  // Calculate total for "Others" category
  const totalCount = data.reduce((sum, company) => sum + company.count, 0);
  const displayedCount = displayData.reduce((sum, company) => sum + company.count, 0);
  const othersCount = totalCount - displayedCount;
  
  // Add "Others" category if there are more companies
  const chartData = othersCount > 0 
    ? [...displayData, { name: 'Others', count: othersCount }] 
    : displayData;
  
  // Generate colors
  const colors = [
    '#2563EB', // Blue
    '#7C3AED', // Purple
    '#0D9488', // Teal
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#6B7280'  // Gray (for Others)
  ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width={300} height={300} viewBox="0 0 300 300">
        <VictoryPie
          standalone={false}
          width={300}
          height={300}
          data={chartData}
          x="name"
          y="count"
          innerRadius={50}
          labelRadius={90}
          style={{
            data: { 
              fill: ({ index }) => colors[index % colors.length],
              stroke: "#FFFFFF",
              strokeWidth: 1
            },
            labels: { fill: "none" }
          }}
          animate={{
            duration: 2000,
            easing: "bounce"
          }}
        />
        
        <VictoryLegend
          standalone={false}
          x={150}
          y={150}
          centerTitle
          orientation="vertical"
          gutter={10}
          style={{
            title: { fontSize: 12 },
            labels: { fontSize: 8, fill: "#64748b" }
          }}
          data={chartData.map((item, index) => ({
            name: `${item.name} (${item.count})`,
            symbol: { fill: colors[index % colors.length] }
          }))}
        />
        
        <VictoryLabel
          textAnchor="middle"
          style={{ fontSize: 14, fill: "#334155" }}
          x={150} 
          y={150}
          text="Companies"
        />
      </svg>
    </div>
  );
};

export default CompanyDistributionChart;