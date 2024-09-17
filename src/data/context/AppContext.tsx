import { createContext, ReactNode } from "react";

interface AppProviderProps {
    children: ReactNode;
}

const AppContext = createContext({
    nome: ""
});

export function AppProvider({ children }: AppProviderProps) {
    return (
        <AppContext.Provider value={{ nome: "Teste Context API" }}>
            {children}
        </AppContext.Provider>
    );
}

export default AppContext;
