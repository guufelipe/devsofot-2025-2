// src/backend/services/QueueService.js

// A função que realmente faz o trabalho pesado é importada aqui
import { processAndCreditActivity } from '../services/rewardEngine.js';
// BONUS
import welcomeBonusService from './WelcomeBonusService.js';

// Array simples para simular a fila de tarefas pendentes (apenas para demonstração)
const activityQueue = []; 

// Adiciona uma nova atividade para ser processada assincronamente
// {object} activityData Dados da atividade (userId, distanceKm, etc.)

export async function addActivityToQueue(activityData) {
    // Em produção, aqui seria 'queue.add('processActivity', activityData);'
    // Para fins de demonstração (se não puder configurar o Redis/BullMQ), 
    // simulamos a execução assíncrona com um setTimeout, adicionando o trabalho 
    // à 'fila' e processando em seguida:
    activityQueue.push(activityData);
    
    // Inicia o processamento em um loop de eventos, 
    // liberando o thread principal da API
    processQueue();
}

// Simula um Worker (Consumidor) rodando em segundo plano.
// Em um projeto real, este seria um processo Node.js separado (worker.js)

function processQueue() {
    if (activityQueue.length === 0) return;
    
    // Pega a primeira tarefa da fila (FIFO)
    const task = activityQueue.shift(); 
    
    console.log(`[Worker] Iniciando processamento de atividade para o usuário: ${task.userId}`);

    // Executa a lógica pesada que movemos para cá
    processAndCreditActivity(
        task.userId, 
        task.distanceKm, 
        task.timeMinutes, 
        task.activityType
    )
    .then(async (result) => { // Tornar a função de sucesso async para poder usar await
        
        console.log(`[Worker] Processamento de atividade concluído. Sucesso: ${result.success}`);
        
        // IMPLEMENTAÇÃO HU4
        if (result.success) {
            // Se a atividade física foi creditada com sucesso, verificamos o bônus
            await welcomeBonusService.processWelcomeBonus(task.userId);
        }
        // FIM DA IMPLEMENTAÇÃO HU4

    })
    .catch(error => {
        console.error(`[Worker] Erro catastrófico ao processar atividade:`, error);
    })
    .finally(() => {
        // Processa a próxima tarefa na fila, se houver
        processQueue(); 
    });
}