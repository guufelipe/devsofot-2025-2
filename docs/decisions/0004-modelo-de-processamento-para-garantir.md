# Modelo De Processamento Para Garantir

## Context and Problem Statement

O Critério de Aceitação exige que a sincronização e o crédito de Capibas ocorram no máximo em "Y minutos" após o término da atividade. O processamento inclui validação, verificação de bônus e comunicação com a API externa da Prefeitura.

## Considered Options

* Processamento Assíncrono (Filas/Workers)
* Processamento Síncrono
* Processamento Programado (Cron Jobs)

## Decision Outcome

Chosen option: "Processamento Assíncrono", because Isso permite que o aplicativo do usuário responda imediatamente, garantindo que o processamento pesado e a comunicação com a Prefeitura sejam concluídos em segundo plano, respeitando o limite de tempo. Implicações: Requer a implementação de uma tecnologia de fila de mensagens. O worker deve ter lógica de re-tentativa e monitoramento (dead-letter queue) para garantir que nenhuma atividade seja perdida.
