## Gestão de Contribuições – Front‑end

Aplicação Angular para gestão de contribuições financeiras de uma igreja, com dashboard, gráficos, filtros, autenticação e emissão de relatórios em PDF.

---

## Funcionalidades

- **Autenticação**
  - Tela de login com opção de salvar e‑mail do usuário.
  - Tela de registro de usuário.
  - Proteção de rotas via guard; redireciona para `/auth/login` quando não autenticado.
- **Dashboard financeiro**
  - Cards de resumo (totais, comparativos).
  - Gráfico por forma de pagamento (PIX, espécie etc.).
  - Gráfico mensal comparando ano atual x anterior.
- **Contribuições**
  - Listagem paginada e ordenável de contribuições recentes.
  - Filtros por membro, tipo de contribuição, forma de pagamento e período.
  - Cadastro de contribuições em modal, com máscara/normalização de valores em BRL.
  - Cadastro de membros em modal.
- **Relatórios**
  - Geração de relatório semanal em PDF a partir de um intervalo de datas.
- **UX**
  - Toasts (snackbars) de sucesso, erro e aviso, coloridos por tipo.
  - Loading global enquanto requisições HTTP estão em andamento.

---

## Stack e dependências

- **Framework:** Angular 21 (standalone components)
- **UI:** Angular Material, Bootstrap 5
- **Gráficos:** Chart.js
- **HTTP:** `HttpClient` com interceptors (loading + token JWT)
- **Formulários:** Reactive Forms
- **Internacionalização:** `pt-BR` para datas e moeda (BRL)

Veja todas as dependências em `package.json`.

---

## Pré‑requisitos

- Node.js (versão compatível com Angular 21)
- npm (usado como package manager)
- Backend da aplicação em execução, com `environment.apiUrl` apontando para ele

---

## Como rodar o projeto

Instalar dependências:

```bash
npm install
```

Subir o servidor de desenvolvimento (porta padrão 4200):

```bash
npm start
# ou
ng serve
```

Depois, acesse em seu navegador:

- http://localhost:4200/

O hot‑reload será aplicado sempre que você salvar alterações nos arquivos fonte.

---

## Scripts disponíveis

No `package.json` você encontra os principais scripts:

- `npm start` – inicia o servidor de desenvolvimento (`ng serve`).
- `npm run build` – build de produção (`ng build`).
- `npm run watch` – build em modo watch.
- `npm test` – executa os testes unitários (`ng test`).

---

## Ambientes

Os arquivos de ambiente ficam em `src/environments/`:

- `environment.ts` – configurações padrão (produção).
- `environment.development.ts` – configurações para desenvolvimento.

Certifique‑se de configurar `apiUrl` corretamente para apontar para o backend.

---

## Estrutura básica

Algumas pastas principais do projeto:

- `src/app/modules/auth` – telas de login/registro, serviço de autenticação, guard e interceptor de token.
- `src/app/modules/home` – dashboard, tabela de contribuições, diálogos e serviços de dados.
- `src/app/modules/contributions` – componentes e serviços de contribuições.
- `src/app/modules/members` – componentes de cadastro de membros.
- `src/app/core` – interceptors e serviços compartilhados (ex.: loading).
- `src/app/shared` – componentes e serviços reutilizáveis (ex.: toast).

---

## Convenções e boas práticas

- Uso de **standalone components** no Angular 21.
- Serviços injetáveis via `inject()` dentro das classes.
- Interceptores HTTP para responsabilidades transversais (loading, token JWT).
- Formulários reativos para telas de autenticação e cadastros.
- Estilização combinando Angular Material e classes utilitárias do Bootstrap.

---

## Próximos passos sugeridos

- Documentar os endpoints esperados do backend (login, contribuições, relatórios).
- Adicionar exemplos de payloads de requisição/resposta.
- Incluir capturas de tela do dashboard e telas de autenticação.

Este README descreve apenas o front‑end. Consulte o repositório do backend para detalhes de API e geração dos relatórios em PDF.
