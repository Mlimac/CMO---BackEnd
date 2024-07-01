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
  user: "root",
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

  if((usu == "marcos@email.com") && (sen == "123")){
    const id = 1; //isso vem do BD

    //token tem 3 partes = 1) identifica o usuario 2 )segredo 3) opçoes
    const token = jwt.sign({id}, SEGREDO, { expiresIn: 600 }) //10 min
   
    console.log("usuario marcos logou no sistema");
    res.status(200).json({autenticado : true, token: token});

  }
  else{
    res.status(501).send("usuario invalido ou inexistente");
  }   

});

//======================================================== MÉTODO GET ====================================================

app.get("/verificarLogin", verificarToken, (req, res) => { res.status(200).json({st : "ok"});});




app.get("/marcas", (req, res) => {
   

  conexao.query("select id_marca, desc_marca, logo_marca, url_marca, ativo from Marca")
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

  //res.status(200).send(html);
  //Fazer uma SQL no banco de dados
  //Trazendo as marcas cadastradas e com o fl_marca TRUE
  //lista = html

});
 
//Get Site
app.get("/servicos", (req, res) => {
  // conexao.query("select * from servico where equipe = 7 ORDER BY ordem_apresentacao ")
  conexao.query("select titulo_servico, desc_servico, img_servico, ordem_apresentacao, url_servico from servico where equipe = 7 ORDER BY ORDEM_APRESENTACAO")
    .then(result => {res.json(result.recordset); /*console.log(result.recordset);*/})
    .catch(err => res.json(err));
});


//Get ADM
app.get("/admServicos", verificarToken, (req, res)=>{

  
  conexao.query("select * from servico ORDER BY ordem_apresentacao ")
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
                        FROM servico WHERE id_servico = ${id_servico}`)
                        .then(result => res.json(result.recordset))
                        .catch(err => res.json(err));
});


app.get("/filiais",  (req, res)=>{

  conexao.query("select nome, endereco, bairro, cidade, estado, fone, celular, cnpj from filial")
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

});

app.get("/filiais:id",  (req, res)=>{

  conexao.query(`select nome, endereco, bairro, cidade, estado, fone, celular, cnpj from filial where id_filial=${id_filial}`)
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

});

app.get("/chamados",  (req, res)=>{

  conexao.query("SELECT [id_chamado], [desc_produto] ,[id_cliente] ,[id_tipo] ,[id_marca] ,[nr_serie] ,[capacidade] ,[problema] ,[solucao] ,[dt_chamado] ,[dt_resposta] FROM Chamado")
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

});

app.get("/chamados:id",  (req, res)=>{

  conexao.query(`SELECT [id_chamado], [desc_produto] ,[id_cliente] ,[id_tipo] ,[id_marca] ,[nr_serie] ,[capacidade] ,[problema] ,[solucao] ,[dt_chamado] ,[dt_resposta] FROM Chamado where id_chamado = ${id}`)
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

});



app.get("/clientes",  (req, res)=>{

  conexao.query("SELECT [id_cliente] ,[nome_cliente] ,[fone_cliente] ,[email_cliente] ,[data_cadastro] FROM Cliente")
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

});

app.get("/clientes:id",  (req, res)=>{

  conexao.query(`SELECT [id_cliente] ,[nome_cliente] ,[fone_cliente] ,[email_cliente] ,[data_cadastro] FROM Cliente where id_cliente = ${id}`)
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

});


app.get("/contato",  (req, res)=>{

  conexao.query("SELECT [id_cliente] ,[assunto] ,[mensagem] ,[dt_contato] ,[resposta] ,[dt_resposta] FROM Contato")
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

});

app.get("/contato:id",  (req, res)=>{

  conexao.query(`SELECT [id_cliente] ,[assunto] ,[mensagem] ,[dt_contato] ,[resposta] ,[dt_resposta] FROM Contato where id_contato = ${id}`)
  .then(result => res.json(result.recordset))
  .catch(err => res.json(err));

});

//======================================================= MÉTODO GET FIM =================================================









//======================================================== MÉTODO POST ====================================================


//Rota para inclusão de novos serviços
app.post("/servicos", verificarToken, (req, res) => {
  let titulo = req.body.titulo;
  let desc = req.body.desc;
  let url = req.body.url;
  let ativo = req.body.ativo;
  let img = req.body.img;
  let ordem = req.body.ordem;

  console.log("titulo: " + titulo);

  conexao.query(
      `exec SP_Ins_Servico '${titulo}', '${desc}', '${img}', '${url}', ${ordem}, ${ativo}`, 
      (erro, resultado) => {
          if (erro) {
              console.log(erro);
              res.status(500).send('Problema ao inserir serviço');
          } else {
              console.log(resultado);
              res.status(200).send("Serviço inserido com sucesso");
          }
      }
  );
});



app.post("/marcas", (req, res)=>{
   let desc = req.body.desc;
   let url = req.body.url;
   let logo = req.body.logo;
   
   //console.log("desc: " + desc + "\nurl: " + url + "\nlogo: " + logo)
   conexao.query(`exec SP_Ins_Marca
      '${desc}', '${logo}', '${url}'`, (erro, resultado) =>{
   
           if(erro){
             console.log(erro);
             res.status(500).send('Problema ao inserir marca');
           }
           else{
             console.log(resultado);
             res.status(200).send("Marca inserida com sucesso");
   
           }
   
      })
        
  
});

app.post("/filiais", (req, res)=>{
   let nome = req.body.nome;
   let endereco = req.body.endereco;
   let bairro = req.body.bairro;
   let url = req.body.url;
   let ativo = req.body.ativo;

   conexao.query(`exec SP_Ins_Filial 0,
    '${nome}', '${bairro}', '${endereco}', '${url}', ${ativo}`, (erro, resultado) =>{
 
         if(erro){
           console.log(erro);
           res.status(500).send('Problema ao inserir filial');
         }
         else{
           console.log(resultado);
           res.status(200).send("Filial inserida com sucesso");
 
         }
 
    })

   
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

  conexao.query(`exec SP_Ins_Chamado
    '${cliente}', ${fone}, '${email}', '${tipoProd}', '${produto}',  '${marca}',  '${problema}',  '${tipoCham}'`, (erro, resultado) =>{
 
         if(erro){
           console.log(erro);
           res.status(500).send('Problema ao inserir chamado');
         }
         else{
           console.log(resultado);
           res.status(200).send("Chamado inserida com sucesso");
 
         }
 
    })


});

app.post("/tipo_produto", (req, res) => {
  const desc_tipo = req.body.desc_tipo;
  conexao.query(`exec SP_Ins_TipoProduto
    '${desc_tipo}'`, (erro, resultado) =>{
 
         if(erro){
           console.log(erro);
           res.status(500).send('Problema ao inserir tipo de produto');
         }
         else{
           console.log(resultado);
           res.status(200).send("Tipo de produto inserido com sucesso");
 
         }
 
    })


});



//======================================================== MÉTODO POST FIM ==================================================






//=========================================================== MÉTODO PUT ====================================================
// Endpoint para atualizar serviços
app.put("/servicos:id", (req, res) => {
  let id = req.params.id;

  let titulo = req.body.titulo;
  let desc_servico = req.body.desc_servico;
  let img_servico = req.body.img_servico;
  let url_servico = req.body.url_servico;
  let ordem = req.body.ordem;
  let ativo = req.body.ativo;

  conexao.query(`exec SP_Upd_Servico 
      ${id}, '${titulo}', '${desc_servico}', '${img_servico}', '${url_servico}', ${ordem}, ${ativo}`, (erro, resultado) => {
      if (erro) {
          console.log(erro);
          res.status(500).send('Problema ao atualizar serviço');
      } else {
          console.log(resultado);
          res.status(200).send("Serviço atualizado com sucesso");
      }
  });
});


// Endpoint para atualizar marcas
app.put("/marcas:id", (req, res) => {
    let id = req.params.id;

    let desc_marca = req.body.desc_marca;
    let url_marca = req.body.url_marca;
    let ativo = req.body.ativo;

    conexao.query(`exec SP_UPd_Marca
      ${id}, '${desc_marca}', '${url_marca}', ${ativo}`, (erro, resultado) =>{
   
           if(erro){
             console.log(erro);
             res.status(500).send('Problema ao atualizar marca');
           }
           else{
             console.log(resultado);
             res.status(200).send("Marca atualizada com sucesso");
   
           }
   
      })

   
});

// Endpoint para atualizar filiais
app.put("/filiais:id", (req, res) => {
  let id = req.params.id;

  let nome = req.body.nome;
  let bairro = req.body.bairro;
  let endereco = req.body.endereco;
  let url = req.body.url;
  let ativo = req.body.ativo;

  conexao.query(`exec SP_Upd_Filial 
      ${id}, '${nome}', '${bairro}', '${endereco}', '${url}', ${ativo}`, (erro, resultado) => {
      if (erro) {
          console.log(erro);
          res.status(500).send('Problema ao atualizar filial');
      } else {
          console.log(resultado);
          res.status(200).send("Filial atualizada com sucesso");
      }
  });
});



app.put("/tipo_produto:id", (req, res) => {
  let id = req.params.id;

  let desc_tipo = req.body.desc_tipo;
  let ativo = req.body.ativo;

  conexao.query(`exec SP_UPd_Servico
    ${id}, ${desc_tipo}, ${ativo}`, (erro, resultado) =>{
 
         if(erro){
           console.log(erro);
           res.status(500).send('Problema ao atualizar tipo de produto');
         }
         else{
           console.log(resultado);
           res.status(200).send("tipo produto atualizado com sucesso");
 
         }
 
    })
});


//=========================================================== MÉTODO PUT FIM ================================================


//=========================================================== MÉTODO  DELETE INICIO ================================================ 

app.delete("/servicos/:id", (req, res) => {
  let id = req.params.id;

console.log(id);
  conexao.query(`exec SP_Del_Servico
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

app.delete("/filial/:id", (req, res) => {
  let id = req.params.id;


  conexao.query(`exec SP_Del_Filial
    ${id}`, (erro, resultado) =>{
 
         if(erro){
           console.log(erro);
           res.status(500).send('Problema ao excluir filial');
         }
         else{
           console.log(resultado);
           res.status(200).send("Filial excluida com sucesso");
 
         }
 
    })
});

app.delete("/tipo_produto/:id", (req, res) => {
  let id = req.params.id;


  conexao.query(`exec SP_Del_TipoProduto
    ${id}, ${ativo}`, (erro, resultado) =>{
 
         if(erro){
           console.log(erro);
           res.status(500).send('Problema ao excluir tipo de produto');
         }
         else{
           console.log(resultado);
           res.status(200).send("Tipo de produto excluido com sucesso");
 
         }
 
    })
});

app.delete("/marca/:id", (req, res) => {
  let id = req.params.id;


  conexao.query(`exec SP_Del_Marca
    ${id}`, (erro, resultado) =>{
 
         if(erro){
           console.log(erro);
           res.status(500).send('Problema ao excluir marca');
         }
         else{
           console.log(resultado);
           res.status(200).send("Marca excluida com sucesso");
 
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
