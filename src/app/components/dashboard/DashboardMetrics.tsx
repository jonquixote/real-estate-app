import React from 'react';
import MetricCard from './MetricCard';

interface DashboardMetricsProps {
  metrics: {
    totalProperties: number;
    meetingRentRule: number;
    meetingSqftRule: number;
    meetingEitherRule: number;
    averageRentRatio: number;
    averageSqftRatio: number;
    averagePrice: number;
    topMarkets: Array<{
      location: string;
      propertyCount: number;
      averageRentRatio: number;
    }>;
  };
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Investment Metrics</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Properties"
          value={metrics.totalProperties.toLocaleString()}
          description="Properties in database"
          color="blue"
        />
        
        <MetricCard
          title="Rent 1% Rule"
          value={`${metrics.meetingRentRule.toLocaleString()} (${((metrics.meetingRentRule / metrics.totalProperties) * 100).toFixed(1)}%)`}
          description="Properties meeting rent 1% rule"
          color="green"
        />
        
        <MetricCard
          title="Sqft 1% Rule"
          value={`${metrics.meetingSqftRule.toLocaleString()} (${((metrics.meetingSqftRule / metrics.totalProperties) * 100).toFixed(1)}%)`}
          description="Properties meeting sqft 1% rule"
          color="green"
        />
        
        <MetricCard
          title="Either Rule"
          value={`${metrics.meetingEitherRule.toLocaleString()} (${((metrics.meetingEitherRule / metrics.totalProperties) * 100).toFixed(1)}%)`}
          description="Properties meeting either 1% rule"
          color="green"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Average Rent Ratio"
          value={`${metrics.averageRentRatio.toFixed(2)}%`}
          description="Average rent-to-value ratio"
          color="blue"
        />
        
        <MetricCard
          title="Average Sqft Ratio"
          value={`${metrics.averageSqftRatio.toFixed(2)}%`}
          description="Average sqft-to-value ratio"
          color="blue"
        />
        
        <MetricCard
          title="Average Price"
          value={`$${metrics.averagePrice.toLocaleString()}`}
          description="Average property price"
          color="gray"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">Top Markets</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Properties
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Rent Ratio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.topMarkets.map((market, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {market.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {market.propertyCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {market.averageRentRatio.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
