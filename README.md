# Tokyo Disney Resort Unofficial API

東京ディズニーリゾートの待ち時間情報を提供する非公式APIサーバーです。

## 🎯 機能

- 東京ディズニーランド・シーの待ち時間情報取得
- FastPass情報取得
- ヘルスチェックエンドポイント
- Prometheusメトリクス
- Swagger API ドキュメント

## 🚀 デプロイ

このプロジェクトは以下の方法でデプロイできます：

### Vercel (推奨)

1. GitHubリポジトリをVercelに接続
2. 環境変数を設定
3. 自動デプロイ

### Docker Compose (ローカル開発)

```bash
docker-compose up -d
```

## 📚 API エンドポイント

### 基本情報取得
```
GET /exec?park=land&type=standby&token=YOUR_API_TOKEN
```

### ヘルスチェック
```
GET /health
```

### メトリクス
```
GET /metrics
```

### API ドキュメント
```
GET /docs
```

## 🔧 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `API_TOKEN` | API認証トークン | ✅ |
| `REDIS_URL` | Redis接続URL | ❌ |
| `PORT` | サーバーポート | ❌ (デフォルト: 3000) |
| `LOG_LEVEL` | ログレベル | ❌ (デフォルト: info) |

## 🛠️ 開発

### セットアップ

```bash
# 依存関係のインストール
cd api-server
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集して必要な値を設定

# サーバーの起動
npm start
```

### スクレイピング

```bash
cd scraper
python cli.py --park land --type standby
```

## 📊 メトリクス

Prometheusメトリクスが `/metrics` エンドポイントで提供されます。

## 🔒 セキュリティ

- API認証トークンによるアクセス制御
- 環境変数による設定管理
- エラーハンドリング

## 📄 ライセンス

このプロジェクトは非公式のものです。東京ディズニーリゾートの利用規約に従ってご利用ください。

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。

## 📞 サポート

問題が発生した場合は、GitHubのイシューを作成してください。 