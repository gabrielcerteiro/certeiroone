# CONTEXTO COMPLETO — PLATAFORMA CERTEIRO
> Arquivo para onboarding de nova sessão no Claude Code.
> Atualizado em: 07/04/2026 — versao 1.2.0 fechada

---

## 1. VISÃO GERAL DO PROJETO

**Nome:** Plataforma Certeiro
**Dono:** Gabriel Certeiro — Gabriel Certeiro Imóveis, Itajaí/SC
**Conceito:** ERP operacional de exclusividades imobiliárias. Dashboard interno de controle de captações, funil de vendas, visitas, propostas e linha do tempo operacional.

---

## 2. REPOSITÓRIO E DEPLOY

| Item | Valor |
|------|-------|
| Repo principal | `github.com/gabrielcerteiro/dashboard-certeiro` |
| Branch | `main` (auto-deploy via Vercel) |
| URL produção | `https://dashboard-certeiro.vercel.app` |
| Repo secundário (legado) | `github.com/gabrielcerteiro/visitas-gabrielcerteiro` |
| URL secundária | `https://visitas.gabrielcerteiro.com.br` |

---

## 3. ARQUIVOS DO PROJETO

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Dashboard principal — lista, detalhe, edição, nova exclusividade |
| `registro.html` | Registro de visitas e propostas (SEM criacao de imovel) |
| `vendedor.html` | Relatório para proprietário (link compartilhável) |
| `CONTEXTO_CLAUDE_CODE.md` | Este arquivo |

---

## 4. SUPABASE

| Item | Valor |
|------|-------|
| Project ID | `vtykzralkxlbqqkleofl` |
| URL | `https://vtykzralkxlbqqkleofl.supabase.co` |
| Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0eWt6cmFsa3hsYnFxa2xlb2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjMyNjAsImV4cCI6MjA4OTkzOTI2MH0.rYBifw2NXqVDGrKbDWKJgrFAIdoruxxsIPc9RXibgy0` |

### 4.1 RLS Policies (ja configuradas)
- `propostas` — INSERT, UPDATE
- `visitas` — INSERT, UPDATE
- `funil_snapshot` — ALL
- `exclusividades` — ALL
- `imoveis` — INSERT, UPDATE

### 4.2 Tabelas

#### `imoveis`
- `id` uuid PK
- `nome`, `proprietario`, `bairro`, `status`, `preco` text
- `ativo` boolean (default true)
- `created_at` timestamptz

#### `exclusividades`
- `id` uuid PK, `imovel_id` uuid FK → imoveis.id
- `data_inicio` date, `dias_contrato` int (default 120)
- `status` text CHECK ('ativa','encerrada','renovada')
- `observacoes` text, `created_at`, `updated_at` timestamptz

#### `funil_snapshot`
- `id` uuid PK, `exclusividade_id` uuid FK → exclusividades.id
- `imovel_nome`, `proprietario`, `preco` text
- `status_exclusividade` text CHECK ('ativa','vendida','perdida','encerrada')
- `data_inicio`, `data_fim` date
- `prazo_contrato_dias` int (default 120)
- `prazo_repaginacao_dias` int
- `data_repaginacao_concluida`, `data_gravacao_conteudo`, `data_midia_entregue` date
- `prazo_interno_dias` int
- `meta_leads`, `meta_visitas`, `meta_propostas` int
- `meta_investimento` numeric (default 1500) — NOME CORRETO (nao usar meta_gastos_ads)
- `meta_cpl` numeric (default 65)
- `total_leads`, `total_visitas`, `total_propostas` int — legado/manual
- `leads_abertos`, `leads_perdidos` int
- `leads_meta_ads`, `leads_google_ads`, `leads_instagram_org`, `leads_youtube`, `leads_tiktok`, `leads_site_org`, `leads_indicacao`, `leads_corretor_parc`, `leads_relacionamento`, `leads_disparo_base`, `leads_oferta_ativa`, `leads_outdoor` int
- `gastos_metaads` numeric, `alcance_metaads` int, `frequencia_metaads` numeric
- `localizacao`, `tipo_imovel` text — tipo: Mobiliado, Vazio, Repaginado
- `atualizado_em` timestamptz, `fonte` text (default 'pipedrive_n8n')
- `midia_total_planejada` numeric — orcamento total do contrato
- `disparos_base`, `impactados_base`, `visitas_base`, `propostas_base` int
- `disparos_parceiros`, `contatados_parceiros`, `visitas_parceiros`, `propostas_parceiros` int
- `data_disparo_base`, `data_disparo_parceiros` date
- `cad_dwv`, `cad_site`, `cat_gabriel`, `cat_rafaela` boolean DEFAULT false
- `video_youtube`, `post_instagram`, `post_tiktok`, `post_facebook` boolean DEFAULT false

#### `visitas`
- `id` uuid PK, `imovel_id` uuid FK → imoveis.id
- `imovel_nome`, `corretor`, `parceiro`, `origem`, `nome_interessado` text
- `data_visita` date, `hora_visita` time
- `objections` text[], `observacoes` text
- `intencao` text ('Quer comprar','Esta pensando','Nao gostou','Quer segunda visita')
- `qualificado_financeiramente` boolean
- `formas_pagamento` text[], `pagto_detalhes` text, `created_at` timestamptz

#### `propostas`
- `id` uuid PK, `imovel_id` uuid FK → imoveis.id
- `nome_interessado` text, `data` date, `valor_proposto` numeric
- `forma_pagamento` text CHECK ('a_vista','financiamento','parcelamento_direto','dacao_a_vista','dacao_financiamento','dacao_parcelamento_direto','parcelamento_direto_financiamento')
- `status` text CHECK ('em_andamento','aceita','recusada','desistiu')
- `observacao` text, `created_at`, `updated_at` timestamptz
- NAO tem coluna `corretor`

#### `corretores`
- Gabriel Certeiro — CRECI 22249/SC
- Robson Souza — CRECI 36145/SC

### 4.3 Views

#### `dashboard_imoveis`
JOIN funil_snapshot + exclusividades + imoveis. Campos calculados:
- `dias_restantes`, `tl_hoje_pct`, `status_repaginacao`, `data_meta_interna`
- `cpl_metaads`, `conv_lead_visita`, `conv_visita_prop`, `dash_status`
- Todos os campos de funil_snapshot
- `count_propostas` — COUNT real da tabela propostas (SEMPRE no FINAL do SELECT)

> CRITICO: ao fazer CREATE OR REPLACE VIEW, novos campos devem vir DEPOIS de
> count_propostas. PostgreSQL nao permite inserir colunas no meio.

#### `dashboard_visitas_detalhe`
View de visitas com JOIN em exclusividades para retornar `exclusividade_id`.

---

## 5. ARQUITETURA DO FRONTEND

### Stack
- HTML/CSS/JS puro — zero frameworks
- Supabase JS SDK v2 via CDN
- Font: Nunito Sans (Google Fonts)
- Sem build step

### Design System
```css
:root {
  --navy: #191949;
  --white: #FFFFFF;
  --bg: #F5F5F8;
  --text: #191949;
  --muted: #8E8EA0;
  --s2: #ECECF1;
  --s3: #D9D9E3;
  --green: #10B981;
  --red: #EF4444;
  --yellow: #F59E0B;
  --blue: #3B82F6;
  --card-radius: 14px;
}
```

### Padroes visuais
- **Icones:** SVG inline estilo Lucide (stroke, nao fill, stroke-width 1.5 ou 2). ZERO emojis.
- **Labels de secao:** uppercase, font-size 11px, letter-spacing 1px, cor --muted
- **Nav labels:** uppercase, font-size 11px, letter-spacing 0.5px
- **Badges de status:**
  - ativa: bg #D1FAE5, texto #065F46
  - vendida: bg #DBEAFE, texto #1E40AF
  - perdida/encerrada: bg #F3F4F6, texto #6B7280
- **Border-left icards (3px por dash_status):**
  - ok: --green | melhoria/atencao: --yellow | critico: --red | vendida/encerrada: --muted
- **Inputs:** border 1px solid --s3, border-radius 8px, padding 10px 12px
  - Label: uppercase, 11px, --muted, letter-spacing 0.5px
  - Focus: border-color --navy, outline none
- **Botao primario:** background --navy, texto branco, border-radius 8px
- **Botao destrutivo:** border 1px solid --red, texto --red, sem fundo
- **Indicador ativo mobile:** linha --navy 2px no TOPO do botao ativo
- **Bottom-nav PWA:** height 64px + env(safe-area-inset-bottom), icones 24px

### Layout
- **Mobile** (< 900px): bottom-nav fixa, coluna única, max-width 480px
- **Desktop** (>= 900px): sidebar lateral esquerda, grid 2 colunas à direita

### Regras críticas de código
1. **ZERO acentos dentro de `<script>`** — ASCII puro no JS
2. **ZERO emojis** — usar SVG inline estilo Lucide
3. **`create_or_update_file` individualmente** para arquivos grandes
4. **SHA obrigatório** ao atualizar arquivo existente

---

## 6. NAVEGAÇÃO

### Icones SVG (Lucide)
- Alertas: bell | Exclusividades: home | Registro: clipboard-list
- Mais: more-horizontal | Captacao: target | Vendas: trending-up
- Marketing: megaphone | Conteudo: film | Financeiro: bar-chart-2
- Usuarios: user | Sair: log-out

### Mobile bottom-nav
4 botoes: Alertas | Exclusividades | Registro | Mais
Indicador ativo: linha --navy 2px no topo
Safe area iOS: padding-bottom env(safe-area-inset-bottom)

### Desktop sidebar
Item ativo: background --navy, icone e label brancos

---

## 7. FLUXO DE CRIACAO DE EXCLUSIVIDADE

**Unico ponto de entrada: modal "+ Nova Exclusividade" no index.html**
Campos: Nome, Proprietario, Bairro (Fazenda/Praia Brava/Ressacada/Outro),
Tipo (Mobiliado/Vazio/Repaginado), Preco, Data de inicio,
Prazo (120/180 dias), Tem repaginacao? (checkbox condicional)

INSERT sequencial: imoveis → exclusividades → funil_snapshot
tipo_imovel salvo em funil_snapshot.

> registro.html NAO tem criacao de imovel — apenas visitas e propostas.
> Fluxo de imovel foi removido do registro na v1.2.0.

---

## 8. MÓDULOS

### index.html — funcoes principais
- `loadDashboard()` — carrega view + visitas + propostas
- `saveSnapshot()` — UPDATE funil_snapshot (inclui tipo_imovel, midia_total_planejada)
- `salvarNovaExcl()` — INSERT sequencial com todos os campos do modal
- `funilBarras(im)` — Visitas: visitasMap. Propostas: count_propostas. Ads: midia_total_planejada ou meta_investimento
- `excluirExclusividade()` / `_doExcluirExclusividade()` — DELETE funil_snapshot → exclusividades
- `disparosBaseHtml(im)` / `disparosParcHtml(im)` / `salvarDisparosBase()` / `salvarDisparosParc()`
- `toggleAcaoVenda(id, key, current)` — auto-save booleano
- `acoesVendaHtml(im)` — 8 checkboxes

### registro.html
- Apenas visitas e propostas
- Payload de proposta NAO inclui campo `corretor`

### vendedor.html
- Relatorio publico por `?id=<exclusividade_id>&from=internal`

---

## 9. FUNIL — LÓGICA DE BARRAS

```
fator = diasPassados / diasTotal
esperado = Math.round(meta * fator)
```
Verde >= esperado | Amarelo >= 80% | Vermelho < 80%

---

## 10. HISTORICO DE VERSOES

### v1.0.0 — primeiro deploy
Pipeline, alertas, timeline, registro, relatorio vendedor, autenticacao.

### v1.1.0 — 07/04/2026
RLS configurado. Propostas salvando. Funil com dados reais (visitas + propostas).
Nova exclusividade, disparos, acoes de venda, midia planejada vs realizada.

### v1.2.0 — 07/04/2026
Visual estilo Pipedrive: SVG inline, border-left por status, labels uppercase,
badges pills, formularios profissionais, indicador ativo mobile, safe area PWA iOS.
Fluxo de criacao de imovel unificado no Dashboard (removido do Registro).

---

## 11. PENDENCIAS ATIVAS

### Alta prioridade
- [ ] Cadastro de usuarios via Edge Function (service_role)
      Hoje sb.auth.signUp() troca sessao ativa — nao funciona

### Backlog
- [ ] Modulo Analise — conversoes por canal
- [ ] Modulo Vendas — tracking VGV fechado
- [ ] Modulo Financeiro — DRE simplificado

---

## 12. CONTEXTO OPERACIONAL

- **Equipe:** Gabriel Certeiro + Robson Souza + Rafaela
- **Foco:** imoveis R$630K–R$3M+ em Itajai/SC
- **Stack:** GHL + WhatsApp API + n8n + Pipedrive + Supabase + Vercel

---

## 13. REGRA DE EDICAO DE ARQUIVOS

SEMPRE fazer `get_file_contents` antes de editar qualquer arquivo:
1. Obter SHA atual (obrigatorio para update)
2. Verificar integridade do index.html (historico de truncamento com arquivo grande)
Nunca usar SHA de memoria.
