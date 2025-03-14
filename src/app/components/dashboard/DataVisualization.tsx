import React from 'react';

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }>;
}

interface DataVisualizationProps {
  title: string;
  description?: string;
  chartType: 'bar' | 'line' | 'pie' | 'doughnut';
  data: ChartData;
  height?: number;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
  title,
  description,
  chartType,
  data,
  height = 300
}) => {
  // In a real implementation, this would use a charting library like Recharts or Chart.js
  // For now, we'll create a simplified visualization
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      
      <div className="p-4" style={{ height: `${height}px` }}>
        {/* Simplified chart visualization */}
        <div className="h-full flex items-end justify-around">
          {data.labels.map((label, index) => {
            const dataset = data.datasets[0];
            const value = dataset.data[index];
            const maxValue = Math.max(...dataset.data);
            const height = (value / maxValue) * 100;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-12 bg-blue-500 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs mt-2 text-gray-600">{label}</div>
                <div className="text-xs font-medium">{value}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-center">
          {data.datasets.map((dataset, index) => (
            <div key={index} className="flex items-center mx-2">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: dataset.backgroundColor || '#3B82F6' }}
              ></div>
              <span className="text-xs text-gray-600">{dataset.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
