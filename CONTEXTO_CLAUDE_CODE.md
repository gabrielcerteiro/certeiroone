# CONTEXTO COMPLETO — PLATAFORMA CERTEIRO
> Arquivo para onboarding de nova sessão no Claude Code.
> Atualizado em: 07/04/2026 — pos Fase 3 concluida

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

### 4.1 RLS Policies (já configuradas)
Todas as tabelas abaixo têm policies para role `authenticated`:
- `propostas` — INSERT, UPDATE
- `visitas` — INSERT, UPDATE
- `funil_snapshot` — ALL (SELECT, INSERT, UPDATE, DELETE)
- `exclusividades` — ALL
- `imoveis` — INSERT, UPDATE

### 4.2 Tabelas

#### `imoveis`
- `id` uuid PK
- `nome` text
- `proprietario` text
- `bairro` text
- `status` text
- `preco` text
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
Dados operacionais. Campos originais + migracao Fase 3:
- `id` uuid PK
- `exclusividade_id` uuid FK → exclusividades.id
- `imovel_nome`, `proprietario`, `preco` text
- `status_exclusividade` text CHECK ('ativa','vendida','perdida','encerrada')
- `data_inicio`, `data_fim` date
- `prazo_contrato_dias` int (default 120)
- `prazo_repaginacao_dias` int
- `data_repaginacao_concluida` date
- `data_gravacao_conteudo` date
- `data_midia_entregue` date
- `prazo_interno_dias` int
- `meta_leads`, `meta_visitas`, `meta_propostas` int
- `meta_investimento` numeric (default 1500) — meta de midia (NOME CORRETO — nao usar meta_gastos_ads)
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
- `disparos_base` int — ADICIONADO Fase 3
- `impactados_base` int — ADICIONADO Fase 3
- `visitas_base` int — ADICIONADO Fase 3
- `propostas_base` int — ADICIONADO Fase 3
- `disparos_parceiros` int — ADICIONADO Fase 3
- `contatados_parceiros` int — ADICIONADO Fase 3
- `visitas_parceiros` int — ADICIONADO Fase 3
- `propostas_parceiros` int — ADICIONADO Fase 3
- `data_disparo_base` date — ADICIONADO Fase 3
- `data_disparo_parceiros` date — ADICIONADO Fase 3
- `cad_dwv` boolean DEFAULT false — ADICIONADO Fase 3
- `cad_site` boolean DEFAULT false — ADICIONADO Fase 3
- `cat_gabriel` boolean DEFAULT false — ADICIONADO Fase 3
- `cat_rafaela` boolean DEFAULT false — ADICIONADO Fase 3
- `video_youtube` boolean DEFAULT false — ADICIONADO Fase 3
- `post_instagram` boolean DEFAULT false — ADICIONADO Fase 3
- `post_tiktok` boolean DEFAULT false — ADICIONADO Fase 3
- `post_facebook` boolean DEFAULT false — ADICIONADO Fase 3

#### `visitas`
- `id` uuid PK
- `imovel_id` uuid FK → imoveis.id
- `imovel_nome` text
- `data_visita` date
- `hora_visita` time
- `corretor` text
- `parceiro` text
- `origem` text
- `nome_interessado` text
- `objections` text[]
- `observacoes` text
- `intencao` text ('Quer comprar','Esta pensando','Nao gostou','Quer segunda visita')
- `qualificado_financeiramente` boolean
- `formas_pagamento` text[]
- `pagto_detalhes` text
- `created_at` timestamptz

#### `propostas`
- `id` uuid PK
- `imovel_id` uuid FK → imoveis.id
- `nome_interessado` text
- `data` date
- `valor_proposto` numeric
- `forma_pagamento` text CHECK ('a_vista','financiamento','parcelamento_direto','dacao_a_vista','dacao_financiamento','dacao_parcelamento_direto','parcelamento_direto_financiamento')
- `status` text CHECK ('em_andamento','aceita','recusada','desistiu')
- `observacao` text
- `created_at`, `updated_at` timestamptz

> NAO tem coluna `corretor`. Payload de salvarProposta() em registro.html NAO deve incluir esse campo.

#### `corretores`
- Gabriel Certeiro — CRECI 22249/SC
- Robson Souza — CRECI 36145/SC

### 4.3 Views

#### `dashboard_imoveis`
JOIN de funil_snapshot + exclusividades + imoveis. Campos calculados:
- `dias_restantes`, `tl_hoje_pct`, `status_repaginacao`, `data_meta_interna`
- `cpl_metaads`, `conv_lead_visita`, `conv_visita_prop`, `dash_status`
- `count_propostas` — COUNT real de propostas por imovel_id (adicionado Fase 1, no FINAL do SELECT)

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

### Layout
- **Mobile** (< 900px): bottom-nav fixa, coluna única, max-width 480px
- **Desktop** (>= 900px): sidebar lateral esquerda, grid 2 colunas à direita

### Regras críticas de código
1. **ZERO acentos dentro de `<script>`** — ASCII puro no JS
2. **Emojis como HTML entities** — ex: `&#128202;` para 📊
3. **`create_or_update_file` individualmente** para arquivos grandes (nao usar push_files)
4. **SHA obrigatório** ao atualizar arquivo existente

---

## 6. NAVEGAÇÃO

### Mobile (bottom-nav)
Alertas | Exclusividades | Registro (→ registro.html) | Analise | Mais (drawer)

### Desktop (sidebar)
Mesmos itens + Captação, Vendas, Marketing, Conteúdo, Financeiro (todos "Em breve")

### Bug pendente
Indicador ativo mobile sem destaque visual claro. Estilo nao definido ainda.

---

## 7. MÓDULOS DO index.html

### Views
- `vAlertas`, `vList`, `vDetail`, `vEdit`, `vAnalise`

### Funcoes principais (pos Fase 3)
- `loadDashboard()` — carrega view dashboard_imoveis + visitas + propostas
- `saveSnapshot()` — UPDATE funil_snapshot, recalcula data_fim
- `salvarNovaExcl()` — INSERT sequencial: imoveis → exclusividades → funil_snapshot
- `funilBarras(im)` — barras do funil. Visitas: visitasMap (real). Propostas: count_propostas (real). Midia: meta_investimento
- `excluirExclusividade()` + `_doExcluirExclusividade()` — DELETE funil_snapshot → exclusividades (NAO deleta imoveis)
- `disparosBaseHtml(im)` + `disparosParcHtml(im)` — renderiza paineis de disparos editaveis
- `salvarDisparosBase(exclId)` + `salvarDisparosParc(exclId)` — UPDATE funil_snapshot campos de disparo
- `toggleAcaoVenda(exclId, key, current)` — UPDATE booleano de acao de venda, re-renderiza secao
- `acoesVendaHtml(im)` — checkboxes editaveis para 8 acoes (cad_dwv, cad_site, cat_gabriel, cat_rafaela, video_youtube, post_instagram, post_tiktok, post_facebook)

---

## 8. MÓDULO registro.html

- Registrar visita e proposta
- `salvarImovelModal()` — cria imovel + exclusividade + funil_snapshot (apos Fase 3, o imóvel criado aqui aparece no dashboard)
- Payload de proposta NAO inclui campo `corretor`

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

## 11. TIMELINE OPERACIONAL

1. Assinatura | 2. Repaginacao | 3. Material/Gravacao | 4. Disparo base
5. Disparo parceiros | 6. Campanha no ar | 7. 1a visita | 8. 1a proposta
9. Meta interna | 10. Prazo autorizacao

---

## 12. ALERTAS (gerados dinamicamente)

Contrato vencendo <= 30d → CRITICO | Vencido → CRITICO | Meta interna ultrapassada → CRITICO
Campanha sem visita → ATENCAO | 3+ visitas sem proposta → ATENCAO | 30d sem gravacao → ATENCAO

---

## 13. HISTÓRICO DE FASES

### Fase 1 — concluída (07/04/2026)
- P1: payload de propostas corrigido (removido campo `corretor` inexistente)
- P9: funil de visitas usa visitasMap real (nao total_visitas manual)
- P6: campo meta_gastos_ads corrigido para meta_investimento + campo editavel no form
- P3: botao + funcao de exclusao de exclusividade implementados
- P10: view dashboard_imoveis atualizada com count_propostas real
- RLS: todas as tabelas liberadas para role authenticated

### Fase 3 — concluída (07/04/2026)
- Item 0: bug propostas nao aparecendo no painel de detalhe corrigido (chave imovel_id)
- Item 1: modal "+ Nova exclusividade" com INSERT sequencial imoveis→exclusividades→funil_snapshot
- Item 2: paineis de disparos base e parceiros editaveis com botao salvar
- Item 3: checkboxes de acoes de venda com auto-save no onChange
- Item 4: registro.html agora cria exclusividade + funil_snapshot junto com o imovel

---

## 14. PENDÊNCIAS ATIVAS

### Proxima — Fase 4: Midia planejada vs realizada
- [ ] Campo midia_total_planejada (verificar se ja existe ou criar nova coluna)
- [ ] Calculo proporcional: midia_esperada = total * (dias_passados / dias_total)
- [ ] Exibicao comparativa previsto x realizado no card de detalhe

### Fase 5 — Visual e UX
- [ ] Remover emojis, substituir por SVG inline
- [ ] Melhorar densidade de informacao
- [ ] Corrigir indicador ativo mobile (estilo a definir)
- [ ] Border-left colorida nos icards por dash_status

### Fase 6 — Cadastro de usuários (sessao separada, complexa)
- [ ] Reescrever via Edge Function com service_role
- [ ] Hoje usa sb.auth.signUp() que troca sessao ativa — nao funciona

---

## 15. CONTEXTO OPERACIONAL

- **Equipe:** Gabriel Certeiro (dono/corretor) + Robson Souza (corretor parceiro) + Rafaela (ops)
- **Foco:** imóveis R$630K–R$3M+ em Itajaí/SC
- **Stack:** GHL + WhatsApp API + n8n + Pipedrive + Supabase + Vercel

---

## 16. REGRA DE EDICAO DE ARQUIVOS

SEMPRE fazer `get_file_contents` antes de editar qualquer arquivo para:
1. Obter SHA atual (obrigatorio para update)
2. Verificar se index.html nao esta truncado (historico de problema com arquivo 126KB)
Nunca usar SHA de memoria — sempre buscar o atual antes de editar.
