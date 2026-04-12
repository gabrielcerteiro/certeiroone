# Sessao: Passo 3 (Seed) + Padrao de Layout

**Data:** 12/04/2026
**Gerado por:** Claudion
**Para:** Gabriel Marketing (Claude Code)

---

## ANTES DE QUALQUER COISA -- LEITURA OBRIGATORIA

Leia os seguintes arquivos em ordem antes de escrever uma linha de codigo:

1. `CONTEXTO_CLAUDE_CODE.md` -- contexto tecnico completo da plataforma
2. `~/.claude/skills/frontend-design/SKILL.md` -- padrao visual obrigatorio

O skill de frontend-design define os tokens, componentes e regras de layout
que DEVEM ser seguidos em TODO o codigo novo desta sessao e de todas as sessoes
futuras. Nao e opcional.

---

## PADRAO DE LAYOUT -- REGRA PERMANENTE

A partir desta sessao, TODO formulario, modal ou pagina criado ou editado
no Certeiro One deve seguir obrigatoriamente este padrao:

### Container
- Formularios em paginas inteiras: `max-width: 800px; margin: 0 auto;`
- Modais: `max-width: 720px; margin: 0 auto;`
- Nunca deixar o conteudo editorial esticar ate a borda da tela

### Grid de campos por tipo
- Campos curtos (data, numero de controle, status, %, tipo): grid 3 ou 4 colunas
- Campos medios (nome, valor R$, area): grid 2 colunas
- Campos longos (endereco, observacao, textarea): 1 coluna full-width dentro do container
- Gap: 12px horizontal, 14px vertical
- Campo de data nunca deve exceder ~220px de largura visual

### Agrupamento semantico
- Agrupar campos relacionados em secoes com label uppercase acima
  (ex: "DADOS DA VENDA", "IMOVEL", "PARTES ENVOLVIDAS")
- Usar card ou separador visual entre secoes

### Exemplo de grid correto
```css
.form-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.form-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.form-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
```

Este padrao se aplica a qualquer codigo novo e tambem a edicoes em arquivos
existentes -- ao tocar em um formulario, corrija o layout se ainda estiver full-width.

---

## TAREFA 1 -- PASSO 3: SEED DOS 91 REGISTROS HISTORICOS

### Objetivo
Inserir os 91 registros historicos de vendas na tabela `vendas` do Supabase.

### Arquivo de dados
`data/vendas_classificadas_completo.csv` -- 91 registros classificados

### O que fazer
1. Leia o arquivo CSV completo
2. Gere um script SQL de INSERT para todos os 91 registros
3. Execute o script via Supabase MCP (use `apply_migration` com nome `seed_vendas_historicas`)
4. Confirme quantos registros foram inseridos com:
   `SELECT COUNT(*) FROM vendas;`

### Campos a mapear do CSV para a tabela
O CSV tem colunas de classificacao que foram definidas na sessao anterior.
Mapeie os campos disponiveis. Campos sem equivalente no CSV ficam NULL --
serao preenchidos incrementalmente pelo Gabriel via interface.

### Campos obrigatorios no INSERT
- `numero_controle` -- vem do CSV (ex: V0261, V0262...)
- `status_venda` -- vem do CSV
- `is_construtora` -- vem do CSV (boolean)
- `is_parceria` -- vem do CSV (boolean)
- `imovel_tipologia` -- vem do CSV
- `categoria` -- vem do CSV (1, 2, 3 ou 4)

### Campos opcionais (se existirem no CSV)
- `imovel_nome`, `imovel_regiao`, `forma_pagamento`
- `valor_contrato`, `valor_honorarios`
- `data_venda`, `competencia`

### Regras criticas
- `vgv` e GENERATED ALWAYS -- NAO incluir no INSERT
- `numero_controle` e UNIQUE -- se der conflito, parar e reportar
- Executar tudo em uma unica migration para ser atomico
- Se algum registro falhar, o batch inteiro deve falhar (sem inserts parciais)

### Validacao apos seed
```sql
SELECT COUNT(*) as total FROM vendas;
SELECT status_venda, COUNT(*) FROM vendas GROUP BY status_venda;
SELECT is_construtora, is_parceria, COUNT(*) FROM vendas GROUP BY is_construtora, is_parceria;
```
Mostrar resultado das tres queries antes de continuar.

---

## TAREFA 2 -- CORRECAO DE LAYOUT NOS FORMULARIOS EXISTENTES

Executar SOMENTE apos Tarefa 1 concluida e validada.

### Objetivo
Aplicar o padrao de layout definido acima nos formularios existentes que
ainda estao com campos full-width.

### Etapa 2a -- registro.html (fazer e PARAR)
Reorganizar campos do formulario com grid conforme padrao acima.
Exibir diff completo e aguardar aprovacao antes de continuar.

### Etapa 2b -- modais do index.html (somente apos aprovacao da 2a)
Identificar todos os modais com formularios (inputs, selects) e aplicar
max-width: 720px + grid de campos.
Manter toda logica JS intacta -- apenas CSS/HTML estrutural.

### O que NAO mudar
- Nenhuma logica JavaScript
- Nenhuma query ao Supabase
- Nenhum ID, name ou evento de campo

### Validacao obrigatoria apos CADA etapa (nao pular)

1. Verificar acentos em blocos JS:
   `grep -n "[\x80-\xFF]" ARQUIVO.html | head -20`
   Resultado esperado: nenhuma linha.

2. Verificar fechamento do arquivo:
   `tail -3 ARQUIVO.html`
   Resultado esperado: `</html>` nas ultimas 3 linhas.

3. Confirmar campos de data:
   `grep -n "type=\"date\"" ARQUIVO.html`
   Nenhum com width > 220px ou herdando 100% sem container com max-width.

Somente apos os tres comandos passarem, fazer commit:
- Tarefa 1: `feat: seed 91 registros historicos na tabela vendas`
- Tarefa 2a: `style: grid layout em registro.html`
- Tarefa 2b: `style: grid layout em modais do index.html`

---

## ESTADO ATUAL DO SISTEMA (referencia)

- Passo 0: concluido (sidebar, modulos separados, roles corrigidas)
- Passo 1: concluido (tabelas vendas e parcelas_comissao criadas)
- Passo 2: concluido (vendas.html construido)
- Bug leads_abertos: corrigido diretamente no banco via Claudion
- Passo 3: PENDENTE -- esta sessao
- Passo 4 (webhook Pipedrive->n8n->Supabase): futuro
- Passo 5 (Conta Azul): futuro

---

*Gerado por Claudion em 12/04/2026*
