# Mecanismo De Comunicação Para Emissão (Crédito) Da Moeda Capiba

## Context and Problem Statement

O produto CapibaFit não fará a gestão financeira da moeda, mas precisa solicitar a emissão (crédito) da Capiba ao sistema central da Prefeitura após uma atividade ser validada. É essencial que o método de comunicação seja seguro e o único canal de alteração de saldo.

## Considered Options

* API REST/JSON da Prefeitura
* Comunicação por Arquivos (Batch)
* Implementação Própria

## Decision Outcome

Chosen option: "API REST/JSON da Prefeitura", because A comunicação entre os backends será o único meio para emitir a Capiba. A comunicação deve ser backend-to-backend.
