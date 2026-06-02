UniRead

UniRead é uma plataforma web de assinatura voltada para leitura digital de mangás, livros e HQs, desenvolvida como projeto de Trabalho de Conclusão de Curso do curso de Análise e Desenvolvimento de Sistemas.

A proposta do sistema é reunir diferentes tipos de obras em um único ambiente digital, oferecendo ao usuário uma experiência mais prática, organizada e personalizada. A plataforma conta com telas de login, biblioteca, autores, descrição de obras, leitura digital, perfil do usuário e um chatbot chamado Lumi, responsável por auxiliar na recomendação de conteúdos.

Objetivo do Projeto

O objetivo principal do UniRead é centralizar o acesso a mangás, livros e histórias em quadrinhos em uma única plataforma web, reduzindo a necessidade de utilizar vários serviços diferentes para consumir conteúdos de leitura digital.

Além disso, o projeto busca incentivar o hábito da leitura por meio de recursos como recomendações personalizadas, histórico de leitura, favoritos, perfil com progresso do usuário e elementos de gamificação.

Funcionalidades
Cadastro e login de usuários;
Biblioteca digital com obras organizadas;
Busca por títulos, autores e categorias;
Tela de autores;
Tela de descrição da obra;
Leitor digital integrado;
Sistema de favoritos;
Histórico e progresso de leitura;
Perfil do usuário com nível, experiência e recompensas;
Chatbot Lumi para recomendação de obras;
Integração com API externa para busca de mangás;
Estrutura preparada para integração com banco de dados Supabase;
Configuração para deploy na Vercel.
Tecnologias Utilizadas
Front-end
HTML5;
CSS3;
JavaScript.
Back-end
Node.js;
Express.js.
Banco de Dados
Supabase.
APIs e Integrações
MangaDex API;
Supabase;
Vercel.

Estrutura do Projeto
TCC - Definitivo/
│
├── index.html
├── Login.html
├── Biblioteca.html
├── Autores.html
├── Descricao.html
├── Leitura.html
├── Lumi.html
├── Perfil.html
│
├── src/
│   ├── Js/
│   ├── css/
│   └── imagens/
│
├── backend/
│   ├── server.js
│   ├── manga.js
│   ├── mangadex.js
│   ├── mangaHandlers.js
│   ├── supabase.js
│   ├── routes/
│   ├── repositories/
│   └── supabase_tabelas.sql
│
├── api/
│   └── index.js
│
├── package.json
├── vercel.json
└── README.md

O back-end do UniRead foi desenvolvido utilizando Node.js com Express.js. Ele é responsável por organizar as rotas da aplicação, processar requisições e realizar a comunicação com serviços externos e banco de dados.

Entre as principais rotas do sistema estão:

Rotas de login e cadastro;
Rotas de perfil do usuário;
Rotas de favoritos;
Rotas de busca de mangás;
Rotas de capítulos e páginas;
Rotas para progresso de leitura.
Banco de Dados

O projeto possui estrutura preparada para uso com Supabase, contendo tabelas voltadas para:

Usuários;
Favoritos;
Progresso de leitura.

O arquivo supabase_tabelas.sql contém os comandos SQL necessários para criação das tabelas no banco de dados.

Chatbot Lumi

A Lumi é uma assistente virtual criada para tornar a experiência do usuário mais interativa. Sua função é recomendar obras com base no que o usuário informa, como preferências de leitura ou estado emocional.

Na versão atual, a Lumi funciona com uma lógica inicial de recomendação baseada em palavras-chave e sentimentos. Futuramente, a proposta é integrar a assistente a uma API de inteligência artificial para tornar as respostas mais naturais e personalizadas.


Status do Projeto

O UniRead está em desenvolvimento como protótipo funcional de uma plataforma de leitura digital. Algumas funcionalidades já estão implementadas, enquanto outras estão planejadas para melhorias futuras, como:

Integração completa com sistema de pagamento;
Expansão do catálogo de obras;
Integração avançada com inteligência artificial;
Melhorias no sistema de recomendação;
Testes com usuários reais;
Melhorias de responsividade e desempenho.
Autores

Projeto desenvolvido por:

Nykolas Luan;
Antony William;
Cleyson de Souza;
Rafael Lourenço;
João Victor Viana.
Orientadora

Profa. Luana Magalhães Nunes Leal.

Instituição

Faculdade Metropolitana de Manaus - FAMETRO
Curso de Tecnologia em Análise e Desenvolvimento de Sistemas

Licença

Este projeto foi desenvolvido para fins acadêmicos.
