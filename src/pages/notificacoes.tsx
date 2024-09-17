import Layout from "@/components/template/Layout";
import useAppData from "@/data/hook/useAppData";

export default function Notificacoes() {
  const ctx = useAppData();

  return (
    <Layout titulo="Notificacoes" subtitulo="Aqui você irá gerenciar as suas notificações">
      <h3>{ctx.nome}</h3>
    </Layout>
  );
}
