# Sessao: Grupos de exclusividades + TMM correto

**Data:** 12/04/2026
**Gerado por:** Claudion
**Para:** Gabriel Marketing (Claude Code)

---

## LEITURA OBRIGATORIA ANTES DE COMECAR

1. `CONTEXTO_CLAUDE_CODE.md`
2. `~/.claude/skills/frontend-design/SKILL.md`

---

## O QUE JA FOI FEITO NO BANCO (nao repetir)

- Status 'encerrada' e 'inativa' convertidos para 'perdida'
- Constraint: aceita APENAS ativa, gestao, repaginando, aguardando, vendida, perdida

---

## TAREFA 1 — REDESENHO DOS GRUPOS E CARDS no exclusividades.html

### Ordem dos grupos (topo para baixo)
1. EM CAMPANHA (status = 'ativa')
2. GESTAO (status = 'gestao')
3. EM REPAGINANDO (status = 'repaginando')
4. AGUARDANDO (status = 'aguardando')
5. VENDIDAS — colapsado por padrao (status = 'vendida')
6. PERDIDAS — colapsado por padrao (status = 'perdida')

### Cards por tipo

#### ATIVA e GESTAO — card completo com funil de barras
- GESTAO: badge roxo "Gestao", border-left roxo (#8B5CF6), TMM com "(20%)" ao lado
- ATIVA: comportamento atual sem alteracao

#### REPAGINANDO e AGUARDANDO — card resumido
- Nome, proprietario, preco, badge status, barra de progresso
- Data relevante:
  - Repaginando: label "Campanha prevista a partir de" + data_repaginacao_concluida
    (ou "Repaginacao em andamento" se nao preenchida)
  - Aguardando: label "Cadastrado em" + data_inicio
- Botao Atualizar + link Ver detalhe

#### PERDIDA — colapsado igual ao grupo VENDIDAS atual
Badge vermelho "Perdida". Cards com nome, datas, observacoes.

### Selects a atualizar
- Formulario de edicao (renderEdit): APENAS ativa, repaginando, aguardando, gestao, vendida, perdida
- Modal nova exclusividade: mesmo conjunto, remover inativa/encerrada/renovada

---

## TAREFA 2 — CORRIGIR TMM NOS CARDS E NA BARRA

### Formula correta do TMM

**IMPORTANTE: O TMM e calculado sobre o PRECO CHEIO do imovel, NAO sobre o VGV (5%).**

TMM = preco_reais / dias_tipo * 30

Exemplos:
- Vazio R$ 2.200.000 / 120 dias * 30 = R$ 550.000/mes
- Mobiliado R$ 3.100.000 / 80 dias * 30 = R$ 1.162.500/mes
- Repaginado R$ 7.200.000 / 40 dias * 30 = R$ 5.400.000/mes

Dias por tipologia (SEMPRE usar tipo_imovel, NUNCA prazo_interno_dias para TMM):
- Repaginado: 40 dias
- Mobiliado: 80 dias
- Vazio: 120 dias (padrao se tipo nao identificado)

### Correcao no renderCard

A funcao parsePrecM retorna o preco em MILHOES (ex: 3.1 para R$ 3.100.000).
Precisa multiplicar por 1.000.000 antes de dividir pelos dias.

```javascript
// REMOVER prazoMesesIm do calculo de TMM — ele usa prazo_interno_dias (errado para TMM)
// USAR sempre os dias padrao por tipologia

var diasTMM = {'Repaginado': 40, 'Mobiliado': 80, 'Vazio': 120};
var dTMM = diasTMM[im.tipo_imovel] || 120;
var precoReais = parsePrecM(im.preco) * 1000000;
var tmmVal = precoReais / dTMM * 30;
// Para gestao: var tmmVal = (precoReais / dTMM * 30) / 5;

// Formatacao: numero completo com pontos de milhar, SEM abreviacao M ou K
function fmtTMM(v) {
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR') + '/mes';
}
// fmtTMM(1162500)  → "R$ 1.162.500/mes"
// fmtTMM(550000)   → "R$ 550.000/mes"
```

### Correcao no calcTMM (barra superior)

A funcao calcTMM ja existe e calcula um TMM diferente (baseado em honorarios/VGV)
para fins de meta financeira. Manter essa logica para a barra superior — ela
esta correta para o objetivo dela (comparar honorarios esperados com meta mensal).

O que precisa de correcao na barra:
1. Os elementos HTML `tmmValor` e `tmmMeta` nao existem no pipelineHeader — adicionar:

```html
<div id="pipelineHeader" style="background:var(--navy);border-radius:var(--card-radius);padding:14px 24px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center">
  <span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px">CERTEIRO ONE — PIPELINE</span>
  <div style="display:flex;gap:24px;align-items:center">
    <div style="text-align:right">
      <div style="color:rgba(255,255,255,0.45);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Ativas</div>
      <div id="pipelineAtivas" style="color:#fff;font-size:13px;font-weight:800">-</div>
    </div>
    <div style="text-align:right">
      <div style="color:rgba(255,255,255,0.45);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase">TMM total</div>
      <div id="tmmValor" style="color:#34D399;font-size:13px;font-weight:800">-</div>
    </div>
    <div style="text-align:right">
      <div style="color:rgba(255,255,255,0.45);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Meta mensal</div>
      <div id="tmmMeta" style="color:rgba(255,255,255,0.7);font-size:13px;font-weight:800">-</div>
    </div>
  </div>
</div>
```

2. A funcao fmtValM interna do calcTMM deve usar numero completo:
```javascript
function fmtValM(v) {
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR');
}
```

---

## ORDEM DE EXECUCAO

1. Tarefa 1 — mostrar diff, aguardar aprovacao
2. Tarefa 2 — apos aprovacao da Tarefa 1

---

## VALIDACAO OBRIGATORIA

```bash
grep -n "[\x80-\xFF]" exclusividades.html | head -20
tail -3 exclusividades.html
```

Verificacao manual: Casa Ressacada N81 (Mobiliado, R$ 3.100.000) deve exibir
TMM = R$ 1.162.500/mes nos cards.

Commits:
- `feat: redesenho grupos exclusividades nova ordem e cards por tipo`
- `fix: TMM preco cheio sem VGV numero completo sem abreviacao`

---

*Gerado por Claudion em 12/04/2026*
