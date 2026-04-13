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
- Data de inicio do prazo real: para Repaginando = data_repaginacao_concluida;
  para Aguardando = data_inicio
- Barra de progresso do contrato (dias passados / dias totais)
- Botao "Atualizar" e link "Ver detalhe"

Label da data:
- Repaginando: "Campanha prevista a partir de" + data_repaginacao_concluida
  (ou "Repaginacao em andamento" se data nao preenchida)
- Aguardando: "Cadastrado em" + data_inicio

#### VENDIDA — card historico (igual ao atual renderCardVendida)

#### PERDIDA — card minimalista colapsado
Badge vermelho "Perdida". Cards com: nome, data_inicio, data_fim, observacoes.

### O que REMOVER
- Grupo "Inativas" — nao existe mais
- Status 'inativa' e 'encerrada' de todos os selects, filtros e badges
- Select de status no formulario de edicao: APENAS ativa, repaginando, aguardando, gestao, vendida, perdida
- Select de status no modal de nova exclusividade: APENAS ativa, repaginando, aguardando, gestao

---

## TAREFA 2 — CORRECAO DA FORMULA DO TMM

### Formula correta
TMM = preco_do_imovel x (30 / dias_tipo)

Dias por tipologia:
- Repaginado: 40 dias
- Mobiliado:  80 dias
- Vazio:     120 dias

Exemplos de validacao:
- Casa Ressacada, Mobiliado, R$ 3.100.000: TMM = 3.100.000 / 80 x 30 = R$ 1.162.500/mes
- Apto Vazio, R$ 2.200.000:                TMM = 2.200.000 / 120 x 30 = R$ 550.000/mes
- Repaginado R$ 7.200.000:                 TMM = 7.200.000 / 40 x 30 = R$ 5.400.000/mes

### O que mudar no codigo

#### renderCard (TMM individual no card)
```javascript
// ERRADO — usa honorarios (0.05):
var tmmVal = parsePrecM(im.preco) * 0.05 / prazoMesesIm(im);

// CORRETO — usa preco do imovel direto:
var tmmVal = parsePrecM(im.preco) * 1000000 / prazoMesesIm(im);
// parsePrecM retorna em milhoes (ex: 3.1 para 3.100.000)
// multiplicar por 1000000 converte de volta para reais
// prazoMesesIm ja retorna dias/30 (ex: 80/30 = 2.667 para Mobiliado)
```

Para GESTAO: dividir o resultado por 5 (Gabriel retém 20%):
```javascript
if (im.status_exclusividade === 'gestao') tmmVal = tmmVal / 5;
```

#### calcTMM (TMM total da barra superior)
Localizar dentro de calcTMM:
```javascript
var vgv_im = preco_reais * 0.05;
var tmm_imovel = vgv_im / (dias_tipo / 30);
```

Substituir por:
```javascript
var tmm_imovel = preco_reais / (dias_tipo / 30);
```

Para gestao: `if (im.status_exclusividade === 'gestao') tmm_imovel = tmm_imovel / 5;`

### Regra de formatacao — numero completo, SEM abreviacao M ou K
```javascript
function fmtTMM(v) {
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR') + '/mes';
}
// fmtTMM(1162500) → "R$ 1.162.500/mes"
// fmtTMM(550000)  → "R$ 550.000/mes"
```

Substituir a formatacao atual dos cards (que usa M/K) por fmtTMM().
A funcao interna fmtValM dentro de calcTMM tambem deve usar toLocaleString.

### Bug 3: Elementos HTML do TMM nao existem na barra
Adicionar ao pipelineHeader:

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

---

## ORDEM DE EXECUCAO

1. Tarefa 1 (grupos) — mostrar diff, aguardar aprovacao
2. Tarefa 2 (TMM) — apos aprovacao da Tarefa 1

---

## VALIDACAO OBRIGATORIA APOS CADA TAREFA

```bash
grep -n "[\x80-\xFF]" exclusividades.html | head -20   # zero resultados
tail -3 exclusividades.html                              # </html> nas ultimas 3 linhas
```

Verificar no browser com Casa Ressacada (Mobiliado, R$ 3.100.000):
- TMM no card deve exibir: R$ 1.162.500/mes
- Se mostrar qualquer outro valor, a formula esta errada

Commits:
- `feat: redesenho grupos exclusividades - nova ordem e cards por tipo`
- `fix: TMM formula correta - preco direto sem honorarios - numero completo`

---

*Gerado por Claudion em 12/04/2026*
*Migration de banco ja executada pelo Claudion — nao repetir SQL*
