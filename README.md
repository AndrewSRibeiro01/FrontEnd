# Frontend — Brain Agriculture

SPA em **React + TypeScript (Vite)** para o teste técnico *Brain Agriculture v2*.
Segue **arquitetura em camadas** (Clean Architecture / DDD-lite) e **Atomic Design**
para os componentes de UI. Estilos 100% em **styled-components** com tema tipado.

## Stack

- React 18 + TypeScript
- Vite
- Redux Toolkit + React Redux
- React Router
- Axios
- styled-components
- Jest + React Testing Library

## Estrutura de pastas

```
src/
├─ main.tsx                       # bootstrap (Redux + Router + ThemeProvider)
├─ domain/                        # regras e contratos (puro TS, sem framework)
│  ├─ entities/                   # Producer, Farm, Harvest, Crop, Dashboard, BrazilianState
│  ├─ repositories/               # interfaces de repositório
│  └─ validation/                 # CPF/CNPJ, áreas da fazenda
├─ application/                   # estado + orquestração
│  ├─ store/                      # Redux Toolkit (slices normalizadas por id)
│  ├─ hooks/                      # useAppDispatch / useAppSelector tipados
│  └─ use-cases/                  # thunks (repositório + slice)
├─ infrastructure/                # detalhes técnicos
│  ├─ http/                       # cliente axios
│  ├─ repositories/               # implementações HTTP + factory (mock vs real)
│  └─ mocks/                      # implementações em memória com seed
└─ presentation/                  # UI
   ├─ theme/                      # tokens, ThemeProvider, GlobalStyle
   ├─ components/
   │  ├─ atoms/                   # Button, Input, Label, Card, Badge, Spinner, Stack, Divider
   │  ├─ molecules/               # FormField, StatCard, EmptyState, NavItem, ConfirmDialog
   │  └─ organisms/               # AppLayout, PieChart (SVG), Forms e Lists
   ├─ pages/                      # Dashboard, Producers, ProducerDetails, FarmDetails
   └─ routes/                     # react-router
```

Regra de dependência: `presentation → application → domain ← infrastructure`.
UI não conhece axios; `domain` não conhece nenhuma outra camada.

## Requisitos de negócio cobertos

- Cadastro / edição / exclusão de produtores rurais
- Validação de **CPF ou CNPJ** (dígitos verificadores)
- Fazendas por produtor, com **soma agricultável + vegetação ≤ área total** validada
- Safras (ano) por fazenda; culturas por safra (várias por fazenda/safra)
- Dashboard agregado:
  - Total de fazendas
  - Total de hectares
  - Pizza: **fazendas por estado**
  - Pizza: **culturas plantadas**
  - Pizza: **uso do solo** (agricultável vs vegetação)

## Como rodar

```bash
cp .env.example .env
npm install
npm run dev
```

- App: `http://localhost:5173`
- Por padrão o app usa **dados mockados em memória** (`VITE_USE_MOCKS=true`),
  já seedados com produtores, fazendas, safras e culturas — dá pra abrir o
  dashboard e navegar sem depender do backend rodando.
- Para plugar no backend NestJS: `VITE_USE_MOCKS=false` e ajuste `VITE_API_URL`.

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — type-check + build de produção
- `npm run preview` — serve o build local
- `npm run lint` — ESLint
- `npm test` — testes unitários (Jest + RTL)
- `npm run test:watch` — Jest em modo watch

## Testes

Cobertos por Jest + React Testing Library:

- `domain/validation/document.spec.ts` — CPF / CNPJ (strip, format, valid)
- `domain/validation/farm-areas.spec.ts` — regra de soma das áreas
- `application/store/producers.slice.spec.ts` — reducers da slice normalizada
- `presentation/components/organisms/ProducerForm.spec.tsx` — validação + submit
- `presentation/components/organisms/PieChart.spec.tsx` — render das fatias e legenda

## Decisões relevantes

- **Repositórios com interface no `domain`, implementações no `infrastructure`.**
  Um factory em `infrastructure/repositories/index.ts` decide entre mock e HTTP
  via `VITE_USE_MOCKS`. Isso permite trocar backend sem tocar em nenhuma page ou slice.
- **Slices normalizadas** (`byId` + `ids`) — escalável, evita re-render por reordenação.
- **PieChart em SVG puro** (sem chart lib) — mantém bundle enxuto e evita dependência
  fora do stack pedido pelo scope.
- **Tema tipado** — `styled.d.ts` estende `DefaultTheme`, então `${({ theme }) => ...}`
  tem autocomplete e type-check no editor.
