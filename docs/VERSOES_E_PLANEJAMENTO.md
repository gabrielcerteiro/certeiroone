# Certeiro One — Versoes e Planejamento

---

## 1.0.0 — 06/04/2026

Base operacional. Construido do zero.

Adicionado:
- Dashboard com cards de exclusividades ativas
- Registro de visitas e propostas (removidas do Registro, que agora e so visitas e propostas)
- Relatorio para o vendedor (link publico compartilhavel)
- Autenticacao com Supabase Auth (email + senha)

---

## 1.1.0 — 07/04/2026

Primeira versao usada com dados reais.

Adicionado:
- RLS configurado em todas as tabelas
- Propostas salvando corretamente no banco
- Funil com dados reais: leads, visitas, propostas
- Modal de nova exclusividade
- Disparos para base e para parceiros (datas + quantidades)
- Checklist de acoes de venda (DWV, site, YouTube, Instagram, TikTok, Facebook)
- Midia planejada vs realizada com barra de comparacao
- Editar e excluir visitas e propostas
- Protecao contra duplo envio nos formularios

---

## 1.2.0 — 07/04/2026

Visual profissional.

Adicionado:
- Redesign visual estilo Pipedrive
- Fluxo de criacao unificado no Dashboard (sem paginas separadas)

## 1.2.1 — 07/04/2026

Correcao de bug no modulo Registro.

Corrigido:
- Painel de listagem de propostas no Registro nao exibia os registros
  (mesma causa do bug anterior de visitas — chave de lookup incorreta)
- Os dois problemas estao 100% resolvidos

---

## 1.3.0 — 08/04/2026

Reorganizacao do dashboard em grupos + limpeza do banco de dados.

Adicionado:
- Dashboard reorganizado em 4 grupos: Em Campanha / Em Repaginacao / Aguardando / Vendidas
- Grid de 3 colunas de fora a fora para exclusividades Em Campanha no desktop
- Barra de topo com contagem de exclusividades ativas
- Novos status operacionais: repaginacao e aguardando
- URL renomeada para certeiroone.vercel.app
- Repositorio renomeado para github.com/gabrielcerteiro/certeiroone

Banco de dados:
- Criados: Laguna 1202, Reserva Perequê 2101, Smart São João 506
- Deletados: Lago di Garda 1301 e registros de teste

## 1.3.1 — 12/04/2026

Reestruturacao completa da navegacao.

Adicionado:
- Sidebar lateral estilo Pipedrive via nav.js, compartilhada por todas as paginas
- Modulos separados em arquivos HTML proprios: exclusividades.html, vendas.html, usuarios.html
- Hash routing em exclusividades.html: #lista, #alertas, #detalhe/UUID, #editar/UUID
- Tabela vendas criada no Supabase com 37 campos + VGV calculado automaticamente
- Tabela parcelas_comissao criada
- 94 registros historicos de vendas inseridos no banco (V0261 a V0348)
- Skill de frontend-design instalado

Corrigido:
- Nav duplicada removida do registro.html
- Header superior removido de todas as paginas
- "Plataforma Operacional" removido da sidebar
- Bug leads_abertos: coluna estava faltando no banco, criada

---

## 1.4.0 — 13/04/2026

UX profissional. TMM correto. Layout global padronizado.

Pipeline header:
- Label "CERTEIRO ONE — PIPELINE" removida (nao acrescentava nada)
- Contadores integrados na barra: X ativas · X repag. · X aguar.
- TMM total das exclusividades ativas com barra de progresso colorida vs meta
- Meta TMM fixa: R$ 5.800.000/mes. Verde >= 100%, amarelo 70-99%, vermelho abaixo.
- Pipeline futuro: TMM de repaginando + aguardando exibido separado na barra (informativo)
- Botao "+ Nova exclusividade" integrado diretamente na barra

Grupos redesenhados. Nova ordem:
Em Campanha → Gestao → Repaginando → Aguardando → Vendidas (colapsado) → Perdidas (colapsado)

- Gestao: card completo igual ao Em Campanha + badge roxo + TMM com "(20%)"
- Repaginando: card resumido com data prevista de campanha e TMM individual
- Aguardando: card resumido com data de cadastro e TMM individual
- Perdidas: novo grupo colapsado, card minimalista com badge vermelho

Melhorias de interacao:
- Status clicavel direto no card via popover inline (sem abrir pagina de edicao)
- Indicador "Sem atualizacao ha Xd" exibido discretamente nos cards
- Prazo do contrato virou campo digitavel (antes era select fixo 120 ou 180 dias)
- Botao editar aparece em todos os status para master e operacional (antes estava bugado)

TMM corrigido:
- Formula: TMM = preco x (30 / dias por tipologia). Sem honorarios. Sem prazo interno.
- Dias por tipo: Repaginado = 40 / Mobiliado = 80 / Vazio = 120
- Gestao: TMM dividido por 5 pois Gabriel retém apenas 20%
- Exibido como numero completo com pontos de milhar (ex: R$ 1.162.500/mes, nunca abreviado)

CSS global via nav.js:
- Classes cn-form, cn-grid-2, cn-grid-3, cn-grid-4 disponiveis em todas as paginas
- Aplicadas nos formularios de edicao de todos os modulos

Modulo vendas.html:
- Mascara R$ em tempo real nos campos de valor
- Percentual de comissao calculado automaticamente: honorarios / contrato
- Select "Tipo da Venda" unifica tres campos: Venda Direta / Parceria / Gestao
- Campo competencia oculto do formulario (preenchido automaticamente igual a data da venda)
- Filtro "Formato da Venda" substituiu "Parceria: Sim/Nao"
- Numero de controle sugerido corretamente (ordenado por numero, nao por data de criacao)

Banco de dados (correcoes diretas):
- Colunas de leads por canal criadas no funil_snapshot
- Laguna 1202: preco corrigido de "1.750M" para "1.750.000"
- Tipos de imovel corrigidos: Casa Ressacada e Marechiaro = Mobiliado, Soho = Vazio
- Status normalizados: ativa, gestao, repaginando, aguardando, vendida, perdida
- Removidos: encerrada, inativa, renovada

---

## 1.5.0 — Planejamento

Alta prioridade:

Redesign da tela de detalhe e edicao de exclusividade.
A tela atual abre um formulario enorme que toma toda a tela, sem nenhum contexto ao lado.
O objetivo e construir um layout de dois paineis estilo Pipedrive: dados a esquerda em secoes
colapsaveis com edicao inline por secao, e timeline operacional + acoes de venda fixas a
direita. O usuario nunca sai da tela para editar — a edicao acontece no lugar.

Corrigir registro.html.
O modulo ainda le da tabela legada "perfis" e usa roles admin/editor que nao existem mais.
Alem disso, precisa de "Disparo de parceiros" como origem de visita (hoje so tem "Disparo de
base"), busca por nome do interessado e filtros por tipo, exclusividade, corretor e periodo.

Deploy das Edge Functions no Supabase.
A funcao "criar-usuario" precisa ser deployada com service_role para conseguir criar usuarios
no Supabase Auth e inserir na tabela usuarios. A funcao "excluir-usuario" ja existe mas precisa
ser verificada.

Anon Key para variavel de ambiente.
A chave esta exposta no HTML. Precisa ser movida para variavel de ambiente no Vercel antes de
tornar o repositorio privado.

Media prioridade:

Webhook Pipedrive → n8n → Supabase.
Quando um negocio for marcado como Won no Pipedrive, inserir automaticamente na tabela vendas
e notificar via WhatsApp.

Command palette Cmd+K.
Caixa de busca global que abre com atalho de teclado. Digita o nome da exclusividade, vai
direto para ela. Digita "nova", abre o modal. Igual ao Linear e ao Notion.

Favicon e logo na aba do browser.
Aguardando arquivo PNG da logo.

Controle de acesso por role no frontend.
Role padrao: so visualizacao. Role operacional: edicao sem acesso a usuarios. Master: tudo.

Repositorio privado.
Fazer apos mover a Anon Key para variavel de ambiente.

Backlog futuro:

Aba Analise para Rafaela. Nao iniciar sem briefing aprovado pelo Claudion.

Integracao automatica Meta Ads e Google Ads via n8n para eliminar preenchimento manual.

Modulo Financeiro com DRE via Conta Azul. Pre-requisito: Victoria configurar categorias v4.

Limpeza do banco: remover tabelas obsoletas perfis e corretores apos migrar registro.html.

URLs limpas via vercel.json + campo slug no banco.

---

*Atualizado em 13/04/2026*
