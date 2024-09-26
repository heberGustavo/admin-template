import MenuLateral from "./MenuLateral";
import Cabecalho from "./Cabecalho";
import Conteudo from "./Conteudo";
import { ReactNode } from "react";
import useAppData from "@/data/hook/useAppData";
import forcarAutenticacao from "../../functions/forcarAutenticacao";
//import ForcarAutenticacao from "../auth/ForcarAutenticacao";

interface LayoutProps {
    titulo: string;
    subtitulo: string;
    children?: ReactNode;
}

export default function Layout(props: LayoutProps) {
    const { tema } = useAppData();

    return forcarAutenticacao(
        <div className={`${tema} flex h-screen w-screen`}>
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
    )
}