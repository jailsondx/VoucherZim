# Diretrizes para Agentes de IA

Este arquivo contém regras e contextos fundamentais para agentes de IA operando neste repositório.

---

## 1. Visão Geral da Stack

* *Frontend / Fullstack:* Next.js (App Router), React, Tailwind CSS, TypeCcript.
* *Backend / API:* Node.js.
* *Gerenciador de Pacotes:* npm (NÃO utilize pnpm ou yarn).

---

## 2. Comandos Principais

Sempre utilize os seguintes comandos no terminal:

* *Desenvolvimento:* npm run dev
* *Build:* npm run build
* *Linting / Formatação:* npm lint e npm format

---

## 3. Padrões de Código e Arquitetura

### Next.js (App Router)
* Mantenha a estrutura sob o diretório src/app/.
* *Server Components por padrão:* Só adicione a diretiva 'use client' no topo do arquivo se o componente precisar de estado (useState), efeitos (useEffect) ou eventos do navegador (onClick).
* Organize componentes reutilizáveis em src/components/ui/.
* *Tipagem estrita:* Sempre defina interfaces ou tipos explicitamente. Evite o uso de any, utilize arquivos de interfaces em .ts dentro da pasta de /interfaces, não defina interfaces diretamente dentro dos arquivos tsx.
* *Estilo em Tailwind:* Não crie classes ou arquivos .css, utilizae prioritariamente TailWindCSS.
* Será somente 1 tema, não terá mudança de tema Light e Dark
* Sempre iniciar as ClassName com as proprieades da estilização FLEX, seguido das propriedades de Width e Heigth (Se aplicavies), e do texto (Se aplicaveis) e das Cores (Se aplicaveis)
* A Propriedade de ClassName sempre deve ser a primeira definida em uma tag. Se for um input, o tipo do input deve sempre ser a segunda.
* Bibliotecas externas deve ser usado a shadcn se necessário/recomendado.

### Node.js
* JAMAIS leia os dados dos arquivos ENV
* Use o padrão de caminhos com alias configurados no tsconfig.json (ex: @/components/, @/lib/, @/actions/).
