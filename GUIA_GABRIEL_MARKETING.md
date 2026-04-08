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
no repositorio github.com/gabrielcerteiro/certeiroone
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

### ETAPA 6 — Fazer push dos arquivos alterados
Quando o Claude Code terminar, mande:

```
Faca push de todos os arquivos alterados para o branch main no GitHub.
Use create_or_update_file individualmente para cada arquivo.
Nao use push_files para arquivos grandes.
Antes de cada push, faca get_file_contents para obter o SHA atual.
```

### ETAPA 7 — Atualizar o CONTEXTO_CLAUDE_CODE.md (OBRIGATORIO)
Apos o push dos arquivos, mande este prompt ao Claude Code:

```
Atualize o arquivo CONTEXTO_CLAUDE_CODE.md para refletir o estado atual do sistema.
Registre a versao X.X.X no historico (secao 11) com o que foi feito.
Atualize funcoes novas ou alteradas na secao 9 se necessario.
Remova da secao 12 qualquer pendencia resolvida nesta sessao.
Faca push deste arquivo para o branch main.
```

### ETAPA 8 — Validar no sistema
Acesse certeiroone.vercel.app.
Espere 2-3 minutos após o push.
Teste o que foi alterado.
Se funcionou: avisa Gabriel para validar.
Se quebrou: volta ao Claude Code e descreve o problema.

### ETAPA 9 — Registrar a versão no Google Doc (OBRIGATORIO, NAO PULE)

**9a. Peça o texto de versão ao Claude.ai:**

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

**9b. Cole no Google Doc:**
Abra o Google Doc de versionamento.
Cole o texto gerado no topo da seção de versões.
Anote no backlog qualquer item novo que surgiu durante o trabalho.

---

## TRABALHANDO NO REPOSITÓRIO LOCAL

**Antes de qualquer edição local, sempre rode:**
```
git pull origin main
```

**Fluxo completo:**
1. `git pull origin main`
2. Faz as edições
3. `git add .`
4. `git commit -m "descricao"`
5. `git push origin main`

---

## REGRAS QUE VOCÊ NÃO PODE QUEBRAR

**1. Sempre Prompt 0 ao abrir sessão nova no Claude Code.**
**2. Nunca deixe o Claude Code fazer mais de uma coisa ao mesmo tempo.**
```
Pare de expandir escopo. Execute apenas o que foi pedido.
```
**3. Sempre peça o SQL antes de executar no Supabase.**
```
Me mostre o SQL primeiro antes de executar.
```
**4. Sempre faça push ao final de cada sessão.**
**5. Sempre atualize o CONTEXTO_CLAUDE_CODE.md.**
**6. Sempre teste no sistema antes de falar que acabou.**
**7. Sempre registre a versão no Google Doc.**

---

## O QUE FAZER QUANDO ALGO DER ERRADO

### Sistema quebrou após push
Fale com o Claudion no Claude.ai descrevendo o que parou de funcionar.

### Claude Code fazendo coisas não pedidas
```
Pare. Execute apenas o que foi pedido. Nao faca nada alem disso.
```

### Claude Code repetindo o mesmo erro
Abra sessão nova. Comece do Prompt 0.

### Não sabe se deve aprovar
```
O Claude Code propos isso: [cole]. Faz sentido? Tem risco?
```
Mande ao Claudion no Claude.ai.

### Conflito ao fazer git push
```
git pull origin main
```

---

## ESTRUTURA DE ARQUIVOS NO REPOSITÓRIO

| Arquivo | Para que serve |
|---------|---------------|
| `CERTEIRO_ONE_CONTEXTO_ESTRATEGICO.md` | Contexto do negocio — usar no Claude.ai |
| `CONTEXTO_CLAUDE_CODE.md` | Contexto tecnico — Claude Code le este. SEMPRE atualizar. |
| `GUIA_GABRIEL_MARKETING.md` | Este arquivo |
| `index.html` | Dashboard principal |
| `registro.html` | Registro de visitas e propostas |
| `vendedor.html` | Relatorio publico para proprietario |

---

## ENDEREÇOS IMPORTANTES

| Item | Endereço |
|------|----------|
| Sistema em producao | https://certeiroone.vercel.app |
| Repositorio GitHub | https://github.com/gabrielcerteiro/certeiroone |
| Banco de dados | https://supabase.com — projeto vtykzralkxlbqqkleofl |
| Claude Code | claude.ai/code |
| Claude.ai (Claudion) | claude.ai |
| Versionamento | Google Doc compartilhado com Gabriel |

---

## RESUMO EM CINCO LINHAS

1. Claude.ai planeja e gera os prompts.
2. Claude Code executa e faz push dos arquivos.
3. Claude Code atualiza o CONTEXTO e faz push.
4. Voce testa e avisa Gabriel.
5. Claude.ai gera o texto de versao. Voce cola no Google Doc.

Sem pular etapas. Nenhuma delas.
