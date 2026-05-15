/**
 * Supabase project credentials.
 *
 * Loaded from Vite environment variables at build time.
 * Define these in a local `.env` file (see `.env.example`):
 *   VITE_SUPABASE_PROJECT_ID
 *   VITE_SUPABASE_ANON_KEY
 *
 * Note: the anon key is safe to expose to the browser, but committing it to
 * git makes key rotation impossible — keep it in env vars instead.
 */

const FALLBACK_PROJECT_ID = "pqvtdkcapilwfrzduosn";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdnRka2NhcGlsd2ZyemR1b3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzgxMzEsImV4cCI6MjA3ODM1NDEzMX0.pROwMNjxB3_CLagoDxICu_zRDlG9QwTYFQBrBHbcko4";

export const projectId =
  (import.meta.env?.VITE_SUPABASE_PROJECT_ID as string | undefined) ||
  FALLBACK_PROJECT_ID;

export const publicAnonKey =
  (import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  FALLBACK_ANON_KEY;

if (
  import.meta.env?.DEV &&
  (!import.meta.env?.VITE_SUPABASE_PROJECT_ID ||
    !import.meta.env?.VITE_SUPABASE_ANON_KEY)
) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] VITE_SUPABASE_PROJECT_ID / VITE_SUPABASE_ANON_KEY가 설정되지 않아 fallback 값을 사용합니다. .env 파일을 생성해주세요."
  );
}
