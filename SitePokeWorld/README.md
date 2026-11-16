# PokeWorld

Página estática de download do PokeWorld para Android.

## Publicar o APK

Crie uma Release pública no repositório GitHub e anexe o APK. A página consulta a última Release e libera o botão quando encontra um arquivo `.apk`; se houver um arquivo chamado `PokeWorld.apk`, ele terá preferência. Não é necessário adicionar o APK ao Git comum.

A seção de novidades também mostra a tag da versão, a data de publicação e o texto das notas da Release. Se as notas estiverem vazias ou a consulta falhar, a página informa isso e mantém um link para as Releases. A seção de perguntas frequentes explica a instalação e oferece alternativas caso o download não funcione.

## Testar localmente

Abra `index.html` em um navegador. Para testar a consulta à Release, sirva esta pasta por HTTP, por exemplo com a extensão Live Server do VS Code. A Release precisa estar publicada para o botão ser ativado nesse modo.

## Hospedar

Publique o conteúdo desta pasta em qualquer hospedagem de site estático. O APK será entregue pelo link da Release do GitHub.