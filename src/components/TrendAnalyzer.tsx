"use client";

import { useState } from "react";
import type { DressListing, TrendAnalysisResult } from "@/types";
import { SourcingFinder } from "./SourcingFinder";

export function TrendAnalyzer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TrendAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trendingItems, setTrendingItems] = useState<Set<string>>(new Set());
  const [sourcingFor, setSourcingFor] = useState<{
    brand: string;
    style: string;
  } | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `Pickle ${searchQuery} dress rental`,
          type: "trends",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Search failed");
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

        {/* Search Input */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search Pickle (e.g., 'black midi dress', 'Zara dress')"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
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
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {listing.brand}
                          </span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600 capitalize">
                            {listing.style}
                          </span>
                        </div>
                        <div className="text-gray-700 mb-2">
                          {listing.description ||
                            `${listing.brand} ${listing.style} dress`}
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          ${listing.rentalPrice.toFixed(2)}/rental
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => toggleTrending(listing.id)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
                            className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                          >
                            Find Discount Sources
                          </button>
                        )}
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
            Enter a search query to find trending dresses on Pickle
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
