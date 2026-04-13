# Certeiro One — Historico de Versoes e Planejamento

---

## v1.0.0 — 06/04/2026 — Base operacional

Construido do zero. Primeira versao funcional.

Adicionado:
- Dashboard com cards de exclusividades ativas
- Registro de visitas e propostas
- Relatorio para o vendedor (link publico compartilhavel)
- Autenticacao com Supabase Auth (email + senha)

---

## v1.1.0 — 07/04/2026 — Operacao real

Primeira versao usada com dados reais.

Adicionado:
- RLS configurado em todas as tabelas (seguranca)
- Propostas salvando corretamente no banco
- Funil com dados reais: leads, visitas, propostas
- Modal de nova exclusividade
- Disparos para base e para parceiros (datas + quantidades)
- Checklist de acoes de venda (DWV, site, YouTube, Instagram, TikTok, Facebook)
- Midia planejada vs realizada com barra de comparacao
- Editar e excluir visitas e propostas
- Protecao contra duplo envio nos formularios

---

## v1.2.0 — 07/04/2026 — Visual profissional

Adicionado:
- Redesign visual estilo Pipedrive
- Fluxo de criacao unificado no Dashboard (sem paginas separadas)

### v1.2.1 — 07/04/2026 — Correcao de bug

Corrigido:
- Painel de listagem de propostas no Registro nao exibia os registros
  (mesma causa do bug anterior de visitas — chave de lookup incorreta)

---

## v1.3.0 — 08/04/2026 — Dashboard reorganizado

Adicionado:
- Dashboard reorganizado em 4 grupos: Em Campanha / Em Repaginacao / Aguardando / Vendidas
- Grid de 3 colunas no desktop para exclusividades Em Campanha
- Barra de topo com contagem de exclusividades ativas
- Novos status operacionais: repaginacao e aguardando
- URL renomeada para certeiroone.vercel.app
- Repositorio renomeado para github.com/gabrielcerteiro/certeiroone

Banco de dados:
- Criados: Laguna 1202, Reserva Perequê 2101, Smart São João 506
- Deletados: Lago di Garda 1301 e registros de teste

### v1.3.1 — 12/04/2026 — Reestruturacao de navegacao

Adicionado:
- Sidebar lateral estilo Pipedrive via nav.js (compartilhada por todas as paginas)
- Modulos em arquivos HTML separados: exclusividades.html, vendas.html, usuarios.html
- Hash routing em exclusividades.html: #lista, #alertas, #detalhe/UUID, #editar/UUID
- Tabela `vendas` criada no Supabase (37 campos + VGV calculado)
- Tabela `parcelas_comissao` criada
- 94 registros historicos de vendas inseridos no banco (V0261–V0348)
- Skill de frontend-design instalado em ~/.claude/skills/

Corrigido:
- Nav duplicada removida do registro.html
- Header superior (.hdr) removido de todas as paginas
- "Plataforma Operacional" removido da sidebar
- Bug leads_abertos: coluna criada no banco (estava faltando)

---

## v1.4.0 — 13/04/2026 — UX profissional

### Pipeline header
- Label "CERTEIRO ONE — PIPELINE" removida (nao acrescentava nada)
- Contadores integrados na barra: X ativas · X repag. · X aguar.
- TMM total das exclusividades ativas com barra de progresso vs meta
- Meta TMM fixa: R$ 5.800.000/mes (hardcoded)
- Pipeline futuro: TMM de repaginando + aguardando exibido separado na barra
- Botao "+ Nova exclusividade" integrado na barra (nao mais flutuante abaixo)

### Grupos redesenhados
Nova ordem: Em Campanha → Gestao → Repaginando → Aguardando → Vendidas → Perdidas

- Gestao: card completo igual ao Em Campanha + badge roxo + TMM com "(20%)"
- Repaginando: card resumido com data prevista de campanha e TMM individual
- Aguardando: card resumido com data de cadastro e TMM individual
- Perdidas: novo grupo colapsado com card minimalista (badge vermelho)
- Status normalizados no banco: ativa, gestao, repaginando, aguardando, vendida, perdida
- Removidos do banco e da interface: encerrada, inativa, renovada

### Melhorias de interacao
- Status clicavel direto no card: popover inline sem precisar abrir edicao
- Indicador "Sem atualizacao ha Xd" nos cards (campo atualizado_em)
- Prazo do contrato: input digitavel qualquer numero (antes era select 120/180)
- Botao editar em TODOS os status para roles master e operacional (antes bugado)

### TMM corrigido
- Formula: TMM = preco x (30 / dias_tipologia). Sem honorarios. Sem prazo_interno.
- Dias: Repaginado = 40 / Mobiliado = 80 / Vazio = 120
- Gestao: TMM dividido por 5 (Gabriel retém 20%)
- Formatacao: numero completo com pontos de milhar (ex: R$ 1.162.500/mes, nunca R$ 1,2M)
- Validacao: Soho Vazio R$2,2M → R$550.000/mes | Casa Mobiliado R$3,1M → R$1.162.500/mes

### CSS global
- Classes cn-form, cn-grid-2, cn-grid-3, cn-grid-4, cn-full adicionadas ao nav.js
- Disponıveis em todas as paginas automaticamente
- Aplicadas nos formularios de edicao: exclusividades, registro, usuarios, vendas

### Modulo vendas.html
- Mascara R$ em tempo real nos campos valor contrato e honorarios
- Percentual de comissao calculado automaticamente (honorarios / contrato)
- Select "Tipo da Venda" substituindo campos separados is_parceria + tipo_participacao:
  Venda Direta | Venda com Parceria | Venda Gestao
- Campo competencia oculto do formulario (preenchido automaticamente = data_venda)
- Filtro "Formato da Venda": Direta / Parceria / Gestao
- Numero de controle sugerido corretamente (ordenado por numero_controle, nao created_at)

Banco de dados (Claudion direto):
- Colunas de leads por canal criadas no funil_snapshot (leads_meta_ads, leads_google_ads, etc.)
- Laguna 1202: preco corrigido de "1.750M" para "1.750.000" (formato invalido causava TMM errado)
- Tipos de imovel corrigidos: Casa Ressacada e Marechiaro = Mobiliado, Soho = Vazio

---

## v1.5.0 — Planejamento

### Alta prioridade

**Redesign tela detalhe/edicao de exclusividade** (issue #1)
A tela atual abre formulario gigante full-page. Perda total de contexto ao editar.
Construir layout dois paineis estilo Pipedrive:
- Esquerda: dados em secoes colapsaveis com edicao inline por secao (nao sair da tela)
- Direita: timeline operacional + acoes de venda sempre visiveis
- TMM individual destacado no painel direito
- Campos com largura proporcional ao conteudo (nao mais full-width)

**Corrigir registro.html**
- Ainda le da tabela legada `perfis` — migrar para `usuarios`
- Roles ainda usam admin/editor — trocar para master/operacional/padrao
- Adicionar "Disparo de parceiros" como origem de visita (hoje so existe "Disparo de base")
- Busca por nome do interessado
- Filtros por: tipo (visita/proposta), exclusividade, corretor, periodo

**Deploy das Edge Functions** (issue #3)
- `criar-usuario`: cria usuario no Supabase Auth + insere em `usuarios` com service_role
- Verificar se `excluir-usuario` esta deployada corretamente

**Anon Key para variavel de ambiente** (issue #2)
- Mover para Vercel Environment Variables
- Fazer antes de tornar o repositorio privado

### Media prioridade

**Webhook Pipedrive → n8n → Supabase** (issue #4)
- Deal Won no Pipedrive → INSERT automatico em `vendas` + notificacao WhatsApp

**Command palette Cmd+K** (issue #5)
- Busca global: exclusividades, registros, acoes
- Navegar com setas, confirmar com Enter, fechar com Esc

**Favicon e logo na aba do browser**
- Aguardando arquivo PNG da logo para gerar favicon

**Controle de acesso por role no frontend**
- Role padrao: so visualizacao
- Role operacional: edicao operacional, sem acesso a usuarios
- Role master: acesso total

**Repositorio privado** (issue #6)
- Fazer apos mover Anon Key para variavel de ambiente

### Backlog futuro

**Aba Analise para Rafaela** (issue #7)
- Nao iniciar sem briefing completo aprovado pelo Claudion

**Integracao automatica Meta Ads e Google Ads via n8n**
- Puxar gastos, alcance e leads automaticamente para o funil_snapshot
- Eliminar preenchimento manual dos campos de midia

**Modulo Financeiro — DRE** (issue #8)
- Pre-requisito: Victoria configurar categorias v4 no Conta Azul

**Limpeza do banco**
- Remover tabelas obsoletas `perfis` e `corretores` apos migrar registro.html

**URLs limpas**
- /exclusividades/26 via vercel.json rewrites + campo slug no banco

---

## Regras de versionamento

- v1.X.0 — entrega de funcionalidades novas
- v1.X.Y — correcao de bugs em versao existente
- Toda versao atualiza CONTEXTO_CLAUDE_CODE.md e este arquivo no mesmo commit

---

*Atualizado em 13/04/2026 — Claudion*
