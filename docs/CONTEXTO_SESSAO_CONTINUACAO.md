# Sessao: UX Profissional — Redesign completo do Certeiro One

**Data:** 12/04/2026
**Gerado por:** Claudion
**Para:** Gabriel Marketing (Claude Code)

---

## LEITURA OBRIGATORIA ANTES DE COMECAR

1. `CONTEXTO_CLAUDE_CODE.md`
2. `~/.claude/skills/frontend-design/SKILL.md` — OBRIGATORIO para TODAS as tarefas visuais

---

## O QUE JA FOI FEITO NO BANCO (nao repetir)

- Status normalizados para: ativa, gestao, repaginando, aguardando, vendida, perdida
- Colunas de leads e funil criadas no funil_snapshot
- Bug leads_abertos corrigido

---

## PRINCIPIO DESTA SESSAO

Toda decisao visual deve ser guiada pelo skill de frontend-design.
O objetivo nao e so estreitar campos — e repensar a arquitetura de
interacao para que o sistema funcione como plataforma profissional.

---

## TAREFA 0 — CSS GLOBAL NO nav.js (fazer primeiro, base para tudo)

Adicionar no nav.js as classes globais de layout de formulario.
Estas classes estarao disponíveis em TODOS os arquivos automaticamente.

```css
.cn-form   { max-width: 760px; margin: 0 auto; }
.cn-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.cn-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.cn-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
.cn-full   { grid-column: 1 / -1; }
@media (max-width: 899px) { .cn-grid-3,.cn-grid-4 { grid-template-columns: 1fr 1fr; } }
@media (max-width: 479px) { .cn-grid-2,.cn-grid-3,.cn-grid-4 { grid-template-columns: 1fr; } }
```

Apos adicionar, aplicar cn-form + grids nos formularios de edicao de:
- exclusividades.html (renderEdit)
- registro.html
- usuarios.html
- vendas.html (verificar se vEdit tambem tem container correto)

Campos curtos (data, status, numero, dias): cn-grid-3 ou cn-grid-4
Campos medios (nome, valor): cn-grid-2
Campos longos (observacao, textarea): cn-full

Nao alterar logica JS, IDs ou eventos. So CSS/HTML estrutural.
Mostrar diff do nav.js antes de qualquer outro arquivo. Aguardar aprovacao.

---

## TAREFA 1 — PIPELINE HEADER INTEGRADO

Substituir a barra navy atual + botao flutuante por UMA unica barra que contenha:

Layout (da esquerda para direita):
1. Label "CERTEIRO ONE — PIPELINE"
2. Contadores: "5 ativas · 2 repag. · 1 aguar."
3. Campo de meta digitavel + barra de progresso TMM
4. Botao "+ Nova exclusividade"

### Campo de meta
- Input type="number" inline, borda rgba(255,255,255,0.2), fundo transparente
- Label "META/MES" acima, texto branco opaco
- Persistido em localStorage chave 'cfg_meta_vgv_mes'
- Ao digitar: recalcular barra imediatamente

### Barra de progresso TMM
- Exibir "TMM R$ X.XXX.XXX/mes" como valor
- Verde (#34D399) se TMM >= meta * 70%, amarelo (#F59E0B) se abaixo
- Abaixo da barra: "meta: R$ X.XXX.XXX/mes" em texto muted

### Contadores
- Ativas: branco | Repaginando: #F59E0B | Aguardando: rgba(255,255,255,0.4)
- Separados por ·

### Mobile: empilhar em 2 linhas

---

## TAREFA 2 — REDESENHO DOS GRUPOS no exclusividades.html

Ordem: EM CAMPANHA → GESTAO → EM REPAGINANDO → AGUARDANDO → VENDIDAS (colapsado) → PERDIDAS (colapsado)

ATIVA: card completo existente, sem mudanca
GESTAO: card completo + badge roxo "Gestao" + TMM com "(20%)"
REPAGINANDO: card resumido
  - Nome, proprietario, preco, badge amarelo
  - "Campanha prevista a partir de:" + data_repaginacao_concluida
    (ou "Repaginacao em andamento" se vazio)
  - Barra de progresso + Atualizar + Ver detalhe
AGUARDANDO: card resumido
  - "Cadastrado em:" + data_inicio
  - Barra de progresso + Atualizar + Ver detalhe
VENDIDA: card historico existente
PERDIDA: novo renderCardPerdida — minimalista, badge vermelho, colapsado

Remover 'inativa' e 'encerrada' de TODOS os selects, badges e stMap.
Select de edicao: ativa, repaginando, aguardando, gestao, vendida, perdida
Select de nova exclusividade: ativa, repaginando, aguardando, gestao

---

## TAREFA 3 — FORMULA TMM CORRETA

Formula: TMM = preco × (30 / dias_tipo). SEM honorarios (sem * 0.05).
- Repaginado: 40d | Mobiliado: 80d | Vazio: 120d
- Gestao: dividir por 5

renderCard:
```javascript
var tmmVal = parsePrecM(im.preco) * 1000000 / prazoMesesIm(im);
if (im.status_exclusividade === 'gestao') tmmVal = tmmVal / 5;
```

calcTMM — substituir vgv_im * 0.05 por:
```javascript
var tmm_imovel = preco_reais / (dias_tipo / 30);
if (im.status_exclusividade === 'gestao') tmm_imovel = tmm_imovel / 5;
```

Formatacao obrigatoria — numero completo sem M/K:
```javascript
function fmtTMM(v) { return 'R$ ' + Math.round(v).toLocaleString('pt-BR') + '/mes'; }
```

Validacao: Casa Ressacada (Mobiliado, R$ 3.100.000) → deve exibir R$ 1.162.500/mes.

---

## TAREFA 4 — UX PROFISSIONAL: 3 MELHORIAS DE INTERACAO

### 4a. Campo "Prazo do contrato" vira input digitavel
No modal de nova exclusividade e no formulario de edicao, o campo
"Prazo do contrato" hoje e um select com apenas 120 ou 180 dias.

Substituir por input type="number" com:
- Valor padrao: 120
- Placeholder: "ex: 120"
- Label mantida: "Dias de contrato"
- Remover o select completamente

### 4b. Status clicavel direto no card do pipeline
Nos cards do pipeline (EM CAMPANHA, GESTAO), o badge de status deve ser
clicavel sem abrir a pagina de edicao.

Ao clicar no badge do status no card:
- Abrir um popover/dropdown inline com as opcoes de status
- Selecionar uma opcao → salvar direto no Supabase (funil_snapshot)
- Fechar o popover → atualizar o badge visualmente sem recarregar a pagina

Opcoes do popover: Em campanha, Repaginando, Aguardando, Gestao, Vendida, Perdida
Estilo do popover: card branco com sombra sutil, fonte 12px, lista simples

### 4c. Indicador "sem atualizacao" nos cards
Cards cuja ultima atualizacao (campo atualizado_em no funil_snapshot)
foi ha mais de 7 dias devem exibir um badge discreto no rodape do card:
"Sem atualizacao ha Xd" em cinza, font-size 9px.

Se atualizado_em for null, considerar desatualizado.
Nao bloqueia nenhuma acao — e apenas informativo.

---

## TAREFA 5 — VENDAS.HTML: PENDENCIAS ACUMULADAS

Verificar quais dos itens abaixo AINDA NAO foram implementados e implementar:

5a. Mascara R$ em tempo real nos campos valor_contrato e valor_honorarios
    Ao salvar: extrair digitos puros com parseInt(campo.value.replace(/\D/g,''))

5b. Campo % comissao readonly calculado automaticamente:
    formula: (valor_honorarios / valor_contrato) * 100
    Exibir com 1 decimal (ex: "6,7%"). Se vazio: "--"

5c. Select "Tipo da Venda" substituindo is_parceria + tipo_participacao:
    "Venda Direta"       → is_parceria=false, tipo_participacao='corretor'
    "Venda com Parceria" → is_parceria=true,  tipo_participacao='corretor'
    "Venda Gestao"       → is_parceria=false, tipo_participacao='gestao'
    Campo nome_parceiro aparece SOMENTE quando "Venda com Parceria" selecionado.

5d. Campo competencia: remover do formulario visivel.
    Ao salvar: competencia = data_venda automaticamente.

5e. Filtro "Formato da Venda" substituindo "Parceria: Sim/Nao":
    Venda Direta | Parceria | Gestao

---

## ORDEM DE EXECUCAO

Execute em ordem. Mostrar diff de cada tarefa e aguardar aprovacao antes de prosseguir.

1. Tarefa 0 — nav.js CSS global (mostrar diff nav.js primeiro)
2. Tarefa 1 — Pipeline header
3. Tarefa 2 — Grupos e cards
4. Tarefa 3 — Formula TMM
5. Tarefa 4 — UX melhorias (pode fazer junto com Tarefa 3)
6. Tarefa 5 — vendas.html pendencias

---

## VALIDACAO OBRIGATORIA APOS CADA ARQUIVO

```bash
grep -n "[\x80-\xFF]" ARQUIVO | head -20   # zero resultados esperado
tail -3 ARQUIVO                              # </html> nas ultimas linhas
```

Commits por tarefa:
- `feat: cn-form CSS global nav.js - layout profissional em todos os arquivos`
- `feat: pipeline header integrado com meta TMM e contadores`
- `feat: grupos exclusividades redesign + renderCardPerdida`
- `fix: formula TMM correta preco direto numero completo`
- `feat: status clicavel no card + indicador desatualizacao + prazo digitavel`
- `fix: pendencias UX vendas.html mascara comissao tipo venda`

---

*Gerado por Claudion em 12/04/2026*
