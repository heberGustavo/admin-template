import Image from "next/image";
import loading from "../../../public/images/loading.gif";
import useAuth from "@/data/hook/useAuth";
import router from "next/router";
import Head from "next/head";
import { ReactNode } from "react";

interface ForcarAutenticacaoProps {
    children: ReactNode;
}

export default function ForcarAutenticacao(props: ForcarAutenticacaoProps) {

    const { usuario, carregando } = useAuth();

    function renderizarConteudo() {
        return (
            <>
                <Head>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                if(!document.cookie.includes("admin-template-hg-auth")){
                                    document.location.href = "/autenticacao"
                                }
                            `
                        }}
                    />
                </Head>
                {props.children}
            </>
        )
    }

    function renderizarCarregando() {
        return (
            <div className="flex justify-center items-center h-screen">
                <Image
                    src={loading}
                    alt="Carregando..."
                    width={50}
                    height={50}
                />
            </div>
        )
    }

    if (!carregando && usuario?.email)
        return renderizarConteudo();
    else if (carregando)
        return renderizarCarregando();
    else {
        router.push('/autenticacao');
        return null;
    }
}