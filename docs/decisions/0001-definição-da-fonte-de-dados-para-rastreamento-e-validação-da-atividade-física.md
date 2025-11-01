# Definição Da Fonte De Dados Para Rastreamento E Validação Da Atividade Física

## Context and Problem Statement

O produto CapibaFit se baseia na conversão de atividade física em Moeda Capiba. O sistema precisa de uma fonte de dados confiável (distância, tempo) para validar as atividades sem se tornar uma ferramenta de monitoramento de saúde. A principal questão é garantir que os dados sejam fidedignos e prontamente disponíveis no smartphone do usuário.

## Considered Options

* APIs Externas Oficiais (Google Fit / Apple Health)
* Desenvolvimento de Rastreamento Próprio
* APIs de Apps de Fitness (Strava, Garmin)

## Decision Outcome

Chosen option: "APIs Externas Oficiais", because Google Fit / Apple Healt, o CapibaFit integrará diretamente com estas APIs. Implicações: A validação será delegada ao sistema operacional, reduzindo o risco de fraude.
