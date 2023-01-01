import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import IPaginacao from "../../interfaces/IPaginacao";
import IRestaurante from "../../interfaces/IRestaurante";
import style from "./ListaRestaurantes.module.scss";
import Restaurante from "./Restaurante";

interface IParametrosBusca {
  ordering?: string;
  search?: string;
}

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState("");
  const [paginaAnterior, setPaginaAnterior] = useState("");
  const [busca, setBusca] = useState("");

  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {
    axios
      .get<IPaginacao<IRestaurante>>(url, opcoes)
      .then((res) => {
        setRestaurantes(res.data.results);
        setProximaPagina(res.data.next);
        setPaginaAnterior(res.data.previous);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const buscar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const opcoes = {
      params: {} as IParametrosBusca,
    };

    if (busca) {
      opcoes.params.search = busca;
    }

    carregarDados("http://localhost:8000/api/v1/restaurantes/", opcoes);

    setBusca("");
  };

  useEffect(() => {
    //Obter restaurantes
    carregarDados("http://0.0.0.0:8000/api/v1/restaurantes/");
  }, []);

  return (
    <section className={style.ListaRestaurantes}>
      <h1>
        Os restaurantes mais <em>bacanas</em>!
      </h1>

      <form onSubmit={buscar}>
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {restaurantes?.map((item) => (
        <Restaurante restaurante={item} key={item.id} />
      ))}

      {
        <button
          onClick={() => carregarDados(paginaAnterior)}
          disabled={!paginaAnterior}
        >
          Página anterior
        </button>
      }
      {
        <button
          onClick={() => carregarDados(proximaPagina)}
          disabled={!proximaPagina}
        >
          Próxima página
        </button>
      }
    </section>
  );
};

export default ListaRestaurantes;
