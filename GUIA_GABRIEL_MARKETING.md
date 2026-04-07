# GUIA OPERACIONAL — GABRIEL MARKETING
## Como manter e evoluir o Certeiro One

---

## O QUE É O SEU TRABALHO AQUI

Você é o responsável por executar melhorias técnicas na plataforma Certeiro One.
Gabriel Certeiro define o que quer. Você executa usando duas ferramentas:

- **Claude Code** — executa as mudanças no código
- **Claude.ai** — planeja e define o que vai ser feito

Você não precisa saber programar. Você precisa saber usar essas duas ferramentas
corretamente e seguir o processo.

---

## AS DUAS FERRAMENTAS

### Claude Code (claude.ai/code)
Mexe no código. Edita arquivos. Faz push para o GitHub.
Quando ele faz push, o sistema vai automaticamente para o ar na Vercel.
Você não precisa fazer nada manualmente para publicar.

### Claude.ai (claude.ai)
Planeja o que vai ser feito. Você usa para:
- Entender o que Gabriel quer
- Montar o prompt correto para o Claude Code
- Revisar o que foi feito antes de aprovar
- Planejar a próxima versão

---

## FLUXO DE TRABALHO — PASSO A PASSO

### ETAPA 1 — Receber a demanda
Gabriel pede uma melhoria ou correção.
Você anota e abre o Claude.ai.

### ETAPA 2 — Iniciar sessão no Claude.ai
Cole sempre esta mensagem no início:

```
Sou Gabriel Marketing da Gabriel Certeiro Imóveis.
Preciso executar melhorias na plataforma Certeiro One.
Leia os arquivos CERTEIRO_ONE_CONTEXTO_ESTRATEGICO.md e CONTEXTO_CLAUDE_CODE.md
no repositório github.com/gabrielcerteiro/dashboard-certeiro
para entender o estado atual antes de começar.
A demanda é: [descreva o que Gabriel pediu]
Me ajude a montar o prompt correto para executar no Claude Code.
```

O Claudion vai ler os arquivos, entender o contexto e te entregar o prompt
pronto para usar no Claude Code.

### ETAPA 3 — Executar no Claude Code
Abra o Claude Code em claude.ai/code.
Inicie a sessão sempre com o Prompt 0:

```
Antes de qualquer coisa, leia o arquivo CONTEXTO_CLAUDE_CODE.md
na raiz do repositório.
Após ler, confirme:
1. Quais são os 3 arquivos principais do projeto
2. Qual view o dashboard usa como fonte principal de dados
3. Qual é a regra crítica sobre acentos dentro de <script>
4. Qual é o SHA atual do index.html
Não faça nenhuma alteração ainda.
```

Espere ele confirmar que leu. Só então cole o prompt da tarefa.

### ETAPA 4 — Acompanhar a execução
Leia o que o Claude Code está fazendo.
Se ele pedir aprovação para executar SQL no Supabase, copie o SQL,
abra supabase.com → SQL Editor → cole → Run.
Se aparecer "Success. No rows returned", está certo. Confirme para ele continuar.

### ETAPA 5 — Fazer push
Quando o Claude Code terminar, mande:

```
Faça push de todos os arquivos alterados para o branch main no GitHub.
Use create_or_update_file individualmente para cada arquivo.
Não use push_files para arquivos grandes.
Antes de cada push, faça get_file_contents para obter o SHA atual.
```

### ETAPA 6 — Validar no sistema
Acesse dashboard-certeiro.vercel.app.
Espere 2-3 minutos após o push.
Teste o que foi alterado.
Se funcionou: avisa Gabriel para validar.
Se quebrou: volta ao Claude Code e descreve o problema.

### ETAPA 7 — Registrar a versão (OBRIGATÓRIO)
Essa etapa não é opcional. Sem ela o histórico do sistema se perde.

**7a. Peça o texto de versão ao Claude.ai:**
Ao final de cada ciclo, abra o Claude.ai e mande:

```
O ciclo de melhorias foi concluído e validado.
Com base no que foi feito, gere o texto de registro de versão
para eu colar no Google Doc de versionamento.
Siga exatamente este formato:

## X.X.X — DD/MM/AAAA
Descrição curta do que essa versão representa.

Corrigido:
- [cada bug corrigido em uma linha]

Adicionado:
- [cada funcionalidade nova em uma linha]

Melhorado:
- [cada melhoria em algo que já existia em uma linha]
```

O Claude.ai vai gerar o texto completo e formatado. Você só copia e cola.

**7b. Cole no Google Doc:**
Abra o Google Doc de versionamento.
Cole o texto gerado no topo da seção de versões.
Anote qualquer item novo que surgiu durante o trabalho no backlog.

---

## VERSIONAMENTO — COMO FUNCIONA

O sistema usa o padrão MAJOR.MINOR.PATCH:

| Tipo | Quando usar | Exemplo |
|------|-------------|---------|
| PATCH (último número) | Correção de bug pontual | 1.2.0 → 1.2.1 |
| MINOR (número do meio) | Funcionalidade nova ou melhoria significativa | 1.2.1 → 1.3.0 |
| MAJOR (primeiro número) | Reformulação completa do sistema | 1.x → 2.0 |

**Regra prática:**
- Gabriel reportou um bug e você corrigiu → PATCH (1.2.0 → 1.2.1)
- Gabriel pediu algo novo que não existia → MINOR (1.2.1 → 1.3.0)
- Em dúvida → pergunte ao Claudion

**Nunca feche uma versão sem o texto gerado pelo Claude.ai registrado no Google Doc.**

---

## REGRAS QUE VOCÊ NÃO PODE QUEBRAR

**1. Sempre Prompt 0 ao abrir sessão nova no Claude Code.**
Sem isso ele não tem contexto e vai fazer besteira.

**2. Nunca deixe o Claude Code fazer mais de uma coisa ao mesmo tempo.**
Um escopo por sessão. Se ele começar a expandir o que está fazendo,
mande isso:
```
Pare de expandir escopo.
Execute apenas o que foi pedido.
Não faça melhorias paralelas.
Faça apenas a correção mínima necessária.
```

**3. Sempre peça o SQL antes de executar no Supabase.**
Nunca deixe o Claude Code executar SQL diretamente sem você ver primeiro.
Se ele perguntar "posso executar?", responda:
```
Me mostre o SQL primeiro antes de executar.
```

**4. Sempre faça push ao final de cada sessão.**
Se você fechar o Claude Code sem fazer push, tudo que foi feito se perde.
O push é o que salva o trabalho.

**5. Sempre teste no sistema antes de falar que acabou.**
Abra o dashboard-certeiro.vercel.app e confira com seus próprios olhos.

---

## TRABALHANDO NO REPOSITÓRIO LOCAL

Se você editar arquivos diretamente no seu computador (fora do Claude Code),
o repositório local pode estar desatualizado em relação ao que está no GitHub.

**Antes de qualquer edição local, sempre rode:**
```
git pull origin main
```

Isso garante que você está trabalhando na versão mais recente.
Se não fizer isso e tentar fazer push, vai dar conflito.

**Fluxo correto para edição local:**
1. `git pull origin main` — atualiza o local com o que está no GitHub
2. Faz as edições
3. `git add .`
4. `git commit -m "descricao do que foi feito"`
5. `git push origin main` — envia para o GitHub → Vercel publica automaticamente

---

## O QUE FAZER QUANDO ALGO DER ERRADO

### O sistema quebrou após um push
Fale com o Claudion no Claude.ai descrevendo exatamente o que parou de funcionar.
Ele vai te orientar sobre como reverter ou corrigir.

### O Claude Code começou a fazer coisas que não foram pedidas
Mande o prompt de cobrança:
```
Pare. Execute apenas o que foi pedido.
Não faça nada além disso.
```

### O Claude Code está repetindo sempre o mesmo erro
Abra sessão nova. Comece do Prompt 0. O contexto da sessão antiga pode estar contaminado.

### Não sei se devo aprovar o que o Claude Code propôs
Copie a proposta dele, abra o Claude.ai e pergunte ao Claudion:
```
O Claude Code propôs isso: [cole a proposta]
Faz sentido aprovar? Tem algum risco?
```

### Conflito de versão ao fazer git push
Você tentou fazer push mas o GitHub recusou porque tem commits que você não tem localmente.
Rode: `git pull origin main` e depois tente o push novamente.

---

## ESTRUTURA DE ARQUIVOS NO REPOSITÓRIO

| Arquivo | Para que serve |
|---------|---------------|
| `CERTEIRO_ONE_CONTEXTO_ESTRATEGICO.md` | Contexto do negócio — usar no Claude.ai |
| `CONTEXTO_CLAUDE_CODE.md` | Contexto técnico — Claude Code lê este |
| `GUIA_GABRIEL_MARKETING.md` | Este arquivo |
| `index.html` | Dashboard principal (126KB — cuidado) |
| `registro.html` | Registro de visitas e propostas |
| `vendedor.html` | Relatório público para proprietário |

---

## ENDEREÇOS IMPORTANTES

| Item | Endereço |
|------|----------|
| Sistema em produção | https://dashboard-certeiro.vercel.app |
| Repositório GitHub | https://github.com/gabrielcerteiro/dashboard-certeiro |
| Banco de dados | https://supabase.com → projeto vtykzralkxlbqqkleofl |
| Deploy | https://vercel.com (automático, não precisa acessar) |
| Versionamento | Google Doc compartilhado com Gabriel |

---

## RESUMO EM UMA LINHA

**Claude.ai planeja. Claude Code executa. Você acompanha, aprova, testa e registra.**
Sem pular etapas. Especialmente a de registrar a versão.
