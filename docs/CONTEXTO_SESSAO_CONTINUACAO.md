# Sessao: Correcao de Layout de Formularios

**Data:** 12/04/2026
**Gerado por:** Claudion
**Para:** Gabriel Marketing (Claude Code)

---

## Contexto

Os formularios e modais do Certeiro One estao com todos os campos ocupando
100% da largura da tela. O objetivo desta sessao e corrigir isso aplicando
max-width no container e grid de colunas por tipo de campo -- padrao de
plataformas profissionais como Pipedrive e Linear.

---

## Prompt de Execucao

Leia o arquivo CONTEXTO_CLAUDE_CODE.md antes de qualquer acao.

### Objetivo
Corrigir o layout dos formularios e modais do Certeiro One para eliminar campos
full-width desnecessarios. Hoje todo campo ocupa 100% da largura da tela.
O padrao correto e: max-width no container + grid de colunas por tipo de campo.

### Regra geral a aplicar em TODOS os formularios e modais

1. O wrapper do formulario/modal deve ter max-width: 720px (modais) ou 800px
   (paginas inteiras como registro.html), centralizado com margin: 0 auto.

2. Os campos devem ser organizados em grid CSS por tipo:
   - Campos curtos (data, numero, status, %, tipo): grid de 3 ou 4 colunas
   - Campos medios (nome, valor R$, area): grid de 2 colunas
   - Campos longos (endereco, observacao, textarea): 1 coluna (full-width
     dentro do container com max-width -- nunca full-width da tela toda)

3. Gap entre campos: 12px horizontal, 14px vertical.

4. Dentro de cada secao, agrupar campos relacionados com um label de secao
   (texto pequeno, uppercase, cor muted) acima do grid.

### Arquivos a alterar

#### ETAPA 1 -- registro.html (faca isso primeiro e PARE)
Identificar todos os campos do formulario de registro de visita/proposta e
reorganizar com as regras acima. Prestar atencao especial nos campos:
- Data da visita, Data da proposta: grid de 3-4 colunas junto com status/tipo
- Nome do lead, Imovel: grid de 2 colunas
- Campos de valor (R$): grid de 2-3 colunas junto com outros campos numericos

Apos aplicar as mudancas no registro.html, exiba o diff completo das alteracoes
e AGUARDE aprovacao explicita antes de continuar para a Etapa 2.

#### ETAPA 2 -- index.html (somente apos aprovacao da Etapa 1)
Abrir o arquivo e identificar todos os elementos com class "modal" que
contenham formularios (inputs, selects). Para cada modal:
- Aplicar max-width: 720px no container interno do modal
- Reorganizar campos com grid conforme regras acima
- Manter a logica JS existente intacta -- apenas CSS/HTML estrutural

### O que NAO mudar
- Nenhuma logica JavaScript
- Nenhuma query ao Supabase
- Nenhum ID ou name de campo
- Nenhum evento de submit/save
- Estilo visual existente (cores, fontes, bordas) -- apenas layout/posicionamento

### Validacao obrigatoria apos CADA etapa (nao pular)
Execute os tres comandos abaixo e mostre o output antes de fazer o commit:

1. Verificar acentos em blocos JS:
   grep -n "[\x80-\xFF]" ARQUIVO.html | head -20
   Resultado esperado: nenhuma linha retornada.

2. Verificar fechamento do arquivo:
   tail -3 ARQUIVO.html
   Resultado esperado: </html> aparece nas ultimas 3 linhas.

3. Confirmar que nenhum input de data excede 220px:
   grep -n "type=\"date\"" ARQUIVO.html
   Verificar visualmente que nenhum tem width explicito maior que 220px
   ou que herda width: 100% sem container com max-width definido.

Somente apos os tres comandos passarem sem erro, fazer o commit com a mensagem:
   style: grid layout em formularios e modais - elimina campos full-width

---

*Gerado por Claudion em 12/04/2026*
