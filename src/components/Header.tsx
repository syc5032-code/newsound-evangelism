import React from 'react';
import { PlusCircle, Calendar as CalendarIcon, List, Columns, Download, Sparkles } from 'lucide-react';
import type { ViewMode } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenApplyModal: () => void;
  onOpenDataModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onOpenApplyModal,
  onOpenDataModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Newsound Church Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-red-500/10 ring-2 ring-slate-200/80 shrink-0 bg-black flex items-center justify-center">
              <img
                src="/newsound-logo.png"
                alt="뉴사운드교회 로고"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  뉴사운드교회 노방전도 대시보드
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/60">
                  <Sparkles className="w-3 h-3" /> 2026 사역
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                뉴사운드교회 군단별 전도 일정을 신청하고, 한눈에 확인하는 소통과 기도의 공간
              </p>
            </div>
          </div>

          {/* Controls: View Switcher & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 shadow-xs">
              <button
                type="button"
                onClick={() => onViewModeChange('month')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'month'
                    ? 'bg-white text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="한 달 캘린더 보기"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>월간 달력</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange('week')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'week'
                    ? 'bg-white text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="주간 보기"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>주간</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="목록형 타임라인 보기"
              >
                <List className="w-3.5 h-3.5" />
                <span>목록</span>
              </button>
            </div>

            {/* Data Management Button */}
            <button
              type="button"
              onClick={onOpenDataModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs hover:border-slate-300 cursor-pointer"
              title="데이터 백업 및 엑셀 다운로드"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">엑셀/백업</span>
            </button>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onOpenApplyModal}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>노방전도 신청하기</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
