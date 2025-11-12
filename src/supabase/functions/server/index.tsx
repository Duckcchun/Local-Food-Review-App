// @deno-types="https://deno.land/x/hono@v3.1.7/mod.ts"
import { Hono } from "https://deno.land/x/hono@v3.1.7/mod.ts";
// @deno-types="https://deno.land/x/hono@v3.1.7/middleware/cors.ts"
import { cors } from "https://deno.land/x/hono@v3.1.7/middleware/cors.ts";
// @deno-types="https://deno.land/x/hono@v3.1.7/middleware/logger.ts"
import { logger } from "https://deno.land/x/hono@v3.1.7/middleware/logger.ts";
// @deno-types="https://esm.sh/@supabase/supabase-js@2.39.3"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import * as kv from "./kv_store.tsx";

declare const Deno: any;

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Initialize Supabase Client for auth
const supabaseAuth = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

// Health check endpoint
app.get("/make-server-98b21042/health", (c: { json: (arg0: { status: string; }) => any; }) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-98b21042/signup", async (c: { req: { json: () => any; }; json: (arg0: { error?: string; success?: boolean; user?: { id: any; email: any; name: any; phone: any; userType: any; businessName: any; businessNumber: any; businessAddress: any; createdAt: string; }; message?: string; }, arg1: number | undefined) => any; }) => {
  try {
    const body = await c.req.json();
    const { email, password, name, phone, userType, businessName, businessNumber, businessAddress } = body;

    if (!email || !password || !name || !phone || !userType) {
      return c.json({ error: "필수 정보를 모두 입력해주세요" }, 400);
    }

    // Check if user already exists
    const existingUser = await kv.get(`user:${email}`);
    if (existingUser) {
      return c.json({ error: "이미 존재하는 이메일입니다" }, 400);
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone, userType },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (authError) {
      console.log(`Auth error during signup: ${authError.message}`);
      return c.json({ error: `회원가입 실패: ${authError.message}` }, 400);
    }

    // Store user data in KV store
    const userData = {
      id: authData.user.id,
      email,
      name,
      phone,
      userType,
      businessName: businessName || null,
      businessNumber: businessNumber || null,
      businessAddress: businessAddress || null,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${email}`, userData);
    await kv.set(`user:id:${authData.user.id}`, userData);

    return c.json({ 
      success: true, 
      user: userData,
      message: "회원가입이 완료되었습니다" 
    }, 200);
  } catch (error: unknown) {
    console.log(`Error during signup:`, error);
    const message = error instanceof Error ? error.message : String(error);
    return c.json({ error: `서버 오류: ${message}` }, 500);
  }
});

// Sign in endpoint
interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  success: boolean;
  user: any;
  accessToken: string;
  message: string;
}

app.post("/make-server-98b21042/signin", async (c: { req: { json: () => Promise<SignInRequest> }; json: (arg0: { error?: string; success?: boolean; user?: any; accessToken?: string; message?: string }, arg1: number) => any }) => {
  try {
    const body: SignInRequest = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: "이메일과 비밀번호를 입력해주세요" }, 400);
    }

    // Sign in with Supabase Auth
    const { data: signInData, error: signInError } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.log(`Auth error during signin: ${signInError.message}`);
      return c.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다" }, 401);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${email}`);
    
    if (!userData) {
      return c.json({ error: "사용자 정보를 찾을 수 없습니다" }, 404);
    }

    const response: SignInResponse = {
      success: true, 
      user: userData,
      accessToken: signInData.session.access_token,
      message: "로그인 성공" 
    };

    return c.json(response, 200);
  } catch (error: unknown) {
    console.log(`Error during signin:`, error);
    const message = error instanceof Error ? error.message : String(error);
    return c.json({ error: `서버 오류: ${message}` }, 500);
  }
});

// Get user profile endpoint (requires auth)
app.get("/make-server-98b21042/profile", async (c: { req: { header: (arg0: string) => string; }; json: (arg0: { error?: string; success?: boolean; user?: any; }, arg1: number) => any; }) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "인증 토큰이 필요합니다" }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "유효하지 않은 토큰입니다" }, 401);
    }

    const userData = await kv.get(`user:id:${user.id}`);
    
    if (!userData) {
      return c.json({ error: "사용자 정보를 찾을 수 없습니다" }, 404);
    }

    return c.json({ success: true, user: userData }, 200);
  } catch (error: unknown) {
    console.log(`Error getting profile:`, error);
    const message = error instanceof Error ? error.message : String(error);
    return c.json({ error: `서버 오류: ${message}` }, 500);
  }
});

// Create or