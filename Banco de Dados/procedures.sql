use cmo;
drop procedure if exists sp_ins_servico;
set delimiter //
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
set delimiter //
create procedure SP_Ins_Marca(
    in descricao varchar(100),
    in url_marca varchar(100),
    in logo varchar(100),
    in flag boolean,
    out message varchar(50)
)

begin 
  -- verificar se a marca já existe
  if (exists (select desc_marca 
            from Marca 
            where desc_marca = descricao))
            then
    set message = 'Essa marca já existe no banco de dados';
  else
    insert into Marca (desc_marca, logo_marca, url_marca, fl_marca)
    values(descricao, logo, url, flag);
    set message = 'Marca inserida com sucessso';
  end if;
end//

set delimiter ;





use cmo;
drop procedure if exists sp_ed_servico;
delimiter #
create procedure sp_ed_servico (
  in id integer,
  in tit varchar(50),
  in valor float,
  in desc_servico varchar (1000),
  in img varchar (100),
  in ativo boolean,
  in url varchar (50),
  in oper char (1),
  out mensagem varchar (50)
)
begin
  if (oper = 'U') then
   update servico
     set  
     titulo_servico = tit,
     desc_servico = descr,
     valor = valor,
     img_servico = img,
     ordem_apresentacao = ordem,
     url_servico = url,
     ativo = atv
where id_servico = id;
else 
  update servico
  set ativo = false
  where id_servico = id;
end if;
 set mensagem = 'Operacao realizada com sucesso';

end #
delimiter ;