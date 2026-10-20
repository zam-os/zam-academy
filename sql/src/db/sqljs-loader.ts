import initSqlJs, { type SqlJsStatic } from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";

let loading: Promise<SqlJsStatic> | null = null;

function decodeBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Loads SQLite (sql.js, WebAssembly). The single-file build inlines the
 * `.wasm` as a data URL, which is decoded here and handed to the module
 * directly, so the page needs no second request and runs from `file://`.
 * The dev server serves the file; then the module fetches it itself.
 */
export function loadSqlJs(): Promise<SqlJsStatic> {
  if (!loading) {
    loading = wasmUrl.startsWith("data:")
      ? initSqlJs({ wasmBinary: decodeBase64(wasmUrl.slice(wasmUrl.indexOf(",") + 1)).buffer as ArrayBuffer })
      : initSqlJs({ locateFile: () => wasmUrl });
  }
  return loading;
}
