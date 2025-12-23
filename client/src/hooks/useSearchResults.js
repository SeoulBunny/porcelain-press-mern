import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function useSearchResults(q) {
  const [data, setData] = useState({ journals: [], articles: [] });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!q) return;

    let live = true;

    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await api(`/search?q=${encodeURIComponent(q)}`);
        if (live) setData(res);
      } catch (e) {
        if (live) setErr(e.message);
      } finally {
        if (live) setLoading(false);
      }
    })();

    return () => { live = false; };
  }, [q]);

  return { data, loading, err };
}
