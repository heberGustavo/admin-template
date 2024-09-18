import { createContext, ReactNode, useState } from "react";

type Tema = 'dark' | ''

interface AppProviderProps {
    tema?: Tema;
    alternarTema?: () => void;
    children: ReactNode;
}

const AppContext = createContext({
    tema: '',
    alternarTema: () => {}
});

export function AppProvider(props: AppProviderProps) {
    const [tema, setTema] = useState<Tema>('');

    function alternarTema(){
        setTema(tema === "" ? "dark" : "");
    }
   
    return (
        <AppContext.Provider value={{ 
            tema,
            alternarTema
        }}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContext;
