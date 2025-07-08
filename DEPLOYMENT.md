# デプロイ手順

このドキュメントでは、GitHubとVercelを使ってAPIサーバーをデプロイする手順を説明します。

## 🚀 前提条件

- GitHubアカウント
- Vercelアカウント
- Node.js 18以上

## 📋 手順

### 1. GitHubリポジトリの準備

1. **GitHubでリポジトリを作成**
   ```bash
   # ローカルでGitリポジトリを初期化
   git init
   git add .
   git commit -m "Initial commit"
   
   # GitHubでリポジトリを作成後、リモートを追加
   git remote add origin https://github.com/yourusername/disney-api.git
   git branch -M main
   git push -u origin main
   ```

2. **環境変数の設定**
   - GitHubリポジトリのSettings > Secrets and variables > Actions
   - 以下のシークレットを追加：
     - `API_TOKEN`: API認証用トークン（任意の文字列）
     - `VERCEL_TOKEN`: Vercelのアクセストークン
     - `ORG_ID`: Vercelの組織ID
     - `PROJECT_ID`: VercelのプロジェクトID

### 2. Vercelの設定

1. **Vercelアカウントの作成**
   - [Vercel](https://vercel.com)にアクセス
   - GitHubアカウントでサインアップ

2. **プロジェクトの作成**
   - Vercelダッシュボードで「New Project」をクリック
   - GitHubリポジトリを選択
   - プロジェクト名を設定（例：`disney-api`）

3. **環境変数の設定**
   - プロジェクト設定 > Environment Variables
   - 以下の環境変数を追加：
     ```
     API_TOKEN=your-secret-api-token-here
     NODE_ENV=production
     ```

4. **Vercelトークンの取得**
   - Vercelダッシュボード > Settings > Tokens
   - 新しいトークンを作成
   - このトークンをGitHubの`VERCEL_TOKEN`シークレットに設定

5. **組織IDとプロジェクトIDの取得**
   - VercelダッシュボードのURLから取得：
     - 組織ID: `https://vercel.com/[ORG_ID]/[PROJECT_ID]`
     - プロジェクトID: プロジェクト設定ページのURLから取得

### 3. デプロイの実行

1. **コードをプッシュ**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **GitHub Actionsの確認**
   - GitHubリポジトリのActionsタブでワークフローの実行状況を確認
   - テストが成功すると自動的にVercelにデプロイ

3. **Vercelでの確認**
   - Vercelダッシュボードでデプロイ状況を確認
   - デプロイが完了するとURLが表示される

### 4. 動作確認

デプロイが完了したら、以下のエンドポイントで動作確認：

```bash
# API情報
curl https://your-app.vercel.app/

# ヘルスチェック
curl https://your-app.vercel.app/health

# パーク情報（トークンが必要）
curl "https://your-app.vercel.app/exec?park=land&type=standby&token=YOUR_API_TOKEN"

# API ドキュメント
curl https://your-app.vercel.app/docs
```

## 🔧 トラブルシューティング

### よくある問題

1. **環境変数が設定されていない**
   - Vercelの環境変数設定を確認
   - GitHub Actionsのシークレット設定を確認

2. **デプロイが失敗する**
   - GitHub Actionsのログを確認
   - Vercelのデプロイログを確認

3. **APIが動作しない**
   - 環境変数`API_TOKEN`が正しく設定されているか確認
   - ログを確認してエラーの詳細を把握

### ログの確認方法

1. **Vercelログ**
   - Vercelダッシュボード > プロジェクト > Functions
   - 関数のログを確認

2. **GitHub Actionsログ**
   - GitHubリポジトリ > Actions
   - ワークフローの実行ログを確認

## 🔄 継続的デプロイ

設定が完了すると、以下の場合に自動デプロイされます：

- `main`ブランチにプッシュ
- プルリクエストがマージされる

## 📊 監視

- **Vercel Analytics**: パフォーマンスとエラーを監視
- **GitHub Actions**: テストとデプロイの状況を監視
- **API ヘルスチェック**: `/health`エンドポイントで健全性を確認

## 🔒 セキュリティ

- API認証トークンは必ず環境変数で管理
- 本番環境では強力なトークンを使用
- 定期的にトークンを更新

## 📞 サポート

問題が発生した場合は：

1. GitHubのIssuesで報告
2. Vercelのサポートに問い合わせ
3. ログを確認して詳細な情報を収集 