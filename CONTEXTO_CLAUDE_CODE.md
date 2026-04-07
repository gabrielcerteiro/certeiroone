# CONTEXTO COMPLETO — PLATAFORMA CERTEIRO
> Arquivo para onboarding de nova sessão no Claude Code.
> Atualizado em: 07/04/2026 — pos Fase 4 concluida

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
| `index.html` | Dashboard interno principal — lista, detalhe, edição, nova exclusividade |
| `registro.html` | Módulo de registro de visitas e propostas |
| `vendedor.html` | Relatório para proprietário (link compartilhável) |
| `docs/BRIEFING_DASHBOARD_V20.md` | Briefing de produto com specs funcionais |
| `SPEC_VENDEDOR.md` | Especificação da página do vendedor |
| `CONTEXTO_CLAUDE_CODE.md` | Este arquivo |

---

## 4. SUPABASE

| Item | Valor |
|------|-------|
| Project ID | `vtykzralkxlbqqkleofl` |
| URL | `https://vtykzralkxlbqqkleofl.supabase.co` |
| Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0eWt6cmFsa3hsYnFxa2xlb2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjMyNjAsImV4cCI6MjA4OTkzOTI2MH0.rYBifw2NXqVDGrKbDWKJgrFAIdoruxxsIPc9RXibgy0` |

### 4.1 RLS Policies (ja configuradas)
Todas as tabelas abaixo têm policies para role `authenticated`:
- `propostas` — INSERT, UPDATE
- `visitas` — INSERT, UPDATE
- `funil_snapshot` — ALL (SELECT, INSERT, UPDATE, DELETE)
- `exclusividades` — ALL
- `imoveis` — INSERT, UPDATE

### 4.2 Tabelas

#### `imoveis`
- `id` uuid PK
- `nome`, `proprietario`, `bairro`, `status`, `preco` text
- `ativo` boolean (default true)
- `created_at` timestamptz

#### `exclusividades`
- `id` uuid PK
- `imovel_id` uuid FK → imoveis.id
- `data_inicio` date
- `dias_contrato` int (default 120)
- `status` text CHECK ('ativa','encerrada','renovada')
- `observacoes` text
- `created_at`, `updated_at` timestamptz

#### `funil_snapshot`
Todos os campos operacionais. Colunas adicionadas nas fases:
- `id` uuid PK
- `exclusividade_id` uuid FK → exclusividades.id
- `imovel_nome`, `proprietario`, `preco` text
- `status_exclusividade` text CHECK ('ativa','vendida','perdida','encerrada')
- `data_inicio`, `data_fim` date
- `prazo_contrato_dias` int (default 120)
- `prazo_repaginacao_dias` int
- `data_repaginacao_concluida`, `data_gravacao_conteudo`, `data_midia_entregue` date
- `prazo_interno_dias` int
- `meta_leads`, `meta_visitas`, `meta_propostas` int
- `meta_investimento` numeric (default 1500) — meta de midia (NOME CORRETO)
- `meta_cpl` numeric (default 65)
- `total_leads`, `total_visitas`, `total_propostas` int — legado/manual
- `leads_abertos`, `leads_perdidos` int
- `leads_meta_ads`, `leads_google_ads`, `leads_instagram_org`, `leads_youtube`, `leads_tiktok`, `leads_site_org`, `leads_indicacao`, `leads_corretor_parc`, `leads_relacionamento`, `leads_disparo_base`, `leads_oferta_ativa`, `leads_outdoor` int
- `gastos_metaads` numeric
- `alcance_metaads` int
- `frequencia_metaads` numeric
- `localizacao`, `tipo_imovel` text
- `atualizado_em` timestamptz
- `fonte` text (default 'pipedrive_n8n')
- `midia_total_planejada` numeric — ADICIONADO Fase 4 (orcamento total do contrato)
- `disparos_base`, `impactados_base`, `visitas_base`, `propostas_base` int — Fase 3
- `disparos_parceiros`, `contatados_parceiros`, `visitas_parceiros`, `propostas_parceiros` int — Fase 3
- `data_disparo_base`, `data_disparo_parceiros` date — Fase 3
- `cad_dwv`, `cad_site`, `cat_gabriel`, `cat_rafaela` boolean DEFAULT false — Fase 3
- `video_youtube`, `post_instagram`, `post_tiktok`, `post_facebook` boolean DEFAULT false — Fase 3

#### `visitas`
- `id` uuid PK, `imovel_id` uuid FK → imoveis.id
- `imovel_nome`, `corretor`, `parceiro`, `origem`, `nome_interessado` text
- `data_visita` date, `hora_visita` time
- `objections` text[], `observacoes` text
- `intencao` text ('Quer comprar','Esta pensando','Nao gostou','Quer segunda visita')
- `qualificado_financeiramente` boolean
- `formas_pagamento` text[], `pagto_detalhes` text
- `created_at` timestamptz

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
JOIN de funil_snapshot + exclusividades + imoveis. Campos calculados:
- `dias_restantes`, `tl_hoje_pct`, `status_repaginacao`, `data_meta_interna`
- `cpl_metaads`, `conv_lead_visita`, `conv_visita_prop`, `dash_status`
- Todos os campos de funil_snapshot incluindo os novos de Fase 3 e Fase 4
- `count_propostas` — COUNT real da tabela propostas (no FINAL do SELECT)

> ATENCAO: ao fazer CREATE OR REPLACE VIEW, novos campos devem ser adicionados
> DEPOIS de count_propostas (que ja estava no final). PostgreSQL nao permite
> inserir colunas no meio de uma view existente via CREATE OR REPLACE.

#### `dashboard_visitas_detalhe`
View de visitas com JOIN em exclusividades para retornar `exclusividade_id`.

---

## 5. ARQUITETURA DO FRONTEND

### Stack
- HTML/CSS/JS puro — zero frameworks
- Supabase JS SDK v2 via CDN
- Font: Nunito Sans (Google Fonts)
- Sem build step

### Design System atual
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

### Layout
- **Mobile** (< 900px): bottom-nav fixa, coluna única, max-width 480px
- **Desktop** (>= 900px): sidebar lateral esquerda, grid 2 colunas à direita

### Regras críticas de código
1. **ZERO acentos dentro de `<script>`** — ASCII puro no JS
2. **SVG inline para icones** — NAO usar emojis (Fase 5 vai remover todos)
3. **`create_or_update_file` individualmente** para arquivos grandes
4. **SHA obrigatório** ao atualizar arquivo existente

---

## 6. NAVEGAÇÃO

### Mobile (bottom-nav)
Alertas | Exclusividades | Registro (→ registro.html) | Analise | Mais (drawer)

### Desktop (sidebar)
Mesmos itens + Captação, Vendas, Marketing, Conteúdo, Financeiro (todos "Em breve")

### Bug pendente — indicador ativo mobile
Linha --navy de 2px no TOPO do botão ativo (estilo definido, ainda nao implementado)

---

## 7. MÓDULOS DO index.html

### Views
- `vAlertas`, `vList`, `vDetail`, `vEdit`, `vAnalise`

### Funcoes principais
- `loadDashboard()` — carrega view + visitas + propostas
- `saveSnapshot()` — UPDATE funil_snapshot, inclui midia_total_planejada
- `salvarNovaExcl()` — INSERT sequencial: imoveis → exclusividades → funil_snapshot
- `funilBarras(im)` — barras do funil. Visitas: visitasMap (real). Propostas: count_propostas (real).
  Ads: usa midia_total_planejada se preenchido, senao meta_investimento
- `excluirExclusividade()` / `_doExcluirExclusividade()` — DELETE em cascata
- `disparosBaseHtml(im)` / `disparosParcHtml(im)` — paineis editaveis de disparos
- `salvarDisparosBase(id)` / `salvarDisparosParc(id)` — UPDATE campos de disparo
- `toggleAcaoVenda(id, key, current)` — UPDATE booleano, auto-save
- `acoesVendaHtml(im)` — 8 checkboxes de acoes de venda

### Lógica de mídia (Fase 4)
- Campo `midia_total_planejada` disponivel no form de edicao (secao Meta Ads)
- Bloco comparativo no detalhe:
  midia_esperada = midia_total_planejada * (dias_passados / prazo_contrato_dias)
  Exibe: Previsto ate hoje / Realizado (gastos_metaads) / Diferenca (verde ou vermelho)
  So exibe se midia_total_planejada > 0

---

## 8. MÓDULO registro.html

- Registrar visita (form completo) e proposta (sem campo corretor)
- `salvarImovelModal()` — cria imovel + exclusividade + funil_snapshot em sequencia

---

## 9. MÓDULO vendedor.html

Relatório público. Acesso por `?id=<exclusividade_id>&from=internal`.

---

## 10. FUNIL — LÓGICA DE BARRAS

```
fator = diasPassados / diasTotal
esperado = Math.round(meta * fator)
```
Verde >= esperado | Amarelo >= 80% | Vermelho < 80%

---

## 11. ALERTAS

Contrato vencendo <= 30d → CRITICO | Vencido → CRITICO | Meta interna ultrapassada → CRITICO
Campanha sem visita → ATENCAO | 3+ visitas sem proposta → ATENCAO | 30d sem gravacao → ATENCAO

---

## 12. HISTÓRICO DE FASES

### Fase 1 — concluída (07/04/2026)
- Propostas salvando (payload corrigido)
- Funil visitas/propostas usando dados reais das tabelas
- Campo meta_investimento corrigido e editavel
- Botao de exclusao implementado
- View com count_propostas real
- RLS configurado em todas as tabelas

### Fase 3 — concluída (07/04/2026)
- Modal nova exclusividade (INSERT sequencial 3 tabelas)
- Paineis de disparos base e parceiros editaveis
- Checkboxes de acoes de venda com auto-save
- registro.html cria exclusividade + funil_snapshot automaticamente
- Bug propostas no painel de detalhe corrigido

### Fase 4 — concluída (07/04/2026)
- Campo midia_total_planejada adicionado ao banco e ao form de edicao
- Bloco comparativo previsto x realizado no detalhe
- Barra de Ads no icard usa midia_total_planejada como base quando preenchido

---

## 13. PENDÊNCIAS ATIVAS

### Proxima — Fase 5: Visual e UX estilo Pipedrive
- [ ] Remover todos os emojis, substituir por SVG inline
- [ ] Sidebar: icones SVG por item de menu
- [ ] Corrigir indicador ativo mobile (linha navy 2px no topo)
- [ ] Labels de secao: uppercase, letter-spacing, font-size 11px
- [ ] icards: border-left 3px por dash_status (verde/amarelo/vermelho/cinza)
- [ ] Badges de status como pills coloridos
- [ ] Inputs com border sutil, label uppercase, focus state navy
- [ ] Botoes: primary navy, destrutivo border vermelho

### Fase 6 — Cadastro de usuários (complexa, sessao separada)
- [ ] Edge Function com service_role
- [ ] Hoje sb.auth.signUp() troca sessao ativa — nao funciona

---

## 14. CONTEXTO OPERACIONAL

- **Equipe:** Gabriel Certeiro + Robson Souza + Rafaela
- **Foco:** imóveis R$630K–R$3M+ em Itajaí/SC
- **Stack:** GHL + WhatsApp API + n8n + Pipedrive + Supabase + Vercel

---

## 15. REGRA DE EDICAO DE ARQUIVOS

SEMPRE fazer `get_file_contents` antes de editar qualquer arquivo:
1. Obter SHA atual (obrigatorio para update)
2. Verificar integridade do index.html (126KB — historico de truncamento)
Nunca usar SHA de memoria.
