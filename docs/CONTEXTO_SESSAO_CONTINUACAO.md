# Sessao: Correcao TMM na barra + cards de exclusividades

**Data:** 12/04/2026
**Gerado por:** Claudion
**Para:** Gabriel Marketing (Claude Code)

---

## LEITURA OBRIGATORIA ANTES DE COMECAR

1. `CONTEXTO_CLAUDE_CODE.md`
2. `~/.claude/skills/frontend-design/SKILL.md`

---

## CONTEXTO: O QUE JA FOI FEITO NO BANCO (nao repetir)

- Constraints de status ja atualizadas no Supabase
- 'repaginacao' ja renomeado para 'repaginando' nos dados
- 'gestao' ja e status valido

---

## PROBLEMA IDENTIFICADO (pelo Claudion via analise do codigo)

O arquivo exclusividades.html tem DOIS bugs de TMM:

### BUG 1 — Barra superior nao exibe TMM

A funcao `calcTMM()` calcula o tmm_total corretamente mas tenta atualizar
elementos HTML que NAO EXISTEM no arquivo:
- `document.getElementById('tmmValor')` → null
- `document.getElementById('tmmMeta')` → null
- `document.getElementById('tmmMeses')` → null
- `document.getElementById('tmmAtivas')` → null

O `pipelineHeader` so tem:
```html
<span>CERTEIRO ONE — PIPELINE</span>
<span id="pipelineAtivas">- ativas</span>
```

FIX: adicionar os elementos de TMM no pipelineHeader. Resultado esperado:

```html
<div id="pipelineHeader" ...>
  <span>CERTEIRO ONE — PIPELINE</span>
  <div style="display:flex;gap:24px;align-items:center">
    <div style="text-align:right">
      <div style="color:rgba(255,255,255,0.45);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Exclusividades ativas</div>
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

### BUG 2 — TMM nos cards individuais usa preco bruto ao inves de VGV

Na funcao `renderCard`, o TMM e calculado assim:
```javascript
var tmmVal = parsePrecM(im.preco) / prazoMesesIm(im);
```

Isso usa o preco bruto. O correto e usar o VGV = preco * 0.05:
```javascript
var tmmVal = parsePrecM(im.preco) * 0.05 / prazoMesesIm(im);
```

A funcao prazoMesesIm ja usa os dias certos por tipologia (Repaginado 40d,
Mobiliado 80d, Vazio 120d) — so falta o * 0.05.

Exemplo correto: apto vazio R$ 2.200.000
- VGV = 2.200.000 * 0.05 = 110.000
- Meses = 120 / 30 = 4
- TMM = 110.000 / 4 = R$ 27.500/mes (nao R$ 550.000)

Tambem ajustar a formatacao do TMM no card para exibir como dinheiro:
- Atual: `R$ 0,6 M` (errado — estava usando o preco bruto)
- Correto: `R$ 27.500/mes` (usando VGV)

Funcao de formatacao para o TMM do card:
```javascript
function fmtTMM(v) {
  if (v >= 1000000) return 'R$ ' + (v/1000000).toFixed(1).replace('.',',') + 'M/mes';
  if (v >= 1000) return 'R$ ' + Math.round(v/1000) + 'K/mes';
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR') + '/mes';
}
```

---

## TAREFA — CORRIGIR OS DOIS BUGS

1. No `pipelineHeader`: adicionar os elementos `tmmValor`, `tmmMeta` conforme
   estrutura acima. Manter `pipelineAtivas` existente.

2. Na funcao `renderCard`: corrigir o calculo do TMM adicionando `* 0.05`
   e atualizar a formatacao para usar `fmtTMM()`.

3. Verificar se a funcao `calcTMM` ja atualiza `tmmValor` e `tmmMeta`
   corretamente. Se sim, nao mexer na logica — so adicionar os elementos HTML.

---

## PENDENCIAS ADICIONAIS (apos corrigir TMM)

Se sobrar tempo na sessao, verificar e implementar se ainda nao estiver feito:

### vendas.html
- Mascara R$ nos campos valor_contrato e valor_honorarios
- Campo % comissao calculado automaticamente (honorarios / contrato * 100)
- Select "Tipo da Venda" substituindo is_parceria + tipo_participacao
- Campo competencia oculto (preenchido automaticamente = data_venda)
- Filtro "Formato da Venda" substituindo "Parceria: Sim/Nao"

---

## VALIDACAO OBRIGATORIA

```bash
grep -n "[\x80-\xFF]" exclusividades.html | head -20   # zero resultados
tail -3 exclusividades.html                              # </html> nas ultimas 3 linhas
```

Commits:
- `fix: TMM correto na barra e nos cards de exclusividades`
- `fix: pendencias UX vendas.html` (se implementar)

---

*Gerado por Claudion em 12/04/2026*
*Analise tecnica direta do codigo — bugs identificados com precisao*
