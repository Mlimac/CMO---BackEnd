import express from "express";
import bodyParser from "body-parser";
import mysql from 'mysql2';
import jwt from "jsonwebtoken";
import cors from 'cors';
import sqlServer from "mssql";
const SEGREDO = 'REMOTA';

const app = express();
const porta = 5000;
/* const conexao = mysql.createConnection({
  host: "localhost",
  user: "eder",
  port: 3306,
  database: "CMO",
  password: "123456"
}); 

conexao.connect(); */

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

//======================================================== MÉTODO GET ====================================================


app.get("/marcas", (req, res) => {
   

  conexao.query("select nome, endereco, bairro, cidade, estado, fone, celular, cnpj from marca")
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

  //res.status(200).send(html);
  //Fazer uma SQL no banco de dados
  //Trazendo as marcas cadastradas e com o fl_marca TRUE
  //lista = html

});
 
//Get Site
app.get("/servicos", (req, res) => {
  conexao.query("select * from servico ORDER BY ordem_apresentacao")
    .then(result => res.json(result.recordset))
    .catch(err => res.json(err));
});


//Get ADM
app.get("/admServicos", (req, res)=>{

  conexao.query("select titulo_servico, desc_servico, img_servico, ordem_apresentacao, url_servico from servico ORDER BY ORDEM_APRESENTACAO")
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

});

app.get('/servicos:id', (req, res) =>{
  let id_servico = req.params.id;
  conexao.query(`Select id_servico,
                        titulo_servico,
                        desc_servico,
                        img_servico,
                        url_servico,
                        ordem_apresentacao,
                        ativo
                        FROM servico WHERE id_servico = 1 ${id_servico}`)
                        .then(result => res.json(result.recordset))
                        .catch(err => res.json(err));
});


app.get("/filiais",  (req, res)=>{

  conexao.query("select nome, endereco, bairro, cidade, estado, fone, celular, cnpj from filial")
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

});

app.get("/chamados",  (req, res)=>{

  conexao.query("SELECT [id_chamado], [desc_produto] ,[id_cliente] ,[id_tipo] ,[id_marca] ,[nr_serie] ,[capacidade] ,[problema] ,[solucao] ,[dt_chamado] ,[dt_resposta] FROM Chamado")
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

});

app.get("/clientes",  (req, res)=>{

  conexao.query("SELECT [id_cliente] ,[nome_cliente] ,[fone_cliente] ,[email_cliente] ,[data_cadastro] FROM Cliente")
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

});


app.get("/contato",  (req, res)=>{

  conexao.query("SELECT [id_cliente] ,[assunto] ,[mensagem] ,[dt_contato] ,[resposta] ,[dt_resposta] FROM Contato")
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

});

//======================================================= MÉTODO GET FIM =================================================









//======================================================== MÉTODO POST ====================================================


//Rota para inclusão de novos serviços
app.post("/servicos", (req, res)=>{
   let tit = req.body.titulo;
   let desc = req.body.desc;
   let url = req.body.url;
   let img = req.body.img;
   let oper = req.body.oper;
   let ordem = req.body.ordem;
   
   console.log("titulo: " + tit);

   conexao.query(
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


   });
});

app.post("/marcas", (req, res)=>{
   let desc = req.body.desc;
   let url = req.body.url;
   let logo = req.body.logo;
   
   console.log("desc: " + desc + "\nurl: " + url + "\nlogo: " + logo)
   /*conexao.query(`exec SP_Ins_Marca
      ${desc}, ${logo}, ${url}`, (erro, resultado) =>{
   
           if(erro){
             console.log(erro);
             res.status(500).send('Problema ao inserir marca');
           }
           else{
             console.log(resultado);
             res.status(200).send("Marca inserido com sucesso");
   
           }
   
      })*/
        
  
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


app.post("/chamados", (req, res) => {
  const cliente = req.body.cliente;
  const fone = req.body.fone;
  const email = req.body.email;
  const tipoProd = req.body.tipoProd;
  const produto = req.body.produto;
  const marca = req.body.marca;
  const problema = req.body.problema;
  const tipoCham = req.body.tipoCham;

  conexao.query(
  'call SP_Ins_Chamado (?,?,?,?,?,?,?,?)',
  [cliente, fone, email, tipoProd, produto, marca, problema, tipoCham], (erro, linhas) =>{
    //var campos = {tit, desc, url};
    if(erro) {
      console.log(erro);
      res.send('Problema ao inserir\n');
    }

    else{
      console.log(linhas);
      res.send("Chamado inserido!\n");
    }


   });


});


//======================================================== MÉTODO POST FIM ==================================================






//=========================================================== MÉTODO PUT ====================================================
// Endpoint para atualizar serviços
app.put("/servicos", (req, res) => {
    let id = req.body.id;
    let tit = req.body.titulo;
    let desc = req.body.desc;
    let img = req.body.img;
    let ativo = req.body.ativo;
    let url = req.body.url;
    let oper = req.body.oper;

    conexao.query(`call SP_UPd_Servico
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

// Endpoint para atualizar marcas
app.put("/marcas", (req, res) => {
    let desc_marca = req.body.desc_marca;
    let principal = req.body.principal;

    conexao.query(
        `call SP_Up_Marcas(?, ?, @msg);`, 
        [desc_marca, principal], 
        (erro, linhas) => {
            if (erro) {
                console.log(erro);
                res.send('Problema ao atualizar\n');
            } else {
                console.log(linhas);
                res.send("Marca atualizada com sucesso!\n");
            }
        }
    );
});

// Endpoint para atualizar filiais
app.put("/filiais", (req, res) => {
    let nome = req.body.nome;
    let endereco = req.body.endereco;
    let bairro = req.body.bairro;
    let cidade = req.body.cidade;
    let estado = req.body.estado;
    let fone = req.body.fone;
    let celular = req.body.celular;
    let cnpj = req.body.cnpj;

    conexao.query(
        `call SP_Up_Filiais(?, ?, ?, ?, ?, ?, ?, ?, @msg);`, 
        [nome, endereco, bairro, cidade, estado, fone, celular, cnpj], 
        (erro, linhas) => {
            if (erro) {
                console.log(erro);
                res.send('Problema ao atualizar\n');
            } else {
                console.log(linhas);
                res.send("Filial atualizada com sucesso!\n");
            }
        }
    );
});


//=========================================================== MÉTODO PUT FIM ================================================


//=========================================================== MÉTODO  DELETE INICIO ================================================ 

app.delete("/servicos/:id", (req, res) => {
  let id = req.params.id;


  conexao.query(`call SP_Del_Servico
    ${id}`, (erro, resultado) =>{
 
         if(erro){
           console.log(erro);
           res.status(500).send('Problema ao excluir serviço');
         }
         else{
           console.log(resultado);
           res.status(200).send("Serviço excluido com sucesso");
 
         }
 
    })
});

//=========================================================== MÉTODO DELETE FIM ================================================ 


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
