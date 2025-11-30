"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button
        onClick={reset}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        Try again
      </button>
    </div>
  );
}
