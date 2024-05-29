import express from "express";
import bodyParser from "body-parser";
import mysql from 'mysql2'

const app = express();
const porta = 3000;
const conexao = mysql.createConnection({
  host: "localhost: 3306;/cmo",
  user: "root",
  password: "admin"
})


conexao.connect();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.listen(porta, () => {
    console.log("servidor rodando e escutando na porta 3000")
});


app.get("/", (req, resp) => {
   resp.status(200).send("Nosso servidor da CMO")
});

app.get("/servicos", (req, res) => {
  res.status(200).send("Rota para trazer os serviços")
});

let html = '/';

app.get("/marcas", (req, res) => {
    var html = `<html>
    <head>
    <title>CMO</title>
    </head>
    </body>
    <h1>Bem vindo ao CMO<h1>
    </body>
    </html>`

    res.status(200).send(html);
    //Fazer uma SQL no banco de dados
    //Trazendo as marcas cadastradas e com o fl_marca TRUE
    //lista = html
  });
  
//Rota para inclusão de novos serviços
app.post("/servicos",(req, res)=>{
   let tit = req.body.titulo;
   let desc = req.body.desc;
   let img = req.body.img;
   let ativo = true;
   let url = req.body.url;
   let ordem = req.body.ordem;
   
   conexao.query(
   `CALL sp_ins_servico(?, ?, ?, ?, ?, ?, @id, @msg)`,[tit, desc,img,ativo, url,ordem], (erro, linhas) => {
    campos = {tit, desc, url};
    if(erro) {
      console.log(erro);
      res.send('Problema ao inserir');}
    else  {
       console.log(linhas);
       res.send('Servido Inserido com Sucesso')}
    

   });
});


//Servidor criado com JS puro

//import http from 'http';

//const rotas={
//   "/": "Servidor criado com Node.js para a disciplina WEB",
//   "/servicos": "Todos o serviços executados pela CMO",
//   "/marcas": "Apresentação de todas as marcas"
//};

//const server = http.createServer((req, res)  => {
//    res.writeHead(200, { "Content-type": "text/plain" });
//    res.end(rotas[req.url]);
//});

//server.listen(3000, () => {
//    console.log("Servidor escutando porta 3000")
//})


