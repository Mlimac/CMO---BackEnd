import express from "express";
import bodyParser from "body-parser";
import mysql from 'mysql2';
import jwt from "jsonwebtoken";
import cors from 'cors';
import sqlServer from "mssql";
const SEGREDO = 'REMOTA';

const app = express();
const porta = 5000;
/*const conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  database: "CMO",
  password: ""
});

conexao.connect();*/

const dbConfig = {
  server : "52.5.245.24",
  database : "cmo",
  user: "adminCMO",
  password : "@Uniandrade_2024",
  port : 1433,
  options :{
    trustServerCertificate : true
  }

};

const conexao = sqlServer.connect(dbConfig, (err) => {

  if(err)
    console.log(err);
  else
    console.log("conectado com o sql server");


});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.listen(porta, () => {
    console.log("servidor rodando e escutando na porta " + porta);
});

app.get("/", (req, resp) => {
   resp.status(200).send("Nosso servidor da CMO")
});

/*app.get("/servicos", verificarToken, (req, res) => {
  res.status(200).send("Rota para trazer os servicos\n");
});*/

let html = '/';

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

//conectar ao bd pra buscar o id desse usuario
  if((usu = "marcos") && (sen = "123")){
    const id = 1; //isso vem do BD

    //token tem 3 partes = 1) identifica o usuario 2 )segredo 3) opçoes
    const token = jwt.sign({id}, SEGREDO, { expiresIn: 300 }) //5 min
   
    console.log("usuario marcos logou no sistema");
    res.status(200).json({autenticado : true, token: token});

  }
  else{
    res.status(501).send("usuario invalido ou inexistente");
  }

});




app.get("/marcas", (req, res) => {
    var html = `<html>
    <head>
    <title>CMO</title>
    </head>
    </body>
    <h1>Bem vindo ao CMO<h1>
    </body>
    </html>`


  conexao.query("select nome, endereco, bairro, cidade, estado, fone, celular, cnpj from marca", (err, result) => {
        if (err) throw err;
        res.status(200).json(result);
  });

  //res.status(200).send(html);
  //Fazer uma SQL no banco de dados
  //Trazendo as marcas cadastradas e com o fl_marca TRUE
  //lista = html

});
 
 
app.get("/servicos", (req, res)=>{

  conexao.query("select titulo_servico, desc_servico, img_servico, ordem_apresentacao, url_servico from servico where ordem_apresentacao = 1", (err, result) => {
      if (err) throw err;
      console.log(result);
      res.status(200).json(result);
  });

});

app.get("/filiais",  (req, res)=>{

  conexao.query("select nome, endereco, bairro, cidade, estado, fone, celular, cnpj from filial", (err, result) => {
      if (err) throw err;
      console.log(result);
      res.status(200).json(result);
      return result;
  });

});





//Rota para inclusão de novos serviços
app.post("/servicos", verificarToken, (req, res)=>{
   let tit = req.body.titulo;
   let desc = req.body.desc;
   let url = req.body.url;
   let img = req.body.img;
   let oper = req.body.oper;
   let ordem = req.body.ordem;
   
   console.log("titulo: " + tit);

   /*conexao.query(
   `call SP_Ins_servico(?, ?, ?, ?, ?, ?, @id, @msg);`, [tit, desc, img, ativo, url, ordem], (erro, linhas) => {
    var campos = {tit, desc, url};
    if(erro) {


      console.log(erro);
      res.send('Problema ao inserir');
    }
     
    else{
      console.log(linhas);
      res.send("Serviço inserido!");
    }


   });*/

   conexao.query(`exec SP_Ins_Servico
   ${tit}, ${desc}, ${url}, 
   ${img}, ${ordem}, ${ativo}`, (erro, resultado) =>{

        if(erro){
          console.log(erro);
          res.status(500).send('Problema ao inserir serviço');
        }
        else{
          console.log(resultado);
          res.status(200).send("Serviço inserido com sucesso");

        }

   })
});

app.post("/marcas", verificarToken, (req, res)=>{
   let desc = req.body.desc;
   let url = req.body.url;
   let logo = req.body.logo;
   let flag = req.body.flag;
   
   conexao.query(
   `call SP_Ins_Marca(?, ?, ?, ?, @msg);`, [desc, url, logo, flag], (erro, linhas) => {
    //var campos = {tit, desc, url};
    if(erro) {


      console.log(erro);
      res.send('Problema ao inserir');
    }
     
    else{
      console.log(linhas);
      res.send("Marca inserida!");
    }


   });
});

app.post("/filiais", (req, res)=>{
   let nome = req.body.nome;
   let endereco = req.body.endereco;
   let bairro = req.body.bairro;
   let cidade = req.body.cidade;
   let fone = req.body.fone;
   let celular = req.body.celular;
   let estado = req.body.estado;
   let cnpj = req.body.cnpj;


   
   conexao.query(
   `call SP_Ins_Filiais(?, ?, ?, ?, ?, ?, ?, ?, @msg);`, [nome, endereco, bairro, cidade, estado, fone, celular, cnpj], (erro, linhas) => {
    //var campos = {tit, desc, url};
    if(erro) {
      console.log(erro);
      res.send('Problema ao inserir\n');
    }
     
    else{
      console.log(linhas);
      res.send("Filial inserida!\n");
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
