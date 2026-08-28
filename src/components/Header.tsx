import React from 'react';
import { Plus, Calendar as CalendarIcon, List, Columns, Download, Shield, ShieldCheck } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#ececee]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Newsound Church Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] overflow-hidden border border-[#ececee] shrink-0 bg-[#09090b] flex items-center justify-center">
              <img
                src="/newsound-logo.png"
                alt="뉴사운드교회 로고"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#09090b]">
                  뉴사운드교회 노방전도
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-[10000px] text-[11px] font-medium bg-[#f4f4f5] text-[#18181b] border border-[#ececee]">
                  2026 사역
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[10000px] text-[11px] font-semibold bg-[#18181b] text-[#ffffff]">
                    <ShieldCheck className="w-3 h-3 text-[#ff5a00]" /> 관리자
                  </span>
                )}
              </div>
              <p className="text-xs text-[#71717a] hidden sm:block">
                군단별 노방전도 출격을 신청하고 확인하는 사역 플랫폼
              </p>
            </div>
          </div>

          {/* Controls: View Switcher & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* View Mode Segmented Control */}
            <div className="flex items-center p-1 bg-[#f4f4f5] rounded-[14px] border border-[#ececee]">
              <button
                type="button"
                onClick={() => onViewModeChange('month')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs transition-all cursor-pointer ${
                  viewMode === 'month'
                    ? 'bg-[#ffffff] text-[#09090b] font-semibold border border-[#ececee]'
                    : 'text-[#71717a] hover:text-[#09090b]'
                }`}
                title="한 달 캘린더 보기"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>월간</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange('week')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs transition-all cursor-pointer ${
                  viewMode === 'week'
                    ? 'bg-[#ffffff] text-[#09090b] font-semibold border border-[#ececee]'
                    : 'text-[#71717a] hover:text-[#09090b]'
                }`}
                title="주간 보기"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>주간</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#ffffff] text-[#09090b] font-semibold border border-[#ececee]'
                    : 'text-[#71717a] hover:text-[#09090b]'
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
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#18181b] bg-[#f4f4f5] hover:bg-[#ececee] border border-[#ececee] rounded-[14px] transition-colors cursor-pointer"
                title="관리자 로그아웃"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff5a00]" />
                <span className="hidden md:inline">관리자 ON</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#52525b] hover:text-[#09090b] bg-[#ffffff] hover:bg-[#fafafa] border border-[#ececee] rounded-[14px] transition-colors cursor-pointer"
                title="관리자 로그인"
              >
                <Shield className="w-3.5 h-3.5 text-[#71717a]" />
                <span className="hidden md:inline">관리자</span>
              </button>
            )}

            {/* Data Export Button */}
            <button
              type="button"
              onClick={onOpenDataModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#18181b] bg-[#ffffff] hover:bg-[#fafafa] border border-[#ececee] rounded-[14px] transition-colors cursor-pointer"
              title="데이터 백업 및 엑셀 다운로드"
            >
              <Download className="w-3.5 h-3.5 text-[#71717a]" />
              <span className="hidden md:inline">엑셀</span>
            </button>

            {/* Primary Action Button (Awesomic Obsidian Button) */}
            <button
              type="button"
              onClick={onOpenApplyModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-[#ffffff] bg-[#09090b] hover:bg-[#18181b] rounded-[14px] border border-[#27272a] transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>노방전도 신청하기</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
