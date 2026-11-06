# Secure Catalog UI

Catálogo de produtos em **Angular 21 e TypeScript**, construído para ir além de um CRUD básico: arquitetura modular com lazy loading, programação reativa com RxJS, controle de acesso por perfil e testes automatizados.

> **Status:** projeto demonstrativo, focado em arquitetura front-end. A autenticação é simulada (veja [Limitações](#limitações)).

## Stack

Angular 21 · TypeScript · RxJS · Reactive Forms · SCSS · Karma/Jasmine

## Funcionalidades

- Login demonstrativo com perfis de acesso
- Listagem de produtos com busca, ordenação e paginação
- Criação e edição de produtos com validação
- Rotas protegidas por perfil

## Decisões de arquitetura e onde encontrá-las

| Prática | Onde está | Como |
| --- | --- | --- |
| Lazy loading | `app-routing.module.ts` → `features/products` | `loadChildren` carrega o `ProductsModule` apenas ao acessar `/products`; no build, ele sai como chunk separado |
| Programação reativa (RxJS) | `product-list.component.ts`, `auth.service.ts` | `debounceTime` + `distinctUntilChanged` + `switchMap` na busca (cancela a requisição anterior); `BehaviorSubject` como fonte única do usuário autenticado; `takeUntil` evita vazamento de subscriptions |
| Formulários reativos | `product-form.component.ts` | `FormBuilder` + `Validators`; `patchValue` no modo de edição via `OnChanges` |
| Consumo seguro de API | `core/interceptors/auth.interceptor.ts` | Injeta `Authorization: Bearer` em toda requisição e trata `401` em um só lugar; nenhum service precisa "lembrar" de autenticar |
| Autorização por perfil | `core/services/auth.service.ts` | `UserRole` explícito (`admin`, `sales`, `stock-manager`, `viewer`) e `hasRole()`, em vez de um boolean genérico |
| Proteção de rota | `core/guards/role.guard.ts` | `CanActivate` que bloqueia `/products` para perfis sem permissão; complementa o interceptor, que protege as chamadas de API |
| Separação de responsabilidades | `core/` e `features/` | `core/` guarda o que é transversal (services, models, guards, interceptors); `features/` organiza por domínio de negócio |
| Modelo de domínio isolado | `core/models` | `Product` não depende de Angular; tipos de leitura e escrita separados (`Product` vs `ProductFormValue`); `ProductService` fala só com a API |

## Estrutura

```text
src/app/
├── core/
│   ├── guards/         # RoleGuard
│   ├── interceptors/   # AuthInterceptor
│   ├── models/         # Product (domínio, sem dependência de Angular)
│   └── services/       # AuthService, ProductService
└── features/
    ├── auth/           # login demonstrativo
    └── products/       # módulo lazy-loaded
        └── pages/
            ├── product-list/
            └── product-form/
```

## Migração Angular 15 → 21

O projeto nasceu no Angular 15 e foi migrado para o 21 na branch `chore/upgrade-angular`.

- Builder atualizado para `@angular/build`
- Build (`npm run build`) e testes (`npm run test:ci`) passando após a migração
- Migração sem quebras: o projeto manteve a arquitetura modular (NgModules); a conversão para standalone components fica como próximo passo

## Autenticação e perfis

O login é demonstrativo: ao escolher um perfil, o `AuthService` salva o token fictício `demo-token` no `localStorage` e mantém o usuário em memória. O `AuthInterceptor` envia esse token nas requisições.

- `admin` e `stock-manager`: acessam `/products`
- `sales`: autentica, mas não tem acesso ao catálogo; a tela informa a restrição
- `viewer`: suportado pelo modelo, sem botão no login demonstrativo

## Testes

Testes unitários com Karma/Jasmine para:

- `ProductListComponent`: carregamento, erro, ordenação, paginação, busca com debounce e salvar
- `LoginComponent`: perfis e navegação
- `AuthInterceptor`: header de token e tratamento de `401`
- `RoleGuard`: liberação e bloqueio por perfil

## Executando localmente

```bash
npm install
npm start          # http://localhost:4200
npm run build      # build de produção
npm test           # testes em modo watch
npm run test:ci    # testes uma única vez (para pipelines)
```

**API:** o endereço do backend é configurado em `src/environments/environment.ts` (`apiUrl`). O catálogo consome uma API HTTP real nesse endereço; o login demonstrativo é a única parte simulada.

## Limitações

- **Não há backend de autenticação.** O `demo-token` no `localStorage` serve apenas para demonstrar a arquitetura. Em produção, o token ficaria em cookie `HttpOnly`, já que o `localStorage` é exposto a XSS.
- **Controle de acesso no front-end não substitui autorização no servidor.** O `RoleGuard` melhora a experiência; a segurança real precisa ser validada no backend.
- **Ordenação e paginação são client-side** sobre a lista retornada pela API; apenas a busca é enviada ao servidor.

## Próximos passos

- Paginação e ordenação no servidor
- Autenticação e autorização reais via backend
- Integração contínua com GitHub Actions (build e testes)
- Testes E2E
- Lint (`ng lint`)

## Autor

**William Bueno** · Software Engineer · Web Applications

[GitHub](https://github.com/walbueno) · [LinkedIn](https://www.linkedin.com/in/walbueno) · [Portfólio](https://williambueno.com.br) · [Beez Creative](https://beezcreative.com.br)