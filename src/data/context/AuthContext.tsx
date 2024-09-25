import route from 'next/router';
import Cookies from 'js-cookie';
import firebase from "@/firebase/config";
import Usuario from "@/model/Usuario";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AppProviderProps {
    usuario?: Usuario;
    loginGoogle?: () => Promise<void>;
    children: ReactNode;
}

const AuthContext = createContext({
    usuario: null as Usuario | null,
    loginGoogle: () => { }
});

async function usuarioNormalizado(usuarioFirebase: firebase.User): Promise<Usuario> {
    const token = await usuarioFirebase.getIdToken();
    return {
        uid: usuarioFirebase.uid,
        nome: usuarioFirebase.displayName,
        email: usuarioFirebase.email,
        token,
        provedor: usuarioFirebase.providerData[0]?.providerId,
        imagemUrl: usuarioFirebase.photoURL
    }
}

function gerenciarCookie(logado: boolean){
    const nomeCookie = "admin-template-hg-auth";

    if(logado){
        Cookies.set(nomeCookie, logado.toString().toLowerCase(), {
            expires: 7
        });
    }
    else{
        Cookies.remove(nomeCookie);
    }
}

export function AuthProvider(props: AppProviderProps) {
    const [carregando, setCarregando] = useState<boolean>(true);
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    async function configurarSessao(usuarioFirebase: firebase.User | null) {
        if(usuarioFirebase?.email){
            const usuario = await usuarioNormalizado(usuarioFirebase);
            setUsuario(usuario);
            gerenciarCookie(true);
            setCarregando(false);
            return usuario.email;
        }
        else{
            setUsuario(null);
            gerenciarCookie(false);
            setCarregando(false);
            return false;
        }
    }

    async function loginGoogle() {
        const resp = await firebase.auth().signInWithPopup(
            new firebase.auth.GoogleAuthProvider()
        )

        configurarSessao(resp.user)
            route.push('/')
    }

    useEffect(() => {
        const cancelar = firebase.auth().onIdTokenChanged(configurarSessao);
        return () => cancelar();
    }, []);


    return (
        <AuthContext.Provider value={{
            usuario,
            loginGoogle
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}


export default AuthContext;