# Frontend — Brain Agriculture

SPA em **React + TypeScript (Vite)** com **arquitetura em camadas**.

## Estrutura de pastas

```
src/
├─ main.tsx                       # bootstrap (Redux Provider + Router)
├─ domain/                        # tipos e contratos de negócio
│  ├─ entities/                   # Producer, Farm, ...
│  └─ repositories/               # interfaces
├─ application/                   # estado + regras de aplicação
│  ├─ store/                      # Redux Toolkit (slices)
│  ├─ hooks/                      # useAppDispatch/useAppSelector
│  └─ use-cases/                  # orquestração (chama repositório + store)
├─ infrastructure/                # detalhes técnicos
│  ├─ http/                       # cliente axios
│  └─ repositories/               # implementações HTTP dos contratos
└─ presentation/                  # UI
   ├─ pages/                      # views por rota
   ├─ components/                 # atomic design (atoms/molecules/organisms)
   ├─ routes/                     # react-router
   └─ theme/                      # styled-components (global, tokens)
```

Regra de dependência: `presentation → application → domain ← infrastructure`.
UI não conhece axios; `domain` não conhece nenhuma outra camada.

## Como rodar

```bash
cp .env.example .env
npm install
npm run dev
```

- App: `http://localhost:5173`
- API esperada em: `VITE_API_URL` (padrão `http://localhost:3000/api`)

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — build de produção
- `npm run preview` — serve build local
- `npm run lint` — ESLint
# FrontEnd
# BackEnd
