# Especificação — Dashboard do Vendedor (vendedor.html)

> Documento de instrução para implementação. Gerado em 04/04/2026.
> Mockups aprovados em: `docs/mockup_vendedor_v3.jsx` e `docs/mockup_negociacoes_v5.jsx`

---

## Contexto

O dashboard interno (`index.html`) é usado pelo Gabriel e equipe. O **vendedor.html** é uma view restrita que Gabriel compartilha com o proprietário do imóvel para mostrar o andamento do trabalho de venda.

## Arquitetura

- **Arquivo:** `vendedor.html` (já existe no repo, precisa ser reescrito)
- **Repo:** `gabrielcerteiro/dashboard-certeiro`
- **Deploy:** Vercel auto-deploy via GitHub push
- **Dados:** Supabase (mesmas views + nova tabela `negociacoes`)
- **Acesso:** `vendedor.html?id=IMOVEL_ID` (link público, sem autenticação)
- **Fluxo:** dashboard interno → botão "Vendedor" na tela de detalhe → abre `vendedor.html?id=X&from=internal` em nova aba → barra "Copiar link" aparece → Gabriel copia e envia pro proprietário

## Fluxo de acesso

1. Gabriel abre `dashboard-certeiro.vercel.app` (dashboard interno)
2. Clica num imóvel → tela de detalhe
3. Botão **"Vendedor"** no canto superior direito (já implementado no `index.html`)
4. Abre `vendedor.html?id=X&from=internal` em nova aba
5. Barra sticky "Copiar link para o vendedor" aparece no topo (só com `?from=internal`)
6. Gabriel copia o link (sem o `&from=internal`) e envia via WhatsApp
7. Proprietário abre o link → vê o relatório limpo, sem barra de copiar

---

## Seções do vendedor.html (ordem aprovada)

### 1. Header
- Fundo branco (não navy)
- Logo real do Gabriel Certeiro (tipografia: "GABRIEL CERTEIRO" bold uppercase + subtítulo "3 e 4 Suítes | Fazenda e Brava")
- Badge "Acompanhamento" no canto direito
- Sticky no topo

### 2. Barra "Copiar link" (condicional)
- Só aparece quando URL contém `?from=internal`
- Botão navy "Copiar link para o vendedor"
- Ao copiar, remove o `&from=internal` da URL
- Toast "Link copiado!" por 2.5s
- Sticky abaixo do header

### 3. Hero (enxuto)
- Fundo navy, border-radius 16px
- **Nome do imóvel** em destaque (22px, branco, bold)
- Linha abaixo: proprietário (esquerda, opacidade 0.4) + preço (direita, opacidade 0.55, 14px)
- **SEM** pills/tags (Repaginado, Fazenda, Exclusividade — conceitos internos)
- **SEM** números repetidos (esses vão no card de Atividade)
- Glow dourado sutil no canto superior direito

### 4. Última atualização
- Texto centralizado, 10px, cinza
- Mostra data/hora do campo `atualizado_em` do Supabase

### 5. Prazo da Exclusividade
- Card branco com título "PRAZO DA EXCLUSIVIDADE"
- **Boxes lado a lado:**
  - Se houver repaginação: box "Repaginação" (ex: 40 dias) + box "Venda" (ex: 180 dias) + box "Total" (ex: 220 dias)
  - Se não houver repaginação: só box "Venda" + box "Total"
  - Fonte: 20px bold + "dias" em 11px muted
- **Barra de progresso:**
  - Label "Progresso" + "X dias restantes" (cor semáforo: verde >60d, amarelo 30-60d, vermelho <30d)
  - Barra horizontal com fill na cor semáforo
  - Data início (esquerda) e data fim (direita) em 9px
- **IMPORTANTE:** o prazo mostrado é o prazo da autorização de venda, NÃO a meta interna

### 6. Atividade Comercial
- Card branco com título "ATIVIDADE COMERCIAL"
- 3 boxes lado a lado:
  - **Interessados** (NÃO "Leads") — número grande (28px) navy
  - **Visitas** — número grande azul
  - **Propostas** — número grande verde
- **SEM metas** — só o número realizado
- Esta é a ÚNICA vez que esses números aparecem (sem repetir no hero)

### 7. Investimento em Mídia
- Card branco com título "INVESTIMENTO EM MÍDIA"
- 3 boxes: Investido (R$), Alcance, Frequência
- **SEM CPL** (informação interna)

### 8. Negociações
- Card branco com título "NEGOCIAÇÕES (X)"
- **Resumo visual:** 2 boxes lado a lado
  - "Em andamento" (fundo amarelo claro, número grande)
  - "Não avançaram" (fundo vermelho claro) — inclui recusadas + desistências
- **Toggle:** botões "Em andamento" / "Todas"
- **Lista de negociações:** cada item mostra:
  - Avatar + nome + data
  - Badge de status (Em andamento / Aguardando retorno / Aceita / Recusada / Desistiu)
  - Valor formatado (R$ X.XXX.XXX) + tipo (Proposta formal / Consulta de interesse) + forma de pagamento
  - Toque expande: observação detalhada
- **Dados vêm da tabela `negociacoes`** (ver seção Nova Tabela abaixo)

### 9. Intenção pós-visita
- Card com título "INTENÇÃO PÓS-VISITA (X visitas)"
- 4 barras horizontais: Quer comprar (verde), Está pensando (amarelo), Quer segunda visita (azul), Não gostou (vermelho)
- Contagem derivada das visitas

### 10. Principais Objeções
- Card com barras vermelhas
- Objeções extraídas das visitas, ordenadas por frequência
- Só aparece se houver objeções

### 11. Relatório de Visitas
- Card com título "RELATÓRIO DE VISITAS (X)"
- Lista: avatar + nome + data + badge de intenção
- Toque expande: objeções (pills vermelhas) + observação
- Hint "Toque para ver detalhes" quando colapsado

### 12. Footer
- Separador top border
- "GABRIEL CERTEIRO" (12px, bold, navy)
- "CRECI 22.249/SC · Itajaí/SC"
- Link "gabrielcerteiro.com.br" em dourado

---

## Nova Tabela Supabase: `negociacoes`

```sql
CREATE TABLE negociacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imovel_id UUID REFERENCES imoveis(id),
  nome_interessado TEXT NOT NULL,
  data DATE,
  tipo TEXT CHECK (tipo IN ('proposta_formal', 'consulta')),
  valor_proposto NUMERIC,
  forma_pagamento TEXT CHECK (forma_pagamento IN (
    'a_vista', 'financiamento', 'permuta',
    'permuta_complemento', 'permuta_financiamento'
  )),
  status TEXT CHECK (status IN (
    'em_andamento', 'aguardando', 'aceita', 'recusada', 'desistiu'
  )),
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**View para o vendedor.html:**
```sql
CREATE VIEW dashboard_negociacoes AS
SELECT * FROM negociacoes ORDER BY data DESC;
```

**Labels para exibição:**

| Campo | Valor BD | Label exibido |
|-------|----------|---------------|
| tipo | proposta_formal | Proposta formal |
| tipo | consulta | Consulta de interesse |
| forma_pagamento | a_vista | À vista |
| forma_pagamento | financiamento | Financiamento |
| forma_pagamento | permuta | Permuta |
| forma_pagamento | permuta_complemento | Permuta + complemento |
| forma_pagamento | permuta_financiamento | Permuta + financiamento |
| status | em_andamento | Em andamento |
| status | aguardando | Aguardando retorno |
| status | aceita | Aceita |
| status | recusada | Recusada |
| status | desistiu | Desistiu |

---

## Formulário de input (dashboard interno — index.html)

Na tela de detalhe do imóvel, adicionar seção "Negociações" com:
- Botão "+ Nova" que abre formulário inline
- Campos:
  - Nome do interessado (text input)
  - Data (date input)
  - Tipo (2 botões toggle: Formal / Consulta)
  - Valor proposto (input numérico COM MÁSCARA — pontos aparecem enquanto digita, ex: 6.800.000, com "R$" fixo à esquerda)
  - Forma de pagamento (5 botões de seleção: À vista, Financiamento, Permuta, Permuta + complemento, Permuta + financiamento)
  - Status (5 botões coloridos: Em andamento, Aguardando retorno, Aceita, Recusada, Desistiu)
  - Observação (textarea)
- Botão "Salvar negociação" → INSERT no Supabase
- Lista abaixo mostra negociações existentes com expand/collapse

---

## Design System

- **Font:** DM Sans (400, 500, 600, 700, 800, 900)
- **Navy:** #191949
- **Background:** #F7F7FA
- **Cards:** branco, border-radius 14px, border 1px solid #ECECF1, shadow sutil
- **Semáforo:** verde #10B981, amarelo #F59E0B, vermelho #EF4444, azul #3B82F6
- **Dourado:** #B8922A (para badges "Exclusividade" e link do footer)
- **Muted:** #8E8EA0
- **Animações:** fadeUp em cascata (0.04s delay entre seções)

---

## Terminologia

| Interno (dashboard) | Vendedor (relatório) |
|---------------------|---------------------|
| Leads | Interessados |
| Relatório de Vendas | Acompanhamento |
| Recusadas | Não avançaram |
| CPL | NÃO mostrar |
| Meta interna | NÃO mostrar |
| Tags (Repaginado, Fazenda) | NÃO mostrar |

---

## O que NÃO aparece no vendedor.html

- CPL / custo por visita / custo por proposta
- Formulário de edição
- Alertas internos
- Meta interna de venda (só o prazo da autorização)
- Metas de leads/visitas/propostas (só o realizado)
- Tags internas (Repaginado, Mobiliado, Fazenda, etc.)
- Bottom nav
- Checklist de ações de venda
- Canais de aquisição
- Performance por corretor

---

## Referência dos mockups

- **`docs/mockup_vendedor_v3.jsx`** — Layout completo aprovado do relatório do vendedor
- **`docs/mockup_negociacoes_v5.jsx`** — Módulo de negociações com as duas views (interno + vendedor)

Ambos são React JSX com dados fake para visualização. A implementação deve ser em HTML puro (mesmo padrão do index.html atual).
