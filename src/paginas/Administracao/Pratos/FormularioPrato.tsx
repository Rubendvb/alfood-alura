import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import IPrato from "../../../interfaces/IPrato";
import IRestaurante from "../../../interfaces/IRestaurante";
import ITag from "../../../interfaces/ITag";

export default function FormularioPrato() {
  const [nomePrato, setNomePrato] = useState("");
  const [descricao, setDescricao] = useState("");

  const [tags, setTags] = useState<ITag[]>([]);
  const [tag, setTag] = useState("");

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [restaurante, setRestaurante] = useState("");
  const [imagem, setImagem] = useState<File | null | string>(null);

  const params = useParams();

  useEffect(() => {
    http.get<{ tags: ITag[] }>("tags/").then((res) => setTags(res.data.tags));

    http
      .get<IRestaurante[]>("restaurantes/")
      .then((res) => setRestaurantes(res.data));

    if (params.id) {
      http.get<IPrato>(`pratos/${params.id}/`).then((res) => {
        const prato = res.data;

        setNomePrato(prato.nome);
        setDescricao(prato.descricao);
        setTag(prato.tag);
      });
    }
  }, [params]);

  const selecionaArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setImagem(e.target.files[0]);
    } else {
      setImagem(null);
    }
  };

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("nome", nomePrato);
    formData.append("descricao", descricao);
    formData.append("tag", tag);
    formData.append("restaurante", restaurante);

    if (imagem) {
      formData.append("imagem", imagem);
    }

    if (params.id) {
      http
        .request({
          url: `pratos/${params.id}/`,
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        })
        .then(() => {
          setNomePrato("");
          setDescricao("");
          setTag("");
          setRestaurante("");
          alert("Prato atualizado com sucesso");
        })
        .catch((erro) => console.log(erro));
    } else {
      http
        .request({
          url: "pratos/",
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        })
        .then(() => {
          setNomePrato("");
          setDescricao("");
          setTag("");
          setRestaurante("");
          alert("Prato cadastrado com sucesso");
        })
        .catch((erro) => console.log(erro));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexGrow: 1,
      }}
    >
      <Typography component="h1" variant="h6">
        Formulário de Pratos
      </Typography>
      <Box component="form" sx={{ width: "100%" }} onSubmit={submitForm}>
        <TextField
          value={nomePrato}
          onChange={(e) => setNomePrato(e.target.value)}
          label="Nome do Prato"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />

        <TextField
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          label="Descrição do Prato"
          variant="standard"
          fullWidth
          required
        />

        <FormControl margin="dense" fullWidth>
          <InputLabel id="select-tag">Tag</InputLabel>
          <Select
            labelId="select-tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            {tags.map((tag) => (
              <MenuItem value={tag.value} key={tag.id}>
                {tag.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl margin="dense" fullWidth>
          <InputLabel id="select-restaurante">Restaurante</InputLabel>
          <Select
            labelId="select-restaurante"
            value={restaurante}
            onChange={(e) => setRestaurante(e.target.value)}
          >
            {restaurantes.map((restaurante) => (
              <MenuItem value={restaurante.id} key={restaurante.id}>
                {restaurante.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <input type="file" onChange={selecionaArquivo} />

        <Button
          sx={{ marginTop: 1 }}
          type="submit"
          fullWidth
          variant="outlined"
        >
          Salvar
        </Button>
      </Box>
    </Box>
  );
}
