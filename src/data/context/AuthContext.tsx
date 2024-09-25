import route from 'next/router';
import firebase from "@/firebase/config";
import Usuario from "@/model/Usuario";
import { createContext, ReactNode, useState } from "react";

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

export function AuthProvider(props: AppProviderProps) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    async function loginGoogle() {
        const resp = await firebase.auth().signInWithPopup(
            new firebase.auth.GoogleAuthProvider()
        )

        if (resp.user?.email) {
            const usuario = await usuarioNormalizado(resp.user)
            setUsuario(usuario)
            route.push('/')
        }
    }

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