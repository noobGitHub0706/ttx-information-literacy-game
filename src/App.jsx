import React, { useState } from 'react';
import DefensiveTTXGame from './components/DefensiveTTXGame';
import ManipulatorSimulator from './components/ManipulatorSimulator';

function App() {
  const [currentGame, setCurrentGame] = useState(null);

  if (currentGame === 'defensive') {
    return (
      <div>
        <button
          onClick={() => setCurrentGame(null)}
          className="fixed top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition z-50"
        >
          ← メニューに戻る
        </button>
        <DefensiveTTXGame />
      </div>
    );
  }

  if (currentGame === 'manipulator') {
    return (
      <div>
        <button
          onClick={() => setCurrentGame(null)}
          className="fixed top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition z-50"
        >
          ← メニューに戻る
        </button>
        <ManipulatorSimulator />
      </div>
    );
  }

  // メインメニュー
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            TTX 情報リテラシー教育ゲーム
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            接種理論を用いた情報操作への心理的抵抗力育成
          </p>
          <p className="text-sm text-gray-400">
            Tabletop Exercise for Information Literacy Education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 防御側ゲーム */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition">
            <div className="text-6xl mb-4">🛡️</div>
            <h2 className="text-3xl font-bold mb-4">防御側TTX</h2>
            <p className="text-gray-300 mb-6">
              情報操作を<strong className="text-blue-300">見抜く側</strong>として、
              3人の情報操作者の主張に対応します。
            </p>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-blue-300">特徴:</h3>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• 真偽が混在した情報</li>
                <li>• 検証・質問・信じる・無視の4アクション</li>
                <li>• 限られたリソースでの戦略的判断</li>
                <li>• ターン制の相互作用</li>
              </ul>
            </div>

            <button
              onClick={() => setCurrentGame('defensive')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              防御側ゲームを開始
            </button>
          </div>

          {/* 攻撃側シミュレーター */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition">
            <div className="text-6xl mb-4">⚔️</div>
            <h2 className="text-3xl font-bold mb-4">攻撃側シミュレーター</h2>
            <p className="text-gray-300 mb-6">
              情報を<strong className="text-red-300">操作する側</strong>として、
              様々な手法で市民を説得します。
            </p>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-red-300">特徴:</h3>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• 3ラウンドの段階的説得プロセス</li>
                <li>• 市民の反応と説得度メーター</li>
                <li>• 倫理的ジレンマの体験</li>
                <li>• 代償の可視化とデブリーフィング</li>
              </ul>
            </div>

            <button
              onClick={() => setCurrentGame('manipulator')}
              className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition"
            >
              攻撃側シミュレーターを開始
            </button>
          </div>
        </div>

        {/* 推奨プレイフロー */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 mb-12">
          <h2 className="text-2xl font-bold mb-4">📋 推奨プレイフロー</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <div className="bg-blue-600 text-white rounded-lg p-4 mb-2">
                <div className="text-2xl mb-1">1️⃣</div>
                <div className="font-semibold">防御側ゲーム</div>
                <div className="text-sm opacity-80">事前テスト</div>
              </div>
            </div>
            <div className="text-2xl">→</div>
            <div className="flex-1 text-center">
              <div className="bg-red-600 text-white rounded-lg p-4 mb-2">
                <div className="text-2xl mb-1">2️⃣</div>
                <div className="font-semibold">攻撃側シミュレーター</div>
                <div className="text-sm opacity-80">接種体験</div>
              </div>
            </div>
            <div className="text-2xl">→</div>
            <div className="flex-1 text-center">
              <div className="bg-green-600 text-white rounded-lg p-4 mb-2">
                <div className="text-2xl mb-1">3️⃣</div>
                <div className="font-semibold">防御側ゲーム</div>
                <div className="text-sm opacity-80">事後テスト</div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-300 mt-4">
            この順序で両方のゲームをプレイすることで、最大の学習効果が得られます
          </p>
        </div>

        {/* 研究背景 */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
          <h2 className="text-2xl font-bold mb-4">🎓 研究背景</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2 text-yellow-300">接種理論 (Inoculation Theory)</h3>
              <p className="text-gray-300">
                弱毒化された攻撃を事前に体験することで、
                実際の攻撃に対する心理的抵抗力を獲得する理論。
                ワクチンと同じ原理を情報操作に適用しています。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-yellow-300">メタ認知的気づき</h3>
              <p className="text-gray-300">
                「なぜ騙されるのか」を理解することで、
                自分の思考プロセスを客観的に観察し、
                操作的なレトリックに気づく力を育成します。
              </p>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>法政大学大学院 情報科学研究科 修士課程</p>
          <p className="mt-2">
            ⚠️ このゲームは教育目的で作成されています。
            学んだ手法を悪用しないでください。
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
