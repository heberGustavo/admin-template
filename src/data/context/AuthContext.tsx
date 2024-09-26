import route from 'next/router';
import Cookies from 'js-cookie';
import firebase from "@/firebase/config";
import Usuario from "@/model/Usuario";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AppProviderProps {
    children: ReactNode;
    usuario?: Usuario;
    carregando?: boolean;
    login?: (email: string, senha: string) => Promise<void>;
    cadastrar?: (email: string, senha: string) => Promise<void>;
    loginGoogle?: () => Promise<void>;
    logout?: () => Promise<void>;
}

const NOME_COOKIE_AUTH = "admin-template-hg-auth";

const AuthContext = createContext({
    usuario: null as Usuario | null,
    carregando: true,
    login: async (email: string, senha: string) => {}, 
    cadastrar: async (email: string, senha: string) => {},
    loginGoogle: async () => {}, 
    logout: async () => {}, 
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

function gerenciarCookie(logado: boolean) {
    
    if (logado) {
        Cookies.set(NOME_COOKIE_AUTH, logado.toString().toLowerCase(), {
            expires: 7
        });
    }
    else {
        Cookies.remove(NOME_COOKIE_AUTH);
    }
}

export function AuthProvider(props: AppProviderProps) {
    const [carregando, setCarregando] = useState<boolean>(true);
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    async function configurarSessao(usuarioFirebase: firebase.User | null) {
        if (usuarioFirebase?.email) {
            const usuario = await usuarioNormalizado(usuarioFirebase);
            setUsuario(usuario);
            gerenciarCookie(true);
            setCarregando(false);
            return usuario.email;
        }
        else {
            setUsuario(null);
            gerenciarCookie(false);
            setCarregando(false);
            return false;
        }
    }

    async function loginGoogle() {
        try {
            setCarregando(true);
            const resp = await firebase.auth().signInWithPopup(
                new firebase.auth.GoogleAuthProvider()
            )

            await configurarSessao(resp.user)
            route.push('/');
        } finally {
            setCarregando(false);
        }
    }

    async function login(email: string, senha: string) {
        try {
            setCarregando(true);
            const resp = await firebase.auth().signInWithEmailAndPassword(email, senha);

            await configurarSessao(resp.user)
            route.push('/');
        } finally {
            setCarregando(false);
        }
    }

    async function cadastrar(email: string, senha: string) {
        try {
            setCarregando(true);
            const resp = await firebase.auth().createUserWithEmailAndPassword(email, senha);

            await configurarSessao(resp.user)
            route.push('/');
        } finally {
            setCarregando(false);
        }
    }

    async function logout() {
        try {
            setCarregando(true);
            await firebase.auth().signOut();
            await configurarSessao(null);
            //route.push("/autenticacao");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        if(Cookies.get(NOME_COOKIE_AUTH)){
            const cancelar = firebase.auth().onIdTokenChanged(configurarSessao);
            return () => cancelar();
        }
        else 
            setCarregando(false);
    }, []);


    return (
        <AuthContext.Provider value={{
            usuario,
            carregando,
            login,
            cadastrar,
            loginGoogle,
            logout
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}


export default AuthContext;