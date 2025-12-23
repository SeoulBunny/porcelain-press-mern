import { createContext, useContext, useMemo, useState } from "react";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [lastQuery, setLastQuery] = useState("");

  const value = useMemo(() => ({ lastQuery, setLastQuery }), [lastQuery]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  return useContext(SearchContext);
}
