# CONTEXTO COMPLETO — PLATAFORMA CERTEIRO
> Arquivo para onboarding de nova sessão no Claude Code.
> Gerado em: 04/04/2026

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
| `index.html` | Dashboard interno principal — lista de exclusividades, detalhe, edição |
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

### 4.1 Tabelas

#### `imoveis` (12 rows)
Cadastro base dos imóveis.
- `id` uuid PK
- `nome` text
- `proprietario` text
- `bairro` text
- `status` text
- `preco` text
- `ativo` boolean (default true)
- `created_at` timestamptz

#### `exclusividades` (5 rows)
Contrato de exclusividade por imóvel.
- `id` uuid PK
- `imovel_id` uuid FK → imoveis.id
- `data_inicio` date
- `dias_contrato` int (default 120)
- `status` text CHECK ('ativa','encerrada','renovada')
- `observacoes` text
- `created_at`, `updated_at` timestamptz

#### `funil_snapshot` (5 rows)
Dados operacionais atualizados manualmente ou via n8n/Pipedrive.
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
- `meta_investimento` numeric (default 1500)
- `meta_cpl` numeric (default 65)
- `total_leads`, `total_visitas`, `total_propostas` int
- `leads_abertos`, `leads_perdidos` int
- `leads_meta_ads`, `leads_google_ads`, `leads_instagram_org`, `leads_youtube`, `leads_tiktok`, `leads_site_org`, `leads_indicacao`, `leads_corretor_parc`, `leads_relacionamento`, `leads_disparo_base`, `leads_oferta_ativa`, `leads_outdoor` int
- `gastos_metaads` numeric
- `alcance_metaads` int
- `frequencia_metaads` numeric
- `localizacao` text
- `tipo_imovel` text
- `atualizado_em` timestamptz
- `fonte` text (default 'pipedrive_n8n')

#### `visitas` (5 rows)
Visitas registradas por imóvel.
- `id` uuid PK
- `imovel_id` uuid FK → imoveis.id
- `imovel_nome` text (campo de conveniência)
- `data_visita` date
- `hora_visita` time
- `corretor` text
- `parceiro` text
- `origem` text
- `nome_interessado` text
- `objections` text[] (array)
- `observacoes` text
- `intencao` text (valores: 'Quer comprar', 'Esta pensando', 'Nao gostou', 'Quer segunda visita')
- `qualificado_financeiramente` boolean
- `formas_pagamento` text[] (array)
- `pagto_detalhes` text
- `created_at` timestamptz

#### `propostas` (3 rows)
Propostas de compra registradas.
- `id` uuid PK
- `imovel_id` uuid FK → imoveis.id
- `nome_interessado` text
- `data` date
- `valor_proposto` numeric
- `forma_pagamento` text CHECK ('a_vista','financiamento','parcelamento_direto','dacao_a_vista','dacao_financiamento','dacao_parcelamento_direto','parcelamento_direto_financiamento')
- `status` text CHECK ('em_andamento','aceita','recusada','desistiu')
- `observacao` text
- `created_at`, `updated_at` timestamptz

#### `corretores` (2 rows)
- `id` uuid PK
- `nome` text
- `creci` text
- `tipo` text CHECK ('pessoa_fisica','pessoa_juridica')
- `ativo` boolean
- `foto_url` text
- `created_at` timestamptz

**Corretores cadastrados:**
- Gabriel Certeiro — id: `8dcc5e44-...` — CRECI 22249/SC
- Robson Souza — id: `0e5d9faf-...` — CRECI 36145/SC

**Fotos (Storage bucket `corretores`, público):**
- `https://vtykzralkxlbqqkleofl.supabase.co/storage/v1/object/public/corretores/Foto%20Gabriel%20Certeiro.jpeg`
- `https://vtykzralkxlbqqkleofl.supabase.co/storage/v1/object/public/corretores/Foto%20Robson%20Souza.jpg`

### 4.2 Views

#### `dashboard_imoveis`
View principal usada pelo `index.html`. Faz JOIN de `funil_snapshot` + `exclusividades` + `imoveis`. Retorna todos os campos operacionais + campos calculados:
- `dias_restantes` — dias até data_fim
- `tl_hoje_pct` — % do contrato consumido
- `status_repaginacao` — ('nao_se_aplica','pendente','ok','atrasado')
- `data_meta_interna` — data_midia_entregue + prazo_interno_dias
- `cpl_metaads` — gastos_metaads / leads_meta_ads
- `conv_lead_visita`, `conv_visita_prop` — taxas de conversão
- `dash_status` — ('ok','melhoria','atencao','vendida','perdida','encerrada')

#### `dashboard_visitas_detalhe`
View de visitas com JOIN em exclusividades para retornar `exclusividade_id`.

---

## 5. ARQUITETURA DO FRONTEND

### Stack
- HTML/CSS/JS puro — zero frameworks
- Supabase JS SDK v2 via CDN
- Font: Nunito Sans (Google Fonts)
- Sem build step — arquivos estáticos diretos

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
- **Mobile** (< 900px): nav fixa na parte inferior (`bottom-nav`), conteúdo em coluna única, `max-width: 480px` centralizado
- **Desktop** (≥ 900px): sidebar lateral esquerda (`bottom-nav` vira sidebar), conteúdo à direita em grid 2 colunas

### Regras críticas de código
1. **ZERO acentos dentro de `<script>`** — usar apenas ASCII puro no JS
2. **Emojis como HTML entities** — ex: `&#128202;` para 📊
3. **`create_or_update_file` individualmente** para cada arquivo (não usar `push_files` para arquivos grandes — pode truncar)
4. **SHA obrigatório** ao atualizar arquivo existente no GitHub

---

## 6. NAVEGAÇÃO

### Mobile (bottom-nav — 5 botões)
| Botão | data-tab | Ação |
|-------|----------|------|
| ⚡ Alertas | alertas | switchTab('alertas') |
| 🏠 Exclusividades | excl | switchTab('excl') |
| 📋 Registro | registro | window.location → registro.html |
| 📊 Análise | analise | switchTab('analise') |
| ⋯ Mais | mais | abrirMais() → drawer |

### Desktop (sidebar)
- Mesma estrutura, sem o botão "Mais" (oculto com `display:none`)
- Item "Registro" redireciona para `registro.html`
- Extras: Captação, Vendas, Marketing, Conteúdo (todos "Em breve")

### Estado ativo — CSS atual

**Desktop:** item ativo recebe `background: var(--navy)`, ícone e label em branco (`color: #fff`, `opacity: 1`). Inativos com `opacity: 0.4`.

**Mobile — BUG PENDENTE:** o item ativo no mobile só tem `opacity: 1` vs `opacity: 0.35` nos inativos. Não há indicador visual claro de qual aba está selecionada (exceto o botão "Registro" que sempre tem fundo navy por CSS fixo).

**Fix necessário no `.bottom-nav` (fora do `@media(min-width:900px)`):** adicionar indicador ativo visível. Gabriel ainda não escolheu o estilo (a sessão foi encerrada antes).

Opções para escolher:
- Ponto navy embaixo do ícone
- Linha navy em cima do botão (estilo iOS tab bar)
- Ícone + label em navy bold (sem fundo)
- Fundo navy suave

---

## 7. MÓDULOS DO index.html

### Views (mostradas/ocultadas com classe `on`)
- `vAlertas` — alertas críticos e de atenção por exclusividade
- `vList` — lista de cards de exclusividades + VGV
- `vDetail` — detalhe completo de uma exclusividade
- `vEdit` — formulário de edição (atualiza `funil_snapshot`)
- `vAnalise` — placeholder "Em construção"

### Componentes principais
- **VGV card (navy):** total de portfólio + barra de meta (R$100M) + 3 categorias (≤1M / 1-3M / >3M)
- **Stats row:** Total, Em Venda, Com Proposta
- **icard:** card de exclusividade com funil de barras (Tempo/Leads/Visitas/Propostas + Ads/CPL)
- **Detail grid:** 2 colunas desktop, coluna única mobile — Funil, Timeline, Ações de Venda, Meta Ads, Conversões, Corretores, Canais, Disparos Base, Disparos Parceiros, Intenção, Objeções, Relatório de Visitas, Propostas
- **Edit form:** seções Exclusividade, Linha do Tempo, Funil, Origem de Leads, Meta Ads

### Função de save
`saveSnapshot()` — faz UPDATE em `funil_snapshot` via Supabase, recalcula `data_fim` automaticamente a partir de `data_inicio + prazo_contrato_dias`.

---

## 8. MÓDULO registro.html

Arquivo separado (`registro.html`). Permite:
- Registrar nova visita (form completo com todos os campos da tabela `visitas`)
- Registrar nova proposta
- Listar visitas e propostas recentes

---

## 9. MÓDULO vendedor.html

Relatório público para proprietário. Acesso por URL com `?id=<exclusividade_id>&from=internal`. Spec completa em `SPEC_VENDEDOR.md`.

---

## 10. FUNIL — LÓGICA DE BARRAS

Cada barra mostra: realizado vs. esperado proporcional ao tempo do contrato.

```
fator = diasPassados / diasTotal
esperado = Math.round(meta * fator)
```

Cores: verde se realizado ≥ esperado, amarelo se ≥ 80%, vermelho se < 80%.
Linha vertical no ponto "esperado". Fundo suave na área da meta.

---

## 11. TIMELINE OPERACIONAL (marcos)

Sequência de marcos por exclusividade:
1. Assinatura do contrato
2. Repaginação concluída (opcional)
3. Material pronto / Gravação
4. Disparo para base
5. Disparo para parceiros
6. Campanha no ar
7. Primeira visita
8. Primeira proposta
9. Prazo final meta (data_midia_entregue + prazo_interno_dias)
10. Prazo final autorização (data_fim)

---

## 12. ALERTAS (aba Alertas)

Gerados dinamicamente ao carregar:
- Contrato vencendo em ≤ 30 dias → CRÍTICO
- Contrato vencido → CRÍTICO
- Meta interna ultrapassada → CRÍTICO
- Campanha no ar sem visita → ATENÇÃO
- 3+ visitas sem proposta → ATENÇÃO
- 30+ dias sem gravação após assinatura → ATENÇÃO

Badge vermelho no botão Alertas mostra contagem de críticos.

---

## 13. PRÓXIMOS PASSOS / PENDÊNCIAS

### Bug ativo
- [ ] **Indicador ativo mobile**: item selecionado no `bottom-nav` não tem destaque visual claro. Precisa adicionar CSS de estado ativo fora do `@media(min-width:900px)`. Gabriel ainda não escolheu o estilo visual.

### Funcionalidades planejadas
- [ ] Módulo Análise (view consolidada de visitas + propostas + conversões)
- [ ] Módulo Captação (em breve)
- [ ] Módulo Vendas (em breve)
- [ ] Módulo Marketing (em breve)
- [ ] Módulo Conteúdo (em breve)
- [ ] Campos extras no funil_snapshot: disparos base, parceiros, campos de checklist de ações de venda, campos de campanha Meta Ads avançados, campos de conversão manual

---

## 14. CONTEXTO OPERACIONAL

- **Equipe:** Gabriel Certeiro (dono/corretor, CRECI 22249/SC) + Robson Souza (corretor parceiro, CRECI 36145/SC) + Rafaela (ops/CRM)
- **Foco:** imóveis residenciais R$630K – R$3M+ em Itajaí/Balneário Camboriú/SC
- **Stack adicional:** GoHighLevel (GHL) + WhatsApp Business API oficial + n8n (automações) + Pipedrive (CRM fonte dos dados de funil)
- **Princípio de design dos agentes:** "à prova de coisa genérica" — impossível usar sem preencher contexto

---

## 15. SHA DOS ARQUIVOS ATUAIS (para updates via GitHub API)

> Verificar SHAs atualizados antes de editar — podem mudar a cada commit.

| Arquivo | SHA atual |
|---------|-----------|
| `index.html` | `aeb27776449c25156c3c2fbed1ed693d6dbc9665` |
| `registro.html` | `afcab9ad240ee82231830f678f3a6d476374716f` |
| `vendedor.html` | `320488c03442a143d9d10abe26bcfc8fc221d3f2` |
| `SPEC_VENDEDOR.md` | `1ff78c041388f39cc52cb3fabcd2d5cdd087eb4b` |

> **ATENÇÃO:** O `index.html` pode estar com conteúdo truncado no último commit (erro de `create_or_update_file` com arquivo grande). Sempre fazer `get_file_contents` antes de editar para verificar se o arquivo está íntegro.
