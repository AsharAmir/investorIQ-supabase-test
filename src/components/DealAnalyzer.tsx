import { useState } from "react";
import { Calculator, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Property, DealAnalysis } from "../types";

interface DealAnalyzerProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function DealAnalyzer({
  property,
  isOpen,
  onClose,
}: DealAnalyzerProps) {
  const [analysis, setAnalysis] = useState<DealAnalysis>({
    purchasePrice: property.price,
    rehabCost: 0,
    arv: 0,
    holdingCosts: 0,
    roi: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  const calculateROI = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/analyze-property",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            purchasePrice: analysis.purchasePrice,
            rehabCost: analysis.rehabCost,
            arv: analysis.arv,
            holdingCosts: analysis.holdingCosts,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to calculate ROI");

      const data = await response.json();
      setAnalysis((prev) => ({ ...prev, roi: data.roi }));
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate ROI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <Calculator className="h-8 w-8 text-brand-blue mr-3" />
                  <h2 className="text-2xl font-bold text-brand-navy">
                    Deal Analyzer
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-brand-navy/5 to-brand-blue/10 p-6 rounded-2xl mb-6">
                  <h3 className="font-semibold text-brand-navy mb-2">
                    Property Details
                  </h3>
                  <p className="text-brand-navy/80">{property.address}</p>
                  <p className="text-brand-navy/80">
                    Listed Price: ${property.price.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      Purchase Price
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                      value={analysis.purchasePrice}
                      onChange={(e) =>
                        setAnalysis({
                          ...analysis,
                          purchasePrice: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      Estimated Rehab Cost
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                      value={analysis.rehabCost}
                      onChange={(e) =>
                        setAnalysis({
                          ...analysis,
                          rehabCost: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      After Repair Value (ARV)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                      value={analysis.arv}
                      onChange={(e) =>
                        setAnalysis({
                          ...analysis,
                          arv: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      Holding Costs
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                      value={analysis.holdingCosts}
                      onChange={(e) =>
                        setAnalysis({
                          ...analysis,
                          holdingCosts: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-4 rounded-xl">
                    {error}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={calculateROI}
                  disabled={loading}
                  className="w-full bg-brand-navy text-white px-6 py-4 rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Calculating...
                    </span>
                  ) : (
                    "Calculate ROI"
                  )}
                </motion.button>

                <AnimatePresence>
                  {showResults && analysis.roi > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-6 p-6 bg-gradient-to-r from-brand-navy/5 to-brand-blue/10 rounded-2xl"
                    >
                      <h3 className="text-xl font-bold text-brand-navy mb-4">
                        Analysis Results
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-brand-navy/70">
                            Total Investment:
                          </span>
                          <span className="font-semibold text-brand-navy">
                            $
                            {(
                              analysis.purchasePrice +
                              analysis.rehabCost +
                              analysis.holdingCosts
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-brand-navy/70">
                            Potential Profit:
                          </span>
                          <span className="font-semibold text-brand-navy">
                            $
                            {(
                              analysis.arv -
                              (analysis.purchasePrice +
                                analysis.rehabCost +
                                analysis.holdingCosts)
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-lg pt-2 border-t border-brand-navy/10">
                          <span className="text-brand-navy/70">
                            Return on Investment:
                          </span>
                          <span className="font-bold text-xl text-brand-navy">
                            {analysis.roi.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
