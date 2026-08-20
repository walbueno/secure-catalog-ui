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
| Grids Avançados | `product-list.component.ts` | busca debounced enviada à API; ordenação por coluna e paginação client-side — a apresentação pode ser trocada por ag-Grid/PrimeNG sem alterar o serviço |
| RxJS / programação reativa | `product-list.component.ts`, `auth.service.ts` | `debounceTime` + `distinctUntilChanged` + `switchMap` na busca; `BehaviorSubject` como fonte única de verdade do usuário autenticado; `takeUntil` para evitar leak de subscription |
| Consumir APIs com segurança | `core/interceptors/auth.interceptor.ts` | injeta o `Authorization: Bearer` em toda requisição automaticamente e trata 401 centralizadamente — nenhum service individual precisa "lembrar" de autenticar |
| Autenticação/autorização por perfil | `auth.service.ts` | `UserRole` explícito (`admin`, `sales`, `stock-manager`, `viewer`) e `hasRole()`, em vez de um boolean genérico |
| SOLID / Clean Code / DDD | `core/models`, `core/services` | modelo de domínio (`Product`) isolado de Angular; `ProductService` com responsabilidade única (só fala com a API); tipos de leitura/escrita separados (`Product` vs `ProductFormValue`) |
| Git / boas práticas de estrutura | estrutura de pastas | `core/` (transversal: services, models, guards, interceptors) separado de `features/` (por domínio de negócio) |
| Autorização por perfil (nível de rota) | `core/guards/role.guard.ts` | `CanActivate` que bloqueia `/products` para quem não tem o perfil exigido, usando `AuthService.hasRole()` — complementa o `AuthInterceptor`, que protege as chamadas de API |
| Testes automatizados | `*.spec.ts` | cobertura para `ProductListComponent` (carregamento, erro, ordenação, paginação, busca debounced, salvar), `LoginComponent` (perfis e navegação), `AuthInterceptor` (header de token, tratamento de 401) e `RoleGuard` (liberação/bloqueio por perfil) |

## Autenticação e perfis

O login atual é demonstrativo: não há backend de autenticação. Ao escolher um perfil,
o `AuthService` salva o token fictício `demo-token` no `localStorage` e mantém o usuário
em memória. O `AuthInterceptor` usa esse token nas requisições HTTP.

- `admin` e `stock-manager`: podem acessar `/products`.
- `sales` (vendedor): autentica, mas não possui acesso ao catálogo; a tela informa a restrição.
- `viewer`: é um papel suportado pelo modelo, mas não possui botão no login demonstrativo.

O `RoleGuard` protege a rota `/products`, enquanto o interceptor encerra a sessão e redireciona
para `/login` quando a API retorna `401`. Essa proteção no frontend não substitui a autorização
no backend.

## Estrutura

```
src/app/
├── core/
│   ├── guards/         # RoleGuard
│   ├── interceptors/   # AuthInterceptor
│   ├── models/         # Product (domínio, sem dependência de Angular)
│   └── services/       # AuthService, ProductService
└── features/
    ├── auth/            # login demonstrativo
    │   └── pages/login/
    └── products/        # módulo lazy-loaded
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
O catálogo consome uma API HTTP real configurada nesse endereço; o login demonstrativo é a única
simulação local e não valida credenciais em um backend.


## Próximos passos

**Paginação no servidor**: Atualmente, a busca é enviada à API com debounce, enquanto a ordenação e a paginação acontecem no client-side sobre a lista retornada. O próximo passo natural é migrar a paginação e a ordenação para o servidor caso o volume de dados cresça.
