import type { ApiOk } from "@/types/order";
import type { CreateOrderDTO, OrderCreateResult } from "@/types/order";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
if (!API) throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");

type ApiErrItem = { path?: string; message?: string; code?: string };
type ApiErr = {
  ok: false;
  code?: string;
  message?: string;
  errors?: ApiErrItem[];
};
type ApiResp<T> = ApiOk<T> | ApiErr;

// Helper: build human-friendly message from backend validation errors
function buildErrorMessage(e: ApiErr) {
  if (e?.errors?.length) {
    const lines = e.errors.map((x) =>
      [x.path, x.message].filter(Boolean).join(": ")
    );
    return (e.message ? e.message + " — " : "") + lines.join(" | ");
  }
  return e?.message || e?.code || "Validation failed";
}

export async function createOrder(
  payload: CreateOrderDTO
): Promise<ApiOk<OrderCreateResult>> {
  // Helpful when debugging payload mismatch:
  // console.log("POST /orders payload =>", payload);

  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const json = (await res
    .json()
    .catch(() => ({}))) as ApiResp<OrderCreateResult>;

  if (!res.ok || (json as ApiErr)?.ok === false) {
    const err = json as ApiErr;
    throw Object.assign(new Error(buildErrorMessage(err)), err);
  }

  return json as ApiOk<OrderCreateResult>;
}
