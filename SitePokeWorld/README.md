# PokeWorld

Página estática de download do PokeWorld para Android.

## Publicar o APK

Crie uma Release pública no repositório GitHub e anexe o APK. A página consulta a última Release e libera o botão quando encontra um arquivo `.apk`; se houver um arquivo chamado `PokeWorld.apk`, ele terá preferência. Não é necessário adicionar o APK ao Git comum.

## Testar localmente

Abra `index.html` em um navegador. Para testar a consulta à Release, sirva esta pasta por HTTP, por exemplo com a extensão Live Server do VS Code. A Release precisa estar publicada para o botão ser ativado nesse modo.

## Hospedar

Publique o conteúdo desta pasta em qualquer hospedagem de site estático. O APK será entregue pelo link da Release do GitHub.