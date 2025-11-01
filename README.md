# 🏃‍♂️ CapibaFit

**CapibaFit** é uma plataforma digital gamificada que motiva e recompensa a prática de atividades físicas, transformando esforço em **moedas virtuais Capiba**, que podem ser trocadas por recompensas reais em comércios locais do Recife.

---

## 🎯 Visão do Projeto

O CapibaFit busca promover um estilo de vida mais ativo e saudável através da gamificação, conectando **atividade física, turismo e economia local**.  
O sistema incentiva o usuário a se exercitar e o recompensa com moedas Capiba, que podem ser trocadas por produtos, serviços e descontos.

---

## 👥 Público-Alvo

- **Recifenses que se exercitam:** moradores que já praticam atividades físicas e desejam converter seu esforço em moedas Capiba.
- **Turistas ativos:** visitantes que desejam explorar o Recife a pé ou de bicicleta enquanto acumulam recompensas.

---

## 🚫 Fora do Escopo

- O sistema **não fará gestão financeira** da moeda Capiba (apenas a contagem de recompensas).
- **Não é uma ferramenta de monitoramento de saúde.**
- **Não incluirá um marketplace** para venda de produtos (apenas resgate de descontos e vouchers).

---

## 🧩 Funcionalidades Principais (Histórias de Usuário)

| Nº | Funcionalidade | Descrição |
|----|----------------|------------|
| 1 | Sincronizar atividades | Receber moedas Capiba com base na distância percorrida. |
| 2 | Visualizar extrato de ganhos | Mostrar histórico de atividades e Capibas obtidas. |
| 3 | Painel de metas | Exibir progresso diário e semanal em relação às metas. |
| 4 | Desafio de boas-vindas | Conceder bônus na primeira atividade registrada. |
| 5 | Bônus turístico | Recompensar atividades realizadas em pontos turísticos do Recife. |
| 6 | Sequência de dias ativos | Dar bônus por manter uma rotina de exercícios consecutivos. |
| 7 | Compartilhar conquistas | Permitir publicar resultados e metas nas redes sociais. |

---

## 📊 Priorização do Backlog

1. **Prioridade 1 (Essencial / MVP)**
   - Sincronizar e creditar moedas Capiba (núcleo do produto)
   - Exibir extrato de ganhos

2. **Prioridade 2 (Engajamento e UX)**
   - Desafio de boas-vindas
   - Painel de metas
   - Compartilhamento de conquistas

3. **Prioridade 3 (Diferencial e Expansão)**
   - Bônus por sequência de dias
   - Bônus em pontos turísticos

---

## 🧱 Estrutura do Projeto

```
devsofot-2025-2/
├── README.md                  → Descrição geral do projeto
│   └── readme.txt
├── docs/                      → Documentação e materiais do projeto
│   ├── decisions/             → ADRs detalhadas
│   │   ├── 0001-definição-da-fonte-de-dados-para-atividades.md
│   │   ├── 0002-mecanismo-de-comunicação-para-sincronização.md
│   │   ├── 0003-serviço-de-geolocalização-geofencing.md
│   │   ├── 0004-modelo-de-processamento-para-gamificação.md
│   │   └── 0005-contabilização-do-bônus-progressivo.md
│   └── readme.txt
│   └── prototipo/             → Telas e wireframes
├── src/                       → Código-fonte (frontend e backend)
│   ├── backend/               → Lógica de negócio e APIs
│   │   └── readme.txt
│   ├── frontend/              → Interface do usuário
│   │   └── readme.txt
│   └── readme.txt
├── tests/                     → Testes automatizados
│   └── readme.txt
└── README.md
```

---

## 🧠 Decisões Arquiteturais (ADRs)

As **ADRs (Architecture Decision Records)** documentam as principais decisões técnicas do projeto, como:

- Linguagens e frameworks escolhidos;  
- Estrutura do banco de dados;  
- Padrões de arquitetura (ex: MVC, REST, etc.);  
- Estratégias de autenticação, cache e escalabilidade.  

Esses arquivos ficam em `/docs/decisions/` para rastreabilidade técnica.

---

## 💡 Principais Pilares do Projeto

- **Registro de Atividades e Recompensas:** transformar esforço físico em valor (moeda Capiba).  
- **Gamificação:** aumentar engajamento e retenção dos usuários.  
- **Transparência na Experiência do Usuário:** clareza sobre ganhos e progresso.  
- **Valorização do Recife:** integrar pontos turísticos e incentivar o turismo ativo.

---

## 💻 Tecnologias 

- **Frontend:** React ou Next.js  
- **Backend:** Node.js (Express)  
- **Banco de Dados:** MongoDB ou PostgreSQL  
- **Geolocalização:** Google Maps API / OpenStreetMap  
- **Autenticação:** JWT / OAuth2  

---

## 👨‍💻 Equipe de Desenvolvimento

**Equipe 10 – Desenvolvimento de Software (SI 2025.2)**  
- André Luiz  
- Gustavo Felipe  
- Lucas Marques  
- Robson  
- William  

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais no curso de **Desenvolvimento de Software - SI 2025.2**.  
Todos os direitos reservados à Equipe 10.
