# CLAUDION BRIEFING — CERTEIRO ONE
> Documento de contexto para iniciar novas conversas no Claude.ai (Claudion ou Gabriel Marketing).
> Atualizado em: 07/04/2026

---

## O QUE É O CERTEIRO ONE

Plataforma ERP operacional interna da Gabriel Certeiro Imóveis.
Controla exclusividades imobiliárias: funil de vendas, visitas, propostas,
timeline operacional, disparos de marketing e relatório para proprietários.

**URL de produção:** https://dashboard-certeiro.vercel.app
**Repositório:** github.com/gabrielcerteiro/dashboard-certeiro
**Deploy:** automático via Vercel ao fazer push no branch main

---

## ESTADO ATUAL — versão 1.2.0 (07/04/2026)

### O que está funcionando
- Pipeline de exclusividades com funil de barras (dados reais)
- Sistema de alertas automáticos (6 regras)
- Timeline operacional por exclusividade
- Modal "+ Nova Exclusividade" com criação em cascata (3 tabelas)
- Registro de visitas e propostas (com editar/excluir)
- Painéis de disparos para base e parceiros
- Checkboxes de ações de venda com auto-save
- Campo de verba total planejada + comparativo mídia prevista vs. realizada
- Relatório do vendedor (link compartilhável por imóvel)
- Visual estilo Pipedrive: SVG inline, border-left por status, labels uppercase
- PWA instalável no iOS com safe area correta
- Autenticação de usuários

### O que NÃO funciona ainda
- Cadastro de novos usuários (quebrado — usa signUp que derruba sessão do admin)
- Módulos "Em breve": Análise, Captação, Vendas, Marketing, Conteúdo, Financeiro

---

## ARQUITETURA TÉCNICA

**Stack:** HTML/CSS/JS puro + Supabase (banco) + Vercel (host) + GitHub (repo)
**Sem framework** — arquivos estáticos diretos, sem build step

**Arquivos principais:**
- `index.html` — dashboard principal (126KB — cuidado com truncamento no push)
- `registro.html` — registro de visitas e propostas
- `vendedor.html` — relatório público para proprietário

**Banco de dados (Supabase):**
- Project ID: vtykzralkxlbqqkleofl
- Tabelas: imoveis, exclusividades, funil_snapshot, visitas, propostas, corretores
- View principal: dashboard_imoveis (JOIN das 3 tabelas + campos calculados)
- RLS: todas as tabelas configuradas para role authenticated

**Design System:**
- --navy: #191949 (cor primária)
- --bg: #F5F5F8 (fundo)
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
| Camila | Coordenadora operacional |
| Suelen | Pós-venda e documentação |

---

## DOCUMENTOS DE REFERÊNCIA

| Documento | Onde |
|-----------|------|
| Contexto técnico para Claude Code | `CONTEXTO_CLAUDE_CODE.md` no repositório |
| Versionamento e backlog | Google Doc (link com o Gabriel) |
| Brand Overview | `Gabriel_Certeiro_Brand_Overview_v4_Marco2026.docx` (projeto Claudion) |

---

## COMO TRABALHAR COM O CLAUDE CODE

### Regra de ouro
Sempre iniciar sessão nova com o Prompt 0 (onboarding), depois o prompt da fase.
O Claude Code lê o `CONTEXTO_CLAUDE_CODE.md` e entra produtivo imediatamente.

### Prompt 0 — onboarding obrigatório
```
Antes de qualquer coisa, leia o arquivo CONTEXTO_CLAUDE_CODE.md na raiz do repositório.
Após ler, confirme:
1. Quais são os 3 arquivos principais do projeto
2. Qual view o dashboard usa como fonte principal de dados
3. Qual é a regra crítica sobre acentos dentro de <script>
4. Qual é o SHA atual do index.html
Não faça nenhuma alteração ainda.
```

### Regras críticas de código
1. ZERO acentos dentro de `<script>` — ASCII puro no JS
2. ZERO emojis — SVG inline estilo Lucide
3. `create_or_update_file` individualmente (não push_files para arquivos grandes)
4. SHA obrigatório ao atualizar arquivo existente
5. Sempre `get_file_contents` antes de editar para obter SHA atual

### Deploy
Push no branch main → Vercel detecta automaticamente → online em 2-3 minutos.
NÃO precisa de comando manual de deploy.

---

## BACKLOG — próxima versão (1.3.0)

### Alta prioridade
- [ ] Cadastro de usuários via Edge Function (service_role)
- [ ] Anon Key exposta no CONTEXTO_CLAUDE_CODE.md — mover para variável de ambiente
- [ ] Controle de acesso por role no frontend

### Média prioridade
- [ ] Branches para desenvolvimento (hoje tudo vai direto para produção)
- [ ] Repositório público — tornar privado
- [ ] Logs de auditoria (quem fez o quê)
- [ ] Backup automatizado documentado

### Funcionalidades
- [ ] Módulo Análise — conversões por canal
- [ ] Módulo Vendas — tracking VGV fechado
- [ ] Módulo Financeiro — DRE simplificado
- [ ] Dashboard de disparos para a Rafaela

### Estrutural (futuro)
- [ ] Migrar index.html (126KB) para módulos separados
- [ ] Testes automatizados antes do deploy
- [ ] Variáveis de ambiente (URLs e IDs hardcoded)

---

## COMO INICIAR UMA NOVA CONVERSA AQUI NO CLAUDE.AI

### Para o Claudion (Gabriel Certeiro)
Cole isso no início da conversa:

```
Sou Gabriel Certeiro. Estamos trabalhando na plataforma Certeiro One
(dashboard-certeiro.vercel.app). Leia o arquivo CLAUDION_BRIEFING.md
no repositório github.com/gabrielcerteiro/dashboard-certeiro
para ter o contexto completo do projeto antes de começarmos.
```

### Para o Gabriel Marketing
Cole isso no início da conversa:

```
Sou Gabriel Marketing da Gabriel Certeiro Imóveis.
Preciso executar melhorias na plataforma Certeiro One.
Leia o CLAUDION_BRIEFING.md e o CONTEXTO_CLAUDE_CODE.md
no repositório github.com/gabrielcerteiro/dashboard-certeiro
para entender o estado atual antes de começar.
```

---

## NOTAS IMPORTANTES

- **index.html tem 126KB** — histórico de truncamento ao fazer push. Sempre verificar integridade.
- **Dois Gabriels:** Gabriel Certeiro (dono) e Gabriel Marketing (execução técnica). Contextos diferentes.
- **Supabase view:** ao adicionar colunas via CREATE OR REPLACE VIEW, sempre adicionar DEPOIS de `count_propostas` (que deve ficar no final do SELECT).
- **Propostas:** tabela não tem coluna `corretor`. Nunca incluir no payload.
- **Registro.html:** não tem mais criação de imóvel (removido na v1.2.0). Apenas visitas e propostas.
