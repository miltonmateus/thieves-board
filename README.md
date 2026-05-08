<div align="center">

# Thieves Board API

![Legenda](./src/assets/Logo.png)

Backend do sistema **Thieves Board**, responsável por gerenciar fichas, quests e mecânicas de RPG.

</div>

---

<div align="center">

## Tecnologias

</div>

- **Node.js**
- **NestJS**
- **Fastify** (adapter HTTP)
- **@fastify/multipart** (upload de arquivos / PDFs)
- **TypeScript**
- **MongoDB** (via Mongoose)
- **Zod** (validação de dados)
- **PDF Parsing + OCR** (extração de texto de PDFs e imagens)
- **Playwright** (renderização de HTML para PDF)
- **Jest** (testes e cobertura)

---

<div align="center">

## Funcionalidades

</div>

### Fichas de Personagem

- Upload de ficha em PDF, JPG ou PNG
- Extração automática de dados via texto ou OCR
- Conversão para JSON estruturado
- Persistência no MongoDB
- Edição manual via API
- Preview do texto extraído antes de salvar
- Geração de HTML e PDF da ficha
- Template base para novas fichas T13

#### Endpoints

POST /sheets  
GET /sheets  
GET /sheets/:id  
PATCH /sheets/:id  
DELETE /sheets/:id

POST /sheets/upload-character-file  
POST /sheets/upload-character-pdf  
POST /sheets/preview-character-file

GET /sheets/:id/html  
GET /sheets/:id/pdf

GET /sheets/templates/t13/new-sheet

---

### Fichas de Itens Mágicos

- Upload de ficha em PDF, JPG ou PNG
- Extração e parsing para JSON estruturado
- CRUD completo de itens mágicos
- Associação e remoção de itens mágicos no inventário da ficha
- Template base para novos itens mágicos T13

#### Endpoints

POST /sheets/magic-items  
GET /sheets/magic-items  
GET /sheets/magic-items/:id  
PATCH /sheets/magic-items/:id  
DELETE /sheets/magic-items/:id

POST /sheets/upload-magic-item-file  
POST /sheets/preview-magic-item-file

POST /sheets/:id/inventory/magic-items/:magicItemId  
DELETE /sheets/:id/inventory/magic-items/:magicItemId

GET /sheets/templates/t13/new-magic-item-sheet

---

### Sistema de Dados

- d2, d4, d6, d8, d10, d12, d20
- Rolagem com quantidade (ex: 3d6)

#### Endpoints

GET /dice  
POST /dice/roll

---

### Sistema de Quests

#### Endpoints

POST /quests  
GET /quests  
GET /quests/active  
POST /quests/select  
POST /quests/complete

---

<div align="center">

## Arquitetura

</div>

```bash
src/
├── common/
├── quests/
├── dice/
├── sheets/
│   ├── data/
│   ├── detectors/
│   ├── enums/
│   ├── maps/
│   ├── parsers/
│   ├── pdf-document-service/
│   ├── schemas/
│   ├── services/
│   └── sheets.controller.ts
└── assets/
```

<div align="center">

## Instalação

</div>

```bash
pnpm install
```

---

<div align="center">

## Rodando o projeto

</div>

```bash
pnpm start:dev
```

http://localhost:3000

---

<div align="center">

## Testes e qualidade

</div>

```bash
pnpm test
pnpm exec jest --coverage --runInBand
pnpm run lint
pnpm exec tsc --noEmit
pnpm run build
```

- A cobertura é gerada em `coverage/`
- O diretório `coverage/` não deve ser versionado
- Os testes ficam próximos dos arquivos testados como `*.spec.ts`

---

<div align="center">

## Autor

Milton Teixeira

</div>
