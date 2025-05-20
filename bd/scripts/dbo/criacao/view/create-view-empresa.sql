CREATE VIEW vw_empresa AS 
SELECT 
	emp.id AS id,
	emp.nome_bd AS nome_bd,
	emp.licenca_empresa AS licenca_empresa,
	emp.dt_inicio_licenca AS dt_inicio_licenca,
	emp.dt_fim_licenca AS dt_fim_licenca,
	emp.cota_servico AS cota_servico,
	emp.cota_relatorio_simples AS cota_relatorio_simples,
	emp.cota_relatorio_detalhado AS cota_relatorio_detalhado,
	emp.razao_social AS razao_social,
	emp.nome_fantasia AS nome_fantasia,
	emp.cnpj AS cnpj,
	emp.foto AS foto,
	emp.lema AS lema,
	end_emp.id AS id_endereco,
	end_emp.logradouro AS logradouro_endereco,
	end_emp.numero AS numero_endereco,
	end_emp.bairro AS bairro_endereco,
	end_emp.cidade AS cidade_endereco,
	end_emp.estado AS estado_endereco
	
FROM empresa AS emp
	LEFT JOIN endereco_empresa AS end_emp ON (end_emp.id_empresa = emp.id);