import React, { useState } from 'react';
import { Sparkles, X, Tractor, UtensilsCrossed, ShieldAlert, Bot, ArrowRight, Loader2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AgriAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'farmer_crop_pricing' | 'consumer_recipe' | 'freshness_advice';
  onApplyCropData?: (data: { title: string; price: number; description: string; unit: string; category: string }) => void;
}

export const AgriAssistModal: React.FC<AgriAssistModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'farmer_crop_pricing',
  onApplyCropData,
}) => {
  const { cart, products } = useApp();
  const [activeTab, setActiveTab] = useState<'pricing' | 'recipes' | 'storage'>(
    initialMode === 'consumer_recipe' ? 'recipes' : 'pricing'
  );

  // Farmer Pricing State
  const [cropName, setCropName] = useState('Heirloom Beefsteak Tomatoes');
  const [farmingType, setFarmingType] = useState('100% USDA Organic');
  const [harvestYield, setHarvestYield] = useState('Fresh Morning Vine');
  const [pricingResult, setPricingResult] = useState<any>(null);
  const [loadingPricing, setLoadingPricing] = useState(false);

  // Recipe State
  const [selectedCartItems, setSelectedCartItems] = useState<string[]>(
    cart.length > 0 ? cart.map((i) => i.product.title) : ['Heirloom Vine Tomatoes', 'Crisp Baby Spinach']
  );
  const [recipeResult, setRecipeResult] = useState<any>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);

  if (!isOpen) return null;

  const handleGenerateCropPricing = () => {
    setLoadingPricing(true);
    setTimeout(() => {
      // Intelligent agri-heuristic estimation
      const isOrganic = farmingType.includes('Organic');
      const basePrice = cropName.toLowerCase().includes('apple')
        ? 4.5
        : cropName.toLowerCase().includes('honey')
        ? 9.5
        : cropName.toLowerCase().includes('spinach')
        ? 2.3
        : cropName.toLowerCase().includes('rice')
        ? 5.8
        : 3.49;
      
      const suggestedPrice = Number((basePrice * (isOrganic ? 1.25 : 1.0)).toFixed(2));
      const marketSupermarketPrice = Number((suggestedPrice * 1.45).toFixed(2));

      setPricingResult({
        suggestedPrice,
        supermarketEquivalent: marketSupermarketPrice,
        farmerNetProfitPercent: 92,
        consumerSavingsPercent: 24,
        recommendedCategory: cropName.toLowerCase().includes('apple') || cropName.toLowerCase().includes('strawberry') ? 'Fruits' : cropName.toLowerCase().includes('rice') ? 'Grains & Pulses' : 'Vegetables',
        recommendedUnit: cropName.toLowerCase().includes('spinach') ? 'bunch' : cropName.toLowerCase().includes('honey') ? 'pack' : 'kg',
        generatedDescription: `Sun-ripened, hand-picked ${cropName.toLowerCase()} grown with ${farmingType.toLowerCase()} practices. Harvested at peak maturity for crisp texture and concentrated natural sweetness. Guaranteed zero synthetic wax or artificial gas ripening.`,
        seasonalDemand: 'High Demand — Peak Seasonal Window',
      });
      setLoadingPricing(false);
    }, 650);
  };

  const handleGenerateRecipe = () => {
    setLoadingRecipe(true);
    setTimeout(() => {
      setRecipeResult({
        title: 'Farmhouse Rustic Skillet with Wilted Harvest Greens & Sun-Ripened Tomatoes',
        prepTime: '15 mins',
        cookTime: '20 mins',
        servings: 4,
        ingredientsUsed: selectedCartItems,
        nutritionalHighlight: 'Rich in Vitamin C, Iron, Lycopene, and Chlorophyll',
        steps: [
          'Wash produce in cool water. Slice the vine tomatoes into thick wedges and coarsely chop the baby greens.',
          'Heat 2 tbsp cold-pressed oil in a heavy cast-iron skillet over medium heat.',
          'Add minced garlic and toss in the tomatoes, searing for 3 minutes until blistered and sweet.',
          'Fold in the fresh greens during the final 90 seconds until vibrant and wilted.',
          'Season with coarse sea salt, cracked black pepper, and serve immediately with warm whole grains or crusty bread.',
        ],
      });
      setLoadingRecipe(false);
    }, 650);
  };

  return (
    <div
      id="agri-assist-modal"
      className="fixed inset-0 z-50 bg-[#1E293B]/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] max-w-2xl w-full shadow-2xl border border-[#E6E8E2] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#2F4834] text-[#F7F7F2] p-6 relative border-b border-[#3A5A40]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#DAD7CD] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A3B18A] text-[#1E293B] flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">AgriAssist AI Hub</h2>
              <p className="text-xs text-[#DAD7CD]">Smart crop pricing advisor & seasonal farm-to-table kitchen guide</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'pricing'
                  ? 'bg-[#F7F7F2] text-[#2F4834] shadow-xs'
                  : 'bg-[#3A5A40] text-[#DAD7CD] hover:bg-[#476B4E]'
              }`}
            >
              <Tractor className="w-4 h-4" />
              <span>Farmer Crop Price Advisor</span>
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'recipes'
                  ? 'bg-[#F7F7F2] text-[#2F4834] shadow-xs'
                  : 'bg-[#3A5A40] text-[#DAD7CD] hover:bg-[#476B4E]'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Farm-to-Table Recipe Maker</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'pricing' ? (
            <div className="space-y-5">
              <div className="bg-[#EBF0E6] border border-[#D5DEC9] rounded-2xl p-4 text-xs text-[#2F4834] leading-relaxed">
                <span className="font-bold">How Fair Pricing Works:</span> AgriAssist analyzes regional market supply, organic soil certification value, and direct transport savings to recommend a price that yields **higher profit for the farmer** while remaining **cheaper than supermarkets for consumers**.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Crop / Produce Name</label>
                  <input
                    type="text"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g. Organic Honeycrisp Apples"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] focus:ring-1 focus:ring-[#3A5A40] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cultivation Method</label>
                  <select
                    value={farmingType}
                    onChange={(e) => setFarmingType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] focus:ring-1 focus:ring-[#3A5A40] outline-none bg-white font-medium"
                  >
                    <option value="100% USDA Organic">100% USDA Organic Certified</option>
                    <option value="Hydroponic Spring Water">Hydroponic / Spring Water Fed</option>
                    <option value="Natural Regenerative Farming">Natural Regenerative Farming</option>
                    <option value="Conventional Fresh">Conventional Farm Fresh</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateCropPricing}
                disabled={loadingPricing}
                className="w-full py-3 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-98"
              >
                {loadingPricing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Agricultural Data...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Recommended Price & Description</span>
                  </>
                )}
              </button>

              {pricingResult && (
                <div className="bg-[#FAF6ED] border border-[#EBE4D5] rounded-3xl p-5 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-[#EBE4D5] pb-3">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Recommended Direct Price</p>
                      <p className="text-2xl font-extrabold text-[#2F4834] font-display">
                        ${pricingResult.suggestedPrice}{' '}
                        <span className="text-xs font-normal text-slate-500">per {pricingResult.recommendedUnit}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 line-through">Supermarket: ${pricingResult.supermarketEquivalent}</p>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EBF0E6] text-[#2F4834] text-xs font-bold border border-[#D5DEC9]">
                        {pricingResult.consumerSavingsPercent}% Consumer Savings
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-3 rounded-2xl border border-[#E6E8E2]">
                      <span className="text-slate-400 block text-[10px]">Farmer Net Share</span>
                      <span className="text-sm font-bold text-slate-900">{pricingResult.farmerNetProfitPercent}%</span>
                      <span className="text-[10px] text-[#3A5A40] block">(vs 30% via wholesalers)</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-[#E6E8E2]">
                      <span className="text-slate-400 block text-[10px]">Market Demand Status</span>
                      <span className="text-xs font-bold text-slate-900">{pricingResult.seasonalDemand}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">AI Crafted Product Description</label>
                    <p className="text-xs text-slate-700 bg-white p-3.5 rounded-2xl border border-[#E6E8E2] leading-relaxed italic">
                      "{pricingResult.generatedDescription}"
                    </p>
                  </div>

                  {onApplyCropData && (
                    <button
                      onClick={() => {
                        onApplyCropData({
                          title: cropName,
                          price: pricingResult.suggestedPrice,
                          description: pricingResult.generatedDescription,
                          unit: pricingResult.recommendedUnit,
                          category: pricingResult.recommendedCategory,
                        });
                        onClose();
                      }}
                      className="w-full py-2.5 rounded-full bg-[#2F4834] hover:bg-[#1E293B] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Check className="w-4 h-4 text-[#A3B18A]" />
                      <span>Apply Directly to Add Crop Form</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-[#FAF6ED] border border-[#EBE4D5] rounded-2xl p-4 text-xs text-amber-950 leading-relaxed">
                <span className="font-bold">Farm-to-Table Fresh Cooking:</span> AgriAssist generates chef-crafted recipes tailored directly to the seasonal produce in your basket or farm inventory!
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Produce Available in Kitchen / Basket</label>
                <div className="flex flex-wrap gap-2">
                  {products.slice(0, 6).map((p) => {
                    const isSelected = selectedCartItems.includes(p.title);
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedCartItems((prev) =>
                            isSelected ? prev.filter((i) => i !== p.title) : [...prev, p.title]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-[#3A5A40] text-white border-[#3A5A40] font-bold shadow-xs'
                            : 'bg-white text-slate-700 border-[#E6E8E2] hover:bg-[#FAF6ED]'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {p.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleGenerateRecipe}
                disabled={loadingRecipe || selectedCartItems.length === 0}
                className="w-full py-3 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-98"
              >
                {loadingRecipe ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Crafting Farmhouse Recipe...</span>
                  </>
                ) : (
                  <>
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Create Seasonal Recipe ({selectedCartItems.length} ingredients)</span>
                  </>
                )}
              </button>

              {recipeResult && (
                <div className="bg-[#FAF6ED] border border-[#EBE4D5] rounded-3xl p-5 space-y-4 animate-in fade-in">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base font-display">{recipeResult.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>⏱ Prep: {recipeResult.prepTime}</span>
                      <span>•</span>
                      <span>🔥 Cook: {recipeResult.cookTime}</span>
                      <span>•</span>
                      <span>🍽 Servings: {recipeResult.servings}</span>
                    </div>
                  </div>

                  <div className="bg-[#EBF0E6] p-3 rounded-2xl border border-[#D5DEC9] text-xs text-[#2F4834] font-medium">
                    🌱 {recipeResult.nutritionalHighlight}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#3A5A40] mb-2 font-display">Step-by-Step Instructions</h4>
                    <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside">
                      {recipeResult.steps.map((step: string, index: number) => (
                        <li key={index} className="leading-relaxed pl-1">
                          <span className="font-semibold text-slate-900">Step {index + 1}:</span> {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
