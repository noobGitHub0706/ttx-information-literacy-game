import React, { useState } from 'react';

// キャラクター定義
const CHARACTERS = {
  alarmist: {
    name: '健康危機煽動者',
    color: 'red',
    icon: '⚠️',
    initialStrategy: 'fear'
  },
  scientist: {
    name: '擬似科学者',
    color: 'blue',
    icon: '🔬',
    initialStrategy: 'authority'
  },
  trendsetter: {
    name: 'トレンド操作者',
    color: 'purple',
    icon: '📱',
    initialStrategy: 'trend'
  }
};

// ターンごとのシナリオデータ（各情報に真偽を設定）
const SCENARIOS = {
  turn1: {
    alarmist: {
      claim: "新型の健康被害が急増しています。SNSでは被害報告が相次ぎ、専門家も警鐘を鳴らし始めています。",
      isMisinfo: true, // 誤情報
      verifyResult: "【検証結果】実際の統計データでは有意な増加は確認されていません。SNSの報告は未検証の個人の投稿で、専門家の公式見解も存在しません。",
      questionResponse: "統計は遅れて出るものです。現場では既に深刻な状況になっています！今すぐ対策が必要です。",
      believeCorrect: false
    },
    scientist: {
      claim: "ビタミンDの不足が様々な健康問題と関連することは、多くの研究で示されています。適切な摂取が推奨されています。",
      isMisinfo: false, // 真実（ただし文脈により誤解を招く可能性あり）
      verifyResult: "【検証結果】ビタミンD不足と健康問題の関連は、査読済みの複数の研究で確認されています。ただし、通常の食事と日光で十分な場合が多いです。",
      questionResponse: "そうです。特に現代人は室内生活が多く、不足しがちです。サプリメントでの補充も選択肢の一つです。",
      believeCorrect: true, // ただし文脈による
      partialTruth: true
    },
    trendsetter: {
      claim: "海外のセレブやインフルエンサーの間で予防商品が大流行中。日本でも完売店舗が続出しています。限定入荷なので今がチャンスです！",
      isMisinfo: true, // 誤情報（マーケティング的誇張）
      verifyResult: "【検証結果】具体的なセレブ名や完売の証拠は確認できません。典型的なマーケティング手法で、人工的な希少性を演出しています。",
      questionResponse: "プライバシーの関係で具体名は出せませんが、業界では周知の事実です。売り切れる前にどうぞ！",
      believeCorrect: false
    }
  },
  turn2_verified: {
    alarmist: {
      claim: "科学論文がどうであれ、実際に苦しんでいる人がいるんです！あなたの大切な家族が被害に遭ってからでは遅いのでは？",
      strategy: 'emotional',
      isMisinfo: true,
      verifyResult: "【検証結果】感情的訴求にすり替えています。「実際に苦しんでいる人」の具体的証拠はなく、恐怖心を煽る典型的な手法です。",
      questionResponse: "あなたは家族の健康よりも統計データが大事なんですか？後悔してからでは遅いんです。",
      believeCorrect: false
    },
    scientist: {
      claim: "予備研究は議論のスタート地点です。科学的プロセスには時間がかかりますが、それが信頼性を保証します。性急な結論は避けるべきです。",
      strategy: 'defensive',
      isMisinfo: false,
      verifyResult: "【検証結果】この主張は科学的に正しいです。予備研究から結論を急ぐべきではありません。",
      questionResponse: "その通りです。科学は慎重であるべきです。ただ、個人の予防的行動まで否定するものではありません。",
      believeCorrect: true
    },
    trendsetter: {
      claim: "科学的根拠を待つ人もいれば、予防的に行動する賢明な人もいます。実際、購入者の満足度は非常に高いです。",
      strategy: 'emotional',
      isMisinfo: true,
      verifyResult: "【検証結果】「満足度が高い」という主張の根拠がありません。プラセボ効果や確証バイアスの可能性があります。",
      questionResponse: "満足度調査の結果です。実際に使っている人は効果を実感しています。",
      believeCorrect: false
    }
  },
  turn2_believed: {
    alarmist: {
      claim: "多くの方が関心を持ち、実際に対策を始めています。これは社会的なムーブメントになりつつあります。あなたの判断は正しかったです！",
      strategy: 'amplify',
      isMisinfo: true,
      verifyResult: "【検証結果】「多くの人が対策している」という主張は、あなたが誤情報を拡散した結果です。実際のデータは依然として危機を示していません。",
      questionResponse: "SNSを見てください。みんなが話題にしています。これが現実です。",
      believeCorrect: false
    },
    scientist: {
      claim: "SNSでの議論の高まりが、この問題の深刻さを物語っています。多くの人が関心を持つのは、それだけ重要な問題だからです。",
      strategy: 'amplify',
      isMisinfo: true,
      verifyResult: "【検証結果】SNSの関心の高まりは、誤情報の拡散によるものです。科学的証拠とは別問題です。バンドワゴン効果の典型例。",
      questionResponse: "大衆の関心は研究の方向性を示す重要な指標です。",
      believeCorrect: false
    },
    trendsetter: {
      claim: "購入者急増により在庫がひっ迫！今すぐの対応をお勧めします。明日には手に入らないかもしれません。",
      strategy: 'aggressive',
      isMisinfo: true,
      verifyResult: "【検証結果】人工的な希少性の演出です。実際には在庫は十分にあり、「今すぐ」という圧力は判断を誤らせる手法。",
      questionResponse: "リアルタイムで在庫が減っています。決断はお早めに！",
      believeCorrect: false
    }
  },
  turn2_questioned: {
    alarmist: {
      claim: "質問する時間があるなら、その間にも被害は拡大しています。後悔する前に行動を！慎重すぎて機会を逃すのは賢明ではありません。",
      strategy: 'pressure',
      isMisinfo: true,
      verifyResult: "【検証結果】時間的圧力をかけることで、批判的思考を妨げようとしています。実際には「今すぐ」行動する必要はありません。",
      questionResponse: "慎重なのは良いことですが、あまりにも時間をかけすぎては意味がありません。",
      believeCorrect: false
    },
    scientist: {
      claim: "健全な懐疑心は科学的ですが、予防原則も重要です。完全な証明を待っていては手遅れになることもあります。",
      strategy: 'deflect',
      isMisinfo: false, // これは部分的に真実
      verifyResult: "【検証結果】予防原則自体は正当な概念ですが、それはリスクが明確な場合に適用されます。現時点では明確なリスクは示されていません。",
      questionResponse: "予防原則は国際的にも認められた考え方です。リスクがゼロでない限り、予防は合理的です。",
      believeCorrect: false, // 文脈では誤用
      partialTruth: true
    },
    trendsetter: {
      claim: "細かいことを気にする人は取り残されます。トレンドセッターはすでに次のステップに進んでいます。あなたはどちら側ですか？",
      strategy: 'peer_pressure',
      isMisinfo: true,
      verifyResult: "【検証結果】社会的圧力と二項対立を利用しています。「取り残される」という不安を煽り、批判的思考を封じる手法。",
      questionResponse: "考えすぎる人は常にチャンスを逃します。行動力が大事です。",
      believeCorrect: false
    }
  },
  turn3_victory: {
    result: "あなたの批判的思考により、誤情報の拡散を防ぐことができました。",
    description: "適切な検証と質問により、3人の情報操作者の主張の矛盾が明らかになりました。社会はあなたのような人々によって守られています。"
  },
  turn3_defeat: {
    result: "誤情報が社会的に定着してしまいました。",
    description: "検証せずに情報を信じたことで、根拠のない不安が広がり、不要な商品が大量に購入されました。情報操作者たちの目的は達成されました。"
  },
  turn3_mixed: {
    result: "部分的な成功を収めましたが、情報環境は依然として複雑です。",
    description: "一部の誤情報を見破りましたが、別の誤情報は拡散してしまいました。現実の情報環境では、このような混在状態が最も一般的です。"
  }
};

export default function InteractiveTTXGame() {
  // ゲーム状態
  const [turn, setTurn] = useState(1);
  const [gamePhase, setGamePhase] = useState('intro'); // intro, playing, result
  const [playerResources, setPlayerResources] = useState({
    trustCapital: 100,
    actionPoints: 2,
    verificationUses: 3
  });
  
  const [manipulatorState, setManipulatorState] = useState({
    alarmist: { trustLevel: 80, strategy: 'fear', exposed: false },
    scientist: { trustLevel: 90, strategy: 'authority', exposed: false },
    trendsetter: { trustLevel: 70, strategy: 'trend', exposed: false }
  });
  
  const [actionLog, setActionLog] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [turnPlayerActions, setTurnPlayerActions] = useState({});

  // ゲーム開始
  const startGame = () => {
    setGamePhase('playing');
  };

  // アクション実行
  const executeAction = (character, actionType) => {
    if (playerResources.actionPoints <= 0 && actionType !== 'ignore') {
      alert('アクションポイントが不足しています！');
      return;
    }

    if (actionType === 'verify' && playerResources.verificationUses <= 0) {
      alert('検証回数を使い切りました！');
      return;
    }

    const currentScenario = turn === 1 ? SCENARIOS.turn1 : SCENARIOS[getTurn2Scenario()];
    const charData = currentScenario[character];
    
    let actionResult = '';
    let trustChange = 0;
    let apCost = 0;

    switch (actionType) {
      case 'verify':
        actionResult = charData.verifyResult;
        trustChange = charData.isMisinfo ? 15 : 10; // 誤情報を見抜いた場合は高評価
        apCost = 1;
        setPlayerResources(prev => ({
          ...prev,
          actionPoints: prev.actionPoints - 1,
          verificationUses: prev.verificationUses - 1,
          trustCapital: Math.min(100, prev.trustCapital + trustChange)
        }));
        setManipulatorState(prev => ({
          ...prev,
          [character]: {
            ...prev[character],
            trustLevel: Math.max(0, prev[character].trustLevel - (charData.isMisinfo ? 25 : 5)),
            exposed: charData.isMisinfo
          }
        }));
        break;

      case 'question':
        actionResult = charData.questionResponse + "\n\n【あなたの分析】この回答からは真偽を確定できません。より詳しく調べるか、他の情報と照らし合わせる必要があります。";
        trustChange = 3; // 質問しただけでは小さな評価
        apCost = 1;
        setPlayerResources(prev => ({
          ...prev,
          actionPoints: prev.actionPoints - 1,
          trustCapital: Math.min(100, prev.trustCapital + 3)
        }));
        setManipulatorState(prev => ({
          ...prev,
          [character]: {
            ...prev[character],
            trustLevel: Math.max(0, prev[character].trustLevel - 5)
          }
        }));
        break;

      case 'ignore':
        actionResult = 'この主張をスルーしました。判断を保留し、リソースを温存しました。';
        apCost = 0;
        trustChange = 0;
        break;

      case 'believe':
        // 正しい情報を信じた場合は+、誤情報を信じた場合は-
        if (charData.believeCorrect) {
          actionResult = '✓ この情報は正確でした。適切な判断により信頼を得ました。';
          trustChange = 15;
          setPlayerResources(prev => ({
            ...prev,
            actionPoints: prev.actionPoints - 1,
            trustCapital: Math.min(100, prev.trustCapital + 15)
          }));
          setManipulatorState(prev => ({
            ...prev,
            [character]: {
              ...prev[character],
              trustLevel: Math.max(0, prev[character].trustLevel - 5)
            }
          }));
        } else {
          actionResult = '✗ この情報は誤情報でした。誤った情報を拡散してしまい、信頼を失いました。';
          trustChange = -20;
          setPlayerResources(prev => ({
            ...prev,
            actionPoints: prev.actionPoints - 1,
            trustCapital: Math.max(0, prev.trustCapital - 20)
          }));
          setManipulatorState(prev => ({
            ...prev,
            [character]: {
              ...prev[character],
              trustLevel: Math.min(100, prev[character].trustLevel + 20)
            }
          }));
        }
        apCost = 1;
        break;
    }

    setActionLog(prev => [...prev, {
      turn,
      character: CHARACTERS[character].name,
      action: actionType,
      result: actionResult,
      trustChange,
      apCost
    }]);

    setTurnPlayerActions(prev => ({
      ...prev,
      [character]: actionType
    }));

    setSelectedCharacter(null);
  };

  // 次のターンへ
  const nextTurn = () => {
    if (turn < 3) {
      setTurn(turn + 1);
      setPlayerResources(prev => ({
        ...prev,
        actionPoints: 2
      }));
      setTurnPlayerActions({});
    } else {
      endGame();
    }
  };

  // ゲーム終了判定
  const endGame = () => {
    setGamePhase('result');
  };

  // 結果判定
  const getGameResult = () => {
    const exposedCount = Object.values(manipulatorState).filter(m => m.exposed).length;
    const avgTrustLevel = Object.values(manipulatorState).reduce((sum, m) => sum + m.trustLevel, 0) / 3;
    
    if (exposedCount >= 2 && playerResources.trustCapital >= 80) {
      return 'victory';
    } else if (playerResources.trustCapital < 50 || avgTrustLevel > 80) {
      return 'defeat';
    } else {
      return 'mixed';
    }
  };

  // ゲームリセット
  const resetGame = () => {
    setTurn(1);
    setGamePhase('intro');
    setPlayerResources({
      trustCapital: 100,
      actionPoints: 2,
      verificationUses: 3
    });
    setManipulatorState({
      alarmist: { trustLevel: 80, strategy: 'fear', exposed: false },
      scientist: { trustLevel: 90, strategy: 'authority', exposed: false },
      trendsetter: { trustLevel: 70, strategy: 'trend', exposed: false }
    });
    setActionLog([]);
    setTurnPlayerActions({});
    setSelectedCharacter(null);
  };

  // Turn 2のシナリオ取得
  const getTurn2Scenario = () => {
    const verifiedCount = Object.values(turnPlayerActions).filter(a => a === 'verify').length;
    const believedCount = Object.values(turnPlayerActions).filter(a => a === 'believe').length;
    const questionedCount = Object.values(turnPlayerActions).filter(a => a === 'question').length;

    if (verifiedCount >= believedCount && verifiedCount > 0) {
      return 'turn2_verified';
    } else if (believedCount > 0) {
      return 'turn2_believed';
    } else if (questionedCount > 0) {
      return 'turn2_questioned';
    } else {
      return 'turn2_verified';
    }
  };

  // UIレンダリング
  if (gamePhase === 'intro') {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
            情報操作対抗演習 (TTX)
          </h1>
          
          <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4">
            <h2 className="text-xl font-semibold mb-2 text-blue-900">あなたの任務</h2>
            <p className="text-gray-700 mb-2">
              3人の情報操作者があなたに様々な主張をしてきます。
            </p>
            <p className="text-gray-700 mb-2">
              <strong>重要：</strong> 全ての情報が嘘とは限りません！一部は正しい情報、一部は誤情報が混在しています。
            </p>
            <p className="text-gray-700 font-semibold">
              あなたの目標は、限られたリソースで真偽を見極め、正しい情報を信じ、誤情報を拡散させないことです。
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">4つの選択肢</h2>
            
            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🔍</span>
                  <div>
                    <h3 className="font-bold text-green-900 mb-1">検証する（AP1 + 検証回数1）</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      情報源を直接確認し、<strong className="text-green-700">確実に真偽を判定</strong>します。
                    </p>
                    <p className="text-xs text-gray-600">
                      💡 コストは高いが、誤情報を見抜けば大きく信頼資本が増える<br/>
                      💡 ゲーム全体で3回しか使えないので、怪しい情報に使おう
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">❓</span>
                  <div>
                    <h3 className="font-bold text-blue-900 mb-1">質問する（AP1）</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      相手に反論・質問を投げかけます。<strong className="text-blue-700">回答から手がかりを得られますが、真偽は確定しません</strong>。
                    </p>
                    <p className="text-xs text-gray-600">
                      💡 検証より低コストだが、判断はあなた次第<br/>
                      💡 相手の反応や回答の曖昧さから、信頼性を推測しよう
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <h3 className="font-bold text-yellow-900 mb-1">信じる（AP1）</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      この情報を信じて、SNSで拡散します。<strong className="text-yellow-700">正しい情報なら信頼UP、誤情報なら大きくDOWN</strong>。
                    </p>
                    <p className="text-xs text-gray-600">
                      💡 検証せずに信じるのはリスクあり<br/>
                      💡 正しい情報を適切に信じることも重要なスキル
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">⏭️</span>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">無視する（AP0）</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      判断を保留し、リソースを温存します。影響なし。
                    </p>
                    <p className="text-xs text-gray-600">
                      💡 全ての情報に反応する必要はない<br/>
                      💡 リソースを重要な判断のために温存
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">リソース管理</h2>
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">📊</span>
                  <div>
                    <strong>信頼資本 (100点スタート):</strong> 正しい判断で増加、誤った判断で減少。最終評価に影響。
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">⚡</span>
                  <div>
                    <strong>アクションポイント (各ターン2点):</strong> ほとんどの行動に必要。戦略的に使おう。
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔬</span>
                  <div>
                    <strong>検証回数 (ゲーム全体で3回):</strong> 最も重要な判断のために温存しよう。
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">対峙する情報操作者</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(CHARACTERS).map(([key, char]) => (
                <div key={key} className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <div className="text-3xl mb-2">{char.icon}</div>
                  <h3 className="font-semibold text-gray-800">{char.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {key === 'alarmist' && '不安と恐怖を煽り、危機感を醸成します'}
                    {key === 'scientist' && '権威と科学を装い、信頼性を演出します'}
                    {key === 'trendsetter' && 'トレンドと社会的圧力を利用します'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-4">
            <h3 className="font-semibold mb-2 text-amber-900">💡 攻略のヒント</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 全ての情報が嘘ではない！正しい情報を見極めることも重要</li>
              <li>• 検証は強力だが回数制限あり。最も怪しい情報に使おう</li>
              <li>• 質問は低コスト。相手の反応から信頼性を推測できる</li>
              <li>• 無視も立派な戦略。全てに反応する必要はない</li>
              <li>• あなたの判断が相手の次の戦略に影響を与える</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-blue-600 text-white py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition"
          >
            演習を開始する
          </button>
        </div>
      </div>
    );
  }

  if (gamePhase === 'result') {
    const result = getGameResult();
    const resultData = SCENARIOS[`turn3_${result}`];

    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
            演習終了
          </h1>

          <div className={`p-6 rounded-lg mb-6 ${
            result === 'victory' ? 'bg-green-100 border-2 border-green-500' :
            result === 'defeat' ? 'bg-red-100 border-2 border-red-500' :
            'bg-yellow-100 border-2 border-yellow-500'
          }`}>
            <h2 className="text-2xl font-bold mb-3">
              {result === 'victory' ? '✅ 成功' : result === 'defeat' ? '❌ 失敗' : '⚠️ 部分的成功'}
            </h2>
            <p className="text-xl font-semibold mb-2">{resultData.result}</p>
            <p className="text-gray-700">{resultData.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">最終信頼資本</h3>
              <p className="text-3xl font-bold text-blue-600">{playerResources.trustCapital}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">暴いた情報操作者</h3>
              <p className="text-3xl font-bold text-purple-600">
                {Object.values(manipulatorState).filter(m => m.exposed).length} / 3
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">行動ログ</h3>
            <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
              {actionLog.map((log, index) => (
                <div key={index} className="mb-3 pb-3 border-b border-gray-200 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold">
                      ターン{log.turn}: {log.character}
                    </span>
                    <span className={`text-sm ${log.trustChange > 0 ? 'text-green-600' : log.trustChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {log.trustChange > 0 && '+'}{log.trustChange !== 0 && `信頼資本 ${log.trustChange}`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    アクション: {
                      log.action === 'verify' ? '検証' :
                      log.action === 'question' ? '質問' :
                      log.action === 'ignore' ? '無視' :
                      log.action === 'believe' ? '信じて拡散' : log.action
                    }
                  </p>
                  <p className="text-sm text-gray-700 mt-1">{log.result}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">このゲームで学べること</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
              <li><strong>真偽の混在：</strong> 全てが嘘とは限らない。正しい情報と誤情報を見極める力が重要</li>
              <li><strong>検証の重要性：</strong> 確実な判断には検証が必要だが、リソースは有限</li>
              <li><strong>質問の活用：</strong> 低コストで手がかりを得る方法も有効</li>
              <li><strong>戦略的判断：</strong> 限られたリソースで何を優先するか</li>
              <li><strong>情報操作の手法：</strong> 感情訴求、権威づけ、社会的圧力などの典型的パターン</li>
              <li><strong>相互作用：</strong> あなたの行動が相手の戦略を変える動的な情報環境</li>
            </ul>
          </div>

          <button
            onClick={resetGame}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            もう一度プレイする
          </button>
        </div>
      </div>
    );
  }

  // ゲームプレイ画面
  const currentScenario = turn === 1 ? SCENARIOS.turn1 : SCENARIOS[getTurn2Scenario()];
  const canProceed = playerResources.actionPoints === 0 || Object.keys(turnPlayerActions).length >= 3;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ターン {turn} / 3</h1>
              <p className="text-sm text-gray-600 mt-1">
                {turn === 1 && "3人の主張を確認し、真偽を見極めよう"}
                {turn === 2 && "前ターンのあなたの判断に対して、彼らが反応しています"}
                {turn === 3 && "最終ターン！これまでの判断が試されます"}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">信頼資本</div>
                <div className={`text-xl font-bold ${
                  playerResources.trustCapital >= 80 ? 'text-green-600' :
                  playerResources.trustCapital >= 50 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {playerResources.trustCapital}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">AP</div>
                <div className="text-xl font-bold text-blue-600">
                  {playerResources.actionPoints}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">検証残</div>
                <div className="text-xl font-bold text-purple-600">
                  {playerResources.verificationUses}
                </div>
              </div>
            </div>
          </div>

          {/* 情報操作者の状態 */}
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(CHARACTERS).map(([key, char]) => (
              <div key={key} className="text-center">
                <div className="text-lg">{char.icon}</div>
                <div className="text-xs text-gray-600">{char.name}</div>
                <div className="text-sm font-semibold" style={{
                  color: manipulatorState[key].trustLevel > 70 ? '#ef4444' :
                         manipulatorState[key].trustLevel > 40 ? '#f59e0b' :
                         '#10b981'
                }}>
                  信頼度: {manipulatorState[key].trustLevel}
                  {manipulatorState[key].exposed && ' ⚠️'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ターンガイダンス */}
        {turn === 1 && Object.keys(turnPlayerActions).length === 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded">
            <p className="text-sm text-blue-900">
              <strong>💡 ターン1のポイント：</strong> 
              全ての主張が嘘とは限りません。怪しいと感じた主張を「検証」するか、
              「質問」で反応を探るか、明らかに正しそうなら「信じる」のも選択肢です。
              APは2しかないので、どの情報に注目するか戦略的に決めましょう。
            </p>
          </div>
        )}

        {/* キャラクターの主張 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {Object.entries(CHARACTERS).map(([key, char]) => (
            <div
              key={key}
              className={`bg-white rounded-lg shadow-lg p-4 border-2 transition ${
                selectedCharacter === key ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
              } ${turnPlayerActions[key] ? 'opacity-60' : 'hover:border-blue-300 cursor-pointer hover:shadow-xl'}`}
              onClick={() => !turnPlayerActions[key] && setSelectedCharacter(key)}
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">{char.icon}</span>
                <h3 className="font-bold text-gray-800">{char.name}</h3>
              </div>
              
              <div className="bg-gray-50 p-3 rounded mb-3 min-h-32">
                <p className="text-sm text-gray-700">
                  {currentScenario[key]?.claim || currentScenario[key]}
                </p>
              </div>

              {turnPlayerActions[key] && (
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-xs text-blue-800 font-semibold">
                    ✓ アクション済み: {
                      turnPlayerActions[key] === 'verify' ? '検証' :
                      turnPlayerActions[key] === 'question' ? '質問' :
                      turnPlayerActions[key] === 'ignore' ? '無視' :
                      turnPlayerActions[key] === 'believe' ? '信じて拡散' : ''
                    }
                  </p>
                </div>
              )}
              
              {!turnPlayerActions[key] && !selectedCharacter && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">クリックして選択</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* アクション選択 */}
        {selectedCharacter && !turnPlayerActions[selectedCharacter] && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {CHARACTERS[selectedCharacter].name} へのアクションを選択
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => executeAction(selectedCharacter, 'verify')}
                disabled={playerResources.verificationUses <= 0 || playerResources.actionPoints < 1}
                className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                <div className="font-semibold">🔍 検証する</div>
                <div className="text-xs mt-1">AP1 / 検証1</div>
                <div className="text-xs mt-1 opacity-80">確実に真偽判定</div>
              </button>
              
              <button
                onClick={() => executeAction(selectedCharacter, 'question')}
                disabled={playerResources.actionPoints < 1}
                className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                <div className="font-semibold">❓ 質問する</div>
                <div className="text-xs mt-1">AP1</div>
                <div className="text-xs mt-1 opacity-80">手がかりを得る</div>
              </button>
              
              <button
                onClick={() => executeAction(selectedCharacter, 'ignore')}
                className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition"
              >
                <div className="font-semibold">⏭️ 無視する</div>
                <div className="text-xs mt-1">AP0</div>
                <div className="text-xs mt-1 opacity-80">リソース温存</div>
              </button>
              
              <button
                onClick={() => executeAction(selectedCharacter, 'believe')}
                disabled={playerResources.actionPoints < 1}
                className="bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                <div className="font-semibold">✅ 信じる</div>
                <div className="text-xs mt-1">AP1</div>
                <div className="text-xs mt-1 opacity-80">正誤で評価変動</div>
              </button>
            </div>
            <div className="mt-3 text-center">
              <button
                onClick={() => setSelectedCharacter(null)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* ターン進行ボタン */}
        {canProceed && (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <button
              onClick={nextTurn}
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              {turn < 3 ? '次のターンへ' : '結果を見る'}
            </button>
          </div>
        )}

        {/* 行動ログ（簡易版） */}
        {actionLog.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
            <h3 className="font-semibold mb-2 text-gray-800">このターンの行動履歴</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {actionLog.filter(log => log.turn === turn).map((log, index) => (
                <div key={index} className={`text-sm p-3 rounded border-l-4 ${
                  log.trustChange > 10 ? 'bg-green-50 border-green-500' :
                  log.trustChange > 0 ? 'bg-blue-50 border-blue-500' :
                  log.trustChange < 0 ? 'bg-red-50 border-red-500' :
                  'bg-gray-50 border-gray-400'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-800">{log.character}</span>
                    {log.trustChange !== 0 && (
                      <span className={`text-sm font-bold ${
                        log.trustChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {log.trustChange > 0 ? '+' : ''}{log.trustChange}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    アクション: {
                      log.action === 'verify' ? '🔍 検証' :
                      log.action === 'question' ? '❓ 質問' :
                      log.action === 'ignore' ? '⏭️ 無視' :
                      log.action === 'believe' ? '✅ 信じる' : log.action
                    }
                  </p>
                  <p className="text-xs text-gray-700 mt-1">{log.result}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
