"use client";

import { useState } from "react";
import type { TrendAnalysisResult } from "@/types";
import { SourcingFinder } from "./SourcingFinder";

export function TrendAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TrendAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trendingItems, setTrendingItems] = useState<Set<string>>(new Set());
  const [sourcingFor, setSourcingFor] = useState<{
    brand: string;
    style: string;
  } | null>(null);

  const fetchTrending = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "trending",
          type: "trends",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch trending dresses");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleTrending = (listingId: string) => {
    const newTrending = new Set(trendingItems);
    if (newTrending.has(listingId)) {
      newTrending.delete(listingId);
    } else {
      newTrending.add(listingId);
    }
    setTrendingItems(newTrending);
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Trend Analyzer
        </h2>

        {/* Fetch Button */}
        <div className="mb-6">
          <button
            onClick={fetchTrending}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Loading..." : "Fetch Trending Dresses"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">
                  Average Price
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  ${results.averagePrice.toFixed(2)}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">
                  Price Range
                </div>
                <div className="text-2xl font-bold text-green-900">
                  ${results.priceRange.min} - ${results.priceRange.max}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">
                  Top Brands
                </div>
                <div className="text-lg font-semibold text-purple-900">
                  {results.topBrands.slice(0, 3).join(", ")}
                </div>
              </div>
            </div>

            {/* Listings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top {results.listings.length} Listings
              </h3>
              <div className="space-y-3">
                {results.listings.map((listing) => (
                  <div
                    key={listing.id}
                    className={`p-4 border rounded-lg ${
                      trendingItems.has(listing.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Image */}
                      {listing.picture && (
                        <div className="flex-shrink-0">
                          <img
                            src={listing.picture}
                            alt={listing.name || listing.brand}
                            className="w-24 h-32 object-cover rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 min-w-0">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">
                            {listing.name ||
                              `${listing.brand} ${listing.style} Dress`}
                          </div>
                          <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                            <span>{listing.brand}</span>
                            <span>•</span>
                            <span className="capitalize">{listing.style}</span>
                          </div>
                          <div className="text-lg font-bold text-green-600 mb-2">
                            ${listing.rentalPrice.toFixed(2)}/rental
                          </div>
                          {listing.url && (
                            <a
                              href={listing.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View on Pickle →
                            </a>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 sm:ml-4 w-full sm:w-auto">
                          <button
                            onClick={() => toggleTrending(listing.id)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto ${
                              trendingItems.has(listing.id)
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {trendingItems.has(listing.id)
                              ? "✓ Trending"
                              : "Mark as Trending"}
                          </button>
                          {trendingItems.has(listing.id) && (
                            <button
                              onClick={() =>
                                setSourcingFor({
                                  brand: listing.brand,
                                  style: listing.style,
                                })
                              }
                              className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors w-full sm:w-auto"
                            >
                              Find Discount Sources
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!results && !loading && (
          <div className="text-center py-12 text-gray-500">
            Click the button above to fetch trending dresses from Pickle
          </div>
        )}
      </div>

      {/* Sourcing Finder Modal */}
      {sourcingFor && (
        <SourcingFinder
          brand={sourcingFor.brand}
          style={sourcingFor.style}
          onClose={() => setSourcingFor(null)}
        />
      )}
    </div>
  );
}
