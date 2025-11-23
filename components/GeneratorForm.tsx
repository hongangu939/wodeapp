import React, { useState } from 'react';
import { BoosterType, MaterialType, DesignStyle } from '../types';
import { Button } from './Button';
import { Sparkles } from 'lucide-react';

interface GeneratorFormProps {
  onGenerate: (type: BoosterType, material: MaterialType, style: DesignStyle, details: string) => void;
  isGenerating: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isGenerating }) => {
  const [type, setType] = useState<BoosterType>(BoosterType.INDUSTRIAL_ENTERPRISE);
  const [material, setMaterial] = useState<MaterialType>(MaterialType.ALUMINUM_BRUSHED);
  const [style, setStyle] = useState<DesignStyle>(DesignStyle.INDUSTRIAL_HEAVY);
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(type, material, style, details);
  };

  const labelClass = "block text-sm font-medium text-slate-400 mb-1";
  const selectClass = "block w-full pl-3 pr-10 py-2.5 text-base border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm transition-colors";
  const textareaClass = "block w-full p-3 border-slate-700 bg-slate-800 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-slate-900/50 rounded-xl border border-slate-800">
      <div>
        <h3 className="text-lg font-medium leading-6 text-white mb-4">设计参数配置</h3>
        <p className="text-sm text-slate-400 mb-6">配置信号放大器机箱的核心属性。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="boosterType" className={labelClass}>产品类别</label>
          <select 
            id="boosterType" 
            value={type} 
            onChange={(e) => setType(e.target.value as BoosterType)} 
            className={selectClass}
          >
            {Object.values(BoosterType).map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="material" className={labelClass}>外壳材质</label>
          <select 
            id="material" 
            value={material} 
            onChange={(e) => setMaterial(e.target.value as MaterialType)} 
            className={selectClass}
          >
            {Object.values(MaterialType).map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="style" className={labelClass}>设计风格</label>
          <select 
            id="style" 
            value={style} 
            onChange={(e) => setStyle(e.target.value as DesignStyle)} 
            className={selectClass}
          >
            {Object.values(DesignStyle).map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="details" className={labelClass}>补充细节 (可选)</label>
          <textarea
            id="details"
            rows={3}
            className={textareaClass}
            placeholder="例如：需要超大散热鳍片，红色重点照明，壁挂安装支架..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          variant="primary" 
          isLoading={isGenerating} 
          className="w-full md:w-auto text-base px-8 py-3 shadow-blue-500/20"
          icon={<Sparkles size={18} />}
        >
          生成概念图
        </Button>
      </div>
    </form>
  );
};