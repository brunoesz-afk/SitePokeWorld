# PokeWorld

Página estática de download do PokeWorld para Android.

## Publicar o APK

Crie uma Release pública no repositório GitHub e anexe o APK. A página consulta a última Release e libera o botão quando encontra um arquivo `.apk`; se houver um arquivo chamado `PokeWorld.apk`, ele terá preferência. Não é necessário adicionar o APK ao Git comum.

A seção de novidades também mostra a tag da versão, a data de publicação e o texto das notas da Release. Se as notas estiverem vazias ou a consulta falhar, a página informa isso e mantém um link para as Releases. A seção de perguntas frequentes explica a instalação e oferece alternativas caso o download não funcione.

## Configurar login, personagem e sincronização do jogo

A área Minha conta usa Supabase Auth para cadastro/login por e-mail e senha. No site, o jogador informa somente nome, gênero e região inicial; nível, experiência, progresso, insígnias e equipe de seis Pokémon são exibidos a partir do Supabase. O jogo precisa usar a mesma conta Supabase e escrever os dados nessas tabelas para que a sincronização aconteça.

1. Crie um projeto no [Supabase](https://supabase.com/).
2. No SQL Editor, execute `supabase-schema.sql` para criar as tabelas e as políticas RLS. Se o projeto já tinha as tabelas da versão anterior, execute também `supabase-game-sync-migration.sql` para adicionar os campos de sincronização sem apagar os dados.
3. Em **Project Settings → API**, copie a Project URL e a chave `anon`/publishable. Use a URL base terminada em `.supabase.co`, sem `/rest/v1/`. No arquivo `script.js`, preencha `supabaseUrl` e `supabaseAnonKey` com esses valores.
4. Em **Authentication → URL Configuration**, configure a URL do site publicado. Para testar, sirva a pasta por HTTP em vez de abrir o HTML diretamente.
5. Em **Authentication → Sign In / Providers**, habilite Email. Publique o site em uma hospedagem estática com HTTPS. O visitante cria a conta, confirma o e-mail se essa opção estiver habilitada e salva o nome, gênero e região do personagem.
6. Atualize o projeto do jogo para autenticar o mesmo jogador no Supabase e sincronizar `player_level`, `experience`, `progress_summary`, `badges` e `last_game_sync_at` em `player_profiles`, mais as posições de 1 a 6 em `pokemon_party` (`pokemon_name`, `pokemon_level`, `species_id` e `nickname`). Use o mesmo `auth.users.id` do site; as políticas RLS limitam as alterações aos próprios dados da conta.

O site mostra os dados do jogo somente depois que a integração do jogo enviar a primeira sincronização. Use somente a chave pública `anon`/publishable nos clientes. Nunca coloque uma chave `service_role` no JavaScript, no jogo ou em arquivos publicados.

## Testar localmente

Abra `index.html` em um navegador. Para testar a consulta à Release, sirva esta pasta por HTTP, por exemplo com a extensão Live Server do VS Code. A Release precisa estar publicada para o botão ser ativado nesse modo.

## Hospedar

Publique o conteúdo desta pasta em qualquer hospedagem de site estático. O APK será entregue pelo link da Release do GitHub.