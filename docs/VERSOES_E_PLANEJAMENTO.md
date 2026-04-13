# Certeiro One — Historico de Versoes e Planejamento

---

## v1.0.0 — 06/04/2026
Pipeline inicial funcionando.
- Dashboard com cards de exclusividades
- Registro de visitas e propostas
- Relatorio vendedor (link publico)
- Autenticacao com Supabase Auth

---

## v1.1.0 — 07/04/2026
Operacao real comecando.
- RLS configurado em todas as tabelas
- Propostas salvando corretamente
- Funil com dados reais (leads, visitas, propostas)
- Nova exclusividade via modal
- Disparos de base e parceiros
- Acoes de venda (checklist)
- Midia planejada vs realizada
- Editar e excluir visitas e propostas
- Protecao contra duplo envio

---

## v1.2.0 — 07/04/2026
Visual profissional.
- Visual estilo Pipedrive
- Fluxo de criacao unificado no Dashboard

### v1.2.1 — 07/04/2026
- Corrigido: painel de propostas no Registro nao exibia registros

---

## v1.3.0 — 08/04/2026
Dashboard reorganizado.
- Dashboard em 4 grupos: Em Campanha, Em Repaginacao, Aguardando, Vendidas
- Grid 3 colunas no desktop
- Barra de topo simplificada
- Novos status: repaginacao e aguardando
- URL: certeiroone.vercel.app
- Repo: github.com/gabrielcerteiro/certeiroone
- Banco: imóveis criados e limpos

### v1.3.1 — 12/04/2026
Reestruturacao de navegacao.
- Sidebar lateral estilo Pipedrive via nav.js
- Modulos em HTMLs separados (exclusividades, vendas, usuarios)
- Hash routing em exclusividades.html (#lista, #alertas, #detalhe/UUID, #editar/UUID)
- Nav duplicada e header superior removidos
- "Plataforma Operacional" removido da sidebar
- Tabelas vendas e parcelas_comissao criadas no Supabase
- 94 registros historicos de vendas inseridos (V0261–V0354)
- Bug leads_abertos corrigido no banco
- Skill frontend-design instalado em ~/.claude/skills/

---

## v1.4.0 — 13/04/2026
UX profissional e TMM correto.

### Pipeline
- Header redesenhado: contadores (ativas/repag/aguar) + TMM + meta fixa R$ 5,8M + pipeline futuro
- Barra de progresso TMM: verde >= 100%, amarelo 70-99%, vermelho < 70%
- Pipeline futuro: TMM de repaginando + aguardando exibido separado
- Botao "+ Nova exclusividade" integrado na barra (nao mais flutuante)

### Grupos
- Nova ordem: Em Campanha → Gestao → Repaginando → Aguardando → Vendidas → Perdidas
- Status 'gestao': card completo com badge roxo e TMM com "(20%)"
- Status 'repaginando': card resumido com data prevista de campanha
- Status 'aguardando': card resumido com data de cadastro
- Status 'perdida': card minimalista colapsado (novo renderCardPerdida)
- TMM individual exibido nos cards Repaginando e Aguardando

### UX
- Status clicavel direto no card — popover inline sem abrir edicao
- Indicador "Sem atualizacao ha Xd" nos cards (baseado em atualizado_em)
- Prazo do contrato: input digitavel (nao mais select 120/180)
- Botao editar aparece em TODOS os status para master/operacional

### TMM
- Formula corrigida: TMM = preco x (30 / dias_tipo) — SEM honorarios
- Dias por tipo: Repaginado=40, Mobiliado=80, Vazio=120
- Funcao diasTMM separada de prazoMesesIm (que era usada erroneamente)
- Formatacao: numero completo com pontos de milhar (sem M/K)

### CSS global
- Classes cn-form, cn-grid-2/3/4, cn-full adicionadas ao nav.js
- Aplicadas em todos os formularios de edicao

### vendas.html
- Mascara R$ em tempo real nos campos de valor
- % Comissao calculada automaticamente (honorarios/contrato)
- Select "Tipo da Venda" substituindo is_parceria + tipo_participacao
- Campo competencia oculto (preenchido automaticamente = data_venda)
- Filtro "Formato da Venda": Direta / Parceria / Gestao
- sugerirNumeroControle ordenando por numero_controle DESC (nao created_at)

### Banco (Claudion direto)
- Status normalizados: ativa, gestao, repaginando, aguardando, vendida, perdida
- Removidos: encerrada, inativa, renovada
- Colunas de leads por canal criadas no funil_snapshot
- Laguna 1202: preco corrigido de "1.750M" para "1.750.000"
- Tipos de imovel corrigidos no banco

---

## v1.5.0 — Planejamento

### Alta prioridade

#### Redesign tela detalhe/edicao de exclusividade
A tela atual abre formulario gigante full-page sem contexto.
Construir layout dois paineis:
- Esquerda: dados em secoes colapsaveis com edicao inline por secao
- Direita: timeline operacional + acoes de venda (sempre visiveis)
- TMM individual destacado no painel direito
- Nao sair da tela para editar — edicao acontece inline
Ver issue #1 no GitHub.

#### Corrigir registro.html
- Ainda le da tabela `perfis` (legado) — migrar para `usuarios`
- Roles ainda usam admin/editor — trocar para master/operacional/padrao
- Adicionar "Disparo de parceiros" como origem de visita (hoje so existe "Disparo de base")

#### Deploy das Edge Functions
- `criar-usuario`: cria usuario no Supabase Auth + insere em `usuarios` com service_role
- `excluir-usuario`: ja existe, verificar se esta deployada corretamente
Ver issue #3 no GitHub.

#### Busca e filtros no registro.html
- Busca por nome do interessado
- Filtros por: tipo (visita/proposta), exclusividade, corretor, periodo

#### Anon Key para variavel de ambiente
- Mover para Vercel Environment Variables antes de tornar repo privado
Ver issue #2 no GitHub.

### Media prioridade

#### Webhook Pipedrive → n8n → Supabase
- Deal Won no Pipedrive → INSERT automatico em `vendas`
- Notificacao via WhatsApp
Ver issue #4 no GitHub.

#### Command palette Cmd+K
- Busca global: exclusividades, registros, acoes
- Navegar com setas, confirmar com Enter, fechar com Esc
Ver issue #5 no GitHub.

#### Favicon e logo na aba do browser
- Aguardando arquivo PNG da logo para gerar favicon

#### Controle de acesso por role no frontend
- Role 'padrao': apenas visualizacao (sem botoes Atualizar/Editar)
- Role 'operacional': edicao de dados operacionais, sem usuarios
- Role 'master': acesso total

#### Repositorio privado
- Fazer apos mover Anon Key para variavel de ambiente
Ver issue #6 no GitHub.

### Ideias futuras (backlog)

#### Aba Analise para Rafaela
- Tabela de disparos consolidados por exclusividade
- Funil de conversao por canal
- Nao iniciar sem briefing completo aprovado pelo Claudion
Ver issue #7 no GitHub.

#### Integracao Meta Ads e Google Ads via n8n
- Puxar gastos, alcance e leads automaticamente para o funil_snapshot
- Eliminar preenchimento manual dos campos de midia

#### Modulo Financeiro — DRE simplificado
- Integracao com Conta Azul API
- Pre-requisito: Victoria configurar categorias v4
- Acesso restrito: apenas role master
Ver issue #8 no GitHub.

#### Tabelas obsoletas
- Remover tabelas `perfis` e `corretores` apos migrar registro.html

#### URLs limpas
- /exclusividades/26 via vercel.json rewrites + campo slug no banco

---

## Regras de versionamento

- v1.X.0 = entrega de conjunto de funcionalidades
- v1.X.Y = correcao de bugs em versao existente
- Toda versao entregue deve atualizar CONTEXTO_CLAUDE_CODE.md e este arquivo
- Versao e commitada junto com o codigo, nao separada

---

*Atualizado em 13/04/2026 — Claudion*
