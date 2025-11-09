// tests/rewardEngine.test.js

// 1. Importa as funções que queremos testar
import { 
    calculateCapibas, 
    processAndCreditActivity 
} from '../src/backend/services/rewardEngine';

// 2. Importa as dependências (que vamos simular/mockar)
// A sintaxe abaixo diz ao Jest para substituir o código real desses arquivos por funções simuladas
import { requestCapibaCredit } from '../src/backend/integrations/capibaApi';
import { query } from '../src/backend/database/db_connection';

jest.mock('../src/backend/integrations/capibaApi', () => ({
    requestCapibaCredit: jest.fn(),
}));

jest.mock('../src/backend/database/db_connection', () => ({
    query: jest.fn(),
}));

// --- Testes Unitários (HU1.7) ---

describe('calculateCapibas (Unidade)', () => {
    // Garante que a função de cálculo básica está correta
    test('deve calcular 60 capibas para 2.0 km com fator padrao (30)', () => {
        // Define a variável de ambiente (fator) para garantir que o teste seja consistente
        process.env.CAPIBA_PER_KM = 30; 
        expect(calculateCapibas(2.0)).toBe(60);
    });

    // Garante que a função arredonda para baixo, pois só credita inteiros
    test('deve arredondar o valor para baixo (Math.floor)', () => {
        process.env.CAPIBA_PER_KM = 30;
        // 1.9 * 30 = 57.0 -> deve ser 57
        expect(calculateCapibas(1.9)).toBe(57);
    });
});

// --- Testes de Integração/Fluxo (HU1.7) ---

describe('processAndCreditActivity (Integracao)', () => {
    // Dados de teste
    const userId = 'user-teste-123';
    const distanceKm = 5.0;
    const timeMinutes = 30; // 5 km em 30 min = 10 km/h (velocidade plausível)
    const activityType = 'running';
    const expectedCapibas = 150; // 5.0 * 30

    beforeEach(() => {
        // Reseta os mocks antes de cada teste para garantir isolamento
        requestCapibaCredit.mockClear();
        query.mockClear();
    });

    test('deve rejeitar atividade por anti-fraude (velocidade excessiva)', async () => {
        // 5 km em 5 min = 60 km/h (> limite de 25 km/h)
        const result = await processAndCreditActivity(userId, 5.0, 5, activityType);
        
        // Verifica se a função retorna falha com a mensagem correta
        expect(result.success).toBe(false);
        expect(result.message).toContain('Anti-Fraude');
        
        // Verifica se NENHUMA dependência externa foi chamada (Fluxo interrompido)
        expect(requestCapibaCredit).not.toHaveBeenCalled();
        expect(query).not.toHaveBeenCalled(); 
    });

    test('deve processar e creditar com sucesso (Fluxo OK)', async () => {
        // 1. Configura MOCK: Simula que a API da Prefeitura retornou SUCESSO
        requestCapibaCredit.mockResolvedValue({ 
            success: true, 
            data: { transaction_id: 'ext-ref-456' } 
        });
        
        // 2. Configura MOCK: Simula que o banco de dados local registrou com SUCESSO
        query.mockResolvedValue({}); 

        const result = await processAndCreditActivity(userId, distanceKm, timeMinutes, activityType);

        // 3. Verifica o resultado final da função
        expect(result.success).toBe(true);
        expect(result.credited).toBe(expectedCapibas);

        // 4. Verifica chamadas (Integração): 
        // A API externa DEVE ser chamada com os dados corretos
        expect(requestCapibaCredit).toHaveBeenCalledWith(
            expect.any(String), // userId
            expectedCapibas, 
            '5.00 km, 30 min' // Detalhes calculados
        );

        // O banco de dados DEVE ser chamado para registrar a transação
        expect(query).toHaveBeenCalledWith(
            expect.any(String), // String da Query SQL
            expect.arrayContaining([
                userId, 
                expectedCapibas, 
                activityType, 
                expect.any(String), 
                'ext-ref-456' // Referência externa
            ])
        );
    });
});