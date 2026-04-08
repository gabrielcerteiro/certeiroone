# CERTEIRO ONE — CONTEXTO ESTRATÉGICO
> Documento para iniciar novas conversas no Claude.ai (Claudion).
> Serve como base para planejar melhorias, novas funcionalidades e decisões estratégicas.
> Atualizado em: 08/04/2026 — v1.3.0, repo certeiroone

---

## 1. O NEGÓCIO

**Gabriel Certeiro Imóveis** é uma corretagem boutique de alto padrão em Itajaí/SC.
CRECI 22.249/SC. Foco exclusivo em imóveis residenciais prontos de 3 e 4 suítes
nos bairros Fazenda e Praia Brava.

### Modelo econômico
- Ticket médio: R$ 2M–2,5M (Fazenda) / R$ 3M+ (Praia Brava)
- Comissão: 6% inegociável (exceção: construtoras, 5%)
- Meta 2026: R$ 100M em VGV → ~R$ 5M receita bruta → ~R$ 3,5M lucro líquido
- ~20% das vendas em parceria (comissão 50/50)
- ~80–90% dos negócios envolvem permuta

### O que diferencia
Gabriel não opera como imobiliária. Opera como **projeto por imóvel**:
cada exclusividade recebe Repaginação Certeiro (R$ 70K–400K de capital próprio),
vídeo Certeiro Apresenta (10–15 min no YouTube para pré-qualificação),
tráfego pago dedicado, e Gabriel conduz ~90% das visitas pessoalmente.

**Resultado histórico:** saiu de imobiliária com 25 corretores (R$ 50M VGV, 20% margem)
para operação solo com retaguarda (R$ 80M VGV, 60% margem, 5x mais lucro).

**O insight central:** o valor do negócio está na capacidade de gerar demanda,
não em ter corretores. Escala sem escalar corretores.

---

## 2. POR QUE O CERTEIRO ONE EXISTE

### O problema que resolve
Gabriel opera um negócio de R$ 80M+ sem **nenhuma visibilidade de dados em tempo real**:
- Sem DRE há 2 anos
- Sem dashboard de exclusividades ativas
- Sem registro estruturado de visitas e propostas
- Contexto vive na cabeça de Gabriel — se ele para, a operação para

**O Certeiro One é a solução para esse problema.**
É o ERP operacional da corretagem — o lugar onde toda a operação de
exclusividades é registrada, acompanhada e analisada.

### O que o sistema faz hoje (v1.3.0)
1. **Pipeline em 4 grupos** — Em Campanha / Em Repaginação / Aguardando / Vendidas
2. **Funil de barras** — leads, visitas e propostas realizados vs. esperados (proporcional ao tempo)
3. **Timeline operacional** — marcos de cada exclusividade
4. **Registro de visitas** — com objeções, intenção, qualificação, editar e excluir
5. **Registro de propostas** — valor, forma de pagamento, status, editar e excluir
6. **Controle de mídia** — gasto realizado vs. planejado proporcional ao tempo
7. **Disparos para base e parceiros** — registro e acompanhamento
8. **Ações de venda** — checklist por exclusividade
9. **Relatório do vendedor** — link compartilhável com o proprietário
10. **Alertas automáticos** — contratos vencendo, metas atrasadas, anomalias

### O que o sistema NAO faz ainda
- Módulo Financeiro (DRE, custos, margem por exclusividade)
- Módulo Análise (conversão consolidada por canal)
- Módulo Vendas (tracking de VGV fechado e comissões recebidas)
- Integração com Pipedrive (fonte real de leads)

---

## 3. VISÃO DE LONGO PRAZO

O Certeiro One não é só um dashboard. É a **infraestrutura de dados** que vai
permitir Gabriel escalar sem perder controle.

### Ecossistema estratégico (por ordem de prioridade)
1. **Gabriel Certeiro Corretor** (ativo) — financia tudo. Meta R$ 100M VGV 2026.
2. **Certeiro Construtora** (iniciando) — Angélica lidera. 1º projeto ~R$ 4M.
3. **Certeiro Capital** (pausado) — estruturação de negócios imobiliários.
4. **Certeiro Real Estate** (futuro 2028–29) — internacionalização, Flórida, visto EB-1.

---

## 4. A EQUIPE QUE USA O SISTEMA

| Pessoa | Papel | Uso do sistema |
|--------|-------|----------------|
| **Gabriel Certeiro** | Closer, estratégia | Valida tudo. Vê alertas e pipeline. |
| **Rafaela** | Ops/CRM, pré-vendas | Registra visitas, propostas, alimenta funil |
| **Gabriel Marketing** | Execução técnica | Mantém o sistema, executa melhorias |
| **Robson Souza** | Corretor parceiro | Registra suas visitas |

---

## 5. ESTADO ATUAL DA PLATAFORMA — versão 1.3.0 (08/04/2026)

### O que está funcionando
- Dashboard em 4 grupos: Em Campanha / Em Repaginação / Aguardando / Vendidas
- Grid 3 colunas para exclusividades Em Campanha
- Pipeline de exclusividades com funil de barras (dados reais)
- Alertas automáticos (6 regras) + Timeline operacional
- Modal de nova exclusividade com status inicial
- Registro de visitas e propostas (cadastrar, editar, excluir)
- Disparos para base e parceiros + Checkboxes de ações de venda
- Controle de mídia planejada vs. realizada
- Relatório do vendedor (link público por imóvel)
- Visual profissional estilo Pipedrive + PWA instalável no iOS

### O que NAO funciona ainda
- Cadastro de novos usuários (bug técnico — Edge Function pendente)
- Módulos em breve: Análise, Captação, Vendas, Marketing, Conteúdo, Financeiro

---

## 6. BACKLOG — v1.3.1

### Alta prioridade
- [ ] Botao excluir no formulario de edicao (vEdit)
- [ ] Campo status inicial no modal de nova exclusividade
- [ ] Aba Analise: tabela de disparos para a Rafaela
- [ ] Cadastro de usuarios via Edge Function (service_role)
- [ ] Anon Key exposta no repositorio — mover para variavel de ambiente
- [ ] Controle de acesso por role no frontend

### Media prioridade
- [ ] Repositorio privado no GitHub
- [ ] Branches para desenvolvimento
- [ ] Logs de auditoria + Backup automatizado documentado

### Futuro
- [ ] Modulo Analise, Vendas, Financeiro
- [ ] BI consolidado (Lovable + n8n + Supabase)
- [ ] Integracao com Controlle (financeiro)

---

## 7. TENSÕES ESTRATÉGICAS ATIVAS

1. **Fazenda vs. Praia Brava** — focar 100% no Fazenda ou manter os dois?
2. **Modelo atual vs. próximo nível** — corretagem (6%) vs. estruturação/incorporação.
3. **Centralização vs. autonomia** — tudo depende de Gabriel.
4. **Carteira inexplorada** — ~100 clientes pós-venda com zero follow-up.
5. **Pré-vendas** — Rafaela testando SDR. Sem script formal ainda.
6. **Financeiro cego** — sem DRE há 2 anos.

---

## 8. REFERÊNCIA TÉCNICA RÁPIDA

**URL:** https://certeiroone.vercel.app
**Repo:** github.com/gabrielcerteiro/certeiroone
**Stack:** HTML/CSS/JS puro + Supabase + Vercel
**Deploy:** automático ao fazer push no branch main

**Arquivos principais:**
- `index.html` — dashboard principal
- `registro.html` — visitas e propostas
- `vendedor.html` — relatório público
- `CONTEXTO_CLAUDE_CODE.md` — contexto técnico para Claude Code
- `CLAUDION_BRIEFING.md` — briefing para novas sessões
- `GUIA_GABRIEL_MARKETING.md` — guia operacional

---

## 9. PRINCÍPIOS DE DESENVOLVIMENTO

- **Nada exige entrada manual** — dados fluem automaticamente do Supabase
- **Gabriel fora do sistema** — o sistema existe para liberar Gabriel para vender
- **Simples > sofisticado** — otimização antes de inovação
- **Dados reais > campos manuais**
- **Mobile first** — Rafaela e Robson usam no celular no campo

---

## 10. COMO USAR ESTE DOCUMENTO

Cole no início de qualquer nova conversa no Claude.ai:

```
Sou Gabriel Certeiro. Leia o arquivo CERTEIRO_ONE_CONTEXTO_ESTRATEGICO.md
no repositório github.com/gabrielcerteiro/certeiroone
para entender o negócio e o estado atual da plataforma Certeiro One
antes de começarmos a planejar melhorias.
```
