import express from "express";
import bodyParser from "body-parser";
import mysql from 'mysql2'
import jwt from "jsonwebtoken";

const SEGREDO = 'REMOTA';

const app = express();
const porta = 3000;
const conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  database: "CMO",
  password: "123456"
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

/*
app.get("/servicos", verificarToken, (req, res) => {
  res.status(200).send("Rota para trazer os servicos");
});
*/

let html = '/';

// middleware
/*function verificarToken(req, res, next){
  const token = req.headers['x-access-token'];
  jwt.verify(token, SEGREDO, (erro, decodificado) => {
    if(erro)
      return res.status(401).end();
    req.id = decodificado.id;
    next();
  });
}*/

/*app.post("/login", (req, res) => {

let usu = req.body.usuario;
let sen = req.body.senha;

//conectar ao bd pra buscar o id desse usuario
if((usu = "marcos") AND (sen = "123")){
  const id = 1; //isso vem do BD

  //token tem 3 partes = 1) identifica o usuario 2 )segredo 3) opçoes
  const token = jwt.sign({id}, SEGREDO, { expiresIn: 300 }) //5 min
  
  console.log("usuario marcos logou no sistema");
  res.status.(500).json({autenticado : true, token: token});

}
else{
  res.status(501).send("usuario invalido ou inexistente");
}

});*/


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
  
app.get("/servicos",(req, res)=>{




});

//Rota para inclusão de novos serviços
app.post("/servicos",(req, res)=>{
   let tit = req.body.titulo;
   let desc = req.body.desc;
   let url = req.body.url;
   let img = req.body.img;
   let oper = req.body.oper;
   let ordem = req.body.ordem;
   let ativo = true;
   
   console.log("titulo: " + tit);

   conexao.query(
   `call SP_Ins_servico(?, ?, ?, ?, ?, ?, @id, @msg);`, [tit, desc, img, ativo, url, ordem], (erro, linhas,) => {
    var campos = {tit, desc, url};
    if(erro) {

      console.log(erro);
      res.send('Problema ao inserir');
    }
      
    else{
      console.log(linhas);
      res.send("Serviço inserido!");
    }
    
    

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


