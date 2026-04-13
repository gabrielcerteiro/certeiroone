# Sessao: Pendencias vendas.html + TMM + Status

**Data:** 12/04/2026
**Gerado por:** Claudion
**Para:** Gabriel Marketing (Claude Code)

---

## LEITURA OBRIGATORIA ANTES DE COMECAR

1. `CONTEXTO_CLAUDE_CODE.md`
2. `~/.claude/skills/frontend-design/SKILL.md`

---

## CONTEXTO DO QUE JA FOI FEITO (nao repetir)

- Constraints de status no banco ja atualizadas pelo Claudion
- 'repaginacao' renomeado para 'repaginando' nos dados
- 'gestao' ja e status valido em exclusividades e funil_snapshot
- vendas.html ja tem grid de campos, filtros, ordenacao e visibilidade de colunas

---

## PENDENCIAS NAO IMPLEMENTADAS — vendas.html

A sessao anterior NAO implementou os itens abaixo. Verificar o codigo atual
do vendas.html e implementar o que estiver faltando:

---

### PENDENCIA 1 — Mascara de dinheiro nos campos de valor

Abrir vendas.html e verificar se os campos valor_contrato e valor_honorarios
ja tem mascara de formatacao em tempo real.

Se NAO tiverem, implementar:
- Usuario digita `3000000` → campo exibe `R$ 3.000.000`
- Valor salvo no Supabase: numerico puro sem formatacao
- Extrair digitos antes do INSERT/UPDATE:
  `parseInt(campo.value.replace(/\D/g, ''), 10) || null`
- A mascara deve funcionar tanto no formulario de nova venda quanto no de edicao

---

### PENDENCIA 2 — % Comissao calculada automaticamente

Verificar se o campo percentual_comissao e readonly e calculado automaticamente.

Se NAO for, implementar:
- Campo readonly (nao editavel pelo usuario)
- Formula: `(valor_honorarios / valor_contrato) * 100`
- Recalcular em tempo real sempre que valor_contrato ou valor_honorarios mudar
- Exibir com 1 casa decimal: "6,7%"
- Se qualquer dos dois for zero ou vazio: exibir "--"

---

### PENDENCIA 3 — Substituir campos por "Tipo da Venda"

Verificar se o formulario ainda tem os campos separados `is_parceria`
e `tipo_participacao`.

Se ainda tiver, substituir por UM unico select chamado "TIPO DA VENDA":

Opcoes do select e o que cada uma preenche automaticamente no banco:

  "Venda Direta"
    → is_parceria = false
    → tipo_participacao = 'corretor'
    → percentual_comissao = 6

  "Venda com Parceria"
    → is_parceria = true
    → tipo_participacao = 'corretor'
    → percentual_comissao = 6
    → exibir campo nome_parceiro (oculto nas outras opcoes)

  "Venda Gestao"
    → is_parceria = false
    → tipo_participacao = 'gestao'
    → percentual_comissao = 1

Ao selecionar qualquer opcao, os tres campos de banco sao preenchidos
automaticamente — o usuario so ve o select "Tipo da Venda".

O campo nome_parceiro aparece SOMENTE quando "Venda com Parceria" for selecionado.

---

### PENDENCIA 4 — Campo competencia oculto

Verificar se o campo competencia ainda aparece no formulario.

Se ainda aparecer, remover do formulario visivel.
Ao salvar: `competencia = data_venda` (preenchido automaticamente no JS antes do INSERT).
O campo continua existindo no banco.

---

### PENDENCIA 5 — Filtro "Formato da Venda" na tabela

Verificar se o filtro "Parceria: Sim/Nao" foi substituido por "Formato da Venda".

Se NAO foi, substituir por filtro multi-select com as opcoes:
- Todos → sem filtro
- Venda Direta → is_parceria = false AND tipo_participacao = 'corretor'
- Parceria → is_parceria = true
- Gestao → tipo_participacao = 'gestao'

---

## OUTRAS TAREFAS (apos confirmar pendencias acima)

### TAREFA 2 — TMM na barra do exclusividades.html

```javascript
function calcularTMM(imovel) {
  const preco = parseFloat(imovel.preco) || 0;
  const vgv = preco * 0.05;
  const diasPorTipo = { 'Repaginado': 40, 'Mobiliado': 80, 'Vazio': 120 };
  const dias = diasPorTipo[imovel.tipo_imovel] || 120;
  const tmm = vgv / (dias / 30);
  return imovel.status_exclusividade === 'gestao' ? tmm / 5 : tmm;
}
const tmmTotal = imoveis
  .filter(im => ['ativa','gestao'].includes(im.status_exclusividade))
  .reduce((sum, im) => sum + calcularTMM(im), 0);
```
Exibir na barra como: `R$ 27.500/mes`

### TAREFA 3 — Status em todos os arquivos

- 'repaginacao' → 'repaginando' em filtros, badges, selects, JS
- Adicionar 'gestao' (badge: bg #EDE9FE texto #5B21B6) e 'perdida' (bg #FEE2E2 texto #991B1B)
- Arquivos: exclusividades.html, index.html, registro.html

### TAREFA 4 — Grupo Gestao no dashboard

- Novo grupo no index.html para status 'gestao'
- Badge roxo, TMM com "(20%)" ao lado

---

## ORDEM DE EXECUCAO

1. Verificar e corrigir as 5 pendencias do vendas.html — mostrar o que encontrou e o que mudou, aguardar aprovacao
2. Tarefas 2, 3, 4 — apos aprovacao

---

## VALIDACAO OBRIGATORIA APOS CADA ARQUIVO

```bash
grep -n "[\x80-\xFF]" ARQUIVO.html | head -20
tail -3 ARQUIVO.html
```

Commits:
- `fix: pendencias UX vendas.html - mascara, comissao auto, tipo venda, filtro formato`
- `feat: TMM na barra de exclusividades`
- `fix: status repaginando e badges gestao perdida`
- `feat: grupo gestao no dashboard`

---

*Gerado por Claudion em 12/04/2026*
