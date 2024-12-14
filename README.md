# ⛏️ハックツ・アンキロカップ🏆

<p align="center">
    <img src="https://img.shields.io/badge/TEAM-OBJECT<T>-1f5cbf.svg?&style=for-the-badge">
    <img src="https://img.shields.io/github/commit-activity/t/naoido/hack-z-ankylo/main?style=for-the-badge">
</p>
<br>

## 概要
> [!NOTE]  
> 初めて使用する技術  
> Elixir, Quarkus, ReactNative, Supabase, Uptime Kuma, Hono

今回は様々な技術を取り入れ、マイクロサービスアーキテクチャを採用したサービスになっています。

<br>
<div>
    <h3 align="center">🛠️ 使用技術 ⛑️</h3>
    <p align="center">
        <img src="https://img.shields.io/badge/JS-APOLLO-311C87.svg?logo=apollographql&style=for-the-badge">
        <img src="https://img.shields.io/badge/Elixir-PHOENIX-4B275F.svg?logo=elixir&style=for-the-badge">
        <img src="https://img.shields.io/badge/Java-QUARKUS-4695EB.svg?logo=quarkus&style=for-the-badge">
        <img src="https://img.shields.io/badge/TS-REACT_NATIVE-61DAFB.svg?logo=react&style=for-the-badge">
        <img src="https://img.shields.io/badge/TS-HONO-E36002.svg?logo=hono&style=for-the-badge">
    </p>
    <p align="center">
        <img src="https://img.shields.io/badge/arch-MICROSERVICE-c93a95.svg?&style=for-the-badge">
        <img src="https://img.shields.io/badge/CONTAINER-DOCKER-2496ED.svg?logo=docker&style=for-the-badge">
    </p>
    <br>
    <h3 align="center">☁️ Cloud Services ☁️</h3>
    <p align="center">
        <img src="https://img.shields.io/badge/SAAS-CLOUDFLARE_WORKERS-F38020.svg?logo=cloudflare-workers&style=for-the-badge">
        <img src="https://img.shields.io/badge/BaaS-SUPABASE-3FCF8E.svg?logo=supabase&style=for-the-badge">
    </p>
    <h3 align="center">🐻 Monitor 📺</h3>
    <p align="center">
        <img src="https://img.shields.io/badge/MONITOR-UPTIME_KUMA-5CDD8B.svg?logo=uptime-kuma&style=for-the-badge">
    </p>
</div>

## バックエンド実行手順 📕
1. リポジトリをcloneする
> [!IMPORTANT]
> .envなどを共有するために、サブモジュールにプライベートリポジトリが含まれるため、  
> お試しでされる方は`--recurse-submodules`オプションを削除ください

`git clone --recurse-submodules https://github.com/naoido/hack-z-ankylo.git`  
  
2. docker composeをビルド・立ち上げる
```bash
# 必要なファイルを生成・ビルドする
$ make init
# コンテナ群を立ち上げる
$ docker compose up --build -d
```

3. 接続を確認する
一緒に立ち上がったCloudflareTunnelのドメインにアクセスする<br>
`https://workers.example.com/graphql`にアクセスし、Apolloの画面が表示されれば成功

<br><br>
## .envファイルの構成
```
R2_ENDPOINT="R2エンドポイント"
R2_ACCESS_KEY="R2アクセスキー"
R2_SECRET_KEY="R2シークレットキー"
R2_BUCKET_NAME="R2バケット名"

CLOUDFLARE_WORKERS_BASE_URL="CloudlfareWorkersのベースURL"

SUPABASE_BASE_URL="SupabaseのベースURL"
SUPABASE_JWT_SECRET="JWTのシークレットキー"
SUPABASE_PUBLIC_API_KEY="SupabaseのパブリックAPIキー"

TEST_USER_EMAIL="テストユーザーのメールアドレス"
TEST_USER_PASSWORD="テストユーザーのパスワード"

TUNNEL_BASE_URL="トンネルに割り当ててるベースURL"
TUNNEL_TOKEN="トンネルのトークン"
```
