import React, { useRef, useState } from 'react';
import { X, FileSpreadsheet, Download, Upload, RotateCcw, Database, AlertCircle } from 'lucide-react';
import type { EvangelismSchedule } from '../types';
import { exportToCSV, exportToJSON, resetToSampleData } from '../utils/storage';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedules: EvangelismSchedule[];
  onDataRestored: (schedules: EvangelismSchedule[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  schedules,
  onDataRestored,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    exportToCSV(schedules);
    onShowToast('엑셀(CSV) 파일 다운로드를 시작했습니다.', 'success');
  };

  const handleExportJSON = () => {
    exportToJSON(schedules);
    onShowToast('데이터 백업(JSON) 파일을 다운로드했습니다.', 'success');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          onDataRestored(parsed);
          onShowToast(`총 ${parsed.length}개의 전도 일정을 성공적으로 복원했습니다.`, 'success');
          onClose();
        } else {
          onShowToast('올바르지 않은 백업 파일 형식입니다.', 'error');
        }
      } catch (err) {
        onShowToast('파일을 읽는 도중 오류가 발생했습니다.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    const defaultData = resetToSampleData();
    onDataRestored(defaultData);
    setResetConfirm(false);
    onShowToast('기본 샘플 데이터로 초기화되었습니다.', 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                데이터 백업 & 엑셀 관리
              </h2>
              <p className="text-xs text-slate-500">
                전도 신청 목록을 엑셀로 저장하거나 백업할 수 있습니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* 1. Export CSV */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">엑셀 (CSV) 파일 다운로드</h4>
                <p className="text-xs text-slate-500">
                  교회 주보, 보고서, 인쇄용 엑셀 스프레드시트로 내보냅니다.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              다운로드
            </button>
          </div>

          {/* 2. Export JSON */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">전체 데이터 백업 (JSON)</h4>
                <p className="text-xs text-slate-500">
                  현재 등록된 모든 일정 및 설정 데이터를 파일로 보관합니다.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              백업하기
            </button>
          </div>

          {/* 3. Import JSON */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">백업 데이터 복원</h4>
                <p className="text-xs text-slate-500">
                  저장해둔 JSON 백업 파일을 불러와 복원합니다.
                </p>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              파일 선택
            </button>
          </div>

          {/* 4. Reset to Initial Sample Data */}
          <div className="pt-2 border-t border-slate-100">
            {!resetConfirm ? (
              <button
                type="button"
                onClick={() => setResetConfirm(true)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-dashed border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>샘플 데이터로 초기화하기</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2 animate-in fade-in">
                <p className="text-xs font-bold text-rose-800 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>기본 샘플 데이터로 복원하시겠습니까?</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
                  >
                    초기화 확인
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetConfirm(false)}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
