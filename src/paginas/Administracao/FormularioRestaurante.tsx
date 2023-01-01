import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IRestaurante from "../../interfaces/IRestaurante";

export default function FormularioRestaurante() {
  const [nomeRestaurante, setNomeRestaurante] = useState("");
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      axios
        .get<IRestaurante>(
          `http://0.0.0.0:8000/api/v2/restaurantes/${params.id}/`
        )
        .then((res) => {
          setNomeRestaurante(res.data.nome);
        });
    }
  }, [params]);

  const formSubmitted = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (params.id) {
      axios
        .put(`http://0.0.0.0:8000/api/v2/restaurantes/${params.id}/`, {
          nome: nomeRestaurante,
        })
        .then(() => {
          alert("Restaurante atualizado com sucesso!");
        });
    } else {
      axios
        .post("http://0.0.0.0:8000/api/v2/restaurantes/", {
          nome: nomeRestaurante,
        })
        .then(() => {
          alert("Restaurante cadastrado com sucesso!");
        });
    }

    setNomeRestaurante("");
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography component="h1" variant="h6">
        Formulário de Restaurantes
      </Typography>

      <Box component="form" onSubmit={formSubmitted}>
        <TextField
          value={nomeRestaurante}
          onChange={(e) => setNomeRestaurante(e.target.value)}
          label="Nome do Restaurante"
          variant="standard"
          required
          fullWidth
        />
        <Button
          type="submit"
          variant="outlined"
          sx={{ marginTop: 1 }}
          fullWidth
        >
          Salvar
        </Button>
      </Box>
    </Box>
  );
}
