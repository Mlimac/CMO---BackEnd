use CMO;
drop procedure if exists sp_ins_servico;

delimiter //

create procedure SP_Ins_servico(
  in tit varchar(50),
  in descricao varchar (1000),
  in img varchar (100),
  in ativo boolean,
  in url varchar (50),
  in ordem int,
  out id integer,
  out mensagem varchar (50)
)
begin 
  -- verificar se o serviço existe
  if (exists (select desc_servico
            from servico
            where desc_servico = descricao))
            then
    set mensagem = 'Esse servico ja existe';
  else
    insert into servico (desc_servico, titulo_servico, img_servico, ordem_apresentacao, url_servico)
    values(descricao, tit, img, ordem, url);
    set mensagem = 'Servico inserido com sucesso';
  end if;
 -- set id = new.id_servico;
end//

set delimiter ;







drop procedure if exists SP_Ins_Marca;
delimiter //
create procedure SP_Ins_Marca(
    in descricao varchar(100),
    in url_marca varchar(100),
    in logo varchar(100),
    out message varchar(50)
)

begin 
  -- verificar se a marca já existe
  if (exists (select desc_marca 
            from marca 
            where desc_marca = descricao))
            then
    set message = 'Essa marca já existe no banco de dados';
  else
    insert into marca (desc_marca, logo_marca, url_marca)
    values(descricao, logo, url_marca);
    set message = 'Marca inserida com sucessso';
  end if;
end//

set delimiter ;






drop procedure if exists SP_Ins_Filiais;
delimiter //

create procedure SP_Ins_Filiais(
    in nome_filial varchar(20),
    in endereco_filial varchar(100),
    in bairro_filial varchar(50),
    in cidade_filial varchar(100),
    in estado_filial varchar(50),
    in fone_filial int,
    in celular_filial int,
    in cnpj_filial char(14),
    out message varchar(50)
)

begin 
  -- verificar se a marca já existe
  if (exists (select nome
            from filial 
            where nome = nome_filial))
            then
    set message = 'Essa filial já existe no banco de dados';
  else
    insert into filial (nome, endereco, bairro, cidade, estado, fone, celular, cnpj)
    values(nome_filial, endereco_filial, bairro_filial, cidade_filial, estado_filial, fone_filial, celular_filial, cnpj_filial);
    set message = 'Marca inserida com sucessso';
  end if;
end//

set delimiter ;







DROP PROCEDURE IF EXISTS sp_Up_Servico;
DELIMITER //

CREATE PROCEDURE sp_Up_Servico (
  IN id INTEGER,
  IN tit VARCHAR(50),
  IN desc_servico VARCHAR(1000),
  IN img VARCHAR(100),
  IN ativo BOOLEAN,
  IN url VARCHAR(50),
  IN oper CHAR(1),
  OUT mensagem VARCHAR(50)
)
BEGIN
  IF (oper = 'U') THEN
    UPDATE servico
    SET  
      titulo_servico = tit,
      desc_servico = desc_servico,
      img_servico = img,
      url_servico = url,
      ativo = ativo
    WHERE id_servico = id;
  ELSE 
    UPDATE servico
    SET ativo = FALSE
    WHERE id_servico = id;
  END IF;

  SET mensagem = 'Operação realizada com sucesso';
END //

DELIMITER ;







DROP PROCEDURE IF EXISTS SP_Up_Marcas;
DELIMITER //
CREATE PROCEDURE SP_Up_Marcas(
  IN p_desc_marca VARCHAR(100),
  IN p_principal VARCHAR(100),
  OUT p_message VARCHAR(100)
)
BEGIN
  -- Verificar se a marca existe pela descrição
  IF EXISTS (SELECT 1 FROM marca WHERE desc_marca = p_desc_marca) THEN
    UPDATE marca
    SET 
      principal = p_principal
    WHERE desc_marca = p_desc_marca;
    
    SET p_message = 'Marca atualizada com sucesso';
  ELSE
    SET p_message = 'Marca não encontrada';
  END IF;
END //
DELIMITER ;








DROP PROCEDURE IF EXISTS SP_Up_Filiais;
DELIMITER //
CREATE PROCEDURE SP_Up_Filiais(
  IN p_nome VARCHAR(20),
  IN p_endereco VARCHAR(100),
  IN p_bairro VARCHAR(50),
  IN p_cidade VARCHAR(100),
  IN p_estado VARCHAR(50),
  IN p_fone INT,
  IN p_celular INT,
  IN p_cnpj CHAR(14),
  OUT p_message VARCHAR(100)
)
BEGIN
  -- Verificar se a filial existe pelo nome
  IF EXISTS (SELECT 1 FROM filial WHERE nome = p_nome) THEN
    UPDATE filial
    SET 
      endereco = p_endereco,
      bairro = p_bairro,
      cidade = p_cidade,
      estado = p_estado,
      fone = p_fone,
      celular = p_celular,
      cnpj = p_cnpj
    WHERE nome = p_nome;
    
    SET p_message = 'Filial atualizada com sucesso';
  ELSE
    SET p_message = 'Filial não encontrada';
  END IF;
END //
DELIMITER ;





