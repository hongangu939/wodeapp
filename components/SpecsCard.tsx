import React from 'react';
import { TechnicalSpecs } from '../types';
import { Activity, Box, Droplets, Layers, Cpu, Scale } from 'lucide-react';

interface SpecsCardProps {
  specs: TechnicalSpecs;
}

export const SpecsCard: React.FC<SpecsCardProps> = ({ specs }) => {
  const items = [
    { label: '尺寸', value: specs.dimensions, icon: <Box size={18} className="text-blue-400" /> },
    { label: '材质成分', value: specs.materialComposition, icon: <Layers size={18} className="text-purple-400" /> },
    { label: '散热方案', value: specs.coolingSolution, icon: <Activity size={18} className="text-red-400" /> },
    { label: '防护等级', value: specs.ipRating, icon: <Droplets size={18} className="text-cyan-400" /> },
    { label: '接口类型', value: specs.connectorType, icon: <Cpu size={18} className="text-amber-400" /> },
    { label: '预估重量', value: specs.estimatedWeight, icon: <Scale size={18} className="text-emerald-400" /> },
  ];

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden h-full">
      <div className="p-5 border-b border-slate-700 bg-slate-800/50">
        <h3 className="text-lg font-semibold text-white">技术规格</h3>
        <p className="text-xs uppercase tracking-wider text-blue-400 font-bold mt-1">{specs.marketingTagline}</p>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 gap-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
              <div className="mt-1 flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">{item.label}</p>
                <p className="text-sm font-medium text-slate-100 mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};