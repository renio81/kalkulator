
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Info, 
  ArrowRight, 
  Layers, 
  Box, 
  Maximize, 
  DollarSign, 
  Sparkles,
  ChevronDown,
  Printer,
  Share2
} from 'lucide-react';
import { MaterialType, MaterialConfig, AdditionalCost, EstimationResult } from './types';
import { getBoothExpertAdvice } from './services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const MATERIAL_PRESETS: MaterialConfig[] = [
  { 
    name: MaterialType.PLYWOOD_HPL, 
    basePrice: 2500000, 
    description: "Finishing premium, halus, dan sangat estetis. Cocok untuk indoor/mall." 
  },
  { 
    name: MaterialType.ALUMINUM_ACP, 
    basePrice: 1800000, 
    description: "Tahan cuaca, modern, dan struktural kuat. Cocok untuk semi-outdoor." 
  },
  { 
    name: MaterialType.HOLLOW_SPANDEX, 
    basePrice: 1200000, 
    description: "Gaya industrial, perakitan cepat, dan ekonomis. Cocok untuk event outdoor." 
  }
];

const DEFAULT_ADDONS: AdditionalCost[] = [
  { id: '1', name: 'Lampu LED & Listrik', amount: 500000, enabled: false },
  { id: '2', name: 'Flooring (Lantai Kayu/Karpet)', amount: 750000, enabled: false },
  { id: '3', name: 'Branding Sticker / Vinyl', amount: 400000, enabled: false },
  { id: '4', name: 'Transportasi & Instalasi', amount: 1000000, enabled: false },
];

const App: React.FC = () => {
  const [length, setLength] = useState<number>(3);
  const [width, setWidth] = useState<number>(3);
  const [height, setHeight] = useState<number>(2.5);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialConfig>(MATERIAL_PRESETS[0]);
  const [addons, setAddons] = useState<AdditionalCost[]>(DEFAULT_ADDONS);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const estimation = useMemo((): EstimationResult => {
    // Formula sesuai request: P x L x T x Harga/m2
    // Catatan: Ini formula volume-based pricing yang unik.
    const area = length * width;
    const volume = length * width * height;
    const baseCost = volume * selectedMaterial.basePrice;
    const additionalCost = addons
      .filter(a => a.enabled)
      .reduce((sum, a) => sum + a.amount, 0);

    return {
      baseCost,
      additionalCost,
      totalCost: baseCost + additionalCost,
      area,
      volume
    };
  }, [length, width, height, selectedMaterial, addons]);

  const handleAddonToggle = (id: string) => {
    setAddons(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const fetchAdvice = async () => {
    setIsAiLoading(true);
    const advice = await getBoothExpertAdvice(
      { p: length, l: width, t: height },
      selectedMaterial.name,
      estimation.totalCost,
      addons
    );
    setAiAdvice(advice || "");
    setIsAiLoading(false);
  };

  const chartData = [
    { name: 'Material & Jasa', value: estimation.baseCost },
    { name: 'Biaya Tambahan', value: estimation.additionalCost },
  ].filter(d => d.value > 0);

  const COLORS = ['#10b981', '#6366f1'];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Calculator className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">BoothCraft <span className="text-emerald-600">Estimator</span></h1>
          </div>
          <div className="flex gap-3">
            <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors" onClick={() => window.print()}>
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-7 space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <Maximize className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold">Dimensi Booth</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Panjang (m)</label>
                  <input 
                    type="number" 
                    value={length} 
                    onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Lebar (m)</label>
                  <input 
                    type="number" 
                    value={width} 
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tinggi (m)</label>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <Layers className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold">Material Utama</h2>
              </div>
              <div className="space-y-3">
                {MATERIAL_PRESETS.map((mat) => (
                  <button
                    key={mat.name}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedMaterial.name === mat.name 
                        ? 'border-emerald-600 bg-emerald-50/50' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMaterial.name === mat.name ? 'border-emerald-600' : 'border-slate-300'}`}>
                      {selectedMaterial.name === mat.name && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{mat.name}</div>
                      <p className="text-sm text-slate-500 mt-1">{mat.description}</p>
                      <div className="text-emerald-700 font-medium mt-1">Rp {mat.basePrice.toLocaleString('id-ID')} / m²</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <Box className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold">Biaya Tambahan (Optional)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addons.map((addon) => (
                  <div 
                    key={addon.id}
                    onClick={() => handleAddonToggle(addon.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between ${
                      addon.enabled ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">{addon.name}</span>
                      <span className="text-xs text-slate-500">Rp {addon.amount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${addon.enabled ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${addon.enabled ? 'left-5' : 'left-1'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Result Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              <section className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-10 -mt-10 rounded-full" />
                <div className="relative z-10">
                  <div className="text-emerald-400 font-medium text-sm mb-1 uppercase tracking-wider">Estimasi Total</div>
                  <div className="text-4xl font-bold mb-6">Rp {estimation.totalCost.toLocaleString('id-ID')}</div>
                  
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <div className="flex justify-between text-slate-400 text-sm">
                      <span>Area Booth</span>
                      <span className="text-white font-medium">{estimation.area.toFixed(2)} m²</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-sm">
                      <span>Volume (Faktor Tinggi)</span>
                      <span className="text-white font-medium">{estimation.volume.toFixed(2)} m³</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-sm">
                      <span>Material Base</span>
                      <span className="text-white font-medium">Rp {estimation.baseCost.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-sm">
                      <span>Add-ons</span>
                      <span className="text-white font-medium">Rp {estimation.additionalCost.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <button 
                    onClick={fetchAdvice}
                    disabled={isAiLoading}
                    className="w-full mt-8 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-900 border-t-transparent" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                    Dapatkan Saran Ahli (AI)
                  </button>
                </div>
              </section>

              {/* Data Visualization */}
              {estimation.totalCost > 0 && (
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Proporsi Biaya</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              )}

              {/* AI Advice Box */}
              {aiAdvice && (
                <section className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 relative">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>Rekomendasi Ahli</span>
                  </div>
                  <div className="text-emerald-900 text-sm leading-relaxed whitespace-pre-wrap">
                    {aiAdvice}
                  </div>
                </section>
              )}

              <div className="bg-blue-50 p-4 rounded-xl flex gap-3 border border-blue-100">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  *Harga ini merupakan estimasi awal berdasarkan rumus dimensi x volume. Harga final dapat berubah tergantung kerumitan desain detail dan lokasi pemasangan.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
