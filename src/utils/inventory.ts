/**
 * 구매한 아이템 인벤토리 시스템.
 *
 * 포인트샵에서 구매한 아이템의 저장, 사용, 만료 관리.
 * localStorage 기반 (유저별 namespace).
 */

export interface PurchasedItem {
  id: string;
  productId: string;
  name: string;
  icon: string;
  category: "priority" | "coupon" | "premium" | "badge";
  purchasedAt: string;
  expiresAt: string | null; // null = 영구
  used: boolean;
  usedAt: string | null;
}

const STORAGE_KEY = 'purchasedItems';

/**
 * 아이템 유효기간 계산 (구매일 기준)
 */
function getExpirationDate(category: string, benefit: string): string | null {
  // 배지는 영구
  if (category === 'badge') return null;

  // benefit 문자열에서 기간 추출
  if (benefit.includes('영구')) return null;

  const now = new Date();
  if (benefit.includes('30일') || benefit.includes('1개월')) {
    now.setDate(now.getDate() + 30);
  } else if (benefit.includes('15일')) {
    now.setDate(now.getDate() + 15);
  } else if (benefit.includes('1회')) {
    // 1회 사용 아이템은 30일 내 사용
    now.setDate(now.getDate() + 30);
  } else {
    // 기본 30일
    now.setDate(now.getDate() + 30);
  }

  return now.toISOString();
}

/**
 * 구매한 아이템 목록 가져오기
 */
export function getPurchasedItems(userEmail: string): PurchasedItem[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${userEmail}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * 아이템 구매 (인벤토리에 추가)
 */
export function addPurchasedItem(
  userEmail: string,
  product: { id: string; name: string; icon: string; category: string; benefit: string }
): PurchasedItem {
  const items = getPurchasedItems(userEmail);

  const newItem: PurchasedItem = {
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    productId: product.id,
    name: product.name,
    icon: product.icon,
    category: product.category as PurchasedItem['category'],
    purchasedAt: new Date().toISOString(),
    expiresAt: getExpirationDate(product.category, product.benefit),
    used: false,
    usedAt: null,
  };

  items.push(newItem);
  savePurchasedItems(userEmail, items);
  return newItem;
}

/**
 * 아이템 사용 처리
 */
export function useItem(userEmail: string, itemId: string): boolean {
  const items = getPurchasedItems(userEmail);
  const item = items.find(i => i.id === itemId);

  if (!item || item.used) return false;
  if (item.expiresAt && new Date(item.expiresAt) < new Date()) return false;

  item.used = true;
  item.usedAt = new Date().toISOString();
  savePurchasedItems(userEmail, items);
  return true;
}

/**
 * 활성 아이템 목록 (미사용 + 만료 안 됨)
 */
export function getActiveItems(userEmail: string): PurchasedItem[] {
  const items = getPurchasedItems(userEmail);
  const now = new Date();

  return items.filter(item => {
    if (item.used) return false;
    if (item.expiresAt && new Date(item.expiresAt) < now) return false;
    return true;
  });
}

/**
 * 특정 카테고리의 활성 아이템
 */
export function getActiveItemsByCategory(userEmail: string, category: PurchasedItem['category']): PurchasedItem[] {
  return getActiveItems(userEmail).filter(item => item.category === category);
}

/**
 * 배지 목록 (구매한 배지 = 영구)
 */
export function getOwnedBadges(userEmail: string): PurchasedItem[] {
  return getPurchasedItems(userEmail).filter(item => item.category === 'badge');
}

/**
 * 우선 선정권 보유 여부 (미사용 + 유효)
 */
export function hasPriorityPass(userEmail: string): PurchasedItem | null {
  const items = getActiveItemsByCategory(userEmail, 'priority');
  return items.length > 0 ? items[0] : null;
}

/**
 * 우선 선정권 사용 (1회 소모)
 */
export function usePriorityPass(userEmail: string): boolean {
  const pass = hasPriorityPass(userEmail);
  if (!pass) return false;
  return useItem(userEmail, pass.id);
}

// ─── Internal ──────────────────────────────────────────────────────────────

function savePurchasedItems(userEmail: string, items: PurchasedItem[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEY}:${userEmail}`, JSON.stringify(items));
  } catch {}
}
