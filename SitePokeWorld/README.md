# PokeWorld

Página estática de download do PokeWorld para Android.

## Publicar o APK

Crie uma Release pública no repositório GitHub e anexe o APK. A página consulta a última Release e libera o botão quando encontra um arquivo `.apk`; se houver um arquivo chamado `PokeWorld.apk`, ele terá preferência. Não é necessário adicionar o APK ao Git comum.

A seção de novidades também mostra a tag da versão, a data de publicação e o texto das notas da Release. Se as notas estiverem vazias ou a consulta falhar, a página informa isso e mantém um link para as Releases. A seção de perguntas frequentes explica a instalação e oferece alternativas caso o download não funcione.

## Configurar login e dados do personagem

A área Minha conta usa Supabase Auth para cadastro/login por e-mail e senha e o banco Supabase para guardar o personagem e os seis Pokémon. Os dados são preenchidos manualmente; o jogo ainda não fornece uma API para sincronizá-los automaticamente.

1. Crie um projeto no [Supabase](https://supabase.com/).
2. No SQL Editor do projeto, execute o conteúdo de `supabase-schema.sql`. As tabelas usam Row Level Security para cada conta acessar somente os próprios dados.
3. Em **Project Settings → API**, copie a Project URL e a chave `anon`/publishable. Use a URL base terminada em `.supabase.co`, sem `/rest/v1/`. No arquivo `script.js`, preencha `supabaseUrl` e `supabaseAnonKey` com esses valores.
4. Em **Authentication → URL Configuration**, configure a URL do site publicado. Para testar, sirva a pasta por HTTP em vez de abrir o HTML diretamente.
5. Publique o site em uma hospedagem estática com HTTPS. O visitante pode criar uma conta, confirmar o e-mail se essa opção estiver habilitada no Supabase, preencher personagem/equipe e voltar depois para consultar os dados.

Use somente a chave pública `anon`/publishable no site. Nunca coloque uma chave `service_role` no JavaScript ou em arquivos publicados.

## Testar localmente

Abra `index.html` em um navegador. Para testar a consulta à Release, sirva esta pasta por HTTP, por exemplo com a extensão Live Server do VS Code. A Release precisa estar publicada para o botão ser ativado nesse modo.

## Hospedar

Publique o conteúdo desta pasta em qualquer hospedagem de site estático. O APK será entregue pelo link da Release do GitHub.