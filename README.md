# Secure Catalog UI

Desenvolvi este catálogo de produtos em Angular para ir além de um CRUD básico e demonstrar boas práticas de mercado. 
O projeto foi estruturado com foco em arquitetura modular, priorizando performance (com lazy loading), 
segurança no consumo de APIs (via interceptor de autenticação) e uma experiência de usuário fluida (formulários reativos e grid completa com busca, ordenação e paginação). 
Cada decisão técnica e arquitetural está detalhada na tabela abaixo.

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

Para rodar o projeto na sua máquina, siga os passos abaixo:

```bash
npm install
npm start        # Sobe o servidor em http://localhost:4200
npm run build    # Gera o build de produção
npm test         # Roda os testes unitários (Karma/Jasmine)
```

**Configuração da API**: O endereço do backend deve ser configurado em `src/environments/environment.ts` (`apiUrl`). 
O projeto foi estruturado para consumir uma API real e não utiliza mocks embutidos, evidenciando claramente o contrato HTTP esperado.


## Próximos passos

**Paginação no servidor**: Atualmente, a busca, ordenação e paginação acontecem no client-side sobre a lista completa trazida pela API. Essa foi uma escolha proposital para manter o escopo enxuto, mas o próximo passo natural é migrar para paginação server-side caso o volume de dados cresça.
