"use client";

import { useState, useEffect } from "react";
import type { RetailSource } from "@/types";

interface SourcingFinderProps {
  brand: string;
  style: string;
  onClose: () => void;
}

export function SourcingFinder({ brand, style, onClose }: SourcingFinderProps) {
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState<RetailSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true);
      setError(null);

      try {
        // Search for discount sources
        const query = `Buy ${brand} ${style} dress on sale Depop Poshmark Zulily ASOS`;

        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            type: "sourcing",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Search failed");
        }

        const data = await response.json();
        if (data.sources && Array.isArray(data.sources)) {
          // Sort by discount percentage (highest first)
          const sortedSources = [...data.sources].sort(
            (a, b) => b.discountPercent - a.discountPercent
          );
          setSources(sortedSources);
        } else {
          setSources([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [brand, style]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            Discount Sources for {brand} {style} dress
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">
                Searching for discount sources...
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          {!loading && sources.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sources.map((source, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900">
                        {source.retailer}
                      </h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                        {source.discountPercent}% OFF
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Original Price:</span>
                        <span className="text-gray-900 line-through">
                          ${source.originalPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sale Price:</span>
                        <span className="text-lg font-bold text-green-600">
                          ${source.salePrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">You Save:</span>
                        <span className="font-semibold text-gray-900">
                          $
                          {(source.originalPrice - source.salePrice).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View on {source.retailer} →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && sources.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500">
              No discount sources found. Try searching again or check back
              later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
