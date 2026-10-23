# nuxt-utc-bucket

UTC と JST (Asia/Tokyo) の日時を変換する静的 Web アプリだよ。
一行でも複数行でも使えて、日本語と英語に対応している。

- 公開版: https://yuu-eguci.github.io/nuxt-utc-bucket/
- Docker: 対応!
- Node.js: 24.22.1 (LTS)
- npm: 11 (Node.js 同梱版)
- Framework: Vue 3、Vite 8、Vuetify 4、vue-i18n 11、Day.js 1
- Linter: ESLint 10、eslint-plugin-vue、typescript-eslint
- 型チェック: vue-tsc
- Test: Vitest 5、Vue Test Utils、jsdom

## パッと実行してみたい

### Docker で動かす

```bash
# lint / 型チェック / テスト / ビルドをコンテナでまとめて実行
docker build --target check -t nuxt-utc-bucket:check .
docker run --rm --name nuxt-utc-bucket-check nuxt-utc-bucket:check

# GitHub Pages と同じパス (/nuxt-utc-bucket/) でビルドしてプレビュー
docker build --target preview -t nuxt-utc-bucket:preview .
docker run -d --rm --name nuxt-utc-bucket-preview -p 4173:4173 nuxt-utc-bucket:preview
# → http://localhost:4173/nuxt-utc-bucket/
docker stop nuxt-utc-bucket-preview
```

### ローカルで動かす

Node.js は `.nvmrc` のバージョン (24.22.1) を使う。
Volta は `package.json` の `volta` を読んで自動で切り替える。
nvm や mise では `.nvmrc` を読み込んでね。

```bash
# 依存をインストール (package-lock.json どおりに入れる)
npm ci

# 開発サーバー (http://localhost:5173/)
npm run dev

# lint / 型チェック / テスト
npm run lint
npm run typecheck
npm test

# 全部まとめて (CI と同じ)
npm run verify

# 静的ファイルを dist/ にビルド (ルート配信用)
npm run build

# GitHub Pages 用にビルド (base が /nuxt-utc-bucket/ になる)
npm run build:github-pages
npm run preview:github-pages
# → http://localhost:4173/nuxt-utc-bucket/
```

## デモ動画

初期版の操作動画は `video/(2023-05-08)nuxt-utc-bucket.mp4` にあるよ。

https://user-images.githubusercontent.com/28250432/236964716-007c5374-6dc5-414e-b5de-fb42fcf92472.mp4

現行版とは余白や幅が少し違う。

## 使い方

- UTC 欄に `2023-12-31 23:00:00` と入れると JST に変換する。
- Asia/Tokyo 欄に入れると UTC に変換する。
- 入力に `Z`、`z`、`+09:00` のオフセットがある場合は、入力欄のタイムゾーンと一致する必要がある。
- 複数行タブでは行ごとに変換する。
- 空欄の行はそのまま残す。
- 改行コードは LF と CRLF に対応している。
- 結果のカードをクリックするとコピーできる。
- コピーに失敗するとメッセージを表示する。
- 初回の言語はブラウザの設定から選ぶ。
- 対応する言語がなければ日本語になる。
- 選んだ言語は `i18n_redirected` cookie に保存する。
- 変換結果は実行する端末のタイムゾーンに依存しない。

## ディレクトリ

- `src/utils`: 日時変換の処理。
- `src/components`: 一行・複数行の変換画面と説明カード。
- `src/composables/useCopy.ts`: コピー処理。
- `src/locales`: 日本語と英語のメッセージ。
- `public`: favicon などの静的ファイル。
- `tests`: 日時変換、画面、言語設定、ビルドパスのテスト。

## 実行環境と CI

- Node.js の指定は `.nvmrc`、`package.json` の `engines` と `volta`、`Dockerfile`、GitHub Actions で揃えている。
- `npm run check:node` で Node.js の指定が一致するか確認できる。
- Docker のベースイメージは digest で固定している。
- ローカル・CI・Docker で `npm ci` を使い、`package-lock.json` の依存を入れる。
- `ci.yml` は PR と `dev`・`main` への push で実行する。
- CI では audit、署名確認、lint、型チェック、複数の `TZ` でのテスト、Pages 用ビルド、出力パスを確認する。
- Docker での検証とプレビューの応答確認も行う。
- `cd.yml` は `main` への push で検証を通してから `dist/` を `gh-pages` に公開する。
- 公開パスは `/nuxt-utc-bucket/` だよ。
- 外部の Actions は commit SHA で固定している。
- Dependabot で npm・GitHub Actions・Docker の更新を確認する。
