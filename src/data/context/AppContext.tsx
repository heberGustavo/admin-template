import { createContext, ReactNode, useEffect, useState } from "react";

//type Tema = 'dark' | ''

interface AppProviderProps {
    tema?: string;
    alternarTema?: () => void;
    children: ReactNode;
}

const AppContext = createContext({
    tema: '',
    alternarTema: () => {}
});

export function AppProvider(props: AppProviderProps) {
    const [tema, setTema] = useState('');

    function alternarTema(){
        const novoTema = tema === "" ? "dark" : "";
        
        setTema(novoTema);
        localStorage.setItem("tema", novoTema);
    }

    useEffect(() => {
        const temaSalvo = localStorage.getItem("tema");
        setTema(temaSalvo ?? "");
    }, [])
   
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
