# Sessao: Pipeline header redesign + grupos + TMM + layout global

**Data:** 12/04/2026
**Gerado por:** Claudion
**Para:** Gabriel Marketing (Claude Code)

---

## LEITURA OBRIGATORIA ANTES DE COMECAR

1. `CONTEXTO_CLAUDE_CODE.md`
2. `~/.claude/skills/frontend-design/SKILL.md` — OBRIGATORIO para todas as tarefas visuais

---

## O QUE JA FOI FEITO NO BANCO (nao repetir)

- Status 'encerrada' e 'inativa' convertidos para 'perdida'
- Constraint aceita APENAS: ativa, gestao, repaginando, aguardando, vendida, perdida

---

## TAREFA 0 — LAYOUT GLOBAL: ELIMINAR CAMPOS FULL-WIDTH (fazer primeiro)

### O problema
Todos os formularios de edicao em TODOS os arquivos tem campos ocupando
100% da largura da tela. Em desktop (1440px) um campo de data fica com
1400px de largura — completamente errado.

### A solucao: CSS compartilhado no nav.js

Adicionar no nav.js, dentro da funcao que injeta o CSS da sidebar, as
seguintes classes globais que estarao disponıveis em TODOS os arquivos:

```css
/* Layout de formularios — padrão global */
.cn-form       { max-width: 760px; margin: 0 auto; }
.cn-grid-2     { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.cn-grid-3     { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.cn-grid-4     { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.cn-full       { grid-column: 1 / -1; }
@media (max-width: 899px) {
  .cn-grid-3, .cn-grid-4 { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 479px) {
  .cn-grid-2, .cn-grid-3, .cn-grid-4 { grid-template-columns: 1fr; }
}
```

### Aplicar a classe em cada arquivo

Apos adicionar o CSS no nav.js, aplicar em cada formulario:

#### exclusividades.html — funcao renderEdit
O container do formulario de edicao deve receber class="cn-form".
Os campos dentro devem ser agrupados em cn-grid-2 ou cn-grid-4 por tipo:
- Campos curtos (status, tipo, localizacao, dias, metas numericas): cn-grid-3 ou cn-grid-4
- Campos de data: cn-grid-3 junto com outros campos relacionados
- Campos longos (observacoes): cn-full dentro do grid

#### registro.html — formulario de visita/proposta
Container principal: cn-form.
Campos: mesma logica — datas e status em grid-3, nomes em grid-2.

#### usuarios.html — formulario de usuario
Container: cn-form.

#### vendas.html — ja tem form-wrap 800px e form-grid/form-grid-4
Verificar se os campos de edicao (vEdit) tambem tem o container correto.
Se nao, aplicar cn-form.

### O que NAO mudar
- Nenhuma logica JavaScript
- Nenhum ID, name ou evento
- Os cards do pipeline (icard) — nao sao formularios, nao aplicar cn-form

---

## TAREFA 1 — PIPELINE HEADER COMPLETO (redesign)

### O problema atual
- Barra exibe apenas label e contador de ativas
- Botao "+ Nova exclusividade" fica solto abaixo como elemento separado
- Nao ha campo de meta nem barra de progresso TMM

### O que construir
Uma unica barra navy slim com tudo integrado:

```
[ CERTEIRO ONE — PIPELINE ]  [ 5 ativas · 2 repag · 1 aguar ]  [ META: R$ [____] | ████░░ TMM R$ X.XXX.XXX ]  [ + Nova ]
```

Todos os elementos em um unico flex container, padding 12px 20px.

### Campo de meta
- Input minimalista inline com borda rgba(255,255,255,0.2)
- Valor persistido em localStorage chave 'cfg_meta_vgv_mes'
- Label "META/MES" acima do input

### Barra de progresso TMM
- Verde (#34D399) quando TMM >= meta * 70%
- Amarelo (#F59E0B) quando TMM < meta * 70%
- Exibir "TMM R$ X.XXX.XXX/mes" como label da barra

### Contadores
- "5 ativas" branco · "2 repag." amarelo · "1 aguar." cinza

### Botao nova exclusividade
Integrado no flex da barra, sem margem separada abaixo.

### Mobile
Empilhar em 2 linhas: (label + contadores) / (barra de meta + botao)

---

## TAREFA 2 — REDESENHO DOS GRUPOS em exclusividades.html

### Ordem
1. EM CAMPANHA (ativa) — card completo
2. GESTAO (gestao) — card completo + badge roxo + TMM "(20%)"
3. EM REPAGINANDO (repaginando) — card resumido com data prevista
4. AGUARDANDO (aguardando) — card resumido com data cadastro
5. VENDIDAS — colapsado
6. PERDIDAS — colapsado, novo renderCardPerdida

### Cards resumidos (repaginando e aguardando)
- Nome + proprietario + preco + badge status
- Data relevante com label:
  - Repaginando: "Campanha prevista a partir de" + data_repaginacao_concluida
  - Aguardando: "Cadastrado em" + data_inicio
- Barra de progresso contrato
- Botao Atualizar + link Ver detalhe

### Selects de status — remover inativa e encerrada de todos os lugares
Formulario de edicao: ativa, repaginando, aguardando, gestao, vendida, perdida
Modal nova exclusividade: ativa, repaginando, aguardando, gestao

---

## TAREFA 3 — FORMULA DO TMM CORRETA

### Formula: TMM = preco × (30 / dias_tipo) — SEM honorarios
- Repaginado: 40 dias
- Mobiliado: 80 dias
- Vazio: 120 dias

Validacao: Casa Ressacada Mobiliado R$ 3.100.000 → TMM = R$ 1.162.500/mes

### renderCard
```javascript
// CORRETO:
var tmmVal = parsePrecM(im.preco) * 1000000 / prazoMesesIm(im);
if (im.status_exclusividade === 'gestao') tmmVal = tmmVal / 5;
```

### calcTMM
```javascript
// Substituir: var vgv_im = preco_reais * 0.05; var tmm_imovel = vgv_im / (dias_tipo/30);
// Por:
var tmm_imovel = preco_reais / (dias_tipo / 30);
if (im.status_exclusividade === 'gestao') tmm_imovel = tmm_imovel / 5;
```

### Formatacao — numero completo SEM M/K
```javascript
function fmtTMM(v) {
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR') + '/mes';
}
```

---

## ORDEM DE EXECUCAO

1. **Tarefa 0** — CSS global no nav.js + aplicar cn-form em todos os arquivos
   Mostrar diff do nav.js e lista dos arquivos alterados. Aguardar aprovacao.
2. **Tarefa 1** — Pipeline header
   Mostrar diff. Aguardar aprovacao.
3. **Tarefas 2 e 3** — Grupos + TMM juntos no exclusividades.html

---

## VALIDACAO OBRIGATORIA APOS CADA ARQUIVO

```bash
grep -n "[\x80-\xFF]" ARQUIVO | head -20   # zero resultados
tail -3 ARQUIVO                              # </html> ou fecha corretamente
```

Validacao visual TMM: Casa Ressacada deve mostrar R$ 1.162.500/mes.

Commits:
- `feat: cn-form CSS global no nav.js - elimina campos full-width em todos os arquivos`
- `feat: pipeline header integrado com meta e TMM`
- `feat: grupos exclusividades - nova ordem e cards por tipo`
- `fix: formula TMM correta - preco direto sem honorarios`

---

*Gerado por Claudion em 12/04/2026*
