CALL pacote_agend('insert', '{
    "servicoOferecido": 1,
    "dtInicio": "2025-07-01",
    "hrAgendada": "09:00:00",
    "frequencia": "dias_semana",
    "qtdRecorrencia": 275,
    "diasPacote": [
        {
            "dia": 1
        },
        {
            "dia": 4
        },
        {
            "dia": 6
        }
    ],
    "petsPacote" : [
        {
            "pet": 1
        },
        {
            "pet": 2
        }
    ]
}');

CALL dbo.set_empresa_atual(4);
CALL set_estado_pacote_agend('preparado', 1);

SELECT * FROM vw_agendamento;

UPDATE info_servico SET id_funcionario = 1 WHERE id_funcionario IS NULL;

UPDATE agendamento SET estado = 'concluido' WHERE estado = 'preparado';



