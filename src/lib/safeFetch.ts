/**
 * Safe JSON fetch utility preventing "Unexpected token 'T', 'The page c'... is not valid JSON" errors.
 * Inspects response status, Content-Type headers, and response text BEFORE parsing JSON.
 * Completely handles HTML error pages (404/500), Vercel SPA fallbacks, Python static servers, and proxy blocks.
 */

export interface SafeFetchResult<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  status?: number;
  isHtmlResponse?: boolean;
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<SafeFetchResult<T>> {
  try {
    const response = await fetch(url, options);
    const status = response.status;
    const contentType = (response.headers.get("content-type") || "").toLowerCase();

    // Read response text first to safely inspect payload before any JSON parsing
    const rawText = await response.text();
    const trimmed = rawText.trim();

    // Check if Content-Type is NOT application/json or payload is HTML/non-JSON text
    const isJsonContentType = contentType.includes("application/json");
    const isHtmlPayload =
      trimmed.startsWith("<") ||
      trimmed.toLowerCase().startsWith("<!doctype") ||
      trimmed.startsWith("The page") ||
      trimmed.startsWith("The requested") ||
      trimmed.includes("<html>") ||
      trimmed.includes("404 Not Found") ||
      trimmed.includes("500 Internal");

    if (!isJsonContentType || isHtmlPayload) {
      console.warn(
        `[SafeFetch] Static host or non-JSON/HTML response detected for ${url} (HTTP ${status}, Content-Type: ${contentType}):`,
        trimmed.slice(0, 100)
      );

      return {
        ok: false,
        status,
        isHtmlResponse: true,
        error: `서버 API 경로(${url})가 연결되지 않았거나 HTML 오류 페이지가 반환되었습니다. (HTTP ${status})`
      };
    }

    if (!trimmed) {
      return { ok: response.ok, status, data: undefined };
    }

    // Safely parse JSON with try-catch block
    let parsedData: any;
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseError) {
      console.warn(`[SafeFetch] JSON.parse safely caught exception for response from ${url}:`, parseError);
      return {
        ok: false,
        status,
        error: "서버 응답이 올바른 JSON 형식이 아닙니다."
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        status,
        error: parsedData?.error || parsedData?.message || `서버 오류가 발생했습니다. (HTTP ${status})`
      };
    }

    return { ok: true, status, data: parsedData as T };
  } catch (netErr: any) {
    console.warn(`[SafeFetch] Network exception silently caught for ${url}:`, netErr);
    return {
      ok: false,
      error: netErr?.message || "네트워크 연결 중 오류가 발생했습니다."
    };
  }
}
