# Plano de versões do Goals

Este é o mapa do app até ele ficar completo. Cada versão é pequena o bastante para ser feita, testada e publicada numa sessão de trabalho. A ordem pode mudar, mas a 3.3 vem primeiro porque o cadastro já está aberto para qualquer pessoa.

## O que é o app “100%”

O app está completo quando todos estes pontos forem verdade:

- **Seguro:** as regras do Firestore são testadas no emulador oficial do Firebase a cada versão, o App Check está ativo e a chave do Firebase só funciona no endereço do site.
- **Respeita a privacidade:** qualquer pessoa consegue excluir a conta e todos os dados, e há política de privacidade e termos de uso publicados.
- **Confiável:** testes automáticos rodam antes de cada publicação, existe um ambiente de testes separado do app de verdade e os erros que acontecem nos celulares chegam até nós.
- **Fácil:** quem nunca viu o app cria a primeira meta sem ajuda, e o app funciona bem no celular, sem internet e com leitor de tela.
- **Útil para todos os tipos de usuário:** quem guarda sozinho, casais e famílias, grupos de amigos e quem está começando.
- **Fácil de encontrar e instalar:** endereço próprio, página de apresentação e instalação simples.

## Já feito

| Versão | O que trouxe |
|---|---|
| 1.x | Quadro de quadradinhos salvo só no aparelho |
| 2.0 | Nome Goals, várias metas e sincronização do casal pelo Firebase |
| 3.0 | Cadastro pelo app, metas com dono e participantes, migração da 2.0 |
| 3.1 | Convite por link, tela de entrada nova, logo indicando a conexão |
| 3.2 | Frequência “Todo mês” com dia do depósito |

## Próximas versões

### 3.3 Base segura

**Objetivo:** deixar o app seguro e correto com a lei antes de crescer.

- Modo de teste ligado ao Firebase Emulator, só quando o app roda em localhost, com testes automáticos das regras do Firestore.
- Excluir conta e todos os dados: metas criadas pela pessoa, saída das metas compartilhadas, perfil e convites.
- Política de privacidade e termos de uso, numa página do próprio site, com link na tela de entrada.
- Aceitar convite só depois de confirmar o e-mail.
- Regras do Firestore conferindo o formato das marcações e limitando tamanhos.
- App Check com reCAPTCHA e chave do Firebase limitada ao endereço do site.
- Encerrar a migração da 2.0: depois de confirmar que os dois e-mails antigos já migraram, apagar a coleção `desafios`, tirar os e-mails das regras e remover o código de migração.

**Pronto quando:** os testes das regras passam no emulador e uma conta de teste é excluída sem deixar nenhum dado para trás.

### 3.4 Controle da meta

**Objetivo:** dar flexibilidade a quem já usa o app no dia a dia.

- Ajustar a meta (valor, prazo, frequência e dia do depósito), recalculando só os quadradinhos que faltam e mantendo os marcados.
- Depósito avulso, fora dos quadradinhos, que entra no total.
- Histórico de depósitos: quem marcou, quando e quanto, com filtro por pessoa.
- Meta concluída com comemoração e uma área de metas arquivadas.
- Lixeira: uma meta excluída pode ser recuperada por 30 dias.

### 3.5 Lembretes

**Objetivo:** ajudar a pessoa a não esquecer o depósito.

- **3.5a:** lembrete na agenda do celular, com um arquivo de calendário que repete no dia do depósito. Não tem custo nem precisa de servidor.
- **3.5b:** notificações no celular. Exige Cloud Functions, que só funcionam no plano Blaze do Firebase (pago conforme o uso). Decidir antes de começar.

### 3.6 Grupos de verdade

**Objetivo:** atender famílias e grupos de amigos.

- Contribuição de cada pessoa, em valor e em porcentagem.
- Papéis: quem criou, quem pode marcar e quem só acompanha.
- Meta por cotas: cada participante tem a sua parte, e o app mostra quem já completou.
- Gerenciar convites: ver os ativos, cancelar e limitar a um uso.
- Passar a meta para outra pessoa.

### 3.7 Primeiros passos

**Objetivo:** fazer quem acabou de chegar criar a primeira meta sozinho.

- Modelos prontos: reserva de emergência, viagem, presente e quitar dívida.
- Boas-vindas em três telas curtas, depois do cadastro.
- Tela inicial vazia com sugestão de primeira meta.
- Revisão de acessibilidade com leitor de tela e teclado.

### 4.0 Profissional

**Objetivo:** preparar o projeto para crescer sem quebrar.

- Projeto Firebase separado só para testes.
- Código em arquivos separados, com uma etapa de montagem que gera o site estático para o GitHub Pages.
- Testes automáticos no GitHub Actions a cada envio.
- Registro de erros vindos dos celulares, sem dados pessoais.
- Endereço próprio (domínio) e página de apresentação do app.
- Métricas de uso sem dados pessoais.

### 4.1 em diante: crescimento (opcional)

- Compartilhar uma conquista como imagem do progresso.
- Indicar o app para amigos.
- Publicar na Google Play a partir do próprio site. A App Store da Apple é bem mais exigente com apps feitos assim.
- Plano pago, só se fizer sentido. Exige plano Blaze, um serviço de pagamento e, em geral, CNPJ.

## Como fazer cada versão

1. Escolher a próxima versão deste plano e confirmar os itens.
2. No Claude Code, pedir a versão, por exemplo: “Vamos fazer a 3.3, item por item.”
3. Testar: testes automáticos e um teste real no celular.
4. Atualizar a versão no `index.html` (`APP_VERSION`), o nome do cache no `sw.js`, o `HISTORICO.md` e este plano (mover a versão para “Já feito”).
5. Se as regras do Firestore mudarem, publicar as regras no console do Firebase antes do app.
6. No GitHub Desktop, fazer o commit “Versão X.Y” e o push. Depois, conferir “Goals X.Y” no fim dos Ajustes.
