# CLAUDION BRIEFING — CERTEIRO ONE
> Documento de contexto para iniciar novas conversas no Claude.ai (Claudion ou Gabriel Marketing).
> Atualizado em: 09/04/2026 — v1.3.1 em producao

---

## O QUE E O CERTEIRO ONE

Plataforma ERP operacional interna da Gabriel Certeiro Imoveis.
Controla exclusividades imobiliarias: funil de vendas, visitas, propostas,
timeline operacional, disparos de marketing e relatorio para proprietarios.

**URL de producao:** https://certeiroone.vercel.app
**Repositorio:** github.com/gabrielcerteiro/certeiroone
**Deploy:** automatico via Vercel ao fazer push no branch main
**Supabase project ID:** vtykzralkxlbqqkleofl

---

## ESTADO ATUAL — versao 1.3.1 (09/04/2026)

### O que esta funcionando

**Painel principal (index.html)**
- Dashboard em 4 grupos: Em Campanha / Em Repaginacao / Aguardando / Vendidas
- Grid 3 colunas para exclusividades Em Campanha
- Pipeline VGV com meta configuravel
- Sistema de alertas automaticos
- Timeline operacional por exclusividade
- Modal Nova Exclusividade com status inicial
- Formulario de edicao completo com:
  - Campo preco de venda (funil_snapshot.preco) com mascara R$ 7.200.000
  - Total de leads calculado automaticamente (soma dos 12 canais)
  - Meta CPL com indicador visual verde/vermelho
  - Botao editar nos cards de repaginacao
- Paineis de disparos base e parceiros
- Checkboxes de acoes de venda com auto-save
- Relatorio do vendedor (link compartilhavel)

**Modulo de usuarios (index.html)**
- Tabela `usuarios` como fonte unica de verdade (substituiu `perfis` e `corretores`)
- Login vinculado por auth_id (nao por id)
- Roles: master / operacional / padrao
- Tela de usuarios: listar, editar (nome, email, role, is_corretor, ativo), excluir, toggle ativo, reset senha
- Criacao via Edge Function `criar-usuario` (service_role)
- Exclusao via Edge Function `excluir-usuario` (service_role)
- currentUsuarioId armazenado no login

**Equipe no sistema:**
- Gabriel Certeiro → master, auth_id linkado, email gabriel@gabrielcerteiro.com.br
- Rafaela → operacional, email suporte@gabrielcerteiro.com.br (sem login ainda)
- Robson Souza → padrao, email robson@gabrielcerteiro.com.br (sem login ainda)

**Registro (registro.html)**
- Registro de visitas e propostas (cadastrar, editar, excluir)
- PROBLEMA CONHECIDO: registro.html ainda le de `perfis` e usa roles admin/editor
  → precisa ser corrigido para ler de `usuarios` com roles master/operacional/padrao
  → ESTA E A PRIMEIRA TAREFA DA PROXIMA SESSAO

**Edge Functions (supabase/functions/)**
- `criar-usuario` — criado no repo, AINDA NAO deployado no Supabase
- `excluir-usuario` — criado no repo, AINDA NAO deployado no Supabase
- Deploy pendente: supabase functions deploy criar-usuario --project-ref vtykzralkxlbqqkleofl
- Deploy pendente: supabase functions deploy excluir-usuario --project-ref vtykzralkxlbqqkleofl

---

## ARQUITETURA TECNICA

**Stack:** HTML/CSS/JS puro + Supabase + Vercel
**Sem framework** — arquivos estaticos, sem build step

**Tabelas ativas:**
- imoveis, exclusividades, funil_snapshot
- usuarios (substituiu perfis + corretores)
- visitas (campo corretor como texto; campo criado_por_id adicionado)
- propostas (SEM campo corretor; campo criado_por_id adicionado)
- activity_log
- perfis (OBSOLETA — pode ser removida futuramente)
- corretores (OBSOLETA — pode ser removida futuramente)

**Colunas adicionadas hoje:**
- visitas.criado_por_id uuid REFERENCES usuarios(id)
- propostas.criado_por_id uuid REFERENCES usuarios(id)
- exclusividades.preco_venda text (OBSOLETA — usar funil_snapshot.preco)
- funil_snapshot.preco text (campo ativo para preco de venda)
- funil_snapshot.meta_cpl numeric

**Imoveis ativos no sistema:**
- Cezanne 1701, Soho 1102, Casa Ressacada n81, Marechiaro 402
- Felicita 802, Felicita 505, Reserva Perequê 2101, Smart Sao Joao 506
- Laguna 1202 (encerrada)

**Design System:**
- --navy: #191949 | --bg: #F5F5F8
- --green: #10B981 | --red: #EF4444 | --yellow: #F59E0B
- Icones: SVG inline estilo Lucide (ZERO emojis)
- ZERO acentos dentro de script — ASCII puro no JS

---

## BACKLOG — PROXIMA VERSAO (v1.4.0)

### Prioridade alta — pendentes criticos

1. **Corrigir registro.html**
   - Trocar sb.from('perfis') por sb.from('usuarios')
   - Corrigir applyRoleUI: admin/editor → master/operacional
   - Adicionar "Disparo de base" e "Disparo de parceiros" como origens de lead
     (hoje tem "Disparo de base" mas nao tem "Disparo de parceiros")

2. **Deploy das Edge Functions**
   - supabase functions deploy criar-usuario --project-ref vtykzralkxlbqqkleofl
   - supabase functions deploy excluir-usuario --project-ref vtykzralkxlbqqkleofl

3. **Busca de registros no registro.html**
   - Refatoracao do modulo de historico
   - Painel de busca com filtros: Tipo / Exclusividade / Corretor / Periodo
   - Busca dinamica no Supabase, so executa ao clicar "Buscar"

### Aba Analise — em design (NAO implementar ainda)

A aba Analise foi projetada em detalhes mas requer decisoes antes de implementar.
AGUARDAR aprovacao do Claudion antes de iniciar.

**Estrutura definida:**
- Overview: resumo do mes (totais gerais + separados base/parceiros)
- Filtros: Periodo / Tipo (base/parceiros/todos) / Usuario / Status (ativas/encerradas)
- Cards por exclusividade com resumo (disparos, impactados, visitas geradas)
- Detalhe por exclusividade: log completo de disparos com editar/excluir
- Formulario de novo disparo inline por exclusividade

**Tabela nova necessaria:**
```sql
CREATE TABLE disparos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exclusividade_id uuid REFERENCES exclusividades(id) ON DELETE CASCADE,
  usuario_id uuid REFERENCES usuarios(id),
  tipo text CHECK (tipo IN ('base','parceiros')),
  fonte text DEFAULT 'manual' CHECK (fonte IN ('manual','meta_api','google_api')),
  data_disparo date NOT NULL,
  enviados integer DEFAULT 0,
  impactados integer DEFAULT 0,
  observacao text,
  created_at timestamptz DEFAULT now()
);
```

**Lacunas identificadas — resolver antes de implementar:**
- registro.html precisa ter "Disparo de parceiros" como origem de visita
- Definir se Robson (padrao) ve a aba Analise
- Decidir se dados de disparo aparecem no link do vendedor (relatorio proprietario)
- Exportacao de relatorio (PDF/Excel) — escopo futuro

### Outros itens identificados

- Favicon / logo na aba do browser (precisa do arquivo PNG da logo)
- Integracao Meta Ads + Google Ads via n8n (apos v1.4.0)
  → Campos campanha_meta_id e campanha_google_id nas exclusividades
  → n8n busca diariamente e atualiza leads_meta_ads, gastos_metaads, etc.
- Remover tabelas obsoletas: perfis, corretores (apos confirmar que nada depende delas)
- Coluna preco_venda em exclusividades pode ser removida (campo ativo e funil_snapshot.preco)

---

## EQUIPE

| Pessoa | Papel | Role no sistema |
|--------|-------|-----------------|
| Gabriel Certeiro | Dono, corretor principal | master |
| Rafaela | Ops/CRM, usa sistema diariamente | operacional |
| Gabriel Marketing | Executa Claude Code | - |
| Robson Souza | Corretor parceiro, CRECI 36145/SC | padrao |

---

## DOCUMENTOS DE REFERENCIA

| Documento | Onde |
|-----------|------|
| Contexto tecnico para Claude Code | CONTEXTO_CLAUDE_CODE.md no repo |
| Guia operacional Gabriel Marketing | GUIA_GABRIEL_MARKETING.md no repo |
| Contexto estrategico | CERTEIRO_ONE_CONTEXTO_ESTRATEGICO.md no repo |
| Versionamento e backlog | Google Doc: https://docs.google.com/document/d/12I9mgnHr1AK79a9PQhKWztBEVtBOwvC9ebI1pzhC8YQ |

---

## COMO INICIAR NOVA CONVERSA NO CLAUDE.AI

### Para o Claudion (Gabriel Certeiro):

```
Sou Gabriel Certeiro. Estamos trabalhando na plataforma Certeiro One
(certeiroone.vercel.app). Leia o arquivo CLAUDION_BRIEFING.md
no repositorio github.com/gabrielcerteiro/certeiroone
para ter o contexto completo antes de continuar.
Versao atual: v1.3.1 em producao.
```

### Para o Gabriel Marketing:

```
Sou Gabriel Marketing da Gabriel Certeiro Imoveis.
Preciso executar melhorias na plataforma Certeiro One.
Leia o CLAUDION_BRIEFING.md e o CONTEXTO_CLAUDE_CODE.md
no repositorio github.com/gabrielcerteiro/certeiroone
para entender o estado atual antes de comecar.
```

---

## REGRAS CRITICAS DE CODIGO

1. ZERO acentos dentro de script — ASCII puro no JS
2. ZERO emojis — SVG inline estilo Lucide
3. Nunca usar push_files para arquivos grandes (trunca o conteudo)
4. Usar create_or_update_file individualmente para index.html e registro.html
5. SHA obrigatorio ao atualizar arquivo existente
6. Sempre get_file_contents antes de editar qualquer arquivo
7. Atualizar CONTEXTO_CLAUDE_CODE.md ao final de cada sessao
8. Verificar acentos no JS apos cada commit (buscar ord > 127 dentro de script tags)

---

## NOTAS IMPORTANTES

- URL antiga dashboard-certeiro.vercel.app DESATIVADA — usar certeiroone.vercel.app
- URL antiga visitas.gabrielcerteiro.com.br DESATIVADA — registro feito pelo registro.html
- Propostas NAO tem coluna corretor — nunca incluir no payload
- registro.html NAO tem criacao de imovel — apenas visitas e propostas
- funil_snapshot e a tabela central de dados operacionais — NAO exclusividades
- A anon key do Supabase exposta no JS e intencional (projetada para ser publica)
  O risco real seria expor a service_role key — que esta apenas nas Edge Functions
- Coluna preco_venda em exclusividades foi criada mas nao e usada — campo ativo e funil_snapshot.preco
