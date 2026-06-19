import { createContext } from "react";

// Context
export const ApiContext = createContext();

// Provider Component
const ApiProvider = ({ children }) => {
  const value = {
    serverUrl: "http://localhost:3001",
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export default ApiProvider;
