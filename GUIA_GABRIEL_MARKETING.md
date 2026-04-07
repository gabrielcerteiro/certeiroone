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

### ETAPA 7 — Atualizar o versionamento
Abra o Google Doc de versionamento.
Registre o que foi entregue na versão atual.
Anote qualquer item novo que surgiu durante o trabalho no backlog.

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

---

## ESTRUTURA DE ARQUIVOS NO REPOSITÓRIO

| Arquivo | Para que serve |
|---------|---------------|
| `CERTEIRO_ONE_CONTEXTO_ESTRATEGICO.md` | Contexto do negócio — usar no Claude.ai |
| `CONTEXTO_CLAUDE_CODE.md` | Contexto técnico — Claude Code lê este |
| `CLAUDION_BRIEFING.md` | Briefing rápido de onboarding |
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

**Claude.ai planeja. Claude Code executa. Você acompanha, aprova e testa.**
Sem pular etapas.
