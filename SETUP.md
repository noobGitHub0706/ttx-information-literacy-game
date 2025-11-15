# セットアップガイド

## 📋 目次

1. [前提条件](#前提条件)
2. [ローカル開発環境のセットアップ](#ローカル開発環境のセットアップ)
3. [GitHubへのアップロード](#githubへのアップロード)
4. [デプロイ](#デプロイ)
5. [Firebase統合（オプション）](#firebase統合オプション)

---

## 前提条件

以下をインストールしてください：

- **Node.js** (v14以上): https://nodejs.org/
- **Git**: https://git-scm.com/
- **GitHubアカウント**: https://github.com/

---

## ローカル開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/ttx-information-literacy-game.git
cd ttx-information-literacy-game
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm start
```

ブラウザで http://localhost:3000 が自動的に開きます。

### 4. ビルド（本番環境用）

```bash
npm run build
```

`build/` ディレクトリに最適化されたファイルが生成されます。

---

## GitHubへのアップロード

### 初回セットアップ

#### 1. GitHubで新しいリポジトリを作成

1. https://github.com/new にアクセス
2. リポジトリ名: `ttx-information-literacy-game`
3. 説明: 「接種理論を用いた情報リテラシー教育ゲーム」
4. Public または Private を選択
5. **Initialize this repository with a README** はチェックしない
6. 「Create repository」をクリック

#### 2. ローカルリポジトリを初期化

プロジェクトディレクトリで：

```bash
# Gitリポジトリを初期化
git init

# すべてのファイルを追加
git add .

# 初回コミット
git commit -m "Initial commit: TTX情報リテラシー教育ゲーム"

# GitHubリポジトリをリモートとして追加（your-usernameを実際のユーザー名に変更）
git remote add origin https://github.com/your-username/ttx-information-literacy-game.git

# メインブランチにプッシュ
git branch -M main
git push -u origin main
```

### 通常の更新フロー

```bash
# 変更をステージング
git add .

# コミット
git commit -m "feat: 新機能の追加"

# プッシュ
git push
```

---

## デプロイ

### GitHub Pages でホスティング

#### 1. package.json に homepage を追加

```json
{
  "homepage": "https://your-username.github.io/ttx-information-literacy-game",
  ...
}
```

#### 2. gh-pages をインストール

```bash
npm install --save-dev gh-pages
```

#### 3. package.json にデプロイスクリプトを追加

```json
{
  "scripts": {
    ...
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

#### 4. デプロイ実行

```bash
npm run deploy
```

数分後、 https://your-username.github.io/ttx-information-literacy-game でアクセス可能になります。

### Vercel でホスティング（推奨）

1. https://vercel.com にアクセス
2. GitHubアカウントで連携
3. リポジトリをインポート
4. 自動的にビルド＆デプロイ

### Netlify でホスティング

1. https://netlify.com にアクセス
2. GitHubアカウントで連携
3. リポジトリを選択
4. ビルド設定:
   - Build command: `npm run build`
   - Publish directory: `build`

---

## Firebase統合（オプション）

研究データを収集する場合、Firebaseと統合できます。

### 1. Firebaseプロジェクトの作成

1. https://console.firebase.google.com/ にアクセス
2. 「プロジェクトを追加」
3. プロジェクト名を入力
4. Google Analyticsは任意

### 2. Firebase SDK のインストール

```bash
npm install firebase
```

### 3. Firebase設定ファイルの作成

`src/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 4. データ収集の実装

ゲーム終了時にデータを保存：

```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

// ゲーム結果を保存
const saveGameResult = async (gameData) => {
  try {
    await addDoc(collection(db, 'game_results'), {
      ...gameData,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error saving data:', error);
  }
};
```

### 5. 環境変数の設定

`.env.local` ファイルを作成（Gitには含めない）:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

---

## トラブルシューティング

### npm install でエラーが出る

```bash
# キャッシュをクリア
npm cache clean --force

# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### ポート3000が使用中

```bash
# 環境変数でポートを変更
PORT=3001 npm start
```

### Tailwind CSS が適用されない

- `public/index.html` に Tailwind CSS の CDN が含まれているか確認
- ブラウザのキャッシュをクリア

---

## サポート

問題が解決しない場合は、GitHubのIssuesで質問してください：
https://github.com/your-username/ttx-information-literacy-game/issues
