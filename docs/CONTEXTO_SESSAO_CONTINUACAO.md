# Sessao: TMM correto + novos status de exclusividade

**Data:** 12/04/2026
**Gerado por:** Claudion
**Para:** Gabriel Marketing (Claude Code)

---

## LEITURA OBRIGATORIA ANTES DE COMECAR

1. `CONTEXTO_CLAUDE_CODE.md`
2. `~/.claude/skills/frontend-design/SKILL.md`

---

## CONTEXTO: O QUE JA FOI FEITO NO BANCO (nao repetir)

O Claudion ja executou as migrations diretamente no Supabase:

- Constraint `funil_snapshot.status_exclusividade` atualizada para:
  'ativa', 'vendida', 'repaginando', 'aguardando', 'perdida', 'gestao', 'encerrada'
- Dados existentes: 'repaginacao' renomeado para 'repaginando' em todos os registros
- Constraint `exclusividades.status` atualizada para:
  'ativa', 'encerrada', 'renovada', 'gestao'

NAO rodar nenhum SQL de alteracao de constraint ou UPDATE de status -- ja foi feito.

---

## LOGICA DE NEGOCIO: STATUS DE EXCLUSIVIDADE

| Status      | Computa TMM? | Observacao                                      |
|-------------|-------------|--------------------------------------------------|
| ativa       | Sim, 100%   | Exclusividade ativa normal                       |
| gestao      | Sim, 20%    | Gabriel retém 1%, repassa resto — divide TMM / 5 |
| repaginando | Nao         | Imovel em repaginacao                            |
| aguardando  | Nao         | Cliente ainda nao desocupou                      |
| vendida     | Nao         | Ja vendida                                       |
| perdida     | Nao         | Nao conseguimos vender                           |
| encerrada   | Nao         | Legado                                           |

---

## LOGICA DE NEGOCIO: CALCULO DO TMM

TMM = VGV / (dias_tipo / 30)

Dias por tipologia do imovel (campo `tipo_imovel` no funil_snapshot):
- Repaginado: 40 dias
- Mobiliado:  80 dias
- Vazio:     120 dias

Exemplo: apto vazio com preco R$ 2.200.000
  VGV = preco * 0.05 = R$ 110.000
  TMM = 110.000 / (120 / 30) = 110.000 / 4 = R$ 27.500/mes

Para status 'gestao': TMM_gestao = TMM_calculado / 5

Exibir TMM sempre formatado como dinheiro: R$ 27.500/mes

---

## TAREFA 1 — BARRA SUPERIOR DO exclusividades.html

A barra de resumo no topo da pagina de exclusividades deve exibir:

- Total de exclusividades ativas (status 'ativa' + 'gestao')
- VGV total (soma dos precos das exclusividades ativas e gestao)
- **TMM total** = soma dos TMMs individuais de cada exclusividade ativa/gestao

### Como calcular o TMM de cada exclusividade:

```javascript
function calcularTMM(imovel) {
  const preco = parseFloat(imovel.preco) || 0;
  const vgv = preco * 0.05;
  
  const diasPorTipo = {
    'Repaginado': 40,
    'Mobiliado': 80,
    'Vazio': 120
  };
  
  const dias = diasPorTipo[imovel.tipo_imovel] || 120;
  const tmm = vgv / (dias / 30);
  
  // Gestao: divide por 5 (Gabriel retém apenas 20%)
  if (imovel.status_exclusividade === 'gestao') {
    return tmm / 5;
  }
  
  return tmm;
}

// TMM total da barra
const tmmTotal = imoveisAtivos
  .filter(im => ['ativa', 'gestao'].includes(im.status_exclusividade))
  .reduce((sum, im) => sum + calcularTMM(im), 0);
```

### Formatacao do TMM
```javascript
function formatarDinheiro(valor) {
  return valor.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}
// Exibir como: R$ 27.500/mes
```

---

## TAREFA 2 — ATUALIZAR STATUS EM TODOS OS ARQUIVOS

Os status de exclusividade mudaram. Atualizar em todos os arquivos HTML/JS:

### Mapeamento de mudancas
- 'repaginacao' → 'repaginando' (em todos os filtros, badges, selects, logica JS)
- Adicionar 'gestao' como novo status valido em todos os selects e filtros
- Adicionar 'perdida' se ainda nao existir como opcao visivel

### Arquivos a verificar
- `exclusividades.html` — filtros, badges, modal de nova exclusividade, modal de edicao
- `index.html` — grupos do dashboard, modal de nova exclusividade
- `nav.js` — se tiver logica de status
- `registro.html` — se tiver filtro por status

### Badge visual para 'gestao'
Adicionar badge com estilo proprio para o novo status 'gestao':
- Background: #EDE9FE (roxo claro)
- Texto: #5B21B6 (roxo escuro)
- Label: "Gestao"

### Badge visual para 'perdida'
- Background: #FEE2E2 (vermelho claro)
- Texto: #991B1B (vermelho escuro)
- Label: "Perdida"

---

## TAREFA 3 — DASHBOARD: GRUPO GESTAO

No index.html, adicionar um novo grupo para exclusividades com status 'gestao':

### GRUPO GESTAO (status = 'gestao')
- Card igual ao grupo "ativa" mas com indicador visual de gestao
- Badge roxo "Gestao" no card
- TMM exibido com nota "(20%)" ao lado para indicar que é parcial

---

## VALIDACAO APOS CADA TAREFA

1. Verificar acentos em JS: `grep -n "[\x80-\xFF]" ARQUIVO.html | head -20`
   Esperado: nenhuma linha.

2. Verificar fechamento: `tail -3 ARQUIVO.html`
   Esperado: `</html>` nas ultimas 3 linhas.

3. Testar no browser: abrir exclusividades.html e confirmar que
   - TMM aparece na barra superior formatado como R$ X.XXX/mes
   - Status 'gestao' aparece como opcao nos selects
   - Badge roxo aparece para imoveis em gestao

Commits por tarefa:
- `feat: TMM correto na barra de exclusividades`
- `fix: status repaginando + badge gestao e perdida em todos os arquivos`
- `feat: grupo gestao no dashboard`

---

*Gerado por Claudion em 12/04/2026*
*SQL de migration ja executado diretamente no Supabase — nao repetir*
