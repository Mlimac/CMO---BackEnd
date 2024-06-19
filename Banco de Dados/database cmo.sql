CREATE DATABASE IF NOT EXISTS CMO;

use CMO;
create table Status_ (

id_status int not null auto_increment primary key, 
desc_status VARCHAR(1000) not null
);

create table servico (
id_servico integer not null primary key auto_increment,
titulo_servico varchar(100),
desc_servico varchar(500),
img_servico varchar(100),
ordem_apresentacao integer, -- se ordem_apresentacao = 0 o serviço não será apresentado
url_servico varchar(100),
ativo boolean);

create table plano_pgto (
id_plano_pgto int not null auto_increment primary key,
desc_plano_pgto varchar(100) not null,
parcelas int not null,
juros float not null

);

create table os_servico (
id_registro int not null auto_increment primary key, 
id_os int not null, 
descricao varchar(1000) not null, 
valor_unit int not null, 
qtde int not null, 
foreign key(id_os) references servico(id_servico));

create table forma_pgto (
id_forma_pgto int not null auto_increment primary key, 
desc_forma_pgto varchar(100) not null);

create table tipo_atendimento (
id_tipo_atendimento int not null auto_increment primary key,
 desc_tipo_atendimento varchar(100) not null);

create table busca (
id_busca int not null primary key, 
endereco_busca varchar(100) not null, 
dt_da_busca DATE not null);

create table acessorio (
id_acessorio int not null auto_increment primary key, 
desc_acessorio varchar(1000) not null);

create table filial (
id_filial int not null auto_increment primary key, 
nome varchar(20) not null, 
endereco varchar(100) not null, 
bairro varchar(50) not null, 
cidade varchar(100) not null, 
estado varchar(50) not null, 
fone int not null,
celular int not null, 
cnpj char(14) not null);

create table cliente(
id_cliente int not null auto_increment primary key, 
nome_cliente varchar(100) not null, 
dt_cad date not null, 
cpf char(11) not null, 
cnpj char(15) not null, 
insc_mun char(15) not null, 
id_status int not null, 
id_filial int not null, 
dt_atualizacao date not null, 
foreign key (id_status) references Status_(id_status), 
foreign key (id_filial) references filial(id_filial));

create table email(
id_email int not null auto_increment primary key, 
id_cliente int not null, 
tipo_email varchar(50) not null, 
email varchar(100) not null, 
foreign key (id_cliente) references cliente(id_cliente));

create table tipo_produto(
id_tipo_produto int not null auto_increment primary key, 
desc_tipo_produto varchar(100) not null, 
principal varchar(100) not null);


create table entrega ( 
id_entrega int not null auto_increment primary key, 
endereco_de_entrega varchar(100) not null, 
dt_entrega date not null);





create table funcionario(
id_funcionario int not null auto_increment primary key, 
nome_funcionario varchar(100) not null, 
data_admissao date not null, 
data_demissao date, 
dept varchar(50) not null, 
funcao varchar(50) not null, 
id_status int not null, 
senha varchar(20) not null, 
id_filial int not null, 
foreign key (id_status) references Status_(id_status), 
foreign key (id_filial) references filial(id_filial));

create table marca(
id_marca int not null auto_increment primary key, 
desc_marca varchar(100) not null, 
logo_marca varchar(100),
url_marca varchar(100));

create table endereco(
id_cliente int not null, 
id_endereco int not null auto_increment primary key, 
tipo_endereco varchar(50) not null, 
endereco varchar(100) not null, 
complemento varchar(50) not null, 
bairro varchar(20) not null, 
cidade varchar(50) not null, 
estado varchar(50) not null, 
cep char(10) not null, 
observacao varchar(100) not null,
foreign key (id_cliente) references cliente(id_cliente));

create table fone(
id_cliente int not null, 
id_fone int not null auto_increment primary key, 
tipo_fone varchar(50) not null, 
nmro int not null, 
contato varchar(50) not null, 
foreign key (id_cliente) references cliente(id_cliente));

create table categoria(
id_categoria int not null auto_increment primary key, 
ds_categoria varchar(100) not null);

create table produto(
id_produto int not null auto_increment primary key, 
obs_produto char(100) not null, 
vl_custo float not null, 
vl_venda float not null, 
dt_cadastro date not null, 
qt_minima int not null, 
qt_estoque int not null, 
fl_balcao int not null, 
fl_ativo int not null, 
codigo int not null, 
unidade varchar(50) not null, 
id_filial int not null, 
foreign key(id_filial) references filial(id_filial));

create table modelo(
id_modelo int not null primary key, 
id_marca int not null, 
desc_modelo varchar(100) not null, 
id_tipo_produto int not null, 
foreign key(id_marca) references marca(id_marca), 
foreign key(id_tipo_produto) references tipo_produto(id_tipo_produto));


create table OS (
id_os int not null auto_increment primary key, 
id_cliente int not null, 
id_tipo_atend int not null,
id_endereco_busca int not null, 
id_endereco_entrega int not null, 
data_abertura date not null, 
id_atendente int not null,
 id_tipo_prod int not null, 
id_marca int not null, 
id_modelo int not null, 
acessorios varchar(1000) not null, 
serie int not null, 
id_status int not null, 
desc_prob varchar(1000) not null, 
especificacao varchar(100) not null, 
dt_compra date not null, 
dt_fechamento date, 
id_tecnico int not null, 
desc_serv varchar(100) not null, 
valor float not null, 
valor_peca float not null, 
valor_desc float not null, 
valor_total float not null,
 id_filial int not null, 
observacoes varchar(100) not null, 
dt_oficina date not null,
 id_forma_pgto int not null, 
 id_plano_pgto int not null,
obs_fechamento varchar(100), 
id_fechador int not null, 
contato int not null,
 dt_garantia date not null,
 dt_exclusao date not null,
 id_exclusao int not null, 
numero_os int not null, 
foreign key (id_cliente) references cliente(id_cliente), 
foreign key(id_tipo_atend) references tipo_atendimento(id_tipo_atendimento), 
foreign key (id_endereco_busca) references busca(id_busca), 
foreign key (id_endereco_entrega) references entrega(id_entrega),
foreign key (id_tipo_prod) references tipo_produto(id_tipo_produto),
foreign key (id_atendente) references funcionario(id_funcionario),
foreign key (id_marca) references marca(id_marca),
foreign key (id_modelo) references modelo(id_modelo),
foreign key (id_status) references Status_(id_status),
foreign key (id_tecnico) references funcionario(id_funcionario),
foreign key (id_filial) references filial(id_filial),
foreign key (id_forma_pgto) references forma_pgto(id_forma_pgto),
foreign key (id_plano_pgto) references plano_pgto(id_plano_pgto)
);



