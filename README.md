# Secure Catalog UI

Aplicação de catálogo desenvolvida com **Angular e TypeScript**, explorando arquitetura modular, programação reativa com RxJS, formulários reativos, controle de acesso e testes automatizados.

> **Status:** Projeto demonstrativo focado em arquitetura e desenvolvimento Front-End.

---

## 🎯 Objetivo

O projeto foi desenvolvido para explorar uma aplicação Angular estruturada em módulos e responsabilidades bem definidas.

Entre os principais conceitos trabalhados estão:

* arquitetura modular;
* lazy loading;
* RxJS;
* Reactive Forms;
* interceptors;
* route guards;
* controle de acesso;
* testes automatizados.

---

## 🛍️ Funcionalidades

A aplicação contempla:

* autenticação demonstrativa;
* catálogo de produtos;
* criação e edição de produtos;
* busca;
* ordenação;
* paginação;
* controle de acesso baseado em perfil.

---

## 🏗️ Arquitetura

A aplicação organiza responsabilidades entre camadas como:

```text
core/
features/
```

A estrutura utiliza conceitos de modularidade para separar responsabilidades compartilhadas e funcionalidades específicas.

---

## ⚡ Lazy Loading

A funcionalidade de produtos utiliza carregamento sob demanda através de `loadChildren`.

Isso permite que determinadas partes da aplicação sejam carregadas conforme a necessidade de navegação.

---

## 🔄 RxJS

O projeto utiliza RxJS para gerenciamento de fluxos assíncronos.

Entre os operadores utilizados estão:

* `debounceTime`
* `distinctUntilChanged`
* `switchMap`
* `takeUntil`

A combinação permite implementar, por exemplo, busca com debounce e cancelamento de requisições anteriores.

---

## 📝 Reactive Forms

Os formulários utilizam Angular Reactive Forms.

São utilizados recursos como:

* `FormBuilder`;
* validators;
* `patchValue`;
* tratamento de alterações de componentes.

---

## 🔐 Autenticação e autorização

O projeto possui uma implementação **demonstrativa** de autenticação e autorização no Front-End.

Os perfis utilizados incluem:

* `admin`;
* `sales`;
* `stock-manager`;
* `viewer`.

O `RoleGuard` controla o acesso às rotas conforme o perfil do usuário.

O `AuthInterceptor` adiciona um token de demonstração às requisições e trata respostas `401`.

---

## ⚠️ Limitação importante

A autenticação deste projeto **não possui backend de autenticação real**.

O projeto utiliza um `demo-token` armazenado no `localStorage` para representar o cenário de autenticação.

Portanto, o mecanismo deve ser entendido como uma demonstração de arquitetura Front-End e não como um sistema de autenticação seguro para produção.

Em uma aplicação real, autenticação e autorização devem ser implementadas e validadas também no backend.

> **Controle de acesso no Front-End não substitui autorização no servidor.**

---

## 🧪 Testes

O projeto possui testes para diferentes partes da aplicação, incluindo:

* `ProductListComponent`;
* `LoginComponent`;
* `AuthInterceptor`;
* `RoleGuard`.

Os testes ajudam a verificar o comportamento de componentes e serviços isoladamente.

---

## 🔎 Busca, ordenação e paginação

A listagem de produtos implementa:

* busca com debounce;
* ordenação no cliente;
* paginação no cliente.

À medida que o volume de dados aumenta, uma evolução natural seria transferir essas operações para o servidor.

---

## 🧠 Princípios utilizados

O projeto busca aplicar conceitos relacionados a:

* SOLID;
* Clean Code;
* separação de responsabilidades;
* modularidade;
* programação reativa;
* reutilização de componentes;
* testabilidade.

---

## 📦 Stack

* Angular 15
* TypeScript
* RxJS
* Reactive Forms
* SCSS
* Karma/Jasmine

---

## 🚀 Executando localmente

Clone o projeto:

```bash
git clone https://github.com/walbueno/secure-catalog-ui.git
```

Instale as dependências:

```bash
npm install
```

Execute:

```bash
ng serve
```

A aplicação ficará disponível localmente conforme a configuração padrão do Angular CLI.

---

## 🔄 Possíveis evoluções

* autenticação real via backend;
* autorização no servidor;
* gerenciamento de sessão;
* paginação server-side;
* ordenação server-side;
* persistência de dados;
* testes E2E;
* integração contínua;
* observabilidade.

---

## 💡 O que este projeto demonstra

* Angular;
* TypeScript;
* RxJS;
* arquitetura modular;
* Reactive Forms;
* programação reativa;
* interceptors;
* route guards;
* controle de acesso no Front-End;
* testes automatizados;
* organização de aplicações web.

---

## 👨‍💻 Autor

**William Bueno**

Software Engineer · Web Applications · Digital Products

* [GitHub](https://github.com/walbueno)
* [LinkedIn](https://www.linkedin.com/in/walbueno)
* [Portfolio](https://williambueno.com.br)
* [Beez Creative](https://beezcreative.com.br)
