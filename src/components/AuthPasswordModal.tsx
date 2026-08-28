import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { EvangelismSchedule } from '../types';
import { ADMIN_PASSWORDS } from '../data/presetData';

interface AuthPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSchedule: EvangelismSchedule | null;
  actionType: 'edit' | 'delete' | 'admin-login';
  isAdmin: boolean;
  onSuccess: () => void;
}

export const AuthPasswordModal: React.FC<AuthPasswordModalProps> = ({
  isOpen,
  onClose,
  targetSchedule,
  actionType,
  isAdmin,
  onSuccess,
}) => {
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setInputPassword('');
    setShowPassword(true);
    setErrorMsg('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = inputPassword.trim();

    if (!entered) {
      setErrorMsg('비밀번호를 입력해주세요.');
      return;
    }

    // Check admin master password
    const isAdminPassword = ADMIN_PASSWORDS.includes(entered);

    if (actionType === 'admin-login') {
      if (isAdminPassword) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg('관리자 비밀번호가 일치하지 않습니다.');
      }
      return;
    }

    // For schedule edit / delete:
    // 1. If already admin, bypass
    // 2. If password matches schedule password or admin password, succeed
    const schedulePassword = targetSchedule?.password || '1234';
    if (isAdmin || entered === schedulePassword || isAdminPassword) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg('비밀번호가 일치하지 않습니다. (신청 비밀번호 또는 관리자 비밀번호 필요)');
    }
  };

  const actionText = actionType === 'delete' ? '일정 삭제' : actionType === 'edit' ? '일정 수정' : '관리자 모드 인증';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{actionText} 권한 확인</h3>
              <p className="text-[11px] text-slate-500">본인 또는 관리자만 가능합니다</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleVerify} className="p-5 space-y-4">
          
          {targetSchedule && actionType !== 'admin-login' && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600">
              <p className="font-bold text-slate-800">[{targetSchedule.cellName}] 전도 일정</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{targetSchedule.date} | {targetSchedule.location}</p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                비밀번호 입력
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? '가리기' : '보기'}</span>
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="신청 시 입력한 비밀번호 또는 관리자 번호"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono tracking-wider font-bold text-slate-800"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              * 신청자 본인의 비밀번호 또는 관리자 마스터 비밀번호를 입력해주세요.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 text-xs font-bold text-white rounded-xl shadow-xs transition-all cursor-pointer ${
                actionType === 'delete'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              확인
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
