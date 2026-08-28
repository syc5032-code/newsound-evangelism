import React, { useRef, useState } from 'react';
import { X, FileSpreadsheet, Download, Upload, RotateCcw, Database, AlertCircle, Cloud, Check, Copy, Key, Link2 } from 'lucide-react';
import type { EvangelismSchedule } from '../types';
import { exportToCSV, exportToJSON, resetToSampleData } from '../utils/storage';
import { getSupabaseConfig, setSupabaseCustomConfig } from '../lib/supabase';

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
  const [activeTab, setActiveTab] = useState<'supabase' | 'backup'>('supabase');

  const supabaseConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseConfig.url || '');
  const [supabaseKey, setSupabaseKey] = useState(supabaseConfig.anonKey || '');
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleSaveSupabaseConfig = () => {
    if (!supabaseUrl || !supabaseKey) {
      setSupabaseCustomConfig('', '');
      onShowToast('Supabase 설정이 초기화되었습니다.', 'info');
      setTimeout(() => window.location.reload(), 500);
      return;
    }

    if (!supabaseUrl.startsWith('https://')) {
      onShowToast('올바른 Supabase Project URL (https://...)을 입력해주세요.', 'error');
      return;
    }

    setSupabaseCustomConfig(supabaseUrl, supabaseKey);
    onShowToast('⚡ Supabase 실시간 DB 설정이 저장되었습니다! 새로고침합니다.', 'success');
    setTimeout(() => window.location.reload(), 600);
  };

  const handleCopySql = () => {
    const sql = `-- ⛪ 뉴사운드교회 노방전도 실시간 데이터베이스 테이블 생성 SQL
CREATE TABLE IF NOT EXISTS public.evangelism_schedules (
  id TEXT PRIMARY KEY,
  cell_name TEXT NOT NULL,
  corps_name TEXT DEFAULT '',
  cell_leader TEXT NOT NULL,
  contact TEXT DEFAULT '',
  date TEXT NOT NULL,
  day_of_week TEXT DEFAULT '',
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  location TEXT NOT NULL,
  participant_count INTEGER DEFAULT 1,
  participants JSONB DEFAULT '[]'::jsonb,
  prayer_topics TEXT DEFAULT '',
  password TEXT DEFAULT '',
  theme_color TEXT DEFAULT 'blue',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- RLS (Row Level Security) 설정 및 전체 읽기/쓰기 허용 정책
ALTER TABLE public.evangelism_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.evangelism_schedules FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.evangelism_schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.evangelism_schedules FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.evangelism_schedules FOR DELETE USING (true);

-- ⚡ 실시간 변경 알림 (Realtime) 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE public.evangelism_schedules;`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    onShowToast('테이블 생성 SQL이 클립보드에 복사되었습니다!', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#09090b]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] rounded-[28px] shadow-2xl border border-[#ececee] max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#ececee] flex items-center justify-between bg-[#fafafa]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[12px] bg-[#09090b] text-[#ffffff] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#09090b]">
                실시간 DB 연동 & 데이터 관리
              </h2>
              <p className="text-xs text-[#71717a]">
                다른 사람과 실시간 공유하거나 엑셀로 백업할 수 있습니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] rounded-[10px] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#ececee] bg-[#ffffff] px-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('supabase')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'supabase'
                ? 'border-[#09090b] text-[#09090b]'
                : 'border-transparent text-[#71717a] hover:text-[#09090b]'
            }`}
          >
            <Cloud className="w-4 h-4 text-[#3ecf8e]" />
            <span>⚡ Supabase 실시간 DB</span>
            {supabaseConfig.isConfigured && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="실시간 연결됨" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'backup'
                ? 'border-[#09090b] text-[#09090b]'
                : 'border-transparent text-[#71717a] hover:text-[#09090b]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>엑셀 & 파일 백업</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {activeTab === 'supabase' ? (
            <div className="space-y-4">
              
              {/* Connection Status Banner */}
              <div className={`p-4 rounded-[18px] border flex items-center justify-between gap-3 ${
                supabaseConfig.isConfigured
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/70 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${
                    supabaseConfig.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`} />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">
                      {supabaseConfig.isConfigured
                        ? '⚡ Supabase 실시간 DB 연결됨 (실시간 공유 중)'
                        : '⚠️ Supabase 미연결 (로컬 저장소 모드)'}
                    </h4>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      {supabaseConfig.isConfigured
                        ? '다른 사람이 신청한 일정이 0.1초 만에 내 화면에 즉시 나타납니다.'
                        : 'Supabase URL과 Key를 등록하면 모든 사람과 실시간 공유됩니다.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supabase Config Form */}
              <div className="space-y-3 p-4 bg-[#fafafa] rounded-[20px] border border-[#ececee]">
                <div>
                  <label className="block text-xs font-bold text-[#18181b] mb-1 flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5 text-[#71717a]" />
                    <span>Supabase Project URL</span>
                  </label>
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3 py-2 text-xs rounded-[10px] border border-[#ececee] bg-[#ffffff] text-[#09090b] focus:outline-none focus:ring-1 focus:ring-[#09090b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181b] mb-1 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-[#71717a]" />
                    <span>Supabase Anon Public Key</span>
                  </label>
                  <input
                    type="password"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-2 text-xs font-mono rounded-[10px] border border-[#ececee] bg-[#ffffff] text-[#09090b] focus:outline-none focus:ring-1 focus:ring-[#09090b]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveSupabaseConfig}
                  className="w-full py-2.5 px-4 bg-[#09090b] hover:bg-[#18181b] text-[#ffffff] text-xs font-bold rounded-[12px] transition-all cursor-pointer shadow-xs"
                >
                  Supabase 설정 저장 및 실시간 연동 시작
                </button>
              </div>

              {/* SQL Schema Generator */}
              <div className="p-4 bg-[#ffffff] rounded-[20px] border border-[#ececee] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-[#09090b]">📋 Supabase 1초 테이블 생성 SQL</h5>
                    <p className="text-[11px] text-[#71717a]">Supabase SQL Editor에 복사하여 붙여넣으면 테이블이 자동 생성됩니다.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="px-2.5 py-1.5 bg-[#f4f4f5] hover:bg-[#ececee] text-[#18181b] text-xs font-semibold rounded-[8px] border border-[#ececee] flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? '복사됨!' : 'SQL 복사'}</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-4">
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
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#ececee] bg-[#fafafa] text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#f4f4f5] hover:bg-[#ececee] text-[#18181b] rounded-[12px] text-xs font-semibold transition-colors cursor-pointer border border-[#ececee]"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
