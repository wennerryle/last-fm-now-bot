<bold color = "red">Внимание!</bold> Не работает на Termux(из-за проблем со сборкой node-gyp и sqlite);
<bold color = "red">Внимание!</bold> Не корректно работает отправка картинок в inline-сообщения со сторонних серверов в Telegram, и он пишет Not Found, обойти это можно отправив картинку заранее на сервера Telegram, и далее прекрепить картинку к Inline-сообщению при помощи file_id аттрибута 

![example picture](./example.jpg)
Отправляет картинку текущего играющего трека из last.fm

### Для запуска сделайте следующее: ###

```shell || powershell
git clone https://github.com/wennerryle/last-fm-now-bot && cd src
npm install
echo "" > .env
```

#### Токены небходимые для работы ####
Далее вам потребуются токены для работы бота.
- telegram token. [Создать его можно здесь](https://t.me/BotFather "Bot father")
- imgbb token. [Создать его можно здесь](https://api.imgbb.com/ "api imgbb")
- lastfm token. [Создать его можно здесь](https://www.last.fm/api/account/create "api last.fm")

Токен от imgbb требовался для генерации картинок, в данный момент существует баг телеграмма
"Не найдено", в будущем от этой зависимости нужно будет избавиться, чтобы убрать баг

Токен от lastfm требуется для того, чтобы показывать последний трек, который слушал пользователь

#### Настройка .env переменных ####

В директории src, если вы выполнили команды для запуска, должен появиться пустой файл .env
Внесите туда следующий текст с ранее созданными токенами:

```env
LAST_FM_TOKEN = "your last fm token"
BOT_TOKEN = "your bot token"
IMGBB_TOKEN = "your imgbb token"
```

#### Это почти всё. Осталось запустить бота ####

Для этого из директории src введите команду

Для разработки:
```shell || powershell
npm run dev
```

Для постоянной работы:
```shell || powershell
node index.js
```