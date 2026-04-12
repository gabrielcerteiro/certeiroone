# Sessao: Ajustes UX no vendas.html + TMM + Status

**Data:** 12/04/2026
**Gerado por:** Claudion
**Para:** Gabriel Marketing (Claude Code)

---

## LEITURA OBRIGATORIA ANTES DE COMECAR

1. `CONTEXTO_CLAUDE_CODE.md`
2. `~/.claude/skills/frontend-design/SKILL.md`

---

## CONTEXTO: O QUE JA FOI FEITO NO BANCO (nao repetir)

- Constraint `funil_snapshot.status_exclusividade` atualizada:
  'ativa', 'vendida', 'repaginando', 'aguardando', 'perdida', 'gestao', 'encerrada'
- Dados 'repaginacao' ja renomeados para 'repaginando'
- Constraint `exclusividades.status` inclui 'gestao'
- NAO rodar nenhum SQL de constraint ou UPDATE de status

---

## TAREFA 1 — AJUSTES UX NO FORMULARIO E TABELA vendas.html

### 1a. Mascara de dinheiro nos campos de valor

Aplicar mascara de formatacao em tempo real nos campos:
- `valor_contrato`
- `valor_honorarios`

Comportamento esperado:
- Usuario digita: `3000000`
- Campo exibe: `R$ 3.000.000`
- Valor salvo no banco: `3000000` (numerico puro, sem formatacao)

Implementacao sugerida:
```javascript
function aplicarMascaraDinheiro(input) {
  input.addEventListener('input', function() {
    let valor = this.value.replace(/\D/g, '');
    if (!valor) { this.value = ''; return; }
    valor = parseInt(valor, 10);
    this.value = valor.toLocaleString('pt-BR', {
      style: 'currency', currency: 'BRL',
      minimumFractionDigits: 0, maximumFractionDigits: 0
    });
  });
}
```

Ao salvar no Supabase, extrair apenas os digitos antes de fazer o INSERT/UPDATE:
```javascript
const valorContrato = parseInt(campoValorContrato.value.replace(/\D/g, ''), 10) || null;
```

### 1b. Percentual de comissao calculado automaticamente

O campo `percentual_comissao` deve ser readonly e calculado automaticamente:
- Formula: `(valor_honorarios / valor_contrato) * 100`
- Recalcular sempre que qualquer dos dois mudar
- Exibir com 1 casa decimal: ex. "6,7%"
- Se qualquer dos dois for zero/vazio, exibir "--"

### 1c. Substituir campos de tipo participacao por "Tipo da Venda"

Remover do formulario os campos `is_parceria` e `tipo_participacao`.
Substituir por UM select "Tipo da Venda":

| Opcao visivel      | is_parceria | tipo_participacao | percentual_comissao |
|--------------------|-------------|-------------------|---------------------|
| Venda Direta       | false       | corretor          | 6                   |
| Venda com Parceria | true        | corretor          | 6                   |
| Venda Gestao       | false       | gestao            | 1                   |

Ao selecionar, preencher os tres campos automaticamente no backend.
O campo `nome_parceiro` so aparece quando "Venda com Parceria" for selecionado.

### 1d. Campo competencia — ocultar do formulario

- Remover `competencia` do formulario visivel
- Ao salvar: `competencia = data_venda` (automatico)
- Campo continua no banco, apenas nao exibido

### 1e. Filtro "Formato da Venda" na tabela de listagem

Substituir o filtro atual "Parceria: Sim/Nao" por um filtro chamado
"Formato da Venda" com as opcoes:

| Opcao visivel      | Logica de filtro                          |
|--------------------|-------------------------------------------|
| Todos              | sem filtro                                |
| Venda Direta       | is_parceria = false AND tipo_participacao = 'corretor' |
| Parceria           | is_parceria = true                        |
| Gestao             | tipo_participacao = 'gestao'              |

O filtro funciona por multi-select (mesmo padrao dos outros filtros da tabela).

---

## TAREFA 2 — BARRA SUPERIOR DO exclusividades.html

TMM calculado por tipologia do imovel:

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
  .filter(im => ['ativa', 'gestao'].includes(im.status_exclusividade))
  .reduce((sum, im) => sum + calcularTMM(im), 0);
```

Exibir como: `R$ 27.500/mes`

---

## TAREFA 3 — STATUS EM TODOS OS ARQUIVOS

- 'repaginacao' → 'repaginando' em todos os filtros, badges, selects, JS
- Adicionar 'gestao' e 'perdida' em todos os selects e filtros

### Badges novos
- gestao: bg #EDE9FE, texto #5B21B6, label "Gestao"
- perdida: bg #FEE2E2, texto #991B1B, label "Perdida"

Arquivos a verificar: exclusividades.html, index.html, registro.html

---

## TAREFA 4 — GRUPO GESTAO NO DASHBOARD (index.html)

- Card igual ao grupo 'ativa'
- Badge roxo "Gestao"
- TMM exibido com "(20%)" ao lado

---

## ORDEM DE EXECUCAO

1. Tarefa 1 (vendas.html) — mostrar diff, aguardar aprovacao
2. Tarefas 2, 3, 4 — apos aprovacao da Tarefa 1

---

## VALIDACAO OBRIGATORIA APOS CADA ARQUIVO

```bash
grep -n "[\x80-\xFF]" ARQUIVO.html | head -20   # zero resultados esperado
tail -3 ARQUIVO.html                              # </html> nas ultimas 3 linhas
```

Commits:
- `fix: mascara dinheiro, tipo da venda, filtro formato em vendas.html`
- `feat: TMM correto na barra de exclusividades`
- `fix: status repaginando + badges gestao e perdida`
- `feat: grupo gestao no dashboard`

---

*Gerado por Claudion em 12/04/2026*
