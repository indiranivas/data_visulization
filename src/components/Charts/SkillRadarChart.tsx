import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { SkillGapData } from '../../types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface SkillRadarChartProps {
  data: SkillGapData[];
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.skill),
    datasets: [
      {
        label: 'Demand',
        data: data.map(item => item.demand),
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        borderColor: 'rgba(124, 58, 237, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(124, 58, 237, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(124, 58, 237, 1)'
      },
      {
        label: 'Supply',
        data: data.map(item => item.supply),
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(37, 99, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(37, 99, 235, 1)'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(203, 213, 225, 0.2)'
        },
        grid: {
          color: 'rgba(203, 213, 225, 0.2)'
        },
        pointLabels: {
          color: '#64748b',
          font: {
            size: 10
          }
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#64748b'
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#64748b',
          boxWidth: 10,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.r}`;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-[300px]">
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default SkillRadarChart;