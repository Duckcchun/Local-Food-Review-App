import { useState, useEffect } from 'react';

const DARK_MODE_KEY = 'darkMode';

/**
 * 다크모드 훅.
 * - localStorage에 설정 저장
 * - html 태그에 'dark' 클래스 토글
 * - 시스템 설정 감지 (초기값)
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // localStorage 우선
    const saved = localStorage.getItem(DARK_MODE_KEY);
    if (saved !== null) return saved === 'true';
    // 시스템 설정 폴백
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(DARK_MODE_KEY, String(isDark));
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);

  return { isDark, toggle };
}
