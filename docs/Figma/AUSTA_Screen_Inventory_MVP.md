# AUSTA SuperApp — Inventário Completo de Telas + Classificação MVP
# Extraído via Figma API em 20/02/2026
# File Key: OcG9oRNdUEskvAPUcKiKMe
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## RESUMO EXECUTIVO

| Métrica | Valor |
|---------|-------|
| Total de telas (Light Mode) | ~230 |
| Total de telas (Dark Mode) | ~20 grupos |
| Módulos funcionais | 19 |
| Componentes do Design System | 21 categorias |
| Foundations (tokens) | 8 categorias |
| Classificação MVP | 9 módulos (Must Have) |
| Classificação pós-launch | 10 módulos (Should/Could) |

---

## DESIGN SYSTEM — Foundations (Tokens)

### Categorias de Tokens identificadas:
| # | Categoria | Node ID | Conteúdo |
|---|-----------|---------|----------|
| 1 | Primary Colors (Main Colors) | 10611:34536 | Paleta cromática principal |
| 2 | Typography | 10611:36262 | Sistema tipográfico (Plus Jakarta Sans + Nunito) |
| 3 | Logo | 10611:37841 | Variações do logo AUSTA (6 variantes) |
| 4 | Media | 10611:43696 | Ilustrações, ícones, imagens (14 frames) |
| 5 | Effects (Shadow, Blur, Focus) | 10611:41389 | Sombras e efeitos visuais |
| 6 | Variables | 10611:43038 | Variáveis de design (5 grupos) |
| 7 | Grid & Spacing | 10611:41857 | Sistema de grid e espaçamento |
| 8 | Icons | Canvas 5367:38988 | Set completo de ícones |

### Cores identificadas (via globalVars):
| Token | Hex | Uso |
|-------|-----|-----|
| Brand/5 | #EBFBFF | Background mais claro |
| Brand/20 | #BDF1FF | Destaque leve |
| Brand primary (fill_SI4EM2) | #00C3F7 | Cor principal da marca |
| Brand secondary (fill_KJMT6N) | #00C3F7 | Logo / acentos |
| Brand accent (fill_NU8JCL) | #00DBBB | Verde-teal accent |
| Gray/0 (White) | #FFFFFF | Fundo branco |
| Gray/5 | #F8FAFC | Fundo cards/seções |
| Gray/20 | #E2E8F0 | Bordas e separadores |
| Gray/30 | #CBD5E1 | Overlays leves |
| Gray/40 | #94A3B8 | Texto secundário |
| Gray/60 | #4B5563 | Texto principal / Dark Mode bg |
| Gray/70 | #334155 | Dark Mode alternativo |
| Destructive/60 | #E11D48 | Alertas / erros |
| fill_MZTC8Y | #FF0000 | Indicadores críticos |
| fill_BLXT27 | #7AB765 | Sucesso / positivo |

### Tipografia:
| Token | Família | Peso | Tamanho | Line Height |
|-------|---------|------|---------|-------------|
| Display sm/Bold | Plus Jakarta Sans | 700 | 96px | 1.08em |
| Text md/Regular | Plus Jakarta Sans | 400 | 16px | 1.375em |
| Logo primary | Nunito | 700 | 35px | 1.36em |
| Logo secondary | Nunito | 700 | 18px | 1.36em |

---

## DESIGN SYSTEM — Componentes

| # | Componente | Node ID | Variantes |
|---|-----------|---------|-----------|
| 1 | Alert & Notification | 10611:45340 | Notifications component set |
| 2 | Accordion | 10611:45620 | Accordions component set |
| 3 | Badge/Tag | 10611:46889 | Múltiplas variantes |
| 4 | Button | 10611:50091 | Hierarchy, Size, Color, State |
| 5 | Breadcrumb | 10611:51141 | 4 variantes |
| 6 | Chat System | 10611:51249 | Bolhas, input, estados |
| 7 | Charts (Line Chart) | 10611:52644 | 4 tipos |
| 8 | Date Picker | 10611:53545 | 3 variantes |
| 9 | Dialog/Modal | 10611:53754 | Modal component set |
| 10 | Dropdown | 10611:54548 | 3 variantes |
| 11 | File Upload | 10611:56853 | Dropzone + Status |
| 12 | Form Controls | 10611:57418 | Checkbox, radio, switch, etc. |
| 13 | Input | 10611:58324 | 6 estados/tipos |
| 14 | Loader | 10611:58477 | Loader Base component set |
| 15 | Misc & Helper | 10693:59457 | Avatares, dividers, etc. |
| 16 | Pagination | 10693:60129 | Variantes de paginação |
| 17 | Progress & Indicator | 10693:61575 | Barras e indicadores |
| 18 | Slider | 10693:61704 | 3 variantes |
| 19 | Step | 10693:62948 | 3 variantes |
| 20 | Table | 10693:63163 | 3 variantes |
| 21 | Tab | 10693:66383 | 3 variantes |
| 22 | Tooltip | 10693:66491 | Tooltip component set |
| 23 | Navigations | 10724:20795 | Header, tab bar, sidebar |
| 24 | Mobile App Components | 10723:18403 | 12+ componentes mobile |

---

## INVENTÁRIO DE TELAS — LIGHT MODE

### Módulo 1: Welcome Screen / Onboarding
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Welcome Screen (splash 1) | 20307:23954 | ✅ MUST |
| 2 | Welcome Screen (splash 2) | 20311:21206 | ✅ MUST |
| 3 | Welcome Screen (onboard 1) | 20313:44230 | ✅ MUST |
| 4 | Welcome Screen (onboard 2) | 20313:44271 | ✅ MUST |
| 5 | Welcome Screen (onboard 3) | 20435:38766 | ✅ MUST |
| 6 | Welcome Screen (onboard 4) | 20435:38828 | ✅ MUST |
| 7 | Welcome Screen (onboard 5) | 20435:38859 | ✅ MUST |
| 8 | Welcome Screen (CTA final) | 20436:40653 | ✅ MUST |
| 9 | Welcome Screen (variante 1) | 23533:58258 | ⬚ COULD |
| 10 | Welcome Screen (variante 2) | 23533:58329 | ⬚ COULD |
| 11 | Welcome Screen (variante 3) | 23533:58393 | ⬚ COULD |
**Subtotal: 11 telas**

### Módulo 2: Authentication
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Authentication (login) | 20307:23813 | ✅ MUST |
| 2 | Authentication (cadastro) | 20313:21317 | ✅ MUST |
| 3 | Authentication (verificação) | 20436:60277 | ✅ MUST |
| 4 | Authentication (OTP) | 20436:60467 | ✅ MUST |
| 5 | Authentication (senha) | 20313:25276 | ✅ MUST |
| 6 | Authentication (recuperação) | 20313:22645 | ✅ MUST |
**Subtotal: 6 telas**

### Módulo 3: Comprehensive Health Assessment
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1-34 | Comprehensive Health Assessment | 23431:67051 → 23431:68034 | — |
| 35-68 | CHA (variantes/duplicatas) | 23686:97230 → 23686:98213 | — |
**Classificação: 34 telas únicas (Light) + 34 duplicatas (variantes)**
**MVP: 🔶 SHOULD — Versão simplificada no MVP (10 telas), completo no v2**

### Módulo 4: Profile Setup & Account Completion
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Profile Setup (principal) | 20442:39819 | ✅ MUST |
| 2 | Profile Setup (variante 1) | 23684:55511 | ✅ MUST |
| 3 | Profile Setup (variante 2) | 23684:55524 | ✅ MUST |
| 4 | Profile Setup (endereço) | 23686:99808 | ✅ MUST |
| 5 | Profile Setup (documentos) | 23686:100199 | ✅ MUST |
| 6 | Profile Setup (foto) | 23686:100422 | ✅ MUST |
| 7 | Profile Setup (dados saúde) | 23686:100433 | 🔶 SHOULD |
| 8 | Profile Setup (preferências) | 23686:100832 | 🔶 SHOULD |
| 9 | Profile Setup (confirmação) | 23686:100994 | ✅ MUST |
**Subtotal: 9 telas**

### Módulo 5: Home & Smart Health Metrics
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Home (dashboard principal) | 20313:44314 | ✅ MUST |
| 2 | Home (alerta destaque) | 23694:41325 | ✅ MUST |
| 3 | Home (header compacto) | 20431:66877 | ✅ MUST |
| 4 | Home (scroll completo) | 23431:66447 | ✅ MUST |
| 5 | Home (métricas expandidas) | 20365:27251 | ✅ MUST |
| 6 | Home (detalhes métrica) | 20367:9731 | ✅ MUST |
| 7 | Home (overlay/modal) | 20368:40705 | ✅ MUST |
| 8 | Home (lista serviços) | 20368:33073 | ✅ MUST |
| 9 | Home (favoritos) | 20372:14379 | 🔶 SHOULD |
| 10 | Home (filtros) | 20368:36141 | 🔶 SHOULD |
| 11 | Home (dark overlay) | 23684:97063 | 🔶 SHOULD |
| 12 | Home (métricas tempo real) | 23688:102183 | 🔶 SHOULD |
| 13-18 | Home (variantes layout) | 20451:54981→20473:37006 | ⬚ COULD |
**Subtotal: ~18 telas**

### Módulo 6: AI Wellness Companion
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | AI Companion (entrada) | 20414:28939 | 🔶 SHOULD |
| 2 | AI Companion (chat) | 20414:28984 | 🔶 SHOULD |
| 3 | AI Companion (resposta) | 20414:29639 | 🔶 SHOULD |
| 4 | AI Companion (sugestões) | 21643:212395 | 🔶 SHOULD |
| 5 | AI Companion (plano saúde) | 20414:60595 | 🔶 SHOULD |
| 6 | AI Companion (nutrição) | 20414:61587 | ⬚ COULD |
| 7 | AI Companion (exercício) | 20414:60683 | ⬚ COULD |
| 8 | AI Companion (sono) | 20414:61722 | ⬚ COULD |
| 9 | AI Companion (mental) | 20414:62154 | ⬚ COULD |
| 10 | AI Companion (histórico) | 20414:73371 | ⬚ COULD |
| 11-15 | AI Companion (variantes) | 20416:46414→20417:60848 | ⬚ COULD |
**Subtotal: 15 telas**

### Módulo 7: AI Symptom Checker
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Symptom Checker (início) | 20406:25812 | ✅ MUST |
| 2 | Symptom Checker (seleção corpo) | 20406:26230 | ✅ MUST |
| 3 | Symptom Checker (detalhe) | 20488:76815 | ✅ MUST |
| 4 | Symptom Checker (severidade) | 20488:77034 | ✅ MUST |
| 5 | Symptom Checker (overlay) | 20406:48065 | ✅ MUST |
| 6 | Symptom Checker (perguntas) | 20406:48560 | ✅ MUST |
| 7 | Symptom Checker (resultado) | 20408:23818 | ✅ MUST |
| 8 | Symptom Checker (recomendação) | 20408:24437 | ✅ MUST |
| 9 | Symptom Checker (histórico) | 20409:23808 | ✅ MUST |
| 10 | Symptom Checker (variante) | 21643:215304 | ✅ MUST |
| 11-28 | Symptom Checker (fluxos detalhados) | 20409:46823→20409:50165 | 🔶 SHOULD |
**Subtotal: 28 telas**

### Módulo 8: Medication Tracker
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Medication (lista) | 20410:27039 | ✅ MUST |
| 2 | Medication (detalhe) | 20410:27615 | ✅ MUST |
| 3 | Medication (adicionar) | 20410:27889 | ✅ MUST |
| 4 | Medication (lembrete) | 23694:40848 | ✅ MUST |
| 5 | Medication (busca) | 20410:27903 | ✅ MUST |
| 6 | Medication (alarme) | 20410:27876 | ✅ MUST |
| 7-25 | Medication (fluxos completos) | 21646:64055→21646:67716 | 🔶 SHOULD |
**Subtotal: 25 telas**

### Módulo 9: Sleep Management
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Sleep Management (grupo) | 20477:37838 | ⬚ COULD |
**Subtotal: 1 grupo (múltiplas telas internas)**

### Módulo 10: Activity Tracker
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Activity Tracker (grupo) | 20482:62038 | ⬚ COULD |
**Subtotal: 1 grupo**

### Módulo 11: Nutrition Monitoring
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Nutrition Monitoring (grupo) | 20488:45260 | ⬚ COULD |
**Subtotal: 1 grupo**

### Módulo 12: Period & Cycle Tracking
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Period Tracking (calendário) | 20404:22832 | ⬚ COULD |
| 2 | Period Tracking (log diário) | 20404:23275 | ⬚ COULD |
| 3-15 | Period Tracking (fluxos) | 20488:65020→20404:45148 | ⬚ COULD |
**Subtotal: 15 telas**

### Módulo 13: Doctor Consultation (Telemedicina)
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Consultation (busca médico) | 20419:50825 | ✅ MUST |
| 2 | Consultation (filtros) | 20419:51528 | ✅ MUST |
| 3 | Consultation (perfil médico) | 20419:51204 | ✅ MUST |
| 4 | Consultation (disponibilidade) | 20510:42292 | ✅ MUST |
| 5 | Consultation (agendamento) | 20419:52138 | ✅ MUST |
| 6 | Consultation (confirmação) | 21650:51628 | ✅ MUST |
| 7 | Consultation (variante confirm) | 23688:102942 | ✅ MUST |
| 8 | Consultation (detalhes consult) | 20419:52688 | ✅ MUST |
| 9 | Consultation (pagamento) | 20419:52899 | ✅ MUST |
| 10 | Consultation (sala espera) | 20419:53130 | ✅ MUST |
| 11-37 | Consultation (videochamada, chat, prescrição, histórico) | 20422→20427 | 🔶 SHOULD |
**Subtotal: 37 telas**

### Módulo 14: Notification & Search
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Notifications (lista) | 20427:72389 | ✅ MUST |
| 2 | Notifications (detalhe) | 20427:74793 | ✅ MUST |
| 3 | Search (principal) | 20516:63598 | ✅ MUST |
| 4 | Search (resultados) | 20427:76217 | ✅ MUST |
| 5-10 | Notifications/Search (estados) | 20427:76131→20427:76810 | 🔶 SHOULD |
**Subtotal: 10 telas**

### Módulo 15: Error & Utility
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Error & Utility (grupo) | 20518:68135 | ✅ MUST |
**Subtotal: 1 grupo (404, timeout, empty states)**

### Módulo 16: Wellness Resources
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Wellness Resources (grupo) | 20519:43188 | ⬚ COULD |
**Subtotal: 1 grupo**

### Módulo 17: Health Community
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Health Community (grupo) | 20519:66013 | ❌ WON'T (v1) |
**Subtotal: 1 grupo**

### Módulo 18: Profile Settings & Help Center
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Settings (perfil) | 23512:43073 | ✅ MUST |
| 2 | Settings (edição) | 23512:43327 | ✅ MUST |
| 3 | Settings (notificações) | 23512:43545 | ✅ MUST |
| 4 | Settings (privacidade) | 23512:43588 | ✅ MUST |
| 5 | Settings (idioma) | 23512:43599 | 🔶 SHOULD |
| 6-33 | Settings (Help Center, FAQ, termos, etc.) | 23512:43617→23512:46009 | 🔶 SHOULD |
**Subtotal: 33 telas**

### Módulo 19: Achievements / Gamification
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Achievements (painel) | 20433:73777 | ⬚ COULD |
| 2 | Achievements (detalhe) | 20433:74324 | ⬚ COULD |
| 3-7 | Achievements (badges, etc.) | 20433:72480→20433:72853 | ⬚ COULD |
**Subtotal: 7 telas**

### Módulo 20: Dashboard (Bonus/Admin)
| # | Nome | Node ID | MVP |
|---|------|---------|-----|
| 1 | Dashboard (light) | 20578:83558 | ❌ WON'T (v1) |
| 2 | Dashboard (dark) | 20578:83823 | ❌ WON'T (v1) |
| 3 | Dashboard (brand) | 20578:84081 | ❌ WON'T (v1) |
| 4-6 | Dashboard (variantes) | 20578:84230→21682:5456 | ❌ WON'T (v1) |
**Subtotal: 6 telas**

---

## CLASSIFICAÇÃO MVP (MoSCoW)

### ✅ MUST HAVE — MVP (v1.0) — ~120 telas
| Módulo | Telas MVP | Justificativa |
|--------|-----------|---------------|
| Welcome/Onboarding | 8 | First impression, conversão |
| Authentication | 6 | Acesso obrigatório |
| Profile Setup | 7 | Cadastro do beneficiário |
| Home & Metrics | 8 | Core navigation hub |
| AI Symptom Checker | 10 | Diferencial competitivo AUSTA |
| Medication Tracker | 6 | Uso diário, retenção |
| Doctor Consultation | 10 | Revenue driver principal |
| Notification & Search | 4 | Infraestrutura essencial |
| Error & Utility | ~5 | UX mínimo (404, empty, loading) |
| Settings (básico) | 4 | Perfil e privacidade |
| **Total MVP** | **~68 telas** | |

### 🔶 SHOULD HAVE — v1.1 (~2 meses pós-launch)
| Módulo | Telas | Justificativa |
|--------|-------|---------------|
| Health Assessment (simplificado) | 15 | Engajamento e dados de saúde |
| AI Wellness Companion (básico) | 5 | Diferenciação IA |
| Symptom Checker (fluxos completos) | 18 | Completar jornada |
| Medication (fluxos avançados) | 19 | Lembretes, histórico |
| Consultation (video, prescrição) | 27 | Telemedicina completa |
| Settings (Help Center, FAQ) | 29 | Suporte ao usuário |

### ⬚ COULD HAVE — v2.0 (~6 meses pós-launch)
| Módulo | Telas | Justificativa |
|--------|-------|---------------|
| Period & Cycle Tracking | 15 | Nicho específico |
| Sleep Management | ~10 | Wearable integration |
| Activity Tracker | ~10 | Wearable integration |
| Nutrition Monitoring | ~10 | Complexo, parcerias |
| Achievements/Gamification | 7 | Retenção longo prazo |
| Wellness Resources | ~8 | Conteúdo editorial |
| Welcome (variantes A/B) | 3 | Otimização de conversão |

### ❌ WON'T HAVE (v1) — Futuro
| Módulo | Telas | Justificativa |
|--------|-------|---------------|
| Health Community | ~15 | Moderação, compliance |
| Dashboard Admin | 6 | Painel interno, não é app |
| Dark Mode completo | ~200 | Implementar como theme toggle |

---

## DARK MODE — Módulos mapeados
| # | Módulo Dark | Node ID |
|---|------------|---------|
| 1 | Splash & Loading | 20552:42704 |
| 2 | Welcome Screen | 20552:42833 |
| 3 | Authentication | 20558:43730 |
| 4 | Health Assessment | 20558:46062 |
| 5 | Profile Setup | 20558:68369 |
| 6 | Home & Metrics | 20558:74067 |
| 7 | AI Wellness Companion | 20567:99387 |
| 8 | AI Symptom Checker | 20567:110420 |
| 9 | Medication Tracker | 20568:67966 |
| 10 | Sleep Management | 20561:55744 |
| 11 | Activity Tracker | 20561:61845 |
| 12 | Nutrition Monitoring | 20566:81603 |
| 13 | Period & Cycle Tracking | 20569:92437 |
| 14 | Doctor Consultation | 20569:95143 |
| 15 | Notification & Search | 20570:75110 |
| 16 | Error & Utility | 20570:76677 |
| 17 | Wellness Resources | 20570:79242 |
| 18 | Health Community | 20570:99398 |
| 19 | Profile Settings | 20576:115075 |
| 20 | Achievements | 20576:130452 |
