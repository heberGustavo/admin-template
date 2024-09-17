import MenuLateral from "./MenuLateral";
import Cabecalho from "./Cabecalho";
import Conteudo from "./Conteudo";
import { ReactNode } from "react";

interface LayoutProps {
    titulo: string;
    subtitulo: string;
    children?: ReactNode;
}

export default function Layout(props: LayoutProps) {
    return (
        <div className={`dark flex h-screen w-screen`}>
            <MenuLateral />
            <div className={`
                flex flex-col w-full p-7
                bg-gray-300 dark:bg-gray-800
            `}>
                <Cabecalho titulo={props.titulo} subtitulo={props.subtitulo} />
                <Conteudo>
                    {props.children}
                </Conteudo>
            </div>
        </div>
    );
}