# Sessao: UX Profissional — Redesign completo do Certeiro One

**Data:** 13/04/2026
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

## TAREFA 0 — CSS GLOBAL NO nav.js (fazer primeiro, base para tudo)

Adicionar no nav.js as classes globais de layout de formulario.
Estas classes estarao disponiveis em TODOS os arquivos automaticamente.

```css
.cn-form   { max-width: 760px; margin: 0 auto; }
.cn-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.cn-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.cn-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
.cn-full   { grid-column: 1 / -1; }
@media (max-width: 899px) { .cn-grid-3,.cn-grid-4 { grid-template-columns: 1fr 1fr; } }
@media (max-width: 479px) { .cn-grid-2,.cn-grid-3,.cn-grid-4 { grid-template-columns: 1fr; } }
```

Aplicar cn-form + grids nos formularios de edicao de:
- exclusividades.html (renderEdit)
- registro.html, usuarios.html, vendas.html (vEdit)

Campos curtos (data, status, dias, numeros): cn-grid-3 ou cn-grid-4
Campos medios (nome, valor): cn-grid-2
Campos longos (observacao): cn-full

Nao alterar logica JS, IDs ou eventos. So CSS/HTML estrutural.
Mostrar diff do nav.js antes de qualquer outro arquivo. Aguardar aprovacao.

---

## TAREFA 1 — PIPELINE HEADER REDESIGN

### O que REMOVER
- Label "CERTEIRO ONE — PIPELINE" — nao acrescenta nada, remover

### O que mostrar na barra (da esquerda para direita)
1. Contadores inline: "5 ativas · 2 repag. · 1 aguar."
2. Separador visual
3. TMM total das ativas+gestao + barra de percentual vs meta fixa
4. TMM pipeline futuro (repaginando + aguardando) — separado, informativo
5. Botao "+ Nova exclusividade" integrado no canto direito

### TMM ativas (meta fixa R$ 5.800.000)
- Meta TMM = R$ 5.800.000/mes (valor fixo hardcoded, nao editavel)
- Exibir: "TMM R$ X.XXX.XXX/mes" + percentual "XX% da meta"
- Barra de progresso: TMM / 5.800.000 * 100
- Verde (#34D399) se >= 100%, amarelo (#F59E0B) se 70-99%, vermelho (#EF4444) se < 70%
- Exibir o percentual em numero grande (ex: "58%") ao lado da barra
- Nao exibir campo para digitar meta — e fixo

### TMM pipeline futuro (informativo, separado)
- Calcular soma TMM de todas as exclusividades com status 'repaginando' e 'aguardando'
- Exibir como: "Pipeline: +R$ X.XXX.XXX/mes" em cor muted/amarelo
- Tooltip ou label: "TMM adicional ao entrar em campanha"
- Este valor NAO entra no calculo do percentual da meta

### Contadores
- Ativas: branco | Repag.: #F59E0B | Aguar.: rgba(255,255,255,0.45)
- Separados por ·

### Botao nova exclusividade
Integrado no flex da barra, sem elemento separado abaixo.

### Mobile: empilhar em 2 linhas

---

## TAREFA 2 — REDESENHO DOS GRUPOS no exclusividades.html

Ordem: EM CAMPANHA → GESTAO → EM REPAGINANDO → AGUARDANDO → VENDIDAS (colapsado) → PERDIDAS (colapsado)

ATIVA: card completo existente, sem mudanca
GESTAO: card completo + badge roxo "Gestao" + TMM com "(20%)"
REPAGINANDO: card resumido
  - Nome, proprietario, preco, badge amarelo
  - TMM individual exibido (mesmo calculo dos cards ativos)
  - "Campanha prevista a partir de:" + data_repaginacao_concluida
    (ou "Repaginacao em andamento" se vazio)
  - Barra de progresso contrato + Atualizar + Ver detalhe
AGUARDANDO: card resumido
  - Nome, proprietario, preco, badge cinza
  - TMM individual exibido
  - "Cadastrado em:" + data_inicio
  - Barra de progresso contrato + Atualizar + Ver detalhe
VENDIDA: card historico existente
PERDIDA: novo renderCardPerdida — minimalista, badge vermelho, colapsado

### BUG CRITICO A CORRIGIR
Exclusividades com status 'vendida', 'perdida' e 'aguardando' nao mostram
botao de editar. Isso e um bug — qualquer exclusividade deve poder ser editada
independente do status.

Fix: garantir que o botao "Atualizar" / "Editar" apareca em TODOS os cards
de TODOS os grupos para usuarios com role master ou operacional.
A logica de permissao e: `currentRole === 'master' || currentRole === 'operacional'`
Nao filtrar por status — o status nao bloqueia a edicao.

### Selects de status
Formulario de edicao: ativa, repaginando, aguardando, gestao, vendida, perdida
Modal nova exclusividade: ativa, repaginando, aguardando, gestao
Remover 'inativa' e 'encerrada' de TODOS os selects, badges e stMap.

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

Adicionar calculo separado do TMM pipeline futuro (repaginando + aguardando):
```javascript
var tmmFuturo = 0;
data.forEach(function(im) {
  if (!['repaginando','aguardando'].includes(im.status_exclusividade)) return;
  var preco_reais = parsePrecM(im.preco) * 1000000;
  var dias_tipo = diasPorTipo[im.tipo_imovel] || 120;
  tmmFuturo += preco_reais / (dias_tipo / 30);
});
```

Formatacao obrigatoria — numero completo sem M/K:
```javascript
function fmtTMM(v) { return 'R$ ' + Math.round(v).toLocaleString('pt-BR') + '/mes'; }
```

Validacao: Casa Ressacada (Mobiliado, R$ 3.100.000) → R$ 1.162.500/mes.

---

## TAREFA 4 — UX PROFISSIONAL: MELHORIAS DE INTERACAO

### 4a. Campo "Prazo do contrato" vira input digitavel
No modal de nova exclusividade E no formulario de edicao:
- Substituir select (120/180) por input type="number"
- Valor padrao: 120, placeholder: "ex: 120"
- Aceita qualquer numero inteiro positivo

### 4b. Status clicavel direto no card do pipeline
Badge de status nos cards e clicavel (todos os grupos, nao so ativa).
Clique → popover inline com opcoes → salva direto no Supabase → atualiza visualmente.
Opcoes: Em campanha, Repaginando, Aguardando, Gestao, Vendida, Perdida
Estilo: card branco, sombra sutil, lista simples 12px.

### 4c. Indicador "sem atualizacao" nos cards
Se atualizado_em for null ou ha mais de 7 dias:
Badge discreto no rodape: "Sem atualizacao ha Xd" — cinza, 9px.

---

## TAREFA 5 — VENDAS.HTML: PENDENCIAS

5a. Mascara R$ em valor_contrato e valor_honorarios
    Salvar: parseInt(campo.value.replace(/\D/g,''))

5b. % comissao readonly calculado: (honorarios/contrato)*100, 1 decimal

5c. Select "Tipo da Venda":
    Direta → is_parceria=false, tipo='corretor'
    Parceria → is_parceria=true, tipo='corretor' + campo nome_parceiro visivel
    Gestao → is_parceria=false, tipo='gestao'

5d. Competencia oculta, preenchida = data_venda ao salvar

5e. Filtro "Formato da Venda": Direta | Parceria | Gestao

---

## ORDEM DE EXECUCAO

1. Tarefa 0 — nav.js CSS (diff nav.js primeiro, aguardar aprovacao)
2. Tarefa 1 — Pipeline header
3. Tarefas 2+3 — Grupos + TMM juntos
4. Tarefa 4 — UX melhorias
5. Tarefa 5 — vendas.html

---

## VALIDACAO OBRIGATORIA APOS CADA ARQUIVO

```bash
grep -n "[\x80-\xFF]" ARQUIVO | head -20
tail -3 ARQUIVO
```

Validacao TMM: Casa Ressacada Mobiliado R$ 3.100.000 → R$ 1.162.500/mes

Commits:
- `feat: cn-form CSS global nav.js`
- `feat: pipeline header TMM meta fixa + pipeline futuro`
- `feat: grupos redesign + fix botao editar em todos os status`
- `fix: formula TMM correta + prazo digitavel + status clicavel`
- `fix: pendencias UX vendas.html`

---

*Gerado por Claudion em 13/04/2026*
