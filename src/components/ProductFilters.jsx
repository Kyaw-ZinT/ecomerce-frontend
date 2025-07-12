// frontend/src/components/ProductFilters.jsx

import React from "react";

function ProductFilters({
  categories,
  onCategoryChange,
  selectedCategory,
  onMinPriceChange,
  onMaxPriceChange,
  minPrice,
  maxPrice,
}) {
  return (
    <div className="mb-8 w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Category Filter */}
        <div className="w-full sm:w-auto">
          <label htmlFor="category-filter" className="block text-gray-700 text-sm font-bold mb-2">
            Category:
          </label>
          <select
            id="category-filter"
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="w-full sm:w-auto flex flex-col items-start">
          <label className="block text-gray-700 text-sm font-bold mb-2">Price Range:</label>
          <div className="flex space-x-2 w-full">
            <input
              type="number"
              placeholder="Min $"
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              min="0"
            />
            <input
              type="number"
              placeholder="Max $"
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;
