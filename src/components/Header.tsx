import React from 'react';
import { PlusCircle, Calendar as CalendarIcon, List, Columns, Download, Sparkles, Shield, ShieldCheck } from 'lucide-react';
import type { ViewMode } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenApplyModal: () => void;
  onOpenDataModal: () => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onOpenApplyModal,
  onOpenDataModal,
  isAdmin,
  onOpenAdminLogin,
  onAdminLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Newsound Church Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-blue-500/10 ring-2 ring-slate-200/80 shrink-0 bg-slate-900 flex items-center justify-center">
              <img
                src="/newsound-logo.png"
                alt="뉴사운드교회 로고"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                  뉴사운드교회 노방전도
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/70 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-amber-500" /> 대시보드
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                    <ShieldCheck className="w-3 h-3" /> 관리자
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                군단별 노방전도 출격을 신청하고 기도로 하나 되는 연합 플랫폼
              </p>
            </div>
          </div>

          {/* Controls: View Switcher & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* View Mode Segmented Control */}
            <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/70 shadow-2xs">
              <button
                type="button"
                onClick={() => onViewModeChange('month')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'month'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="한 달 캘린더 보기"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>월간</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange('week')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'week'
                    ? 'bg-white text-blue-700 shadow-xs'
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="목록형 타임라인 보기"
              >
                <List className="w-3.5 h-3.5" />
                <span>목록</span>
              </button>
            </div>

            {/* Admin Toggle Button */}
            {isAdmin ? (
              <button
                type="button"
                onClick={onAdminLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-xs cursor-pointer"
                title="관리자 로그아웃"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">관리자 ON</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs cursor-pointer"
                title="관리자 마스터 로그인"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">관리자</span>
              </button>
            )}

            {/* Data Management Button */}
            <button
              type="button"
              onClick={onOpenDataModal}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs hover:border-slate-300 cursor-pointer"
              title="데이터 백업 및 엑셀 다운로드"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">엑셀</span>
            </button>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onOpenApplyModal}
              className="flex items-center gap-1.5 px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-xl transition-all shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>노방전도 신청</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
