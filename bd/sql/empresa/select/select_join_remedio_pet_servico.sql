SELECT
    info_servico.id AS id_info_servico,
    ps.id_pet AS id_pet,
    p.nome AS nome_pet,
    rps.id AS id_remedio_pet_servico,
    rps.nome AS nome_remedio_pet,
    rps.instrucoes AS instrucoes_remedio_pet
FROM 
    info_servico
    INNER JOIN pet_servico AS ps ON (ps.id_info_servico = info_servico.id)
    INNER JOIN pet AS p ON (p.id = ps.id_pet)
    LEFT JOIN remedio_pet_servico AS rps ON (rps.id_pet_servico = ps.id)
ORDER BY id_info_servico ASC;
 
