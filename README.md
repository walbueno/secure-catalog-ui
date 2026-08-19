# Secure Catalog UI

Catálogo de produtos em Angular com foco em arquitetura modular e
consumo seguro de API — construído como peça de portfólio para
demonstrar padrões usados em aplicações Angular de nível sênior
(lazy loading, formulários reativos, grid com busca/ordenação/paginação,
autenticação centralizada via interceptor). Não é um CRUD genérico —
cada decisão de arquitetura está documentada na tabela abaixo.

## Stack
Angular 15 · TypeScript · RxJS · Reactive Forms · SCSS

## Decisões de arquitetura e onde encontrá-las

| Requisito / prática | Onde está | Como |
|---|---|---|
| Angular 15+ / TypeScript | todo o projeto | gerado com Angular CLI 15, `strict` no `tsconfig` |
| Modularização (Lazy Loading) | `app-routing.module.ts` → `features/products` | `loadChildren` carrega `ProductsModule` só quando a rota `/products` é acessada — confirmado no build (`products_module` sai como chunk separado) |
| Formulários Dinâmicos | `product-form.component.ts` | `FormBuilder` + `Validators`, `patchValue` em modo edição via `OnChanges`, validação declarativa |
| Grids Avançados | `product-list.component.ts` | busca (debounced), ordenação por coluna, paginação — client-side mas desenhado pra trocar por ag-Grid/PrimeNG sem tocar na lógica de dados |
| RxJS / programação reativa | `product-list.component.ts`, `auth.service.ts` | `debounceTime` + `distinctUntilChanged` + `switchMap` na busca; `BehaviorSubject` como fonte única de verdade do usuário autenticado; `takeUntil` para evitar leak de subscription |
| Consumir APIs com segurança | `core/interceptors/auth.interceptor.ts` | injeta o `Authorization: Bearer` em toda requisição automaticamente e trata 401 centralizadamente — nenhum service individual precisa "lembrar" de autenticar |
| Autenticação/autorização por perfil | `auth.service.ts` | `UserRole` explícito (`admin`, `sales`, `stock-manager`, `viewer`) e `hasRole()`, em vez de um boolean genérico |
| SOLID / Clean Code / DDD | `core/models`, `core/services` | modelo de domínio (`Product`) isolado de Angular; `ProductService` com responsabilidade única (só fala com a API); tipos de leitura/escrita separados (`Product` vs `ProductFormValue`) |
| Git / boas práticas de estrutura | estrutura de pastas | `core/` (transversal: services, models, guards, interceptors) separado de `features/` (por domínio de negócio) |
| Autorização por perfil (nível de rota) | `core/guards/role.guard.ts` | `CanActivate` que bloqueia `/products` para quem não tem o perfil exigido, usando `AuthService.hasRole()` — complementa o `AuthInterceptor`, que protege as chamadas de API |
| Testes automatizados | `*.spec.ts` | cobertura para `ProductListComponent` (carregamento, erro, ordenação, paginação, busca debounced, salvar), `AuthInterceptor` (header de token, tratamento de 401) e `RoleGuard` (liberação/bloqueio por perfil) |

## Estrutura

```
src/app/
├── core/
│   ├── guards/         # RoleGuard
│   ├── interceptors/   # AuthInterceptor
│   ├── models/         # Product (domínio, sem dependência de Angular)
│   └── services/       # AuthService, ProductService
└── features/
    └── products/       # módulo lazy-loaded
        ├── pages/
        │   ├── product-list/
        │   └── product-form/
        ├── products.module.ts
        └── products-routing.module.ts
```

## Rodando localmente

```bash
npm install
npm start        # http://localhost:4200
npm run build    # build de produção
npm test         # testes unitários (Karma/Jasmine)
```

> A API é apontada em `src/environments/environment.ts` (`apiUrl`) — os
> serviços estão prontos para consumir um backend real; não há mock
> embutido de propósito, para deixar claro o contrato HTTP esperado.

## Próximos passos

- Trocar a grid client-side por paginação server-side quando o volume
  de dados justificar (hoje a ordenação/paginação acontece sobre a
  lista completa retornada pela API — decisão consciente para manter
  o escopo do projeto enxuto)
