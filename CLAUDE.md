# Goals: contexto do projeto para o Claude Code

## Sobre o app e quem cuida dele

- **Goals** é um app web instalável (PWA) de metas de economia. Cada meta vira uma cartela de quadradinhos, cada quadradinho vale o número escrito nele e a soma de todos dá exatamente o valor da meta.
- Quem cuida do projeto é o Everton, junto com a esposa. Eles não são programadores: explique em português do Brasil, com palavras simples e sem jargão, e diga exatamente o que eles precisam fazer em cada passo.
- O site é publicado pelo GitHub Pages em https://douradohelpdesk-cmd.github.io/goals/ a partir deste repositório, que é público. Nunca coloque e-mails reais, senhas ou dados de usuários no repositório.
- O plano de versões está em `PLANO-DE-VERSOES.md`, e o histórico do que já foi entregue está em `HISTORICO.md`.

## Arquivos

- `index.html`: o app inteiro em um arquivo (HTML, CSS e JavaScript inline). A interface é montada em JavaScript (`app.innerHTML = ...`) e os elementos são buscados pelo id em `els`, com os ids convertidos para camelCase.
- `sw.js`: service worker. Busca a página na internet primeiro, conferindo sempre se há versão nova (`cache: 'no-cache'` nas navegações), e usa a cópia guardada sem internet. O nome do cache segue a versão (`goals-3.2`) e **muda a cada versão**.
- `manifest.webmanifest` e ícones: instalação como app.
- `firestore.rules`: modelo das regras do Firestore com e-mails de exemplo. As regras de verdade são publicadas no console do Firebase, com os e-mails reais, e esses e-mails nunca vão para o repositório.

## Versão

A cada versão, atualize: `APP_VERSION` no `index.html` (aparece no fim do painel de Ajustes), `CACHE` no `sw.js`, `HISTORICO.md` e `PLANO-DE-VERSOES.md`.

## Firebase

- Projeto `desafio-2027`. SDK web 13.2.0, carregado de `https://www.gstatic.com/firebasejs/13.2.0/` por `loadSdk()`. Sem o Firebase, o app funciona no modo “só neste aparelho” (`mode === 'local'`).
- **Authentication:** e-mail e senha, com cadastro aberto pelo app, confirmação de e-mail e redefinição de senha.
- **Firestore:**
  - `metas/{id}`: `v`, `name`, `goal`, `start` e `end` (AAAA-MM-DD), `freq` (`daily`, `weekdays`, `weekly`, `monthly` ou `seq`), `payDay` (1 a 28, só nas mensais), `values` (lista dos quadradinhos), `marks` (`{posição: {t, by}}`), `owner`, `members` (lista de uids), `fromV2`, `lastInvite`, `createdAt` e `updatedAt`.
  - `usuarios/{uid}`: `name` e `updatedAt`.
  - `convites/{código}`: `metaId`, `owner`, `metaName`, `ownerName`, `createdAt` e `expiresAt` (milissegundos, até 7 dias).
  - `desafios/*`: dados da versão 2.0, liberados só para os dois e-mails antigos. Devem ser removidos na 3.3.
- As regras do Firestore não funcionam como filtro. A consulta das metas precisa bater com a regra: `where('members', 'array-contains', uid)`.
- `updateDoc` num documento que não existe volta como `permission-denied`, e não `not-found`, quando a regra usa `resource.data`.
- Plano gratuito (Spark): não há Cloud Functions. Qualquer item que precise de servidor exige o plano Blaze, e isso precisa ser combinado com o Everton antes.

## Mapa do código (index.html)

- **Dados:** `normalizeProject` (valida e completa uma meta), `plainProject`, `projectDoc` (formato gravado no Firestore), `stats` (totais, ritmo, valor por dia ou por mês).
- **Cálculo dos quadradinhos:** `planValues`, `rampValues` (valores crescentes com soma exata), `seqValues`, `countDeposits` e `monthlyDates`.
- **Sincronização:** `onUser`, `onSnap`, `announce` (avisos do que os outros fizeram; o objeto `recent` evita avisar a própria ação), `cloudWrite`, `onWriteError` e `denied`.
- **Primeira resposta do servidor:** `afterFirstServerSnapshot` chama `migrateV2`, `claimOrCreate`, `ensureProfile`, `offerLegacyMarks` e `maybeProcessInvite`.
- **Tela:** `render`, `renderHome`, `renderProject`, `renderPeople`, `renderSettings`, `renderPreview`, `setStatus` e `syncText`.
- **Rotas pelo endereço:** vazio (início), `#novo` (meta nova), `#p-<id>` (uma meta) e `#convite-<código>`, tratadas em `route`.
- **Indicador de conexão:** `setStatus` grava `data-sync` (`ok`, `bad`, `muted` ou `local`) no elemento `#app`, e o CSS pinta o nome “Goals” do topo de verde, vermelho, cinza ou neutro.
- **Cópia de segurança:** `buildDocument` gera um HTML com as metas. No modo conectado, restaurar adiciona as metas como novas e não apaga nada.

## Visual

- Cores definidas em variáveis no `:root`, com valores próprios para o modo escuro (`prefers-color-scheme` e `data-theme`). Verde da marca `#0F3D2E`, dourado `#F5C542`, verde de sucesso `--done` e vermelho `--bad`.
- Fontes: Manrope na interface e Unbounded só no nome “Goals”, carregadas do Google Fonts.
- Textos em português, falando com uma pessoa só (“você”), curtos e diretos. Use aspas curvas (“ ”) nos textos que a pessoa lê.

## Como trabalhar

- Teste tudo antes de entregar e diga o que foi testado e o que não foi possível testar.
- Para testar com o Firebase de verdade, use o Firebase Emulator Suite (Auth e Firestore, carregando o `firestore.rules`). O primeiro item da 3.3 é ligar o app ao emulador quando ele roda em localhost.
- Mudanças nas regras do Firestore precisam ser publicadas no console **antes** do app novo, e as regras novas devem continuar aceitando a versão anterior do app.
- Mantenha o app funcionando sem internet e no modo “só neste aparelho”.
- Ao terminar uma versão, mostre ao Everton o passo a passo para publicar: regras (se mudaram), commit “Versão X.Y” e push no GitHub Desktop, e conferência de “Goals X.Y” nos Ajustes.
