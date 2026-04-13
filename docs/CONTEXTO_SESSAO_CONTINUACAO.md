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

O Claudion ja executou as migrations:
- Status 'encerrada' e 'inativa' convertidos para 'perdida' nas duas tabelas
- Constraint atualizada para aceitar APENAS: ativa, gestao, repaginando, aguardando, vendida, perdida
- 'renovada' removida dos valores validos

---

## TAREFA 1 — REDESENHO DOS GRUPOS E CARDS no exclusividades.html

### Ordem dos grupos (do topo para baixo)
1. EM CAMPANHA (status = 'ativa')
2. GESTAO (status = 'gestao')
3. EM REPAGINANDO (status = 'repaginando')
4. AGUARDANDO (status = 'aguardando')
5. VENDIDAS — colapsado por padrao, expande ao clicar (status = 'vendida')
6. PERDIDAS — colapsado por padrao, expande ao clicar (status = 'perdida')

### Card por tipo

#### ATIVA e GESTAO — card completo (igual ao atual renderCard)
- Exibir funil de barras (Tempo, Leads, Visitas, Propostas)
- Para GESTAO: adicionar badge roxo "Gestao" no canto superior direito do card
- Para GESTAO: TMM individual exibido com "(20%)" ao lado
- Border-left: verde para ativa, roxo (#8B5CF6) para gestao

#### REPAGINANDO e AGUARDANDO — card resumido com data de inicio
Card simplificado com:
- Nome do imovel + proprietario
- Preco
- Badge do status (amarelo "Repaginando" ou cinza "Aguardando")
- Data de inicio do prazo real: para Repaginando = data_repaginacao_concluida
  (quando a repaginacao termina e o prazo real começa); para Aguardando =
  data_inicio (quando o imovel foi cadastrado, prazo so vale quando liberar)
- Barra de progresso do contrato (dias passados / dias totais)
- Botao "Atualizar" e link "Ver detalhe"

Label da data por tipo:
- Repaginando: "Campanha prevista a partir de" + data_repaginacao_concluida
  (ou "Repaginacao em andamento" se data nao preenchida)
- Aguardando: "Cadastrado em" + data_inicio

#### VENDIDA — card historico (igual ao atual renderCardVendida, ja existe)

#### PERDIDA — card minimalista colapsado
Mesmo padrao visual do grupo VENDIDAS: botao para expandir/colapsar,
dentro mostra cards com: nome, data_inicio, data_fim (se tiver), observacoes.
Badge vermelho "Perdida".

### O que REMOVER
- Grupo "Inativas" — nao existe mais
- Status 'inativa' e 'encerrada' de todos os selects, filtros e badges
- O select de status do formulario de edicao deve ter APENAS:
  Em campanha (ativa), Repaginando, Aguardando, Gestao, Vendida, Perdida

### O que ATUALIZAR nos selects do modal de nova exclusividade
Opcoes do campo "Status inicial":
- Em campanha (ativa) → value="ativa"
- Repaginando → value="repaginando"
- Aguardando → value="aguardando"
- Gestao → value="gestao"

---

## TAREFA 2 — TMM: BARRA SUPERIOR + CARDS

### Bug 1: Barra superior nao exibe TMM
A funcao `calcTMM()` calcula corretamente mas os elementos HTML nao existem.
Adicionar ao `pipelineHeader`:

```html
<div id="pipelineHeader" ...>
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

### Bug 2: TMM nos cards usa preco bruto ao inves de VGV
Na funcao `renderCard`, corrigir:
```javascript
// ERRADO (atual):
var tmmVal = parsePrecM(im.preco) / prazoMesesIm(im);

// CORRETO:
var tmmVal = parsePrecM(im.preco) * 0.05 / prazoMesesIm(im);
```

### Regra de formatacao TMM — numero completo, SEM abreviacao M ou K
```javascript
function fmtTMM(v) {
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR') + '/mes';
}
// fmtTMM(27500)    → "R$ 27.500/mes"
// fmtTMM(110000)   → "R$ 110.000/mes"
```

Aplicar em: card individual + barra superior (tmmValor e tmmMeta).
A funcao interna `fmtValM` dentro de `calcTMM` tambem deve usar
`toLocaleString('pt-BR')` ao inves de abreviar com M/K.

---

## ORDEM DE EXECUCAO

1. Tarefa 1 (grupos e cards) — mostrar diff, aguardar aprovacao
2. Tarefa 2 (TMM) — apos aprovacao da Tarefa 1

---

## VALIDACAO OBRIGATORIA APOS CADA ARQUIVO

```bash
grep -n "[\x80-\xFF]" exclusividades.html | head -20   # zero resultados
tail -3 exclusividades.html                              # </html> nas ultimas 3 linhas
```

Commits:
- `feat: redesenho grupos exclusividades - nova ordem e cards por tipo`
- `fix: TMM correto na barra e nos cards com numero completo`

---

*Gerado por Claudion em 12/04/2026*
*Migration de banco ja executada pelo Claudion — nao repetir SQL*
