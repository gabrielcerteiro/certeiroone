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
- Gerar o texto de registro de versão para o Google Doc

---

## FLUXO DE TRABALHO — PASSO A PASSO

### ETAPA 1 — Receber a demanda
Gabriel pede uma melhoria ou correção.
Você anota e abre o Claude.ai.

### ETAPA 2 — Definir qual versão vai ser

Antes de começar, defina qual número de versão vai usar:

| Situação | Tipo | Exemplo |
|----------|------|---------|
| Correção de bug pontual | PATCH (último número) | 1.2.0 → 1.2.1 |
| Funcionalidade nova ou melhoria significativa | MINOR (número do meio) | 1.2.1 → 1.3.0 |
| Reformulação completa do sistema | MAJOR (primeiro número) | 1.x → 2.0 |

Em dúvida, pergunte ao Claudion no Claude.ai: "Isso é um PATCH ou MINOR?"

### ETAPA 3 — Iniciar sessão no Claude.ai
Cole sempre esta mensagem no início:

```
Sou Gabriel Marketing da Gabriel Certeiro Imoveis.
Preciso executar melhorias na plataforma Certeiro One.
Leia os arquivos CERTEIRO_ONE_CONTEXTO_ESTRATEGICO.md e CONTEXTO_CLAUDE_CODE.md
no repositorio github.com/gabrielcerteiro/dashboard-certeiro
para entender o estado atual antes de comecar.
A demanda e: [descreva o que Gabriel pediu]
Isso e um PATCH ou MINOR? Qual sera o numero da versao?
Me ajude a montar o prompt correto para executar no Claude Code.
```

O Claudion vai confirmar o número da versão e entregar o prompt pronto.

### ETAPA 4 — Executar no Claude Code
Abra o Claude Code em claude.ai/code.
Inicie a sessão sempre com o Prompt 0:

```
Antes de qualquer coisa, leia o arquivo CONTEXTO_CLAUDE_CODE.md
na raiz do repositorio.
Apos ler, confirme:
1. Quais sao os 3 arquivos principais do projeto
2. Qual view o dashboard usa como fonte principal de dados
3. Qual e a regra critica sobre acentos dentro de script
4. Qual e o SHA atual do index.html
Nao faca nenhuma alteracao ainda.
```

Espere ele confirmar que leu. Só então cole o prompt da tarefa.

### ETAPA 5 — Acompanhar a execução
Leia o que o Claude Code está fazendo.
Se ele pedir aprovação para executar SQL no Supabase, copie o SQL,
abra supabase.com → SQL Editor → cole → Run.
Se aparecer "Success. No rows returned", está certo. Confirme para ele continuar.

### ETAPA 6 — Fazer push
Quando o Claude Code terminar, mande:

```
Faca push de todos os arquivos alterados para o branch main no GitHub.
Use create_or_update_file individualmente para cada arquivo.
Nao use push_files para arquivos grandes.
Antes de cada push, faca get_file_contents para obter o SHA atual.
```

### ETAPA 7 — Validar no sistema
Acesse dashboard-certeiro.vercel.app.
Espere 2-3 minutos após o push.
Teste o que foi alterado.
Se funcionou: avisa Gabriel para validar.
Se quebrou: volta ao Claude Code e descreve o problema.

### ETAPA 8 — Registrar a versão (OBRIGATORIO, NAO PULE)
Essa etapa não é opcional. Sem ela o histórico do sistema se perde.

**8a. Peça o texto de versão ao Claude.ai:**

Volte ao Claude.ai (mesma sessão ou nova) e mande exatamente isso:

```
O ciclo de melhorias foi concluido e validado por Gabriel.
A versao e: X.X.X — DD/MM/AAAA

Gere o texto completo de registro de versao para eu colar
no Google Doc de versionamento. Use exatamente este formato:

## X.X.X — DD/MM/AAAA
Descricao curta do que essa versao representa.

Corrigido:
- [cada bug corrigido em uma linha]

Adicionado:
- [cada funcionalidade nova em uma linha]

Melhorado:
- [cada melhoria em algo que ja existia em uma linha]

Nao invente — liste apenas o que foi realmente feito nesta sessao.
```

O Claude.ai vai gerar o texto completo e formatado. Você só copia e cola.

**8b. Cole no Google Doc:**
Abra o Google Doc de versionamento.
Cole o texto gerado no topo da seção de versões.
Anote no backlog qualquer item novo que surgiu durante o trabalho.

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

## REGRAS QUE VOCÊ NÃO PODE QUEBRAR

**1. Sempre Prompt 0 ao abrir sessão nova no Claude Code.**
Sem isso ele não tem contexto e vai fazer besteira.

**2. Nunca deixe o Claude Code fazer mais de uma coisa ao mesmo tempo.**
Um escopo por sessão. Se ele começar a expandir, mande:
```
Pare de expandir escopo.
Execute apenas o que foi pedido.
Nao faca melhorias paralelas.
```

**3. Sempre peça o SQL antes de executar no Supabase.**
Se ele perguntar "posso executar?", responda:
```
Me mostre o SQL primeiro antes de executar.
```

**4. Sempre faça push ao final de cada sessão.**
Se fechar o Claude Code sem push, tudo que foi feito se perde.

**5. Sempre teste no sistema antes de falar que acabou.**
Abra o dashboard-certeiro.vercel.app e confira com seus próprios olhos.

**6. Sempre registre a versão no Google Doc.**
Sem o texto gerado pelo Claude.ai colado no Doc, a versão não existe oficialmente.

---

## O QUE FAZER QUANDO ALGO DER ERRADO

### O sistema quebrou após um push
Fale com o Claudion no Claude.ai descrevendo exatamente o que parou de funcionar.

### O Claude Code começou a fazer coisas não pedidas
```
Pare. Execute apenas o que foi pedido. Nao faca nada alem disso.
```

### O Claude Code está repetindo o mesmo erro
Abra sessão nova. Comece do Prompt 0.

### Não sei se devo aprovar o que o Claude Code propôs
```
O Claude Code propos isso: [cole a proposta]
Faz sentido aprovar? Tem algum risco?
```
Mande isso para o Claudion no Claude.ai.

### Conflito ao fazer git push localmente
```
git pull origin main
```
Rode isso e tente o push novamente.

---

## ESTRUTURA DE ARQUIVOS NO REPOSITÓRIO

| Arquivo | Para que serve |
|---------|---------------|
| `CERTEIRO_ONE_CONTEXTO_ESTRATEGICO.md` | Contexto do negocio — usar no Claude.ai |
| `CONTEXTO_CLAUDE_CODE.md` | Contexto tecnico — Claude Code le este |
| `GUIA_GABRIEL_MARKETING.md` | Este arquivo |
| `index.html` | Dashboard principal (126KB — cuidado) |
| `registro.html` | Registro de visitas e propostas |
| `vendedor.html` | Relatorio publico para proprietario |

---

## ENDEREÇOS IMPORTANTES

| Item | Endereço |
|------|----------|
| Sistema em producao | https://dashboard-certeiro.vercel.app |
| Repositorio GitHub | https://github.com/gabrielcerteiro/dashboard-certeiro |
| Banco de dados | https://supabase.com — projeto vtykzralkxlbqqkleofl |
| Claude Code | claude.ai/code |
| Claude.ai (Claudion) | claude.ai |
| Versionamento | Google Doc compartilhado com Gabriel |

---

## RESUMO EM QUATRO LINHAS

1. Claude.ai planeja e gera os prompts.
2. Claude Code executa e faz push.
3. Você acompanha, aprova e testa.
4. Claude.ai gera o texto de versão. Você cola no Google Doc.

Sem pular etapas. Especialmente a 4.
