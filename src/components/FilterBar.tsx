import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { CELL_PRESETS, CORPS_PRESETS, LOCATION_PRESETS } from '../data/presetData';

interface FilterBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedCell: string;
  onSelectedCellChange: (cell: string) => void;
  selectedCorps: string;
  onSelectedCorpsChange: (corps: string) => void;
  selectedLocation: string;
  onSelectedLocationChange: (loc: string) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  selectedCell,
  onSelectedCellChange,
  selectedCorps,
  onSelectedCorpsChange,
  selectedLocation,
  onSelectedLocationChange,
  onResetFilters,
  totalFilteredCount,
}) => {
  const isFiltered = searchQuery !== '' || selectedCell !== '' || selectedCorps !== '' || selectedLocation !== '';

  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="신청셀, 소속군단, 신청자, 장소, 셀원, 기도제목 검색..."
          className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchQueryChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 w-4 h-4 rounded-full flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>

      {/* Select Filters */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
        
        {/* Cell Selector */}
        <select
          value={selectedCell}
          onChange={(e) => onSelectedCellChange(e.target.value)}
          className="flex-1 sm:flex-initial text-xs sm:text-sm py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
        >
          <option value="">전체 셀 보기</option>
          {CELL_PRESETS.map((cell) => (
            <option key={cell} value={cell}>
              {cell}
            </option>
          ))}
        </select>

        {/* Corps Selector */}
        <select
          value={selectedCorps}
          onChange={(e) => onSelectedCorpsChange(e.target.value)}
          className="flex-1 sm:flex-initial text-xs sm:text-sm py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
        >
          <option value="">전체 군단</option>
          {CORPS_PRESETS.map((corps) => (
            <option key={corps} value={corps}>
              {corps}
            </option>
          ))}
        </select>

        {/* Location Selector */}
        <select
          value={selectedLocation}
          onChange={(e) => onSelectedLocationChange(e.target.value)}
          className="flex-1 sm:flex-initial text-xs sm:text-sm py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
        >
          <option value="">전체 전도 장소</option>
          {LOCATION_PRESETS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-2 rounded-xl border border-rose-200 transition-colors whitespace-nowrap cursor-pointer"
            title="필터 초기화"
          >
            <RotateCcw className="w-3 h-3" />
            <span>초기화</span>
          </button>
        )}

        {/* Result count pill */}
        <div className="text-xs font-medium text-slate-500 px-2.5 py-2 bg-slate-100 rounded-xl whitespace-nowrap">
          검색: <strong className="text-slate-800 font-bold">{totalFilteredCount}</strong>건
        </div>

      </div>

    </div>
  );
};
