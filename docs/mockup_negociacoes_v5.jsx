// MOCKUP APROVADO — Módulo de Negociações v5
// Ver SPEC_VENDEDOR.md para instruções de implementação

// DECISÕES DE DESIGN APROVADAS:

// TIPOS (simplificado para 2):
// - proposta_formal: "Proposta formal" (tem documento/termo)
// - consulta: "Consulta de interesse" (interesse verbal, sem formalização)

// FORMA DE PAGAMENTO (select com 5 opções):
// - À vista
// - Financiamento
// - Permuta
// - Permuta + complemento
// - Permuta + financiamento

// STATUS (5 opções com cores):
// - em_andamento: amarelo
// - aguardando: azul
// - aceita: verde
// - recusada: vermelho
// - desistiu: cinza

// INPUT DE VALOR:
// - Campo numérico com máscara em tempo real
// - "R$" fixo à esquerda do input
// - Pontos aparecem enquanto digita (ex: 6.800.000)
// - Confirmação formatada abaixo do campo

// VIEW INTERNA (Gabriel):
// - Botão "+ Nova" abre formulário inline
// - Lista existente com expand/collapse
// - Salva no Supabase tabela negociacoes

// VIEW VENDEDOR:
// - Resumo: X em andamento / Y não avançaram
// - Toggle: Em andamento / Todas
// - Lista read-only com expand/collapse
// - Sem formulário de edição

// Consultar SPEC_VENDEDOR.md para schema SQL e especificação completa.
