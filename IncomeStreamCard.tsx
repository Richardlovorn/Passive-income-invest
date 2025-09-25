import React from 'react';
import { TrendingUp, Clock } from 'lucide-react';

interface IncomeStreamCardProps {
  source: string;
  monthly: number;
  automation: number;
  icon?: string;
  trend?: number;
}

const IncomeStreamCard: React.FC<IncomeStreamCardProps> = ({ 
  source, 
  monthly, 
  automation,
  icon,
  trend = 8.5
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700 hover:border-blue-500/50 transition-all hover:scale-105 hover:shadow-xl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {icon && (
            <img src={icon} alt={source} className="w-8 h-8 rounded-lg" />
          )}
          <div>
            <h4 className="text-sm font-semibold text-white">{source}</h4>
            <div className="flex items-center space-x-1 mt-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">{automation}% Automated</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-white">
              ${monthly.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Monthly Income</div>
          </div>
          <div className="flex items-center space-x-1 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">+{trend}%</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full"
            style={{ width: `${automation}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default IncomeStreamCard;