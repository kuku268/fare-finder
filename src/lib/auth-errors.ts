import type { AuthError } from "@supabase/supabase-js";

/** Turn Supabase auth errors into Traditional Chinese messages for customers. */
export function authErrorMessage(error: AuthError | Error): string {
  const code = "code" in error ? (error as AuthError).code : undefined;
  switch (code) {
    case "email_not_confirmed":
      return "這個 Email 還沒完成驗證，請到信箱點驗證連結（也請檢查垃圾郵件匣）。";
    case "invalid_credentials":
      return "Email 或密碼錯誤。";
    case "user_already_exists":
      return "這個 Email 已經註冊過了，請直接登入。";
    case "weak_password":
      return "密碼太弱，請至少 6 個字元。";
    case "over_email_send_rate_limit":
      return "寄信太頻繁，請稍等一分鐘再試。";
    case "same_password":
      return "新密碼不能和舊密碼相同。";
    default:
      return error.message;
  }
}
