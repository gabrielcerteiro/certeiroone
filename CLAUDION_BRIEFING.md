# CLAUDION BRIEFING — CERTEIRO ONE
> Documento de contexto para iniciar novas conversas no Claude.ai (Claudion ou Gabriel Marketing).
> Atualizado em: 08/04/2026 — v1.3.0, URL certeiroone.vercel.app

---

## O QUE É O CERTEIRO ONE

Plataforma ERP operacional interna da Gabriel Certeiro Imóveis.
Controla exclusividades imobiliárias: funil de vendas, visitas, propostas,
timeline operacional, disparos de marketing e relatório para proprietários.

**URL de produção:** https://certeiroone.vercel.app
**Repositório:** github.com/gabrielcerteiro/dashboard-certeiro
**Deploy:** automático via Vercel ao fazer push no branch main

---

## ESTADO ATUAL — versão 1.3.0 (08/04/2026)

### O que está funcionando
- Dashboard em 4 grupos: Em Campanha / Em Repaginacao / Aguardando / Vendidas
- Grid 3 colunas para exclusividades Em Campanha
- Pipeline de exclusividades com funil de barras (dados reais)
- Sistema de alertas automáticos (6 regras)
- Timeline operacional por exclusividade
- Modal "+ Nova Exclusividade" com status inicial
- Registro de visitas e propostas (com editar/excluir)
- Painéis de disparos para base e parceiros
- Checkboxes de ações de venda com auto-save
- Campo de verba total planejada + comparativo mídia prevista vs. realizada
- Relatório do vendedor (link compartilhável por imóvel)
- Visual estilo Pipedrive: SVG inline, border-left por status, labels uppercase
- PWA instalável no iOS com safe area correta
- Autenticação de usuários

### O que NAO funciona ainda
- Cadastro de novos usuários (quebrado — usa signUp que derruba sessão do admin)
- Módulos "Em breve": Análise, Captação, Vendas, Marketing, Conteúdo, Financeiro

---

## ARQUITETURA TÉCNICA

**Stack:** HTML/CSS/JS puro + Supabase (banco) + Vercel (host) + GitHub (repo)
**Sem framework** — arquivos estáticos diretos, sem build step

**Arquivos principais:**
- `index.html` — dashboard principal
- `registro.html` — registro de visitas e propostas
- `vendedor.html` — relatório público para proprietário

**Banco de dados (Supabase):**
- Project ID: vtykzralkxlbqqkleofl
- Tabelas: imoveis, exclusividades, funil_snapshot, visitas, propostas, corretores
- View principal: dashboard_imoveis
- RLS: todas as tabelas configuradas para role authenticated
- Status funil_snapshot: ativa, vendida, perdida, encerrada, repaginacao, aguardando

**Design System:**
- --navy: #191949 | --bg: #F5F5F8
- --green: #10B981 | --red: #EF4444 | --yellow: #F59E0B
- Ícones: SVG inline estilo Lucide (ZERO emojis)
- Labels: uppercase, 11px, letter-spacing

---

## EQUIPE

| Pessoa | Papel |
|--------|-------|
| Gabriel Certeiro | Dono, corretor principal, valida tudo |
| Gabriel Marketing | Executa Claude Code, faz push, atualiza versionamento |
| Rafaela | Ops/CRM, usa o sistema diariamente |
| Robson Souza | Corretor parceiro, CRECI 36145/SC |

---

## DOCUMENTOS DE REFERÊNCIA

| Documento | Onde |
|-----------|------|
| Contexto técnico para Claude Code | `CONTEXTO_CLAUDE_CODE.md` no repositório |
| Guia operacional Gabriel Marketing | `GUIA_GABRIEL_MARKETING.md` no repositório |
| Contexto estratégico | `CERTEIRO_ONE_CONTEXTO_ESTRATEGICO.md` no repositório |
| Versionamento e backlog | Google Doc (link com o Gabriel) |
| Brand Overview | `Gabriel_Certeiro_Brand_Overview_v4_Marco2026.docx` (projeto Claudion) |

---

## COMO TRABALHAR COM O CLAUDE CODE

### Prompt 0 — onboarding obrigatório
```
Antes de qualquer coisa, leia o arquivo CONTEXTO_CLAUDE_CODE.md na raiz do repositório.
Após ler, confirme:
1. Quais são os 3 arquivos principais do projeto
2. Qual view o dashboard usa como fonte principal de dados
3. Qual é a regra crítica sobre acentos dentro de script
4. Qual é o SHA atual do index.html
Não faça nenhuma alteração ainda.
```

### Regras críticas de código
1. ZERO acentos dentro de script — ASCII puro no JS
2. ZERO emojis — SVG inline estilo Lucide
3. create_or_update_file individualmente (não push_files para arquivos grandes)
4. SHA obrigatório ao atualizar arquivo existente
5. Sempre get_file_contents antes de editar para obter SHA atual
6. Atualizar CONTEXTO_CLAUDE_CODE.md ao final de cada sessao

---

## BACKLOG — v1.3.1

### Alta prioridade
- [ ] Botao excluir no formulario de edicao (vEdit)
- [ ] Campo status inicial no modal de nova exclusividade
- [ ] Aba Analise: tabela de disparos para a Rafaela
- [ ] Cadastro de usuarios via Edge Function (service_role)
- [ ] Anon Key exposta no repositório — mover para variável de ambiente
- [ ] Controle de acesso por role no frontend

### Media prioridade
- [ ] Repositório privado no GitHub
- [ ] Branches para desenvolvimento
- [ ] Logs de auditoria
- [ ] Backup automatizado documentado

### Futuro
- [ ] Módulo Análise, Vendas, Financeiro
- [ ] Migrar index.html para módulos separados
- [ ] Testes automatizados antes do deploy

---

## COMO INICIAR UMA NOVA CONVERSA NO CLAUDE.AI

### Para o Claudion (Gabriel Certeiro)
```
Sou Gabriel Certeiro. Estamos trabalhando na plataforma Certeiro One
(certeiroone.vercel.app). Leia o arquivo CLAUDION_BRIEFING.md
no repositório github.com/gabrielcerteiro/dashboard-certeiro
para ter o contexto completo do projeto antes de começarmos.
```

### Para o Gabriel Marketing
```
Sou Gabriel Marketing da Gabriel Certeiro Imóveis.
Preciso executar melhorias na plataforma Certeiro One.
Leia o CLAUDION_BRIEFING.md e o CONTEXTO_CLAUDE_CODE.md
no repositório github.com/gabrielcerteiro/dashboard-certeiro
para entender o estado atual antes de começar.
```

---

## NOTAS IMPORTANTES

- URL antiga dashboard-certeiro.vercel.app foi DESATIVADA — usar certeiroone.vercel.app
- index.html — histórico de truncamento ao fazer push. Sempre verificar integridade.
- Dois Gabriels: Gabriel Certeiro (dono) e Gabriel Marketing (execução técnica).
- Supabase view: novos campos sempre DEPOIS de count_propostas no SELECT.
- Propostas: tabela NAO tem coluna corretor. Nunca incluir no payload.
- registro.html NAO tem criação de imóvel — apenas visitas e propostas.
