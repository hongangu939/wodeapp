import React, { useState } from 'react';
import { ViewState, BoosterType, MaterialType, DesignStyle, DesignResult } from './types';
import { generateBoosterConcept, generateBoosterSpecs } from './services/geminiService';
import { GeneratorForm } from './components/GeneratorForm';
import { SpecsCard } from './components/SpecsCard';
import { Button } from './components/Button';
import { 
  Cpu, 
  LayoutGrid, 
  PlusCircle, 
  Settings, 
  Wifi, 
  Download, 
  Share2,
  Zap
} from 'lucide-react';

// Mock data for gallery initialization
const MOCK_GALLERY: DesignResult[] = [];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDesign, setCurrentDesign] = useState<DesignResult | null>(null);
  const [gallery, setGallery] = useState<DesignResult[]>(MOCK_GALLERY);

  const handleGenerate = async (type: BoosterType, material: MaterialType, style: DesignStyle, details: string) => {
    setIsGenerating(true);
    try {
      // Run both generation tasks in parallel for efficiency
      const [imageUrl, specs] = await Promise.all([
        generateBoosterConcept(type, material, style, details),
        generateBoosterSpecs(type, material, style)
      ]);

      const newDesign: DesignResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl,
        params: { type, material, style },
        specs,
        promptUsed: details
      };

      setCurrentDesign(newDesign);
      setGallery(prev => [newDesign, ...prev]);
      setCurrentView(ViewState.DETAILS);
    } catch (error) {
      alert("生成设计失败，请重试。请检查控制台获取详细信息。");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!currentDesign) return;
    const link = document.createElement('a');
    link.href = currentDesign.imageUrl;
    link.download = `signal-booster-${currentDesign.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SidebarItem = ({ view, icon, label }: { view: ViewState, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
        currentView === view 
          ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-500 rounded-r-none' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Wifi size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">SignalForge AI</h1>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4">菜单</div>
          <SidebarItem view={ViewState.DASHBOARD} icon={<LayoutGrid size={20} />} label="仪表盘" />
          <SidebarItem view={ViewState.GENERATOR} icon={<PlusCircle size={20} />} label="新建项目" />
          <SidebarItem view={ViewState.GALLERY} icon={<Zap size={20} />} label="项目图库" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors px-4 py-2">
            <Settings size={20} />
            <span>系统设置</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <h2 className="text-lg font-medium text-white">
            {currentView === ViewState.DASHBOARD && "项目概览"}
            {currentView === ViewState.GENERATOR && "设计工作室"}
            {currentView === ViewState.GALLERY && "项目档案"}
            {currentView === ViewState.DETAILS && "设计分析报告"}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              系统运行中
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600"></div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950 relative">
          
          {/* DASHBOARD VIEW */}
          {currentView === ViewState.DASHBOARD && (
            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-800/30 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">欢迎回来，工程师。</h3>
                <p className="text-slate-300 mb-6 max-w-2xl">
                  准备好设计下一代信号放大技术了吗？
                  启动新项目，利用 AI 即时生成工业级产品概念图和详细技术规格。
                </p>
                <Button onClick={() => setCurrentView(ViewState.GENERATOR)} icon={<PlusCircle size={18} />}>
                  开始新设计
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Quick Stats */}
                 <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <p className="text-slate-400 text-sm">已创建项目</p>
                    <p className="text-3xl font-bold text-white mt-1">{gallery.length}</p>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <p className="text-slate-400 text-sm">算力点数</p>
                    <p className="text-3xl font-bold text-emerald-400 mt-1">无限</p>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <p className="text-slate-400 text-sm">当前模型</p>
                    <p className="text-3xl font-bold text-blue-400 mt-1">Gemini 2.5</p>
                 </div>
              </div>

              <div className="mt-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">最近的设计</h3>
                  {gallery.length > 0 && (
                    <button 
                      onClick={() => setCurrentView(ViewState.GALLERY)}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      查看全部
                    </button>
                  )}
                </div>
                
                {gallery.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
                    <div className="mx-auto w-12 h-12 text-slate-600 mb-3">
                      <Cpu size={48} strokeWidth={1} />
                    </div>
                    <p className="text-slate-500">暂无设计项目。</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gallery.slice(0, 3).map((design) => (
                      <div 
                        key={design.id} 
                        onClick={() => { setCurrentDesign(design); setCurrentView(ViewState.DETAILS); }}
                        className="group relative aspect-[4/3] bg-slate-800 rounded-lg overflow-hidden cursor-pointer border border-slate-700 hover:border-blue-500 transition-all"
                      >
                        <img src={design.imageUrl} alt="Design" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-4 pt-12">
                          <p className="text-white font-medium text-sm">{design.params.type}</p>
                          <p className="text-slate-400 text-xs">{new Date(design.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GENERATOR VIEW */}
          {currentView === ViewState.GENERATOR && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">设计工作室</h2>
                  <p className="text-slate-400 mt-1">配置 AI 参数以生成机箱方案。</p>
                </div>
              </div>
              
              <GeneratorForm onGenerate={handleGenerate} isGenerating={isGenerating} />

              {isGenerating && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <h3 className="text-xl font-bold text-white animate-pulse">正在锻造设计...</h3>
                  <p className="text-slate-400 mt-2">正在分析热力学并渲染表面纹理</p>
                </div>
              )}
            </div>
          )}

          {/* DETAILS VIEW */}
          {currentView === ViewState.DETAILS && currentDesign && (
            <div className="max-w-6xl mx-auto h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setCurrentView(ViewState.GALLERY)}
                  className="text-slate-400 hover:text-white flex items-center"
                >
                  ← 返回图库
                </button>
                <div className="flex space-x-3">
                  <Button variant="outline" icon={<Share2 size={16} />} onClick={() => alert("链接已复制！")}>分享</Button>
                  <Button variant="primary" icon={<Download size={16} />} onClick={handleDownload}>导出渲染图</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                {/* Left: Image */}
                <div className="lg:col-span-2 flex flex-col space-y-6">
                  <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/50 relative group">
                    <img 
                      src={currentDesign.imageUrl} 
                      alt="Generated Design" 
                      className="w-full h-auto object-contain max-h-[600px]" 
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                      <span className="text-xs font-mono text-white">RENDER_ID: {currentDesign.id.slice(-6)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                     <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">设计提示词 (Prompt)</h4>
                     <p className="text-slate-300 text-sm italic">"{currentDesign.params.type}, 材质: {currentDesign.params.material}, 风格: {currentDesign.params.style}..."</p>
                  </div>
                </div>

                {/* Right: Specs */}
                <div className="lg:col-span-1">
                  <SpecsCard specs={currentDesign.specs} />
                </div>
              </div>
            </div>
          )}

          {/* GALLERY VIEW */}
          {currentView === ViewState.GALLERY && (
            <div className="max-w-6xl mx-auto">
               <h2 className="text-2xl font-bold text-white mb-8">项目档案</h2>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {gallery.map((design) => (
                    <div 
                      key={design.id}
                      onClick={() => { setCurrentDesign(design); setCurrentView(ViewState.DETAILS); }}
                      className="group bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-900/10 transition-all cursor-pointer flex flex-col"
                    >
                      <div className="aspect-square overflow-hidden relative">
                        <img 
                          src={design.imageUrl} 
                          alt="Gallery Item" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-white font-medium text-sm mb-1 truncate">{design.params.type}</h3>
                        <p className="text-slate-500 text-xs mb-3">{new Date(design.timestamp).toLocaleDateString()}</p>
                        <div className="mt-auto flex items-center justify-between">
                           <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400 border border-slate-700 group-hover:bg-blue-900/30 group-hover:text-blue-300 group-hover:border-blue-800 transition-colors">
                             {design.specs.ipRating}
                           </span>
                           <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Card */}
                  <button 
                    onClick={() => setCurrentView(ViewState.GENERATOR)}
                    className="aspect-square bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 hover:text-white hover:border-slate-600 transition-all"
                  >
                    <PlusCircle size={32} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">新建项目</span>
                  </button>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;