# Contabilização Do Bônus Progressivo

## Context and Problem Statement

Para incentivar a disciplina, o sistema deve contabilizar streaks (sequências de dias consecutivos com atividade) e conceder um bônus progressivo em Capibas a cada 5 dias. Isso exige um modelo de dados preciso para rastrear a última atividade e o contador atual.

## Considered Options

* Modelo de Persistência Híbrida (DB + Cache)
* Apenas Banco de Dados
* Contagem por Fila Dedicada

## Decision Outcome

Chosen option: "Modelo de Persistência Híbrida", because O worker de processamento da atividade (ADR 4) será o responsável por atualizar o estado do streak no DB após cada atividade validada, garantindo alta performance para exibição no painel de metas. Implicações: O worker deve conter a lógica para: 1. Checar se a atividade é do dia seguinte ao último registro. 2. Resetar o contador se um dia for perdido. 3. Disparar o bônus de 5 em 5 dias.
