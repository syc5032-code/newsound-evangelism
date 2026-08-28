import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { CELL_PRESETS, CORPS_PRESETS } from '../data/presetData';

interface FilterBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedCell: string;
  onSelectedCellChange: (cell: string) => void;
  selectedCorps: string;
  onSelectedCorpsChange: (corps: string) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  availableCells?: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  selectedCell,
  onSelectedCellChange,
  selectedCorps,
  onSelectedCorpsChange,
  onResetFilters,
  totalFilteredCount,
  availableCells,
}) => {
  const isFiltered = searchQuery !== '' || selectedCell !== '' || selectedCorps !== '';

  const cellsList = availableCells && availableCells.length > 0 ? availableCells : CELL_PRESETS;

  return (
    <div className="bg-[#ffffff] p-3 sm:p-4 rounded-[28px] border border-[#ececee] mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      
      {/* Search Input (14px radius, #f4f4f5 background) */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="신청셀, 소속군단, 신청자, 장소, 셀원, 기도제목 검색..."
          className="w-full pl-9.5 pr-8 py-2.5 text-xs sm:text-sm bg-[#f4f4f5] hover:bg-[#ececee]/60 focus:bg-[#ffffff] border border-[#ececee] rounded-[14px] focus:outline-none focus:border-[#09090b] text-[#18181b] placeholder:text-[#a1a1aa] transition-all font-normal"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchQueryChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#71717a] hover:text-[#09090b] bg-[#ececee] hover:bg-[#d4d4d8] w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Select Filters */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
        
        {/* 1. Corps Selector (전체 군단) */}
        <select
          value={selectedCorps}
          onChange={(e) => onSelectedCorpsChange(e.target.value)}
          className={`flex-1 sm:flex-initial text-xs sm:text-sm py-2.5 px-3 rounded-[14px] border transition-all cursor-pointer font-medium ${
            selectedCorps
              ? 'bg-[#09090b] text-[#ffffff] border-[#09090b]'
              : 'bg-[#f4f4f5] text-[#18181b] border-[#ececee] hover:bg-[#ececee]/60'
          } focus:outline-none focus:border-[#09090b]`}
        >
          <option value="" className="bg-[#ffffff] text-[#18181b]">전체 군단</option>
          {CORPS_PRESETS.map((corps) => (
            <option key={corps} value={corps} className="bg-[#ffffff] text-[#18181b]">
              {corps}
            </option>
          ))}
        </select>

        {/* 2. Cell Selector (전체 셀 보기) */}
        <select
          value={selectedCell}
          onChange={(e) => onSelectedCellChange(e.target.value)}
          className={`flex-1 sm:flex-initial text-xs sm:text-sm py-2.5 px-3 rounded-[14px] border transition-all cursor-pointer font-medium ${
            selectedCell
              ? 'bg-[#09090b] text-[#ffffff] border-[#09090b]'
              : 'bg-[#f4f4f5] text-[#18181b] border-[#ececee] hover:bg-[#ececee]/60'
          } focus:outline-none focus:border-[#09090b]`}
        >
          <option value="" className="bg-[#ffffff] text-[#18181b]">전체 셀 보기</option>
          {cellsList.map((cell) => (
            <option key={cell} value={cell} className="bg-[#ffffff] text-[#18181b]">
              {cell}
            </option>
          ))}
        </select>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-medium text-[#18181b] bg-[#f4f4f5] hover:bg-[#ececee] px-3 py-2.5 rounded-[14px] border border-[#ececee] transition-colors whitespace-nowrap cursor-pointer"
            title="필터 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#ff5a00]" />
            <span>초기화</span>
          </button>
        )}

        {/* Result count badge */}
        <div className="text-xs font-medium text-[#71717a] px-3 py-2.5 bg-[#f4f4f5] rounded-[14px] whitespace-nowrap border border-[#ececee]">
          <span>검색 <strong className="text-[#09090b] font-semibold">{totalFilteredCount}</strong>건</span>
        </div>

      </div>

    </div>
  );
};
