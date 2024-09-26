import Link from "next/link";
import { ReactNode } from "react";

interface MenuItemProps {
    texto: string;
    icone: ReactNode;
    url?: string;
    className?: string;
    onClick?: (evento: React.MouseEvent<HTMLLIElement>) => void;
}

export default function MenuItem(props: MenuItemProps) {

    function renderizarLink() {
        return (
            <>
                <div className={`
                    flex flex-col justify-center items-center
                    h-20 w-20
                    dark:text-gray-200
                    ${props.className}
                `}>
                    {props.icone}
                    <span className={`text-xs font-light`}>
                        {props.texto}
                    </span>
                </div>
            </>
        )
    }

    return (
        <li onClick={props.onClick} className={`
            cursor-pointer
            hover:bg-gray-100 dark:hover:bg-gray-800
        `}>
            {
                props.url ? (
                    <Link href={props.url}>
                        {renderizarLink()}
                    </Link>
                ) : (
                    renderizarLink()
                )
            }
        </li>
    )
}