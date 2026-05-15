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

const envProjectId = import.meta.env?.VITE_SUPABASE_PROJECT_ID as
  | string
  | undefined;
const envAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export const projectId = envProjectId || "";
export const publicAnonKey = envAnonKey || "";

if (
  import.meta.env?.DEV &&
  (!import.meta.env?.VITE_SUPABASE_PROJECT_ID ||
    !import.meta.env?.VITE_SUPABASE_ANON_KEY)
) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] VITE_SUPABASE_PROJECT_ID / VITE_SUPABASE_ANON_KEY가 설정되지 않았습니다. .env 파일을 생성해주세요."
  );
}

if (!projectId || !publicAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: VITE_SUPABASE_PROJECT_ID and VITE_SUPABASE_ANON_KEY"
  );
}
