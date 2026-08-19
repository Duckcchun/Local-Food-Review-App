import { toast } from 'sonner';

/**
 * 공유하기 유틸리티.
 * - Web Share API 지원 시 네이티브 공유 시트
 * - 미지원 시 클립보드에 링크 복사
 */

interface ShareData {
  title: string;
  description?: string;
  url?: string;
}

/**
 * 공유하기 실행
 */
export async function shareContent(data: ShareData): Promise<void> {
  const shareUrl = data.url || window.location.href;
  const shareData = {
    title: data.title,
    text: data.description || '',
    url: shareUrl,
  };

  // Web Share API (모바일에서 카카오톡, 문자 등 공유 시트)
  if (navigator.share && isMobile()) {
    try {
      await navigator.share(shareData);
      return;
    } catch (err: any) {
      // 사용자가 취소한 경우
      if (err.name === 'AbortError') return;
    }
  }

  // 폴백: 클립보드에 링크 복사
  await copyToClipboard(shareUrl);
  toast.success('링크가 복사되었습니다!');
}

/**
 * 클립보드에 복사
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 폴백: execCommand
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const result = document.execCommand('copy');
    document.body.removeChild(textArea);
    return result;
  }
}

/**
 * 모바일 감지
 */
function isMobile(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
