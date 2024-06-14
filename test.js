import express from "express";
import bodyParser from "body-parser";
//import mysql from "mysql2";
import jwt from "jsonwebtoken";
import cors from "cors";

const SEGREDO = 'REMOTA';

const app = express();
const porta = 3000;
// const conexao = mysql.createConnection({
//   host: "localhost",
//   port: 3306,
//   database: "CMO",
//   user: "root"
// });

// conexao.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}));
app.use(cors());

app.listen(porta, () => {
  console.log("servidor rodando e escutando na porta 3000");
});

app.get("/", (req, resp) => {
  resp.status(200).send("Nosso servidor da CMO");
});

app.get("/servicos", verificarToken, (req, res) => {
  res.status(200).send("Rota para trazer os servicos");
  
});

let html = '';

// middleware
function verificarToken(req, res, next){
  const token = req.headers['x-access-token'];
  jwt.verify(token, SEGREDO, (erro, decodificado) => {
    if(erro)
      return res.status(401).end();
    req.id = decodificado.id;
    next();
  });
}

app.post("/login", (req, res) => {
  let usu = req.body.usuario;
  let sen = req.body.senha;

  // conectar ao bd pra buscar o ID desse usuario

  //if usu e a senha for igual ao registrado na tabela do BD
  if(usu == "marcos" && sen == "123"){
    const id = 1; // isso vem do BD

    //token tem 3 partes = 1.) identifica o usuário 2.) segredo, opções 
    const token = jwt.sign({id}, SEGREDO, { expiresIn: 300}); // 5 min

    console.log("usuário marcos logou no sistema");
    return res.status(500).json({autenticado: true, token: token});
  };
  res.status(504).send("Usuário inválido ou inexitente");
});

app.get("/marcas", (req, res) => {
   html = 
   `<html>
      <head>
        <title>Projeto CMO</title>
      </head>
      <body>
        <h1>Casa do Micro-Ondas</h1>
        <p>Este é o projeto do novo site da Casa do Micro-Ondas.</p>
      </body>
   </html>`;

   res.status(200).send(html);
     //fazer uma SQL no banco de dados
     //trazendo as marcas cadastradas e com o fl_marca TRUE
     //lista = html
 });

// // Rota para inclusão de novos serviços
 app.post("/servicos", (req, res) => {
   let tit = req.body.titulo;
   let desc = req.body.desc;
   let url = req.body.url;
   let img = req.body.img;
   let ordem = req.body.ordem;
   let ativo = true;

   conexao.query('CALL sp_ins_servico (?, ?, ?, ?, ?, ?, @mensagem)', 
     [tit, desc, url, img, ordem, ativo], (erro, linhas) => {
     if(erro) {
       console.log(erro);
       res.send('Problema ao inserir serviço');
     } else {
       console.log(linhas);
       res.send('Serviço inserido!');
     }
   });
 });

// Servidor criado com JS puro
//import http from "http";

// const rotas = {
//   "/": "Servidor criado com Node.js para a disciplina WEB Front-End",
//   "/servicos": "Todos os servicos executados pela CMO",
//   "/marcas": "Apresentacao de todas as marcas representadas pela empresa"
// };

// // arrow function 
// const server = http.createServer((req, res) => {
//   res.writeHead(200, { "Content-type": "text/plain" });
//   res.end(rotas[req.url]);  
// });

// server.listen(3000, () => {
//   console.log("Servidor escutando porta 3000");
// });

