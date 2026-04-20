import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ContributionChart = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 12,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: '#f1f5f9',
          drawBorder: false
        },
        ticks: {
          font: { weight: 'bold', size: 10 },
          color: '#94a3b8'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { weight: 'bold', size: 10 },
          color: '#64748b'
        }
      }
    }
  };

  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'Contribution %',
        data: data.map(item => item.value),
        backgroundColor: '#6366f1',
        borderRadius: 12,
        barThickness: 32,
        hoverBackgroundColor: '#4f46e5'
      }
    ]
  };

  return (
    <div className="p-2 h-full">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default ContributionChart;
