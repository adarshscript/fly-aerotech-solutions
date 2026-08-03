"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[app] Global error:", error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#0b1020",
          color: "#ffffff",
        }}
      >
        <div style={{ maxWidth: 480, margin: "120px auto", padding: "0 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6 }}>
            This page could not be loaded. If the problem persists, please contact the site owner.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              marginTop: 24,
              padding: "10px 24px",
              borderRadius: 8,
              border: "none",
              background: "#22d3ee",
              color: "#0b1020",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
