# Sessao: Pipeline header redesign + grupos + TMM correto

**Data:** 12/04/2026
**Gerado por:** Claudion
**Para:** Gabriel Marketing (Claude Code)

---

## LEITURA OBRIGATORIA ANTES DE COMECAR

1. `CONTEXTO_CLAUDE_CODE.md`
2. `~/.claude/skills/frontend-design/SKILL.md` — OBRIGATORIO para o header

---

## O QUE JA FOI FEITO NO BANCO (nao repetir)

- Status 'encerrada' e 'inativa' convertidos para 'perdida'
- Constraint aceita APENAS: ativa, gestao, repaginando, aguardando, vendida, perdida

---

## TAREFA 1 — PIPELINE HEADER COMPLETO (redesign)

### O problema atual
A barra navy exibe apenas "CERTEIRO ONE — PIPELINE" e "X ativas".
O botao "+ Nova exclusividade" fica solto abaixo, ocupando espaco desnecessario.
Nao ha campo de meta nem indicador visual de TMM vs meta.

### O que construir
Uma unica barra navy slim que contenha:
1. Label "CERTEIRO ONE — PIPELINE" a esquerda
2. Contadores no centro: ativas + repaginando + aguardando (3 numeros compactos)
3. Campo de meta editavel + barra de progresso TMM vs meta
4. Botao "+ Nova exclusividade" integrado no canto direito

### Layout exato (desktop)
```
[ CERTEIRO ONE — PIPELINE ]  [ 5 ativas · 2 repag · 1 aguar ]  [ META ______ | ████░░░ R$ X.XXX.XXX/mês ]  [ + Nova exclusividade ]
```

Tudo em uma linha, padding 14px 24px, border-radius igual ao atual.

### Campo de meta
- Input type="number" inline, estilo minimalista, borda sutil (rgba branca)
- Placeholder: "0"
- Label acima: "META VGV/MÊS (R$)"
- Valor salvo em localStorage com chave 'cfg_meta_vgv_mes'
- Ao digitar, recalcular a barra de progresso imediatamente

### Barra de progresso TMM vs Meta
- A barra ocupa o espaco disponivel entre o campo de meta e o botao
- Cor da barra: verde (#34D399) quando TMM >= meta * 70%, amarelo (#F59E0B) quando TMM < 70%
- Label: "TMM R$ X.XXX.XXX/mês" calculado em tempo real
- A meta de TMM = meta * 70% (Gabriel precisa de 70% do target para considerar saudavel)
- Abaixo da barra: "meta TMM: R$ X.XXX.XXX/mês" em texto muted

### Contadores centrais (compactos)
Tres badges inline:
- "5 ativas" (branco)
- "2 repag." (amarelo #F59E0B)
- "1 aguar." (cinza rgba)
Separados por ponto medio (·)

### Logica JS
```javascript
// Ao carregar e ao atualizar dados, chamar:
function atualizarPipelineHeader(imoveis) {
  var nAtivas = imoveis.filter(x => x.status_exclusividade === 'ativa').length;
  var nGestao = imoveis.filter(x => x.status_exclusividade === 'gestao').length;
  var nRepag  = imoveis.filter(x => x.status_exclusividade === 'repaginando').length;
  var nAguar  = imoveis.filter(x => x.status_exclusividade === 'aguardando').length;

  // TMM total (formula: preco * 30/dias_tipo, sem 0.05)
  var diasPorTipo = { 'Repaginado': 40, 'Mobiliado': 80, 'Vazio': 120 };
  var tmmTotal = 0;
  imoveis.forEach(function(im) {
    if (!['ativa','gestao'].includes(im.status_exclusividade)) return;
    var preco = parsePrecM(im.preco) * 1000000;
    var dias  = diasPorTipo[im.tipo_imovel] || 120;
    var tmm   = preco / (dias / 30);
    if (im.status_exclusividade === 'gestao') tmm = tmm / 5;
    tmmTotal += tmm;
  });

  var meta = parseFloat(localStorage.getItem('cfg_meta_vgv_mes') || '0');
  var metaTMM = meta * 0.70;
  var pct = metaTMM > 0 ? Math.min((tmmTotal / metaTMM) * 100, 100) : 0;
  var cor = tmmTotal >= metaTMM && metaTMM > 0 ? '#34D399' : '#F59E0B';

  // Atualizar elementos no DOM
  // (elementos com ids: ph-ativas, ph-repag, ph-aguar,
  //  ph-tmm-valor, ph-tmm-barra, ph-tmm-meta, ph-meta-input)
}
```

### Estilo da barra — seguir o skill de frontend-design
- Fundo: --navy (#191949)
- Border-radius: var(--card-radius) ou 14px
- Padding: 12px 20px desktop, 10px 16px mobile
- Em mobile: empilhar em 2 linhas (label + contadores / barra de meta + botao)
- O botao "+ Nova exclusividade" deve ter o mesmo estilo atual (branco sobre navy)
  mas integrado no flex container da barra, sem margin-bottom separado

---

## TAREFA 2 — REDESENHO DOS GRUPOS

### Ordem
1. EM CAMPANHA (status = 'ativa')
2. GESTAO (status = 'gestao')
3. EM REPAGINANDO (status = 'repaginando')
4. AGUARDANDO (status = 'aguardando')
5. VENDIDAS — colapsado (status = 'vendida')
6. PERDIDAS — colapsado (status = 'perdida')

### Cards por tipo

ATIVA: card completo existente (sem mudanca)

GESTAO: card completo igual ATIVA +
  - Badge roxo "Gestao" no canto superior direito
  - TMM exibido com "(20%)" ao lado

REPAGINANDO: card resumido com
  - Nome + proprietario + preco + badge amarelo
  - "Campanha prevista a partir de:" + data_repaginacao_concluida
    (ou "Repaginacao em andamento" se vazio)
  - Barra de progresso dias passados/total
  - Botao Atualizar + Ver detalhe

AGUARDANDO: card resumido com
  - Nome + proprietario + preco + badge cinza
  - "Cadastrado em:" + data_inicio
  - Barra de progresso
  - Botao Atualizar + Ver detalhe

VENDIDA: card historico existente (sem mudanca)

PERDIDA: novo renderCardPerdida
  - Card minimalista: nome, datas, badge vermelho "Perdida"
  - Grupo colapsado por padrao (mesmo padrao do grupo VENDIDAS)

### O que remover
- Grupo "Inativas" — nao existe mais
- Status 'inativa' e 'encerrada' de TODOS os selects, badges e stMap
- Select do formulario de edicao: ativa, repaginando, aguardando, gestao, vendida, perdida
- Select do modal nova exclusividade: ativa, repaginando, aguardando, gestao

---

## TAREFA 3 — FORMULA DO TMM CORRETA

### Formula: TMM = preco × (30 / dias_tipo)
NAO usa honorarios (sem * 0.05)

Validacao obrigatoria — Casa Ressacada (Mobiliado, R$ 3.100.000):
- TMM correto: R$ 1.162.500/mes
- Se mostrar outro valor, formula ainda esta errada

### No codigo

renderCard:
```javascript
// REMOVER: var tmmVal = parsePrecM(im.preco) * 0.05 / prazoMesesIm(im);
// CORRETO:
var tmmVal = parsePrecM(im.preco) * 1000000 / prazoMesesIm(im);
if (im.status_exclusividade === 'gestao') tmmVal = tmmVal / 5;
```

calcTMM — localizar e substituir:
```javascript
// REMOVER: var vgv_im = preco_reais * 0.05; var tmm_imovel = vgv_im / (dias_tipo/30);
// CORRETO:
var tmm_imovel = preco_reais / (dias_tipo / 30);
if (im.status_exclusividade === 'gestao') tmm_imovel = tmm_imovel / 5;
```

Formatacao — numero completo sem M/K:
```javascript
function fmtTMM(v) {
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR') + '/mes';
}
```

---

## ORDEM DE EXECUCAO

1. Tarefa 1 (header) — mostrar mockup/diff, aguardar aprovacao
2. Tarefa 2 (grupos) — apos aprovacao da Tarefa 1
3. Tarefa 3 (TMM) — junto ou apos Tarefa 2

---

## VALIDACAO OBRIGATORIA

```bash
grep -n "[\x80-\xFF]" exclusividades.html | head -20
tail -3 exclusividades.html
```

Commits:
- `feat: pipeline header com meta, TMM barra de progresso e contadores integrados`
- `feat: redesenho grupos exclusividades - ordem e cards por tipo`
- `fix: formula TMM correta - preco direto - numero completo`

---

*Gerado por Claudion em 12/04/2026*
