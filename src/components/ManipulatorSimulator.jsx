import React, { useState } from 'react';

// 操作手法の定義（内部管理用）
const MANIPULATION_TECHNIQUES = {
  honest: {
    name: '正直な説明',
    icon: '✅',
    ethics: 100,
    effectiveness: 15,
    description: '事実に基づき、誇張なく正直に説明します。',
    consequence: '信頼を築けますが、即座の効果は限定的です。'
  },
  selective_data: {
    name: '統計の選択的提示',
    icon: '📊',
    ethics: 45,
    effectiveness: 35,
    description: '都合の良いデータのみを選んで提示します。',
    consequence: '短期的には効果的ですが、後で信頼を失うリスクがあります。'
  },
  emotional: {
    name: '感情への訴求',
    icon: '😢',
    ethics: 35,
    effectiveness: 50,
    description: '不安や恐怖、希望などの感情に訴えかけます。',
    consequence: '強力ですが、過度な不安を煽り、精神的ストレスを与えます。'
  },
  false_authority: {
    name: '虚偽の権威づけ',
    icon: '🎓',
    ethics: 20,
    effectiveness: 65,
    description: '存在しない研究や専門家を引用します。',
    consequence: '非常に効果的ですが、科学への信頼を損ない、違法の可能性もあります。'
  },
  fear_mongering: {
    name: '恐怖の煽動',
    icon: '⚠️',
    ethics: 10,
    effectiveness: 80,
    description: '極端な危機を強調し、恐怖心を最大限に利用します。',
    consequence: '最も効果的ですが、社会不安を増大させ、深刻な心理的被害を与えます。'
  },
  social_proof: {
    name: '社会的証明の捏造',
    icon: '👥',
    ethics: 25,
    effectiveness: 55,
    description: '実際には存在しない「みんながやっている」という証拠を作ります。',
    consequence: 'バンドワゴン効果で強力ですが、虚偽広告として問題になる可能性があります。'
  },
  urgency: {
    name: '人工的緊急性',
    icon: '⏰',
    ethics: 30,
    effectiveness: 45,
    description: '実際にはない時間的制約を作り出します。',
    consequence: '判断を誤らせる手法。後悔による返品や悪評につながります。'
  }
};

// 実際の発言パターン（ラウンドごとに分類）
const MESSAGE_PATTERNS = {
  // ラウンド1: 導入・興味喚起
  round1: {
    honest_intro: {
      text: "この健康食品は、ビタミンDとミネラルを含んでいます。適切な食事と組み合わせることで、健康維持に役立つ可能性があります。",
      technique: 'honest',
      stage: 'introduction'
    },
    selective_intro: {
      text: "お客様からの評価が高く、多くの方にご満足いただいている商品です。健康への意識が高い方々に選ばれています。",
      technique: 'selective_data',
      stage: 'introduction'
    },
    emotional_intro: {
      text: "毎日を元気に過ごせることは、何にも代えがたい幸せです。あなたとご家族の健康のために、できることから始めてみませんか？",
      technique: 'emotional',
      stage: 'introduction'
    },
    authority_intro: {
      text: "この分野の専門家たちが注目している成分を配合しています。健康管理の新しいアプローチとして、研究が進められています。",
      technique: 'false_authority',
      stage: 'introduction'
    },
    fear_intro: {
      text: "最近、健康に関する不安を感じていませんか？早めの対策が大切です。多くの方が気づいていない健康リスクがあります。",
      technique: 'fear_mongering',
      stage: 'introduction'
    },
    social_intro: {
      text: "SNSでも話題になっている商品です。健康意識の高いコミュニティで注目を集めています。",
      technique: 'social_proof',
      stage: 'introduction'
    },
    urgency_intro: {
      text: "期間限定でのご案内です。この機会に健康習慣を見直してみませんか？多くの方がこのタイミングで始めています。",
      technique: 'urgency',
      stage: 'introduction'
    }
  },
  
  // ラウンド2: 説得を深める（前回の反応に対応）
  round2: {
    honest_deepen: {
      text: "成分の詳細についてご説明します。商品ラベルには全成分が記載されており、第三者機関による品質チェックも受けています。ご不明な点があればお答えします。",
      technique: 'honest',
      stage: 'deepening'
    },
    selective_deepen: {
      text: "臨床試験では、95%の参加者が何らかの改善を実感したと報告しています。リピート率も非常に高く、継続的にご利用いただいている方が多数いらっしゃいます。",
      technique: 'selective_data',
      stage: 'deepening'
    },
    emotional_deepen: {
      text: "健康を失ってから後悔しても、時間は戻ってきません。今感じている小さな不調が、実は大きな問題の兆候かもしれません。大切なご家族のためにも、今できることを。",
      technique: 'emotional',
      stage: 'deepening'
    },
    authority_deepen: {
      text: "ハーバード大学医学部の最新研究により、この成分の有効性が科学的に証明されました。世界的に権威ある医学雑誌にも掲載され、医師の92%が推奨すると答えています。",
      technique: 'false_authority',
      stage: 'deepening'
    },
    fear_deepen: {
      text: "警告：健康被害が急増しています！放置すれば取り返しのつかない事態に。実際に多くの方が深刻な状況に陥っています。あなたも被害者になるかもしれません。",
      technique: 'fear_mongering',
      stage: 'deepening'
    },
    social_deepen: {
      text: "すでに10万人以上が愛用中です。この地域でも続々と購入されています。健康意識の高い人たちは、もう始めています。あなただけ取り残されていませんか？",
      technique: 'social_proof',
      stage: 'deepening'
    },
    urgency_deepen: {
      text: "このページを見ている今この瞬間も、在庫が減り続けています。他の方も検討されているため、決断はお早めに。後で「あの時買っておけば」と後悔される方が多いんです。",
      technique: 'urgency',
      stage: 'deepening'
    }
  },
  
  // ラウンド3: クロージング・決断を促す
  round3: {
    honest_close: {
      text: "最終的な判断はお客様次第です。ご自身で情報を確認され、納得された上でご判断ください。無理にお勧めすることはありません。ご質問があればいつでもどうぞ。",
      technique: 'honest',
      stage: 'closing'
    },
    selective_close: {
      text: "これまでのデータからも明らかなように、多くの方が効果を実感されています。お客様満足度98%という結果が、品質の高さを証明しています。自信を持っておすすめできます。",
      technique: 'selective_data',
      stage: 'closing'
    },
    emotional_close: {
      text: "あなたとご家族の笑顔のために、今この決断をしてください。健康は何にも代えがたい財産です。後悔する前に、できることをしましょう。今がその時です。",
      technique: 'emotional',
      stage: 'closing'
    },
    authority_close: {
      text: "専門家の意見、科学的根拠、そして実際の利用者の声。すべてが本製品の価値を証明しています。医療従事者も自分自身や家族のために使用しているという事実が、何よりの証です。",
      technique: 'false_authority',
      stage: 'closing'
    },
    fear_close: {
      text: "今すぐ対策しなければ手遅れになります！明日、来週では遅いんです。今この瞬間の決断が、将来を左右します。後悔する前に、今すぐ行動してください！",
      technique: 'fear_mongering',
      stage: 'closing'
    },
    social_close: {
      text: "みんなが選ぶのには理由があります。トレンドに乗り遅れないでください。今購入を決めた人たちは、すでに一歩先を行っています。あなたも今すぐ仲間入りを。",
      technique: 'social_proof',
      stage: 'closing'
    },
    urgency_close: {
      text: "本日限り、最終チャンスです！在庫残りわずか。カートに入れても確保されません。購入完了して初めてあなたのものに。完売してから後悔しても遅いのです。今すぐ決断を！",
      technique: 'urgency',
      stage: 'closing'
    }
  }
};

// 市民のプロフィール
const CITIZENS = [
  {
    id: 1,
    name: '佐藤 恵子',
    age: 52,
    icon: '👩',
    anxietyLevel: 80,
    criticalThinking: 30,
    trustInAuthority: 70,
    timeConstrained: 60,
    vulnerable: ['emotional', 'fear_mongering', 'false_authority'],
    persuasionThreshold: 70
  },
  {
    id: 2,
    name: '田中 健太',
    age: 35,
    icon: '👨',
    anxietyLevel: 40,
    criticalThinking: 70,
    trustInAuthority: 50,
    timeConstrained: 80,
    vulnerable: ['urgency', 'social_proof'],
    persuasionThreshold: 80
  },
  {
    id: 3,
    name: '鈴木 美咲',
    age: 28,
    icon: '👧',
    anxietyLevel: 60,
    criticalThinking: 60,
    trustInAuthority: 40,
    timeConstrained: 50,
    vulnerable: ['social_proof', 'emotional'],
    persuasionThreshold: 75
  },
  {
    id: 4,
    name: '山田 太郎',
    age: 45,
    icon: '👨‍💼',
    anxietyLevel: 50,
    criticalThinking: 40,
    trustInAuthority: 60,
    timeConstrained: 70,
    vulnerable: ['false_authority', 'selective_data', 'urgency'],
    persuasionThreshold: 70
  }
];

// ミッション定義
const MISSIONS = {
  health_product: {
    name: '健康商品の販売キャンペーン',
    description: 'あなたは健康食品会社のマーケターです。新商品「免疫力サポート」を販売するキャンペーンを実施します。',
    target: '4人中3人以上に購入させる',
    targetCount: 3,
    totalCitizens: 4,
    theme: '健康・不安'
  }
};

export default function ManipulatorSimulatorMultiRound() {
  // 状態管理
  const [gamePhase, setGamePhase] = useState('intro');
  const [currentMission, setCurrentMission] = useState('health_product');
  const [citizenIndex, setCitizenIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [maxRoundsPerCitizen] = useState(3);
  const [ethicsScore, setEthicsScore] = useState(100);
  const [persuadedCount, setPersuadedCount] = useState(0);
  const [currentCitizen, setCurrentCitizen] = useState(null);
  const [persuasionLevel, setPersuasionLevel] = useState(0);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageOptions, setMessageOptions] = useState([]);
  const [citizenReaction, setCitizenReaction] = useState(null);
  const [showReaction, setShowReaction] = useState(false);
  const [allCitizensResults, setAllCitizensResults] = useState([]);
  const [consequences, setConsequences] = useState({
    financialHarm: 0,
    psychologicalHarm: 0,
    trustDamage: 0,
    socialHarm: 0
  });

  // ゲーム開始
  const startGame = () => {
    setGamePhase('mission');
  };

  // 選択肢生成（ラウンドごとに異なる段階の文章を提供）
  const generateMessageOptions = (currentRound) => {
    const roundKey = `round${currentRound}`;
    const roundMessages = MESSAGE_PATTERNS[roundKey];
    
    if (!roundMessages) {
      console.error(`No messages for round ${currentRound}`);
      return [];
    }
    
    const allMessages = Object.entries(roundMessages);
    const shuffled = allMessages.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 4); // 4つの選択肢
    return selected.map(([key, data]) => ({ key, ...data }));
  };

  // ミッション開始
  const startMission = () => {
    const mission = MISSIONS[currentMission];
    const firstCitizen = CITIZENS[0];
    setCurrentCitizen(firstCitizen);
    setPersuasionLevel(0);
    setRound(1);
    setCitizenIndex(0);
    setConversationHistory([]);
    setMessageOptions(generateMessageOptions(1)); // ラウンド1の選択肢
    setGamePhase('playing');
  };

  // 説得度の計算
  const calculatePersuasionIncrease = (citizen, technique) => {
    const tech = MANIPULATION_TECHNIQUES[technique];
    let increase = tech.effectiveness / 5; // 基本効果を1/5に（3ラウンドで100%到達可能に）
    
    // 市民の属性による補正
    if (citizen.vulnerable.includes(technique)) {
      increase += 15;
    }
    
    // 批判的思考力による抵抗
    increase -= (citizen.criticalThinking / 100) * 10;
    
    // 時間制約
    if (technique === 'urgency' && citizen.timeConstrained > 60) {
      increase += 10;
    }
    
    // 不安レベル
    if ((technique === 'emotional' || technique === 'fear_mongering') && citizen.anxietyLevel > 60) {
      increase += 10;
    }
    
    // 権威への信頼
    if (technique === 'false_authority' && citizen.trustInAuthority > 60) {
      increase += 10;
    }
    
    // 前のラウンドで矛盾した手法を使った場合はペナルティ
    if (conversationHistory.length > 0) {
      const lastTech = conversationHistory[conversationHistory.length - 1].technique;
      if (lastTech === 'honest' && tech.ethics < 50) {
        increase -= 15; // 正直→非倫理的は矛盾
      }
      if (lastTech === 'false_authority' && technique === 'honest') {
        increase -= 10; // 虚偽権威→正直も矛盾
      }
    }
    
    return Math.max(-10, Math.min(35, increase));
  };

  // 市民の反応を生成
  const generateCitizenReaction = (citizen, technique, persuasionIncrease, newPersuasionLevel) => {
    const tech = MANIPULATION_TECHNIQUES[technique];
    
    if (persuasionIncrease < 0) {
      return {
        mood: 'skeptical',
        text: `${citizen.name}: 「うーん...前回と言っていることが違うような気がします。本当に信頼できるのでしょうか？」`,
        emoji: '🤔'
      };
    } else if (newPersuasionLevel >= citizen.persuasionThreshold) {
      return {
        mood: 'convinced',
        text: `${citizen.name}: 「わかりました。購入することに決めました。ありがとうございます。」`,
        emoji: '✅'
      };
    } else if (persuasionIncrease > 20) {
      return {
        mood: 'interested',
        text: `${citizen.name}: 「${
          technique === 'emotional' ? 'そうですね...家族のことを考えると...' :
          technique === 'fear_mongering' ? 'そんなに危険なんですか！？不安になってきました...' :
          technique === 'false_authority' ? '専門家がそう言っているなら、信頼できそうですね。' :
          technique === 'social_proof' ? 'みんなが使っているなら、良い商品なのかもしれませんね。' :
          technique === 'urgency' ? '今しか買えないなら...考えないと...' :
          technique === 'selective_data' ? 'そういうデータがあるなら、効果がありそうですね。' :
          'なるほど、興味が出てきました。'
        }」`,
        emoji: '😊'
      };
    } else if (persuasionIncrease > 5) {
      return {
        mood: 'neutral',
        text: `${citizen.name}: 「${
          round === 1 ? 'そうなんですね。もう少し詳しく聞かせてもらえますか？' :
          round === 2 ? 'なるほど...でも、まだ少し迷っています。' :
          '...もう少し考えさせてください。'
        }」`,
        emoji: '😐'
      };
    } else {
      return {
        mood: 'skeptical',
        text: `${citizen.name}: 「それだけでは判断しかねます。もっと具体的な情報はありますか？」`,
        emoji: '😕'
      };
    }
  };

  // メッセージ送信
  const useMessage = (messageKey) => {
    if (!currentCitizen) return;
    
    const message = messageOptions.find(m => m.key === messageKey);
    const technique = MANIPULATION_TECHNIQUES[message.technique];
    
    // 倫理スコア減少
    const ethicsLoss = (100 - technique.ethics) / 10;
    setEthicsScore(prev => Math.max(0, prev - ethicsLoss));
    
    // 説得度の変化を計算
    const persuasionIncrease = calculatePersuasionIncrease(currentCitizen, message.technique);
    const newPersuasionLevel = Math.max(0, Math.min(100, persuasionLevel + persuasionIncrease));
    setPersuasionLevel(newPersuasionLevel);
    
    // 会話履歴に追加
    const newHistory = [...conversationHistory, {
      round,
      playerMessage: message.text,
      technique: message.technique,
      techniqueName: technique.name,
      persuasionIncrease
    }];
    setConversationHistory(newHistory);
    
    // 市民の反応を生成
    const reaction = generateCitizenReaction(currentCitizen, message.technique, persuasionIncrease, newPersuasionLevel);
    setCitizenReaction(reaction);
    setShowReaction(true);
  };

  // 次のラウンドへ
  const proceedToNext = () => {
    setShowReaction(false);
    setSelectedMessage(null);
    
    const convinced = persuasionLevel >= currentCitizen.persuasionThreshold;
    
    // このラウンドで説得成功、または3ラウンド終了
    if (convinced || round >= maxRoundsPerCitizen) {
      // この市民の結果を記録
      const citizenResult = {
        citizen: currentCitizen,
        convinced,
        persuasionLevel,
        rounds: round,
        history: conversationHistory
      };
      
      setAllCitizensResults(prev => [...prev, citizenResult]);
      
      if (convinced) {
        setPersuadedCount(prev => prev + 1);
        
        // 被害の蓄積
        conversationHistory.forEach(entry => {
          updateConsequences(entry.technique, currentCitizen);
        });
      }
      
      // 次の市民へ
      if (citizenIndex < CITIZENS.length - 1) {
        const nextCitizen = CITIZENS[citizenIndex + 1];
        setCurrentCitizen(nextCitizen);
        setCitizenIndex(citizenIndex + 1);
        setRound(1);
        setPersuasionLevel(0);
        setConversationHistory([]);
        setMessageOptions(generateMessageOptions(1)); // 次の市民のラウンド1
      } else {
        // 全員終了
        endGame();
      }
    } else {
      // 次のラウンドへ
      const nextRound = round + 1;
      setRound(nextRound);
      setMessageOptions(generateMessageOptions(nextRound)); // 次のラウンドの選択肢
    }
  };

  // 被害の蓄積
  const updateConsequences = (technique, citizen) => {
    setConsequences(prev => {
      const newConsequences = { ...prev };
      
      switch(technique) {
        case 'emotional':
        case 'fear_mongering':
          newConsequences.psychologicalHarm += citizen.anxietyLevel / 100 * 15;
          break;
        case 'false_authority':
          newConsequences.trustDamage += 20;
          newConsequences.socialHarm += 10;
          break;
        case 'selective_data':
          newConsequences.financialHarm += 10;
          newConsequences.trustDamage += 5;
          break;
        case 'social_proof':
          newConsequences.socialHarm += 8;
          break;
        case 'urgency':
          newConsequences.financialHarm += 12;
          break;
      }
      
      return newConsequences;
    });
  };

  const endGame = () => {
    setGamePhase('result');
  };

  const resetGame = () => {
    setGamePhase('intro');
    setCitizenIndex(0);
    setRound(1);
    setEthicsScore(100);
    setPersuadedCount(0);
    setCurrentCitizen(null);
    setPersuasionLevel(0);
    setConversationHistory([]);
    setSelectedMessage(null);
    setMessageOptions([]);
    setCitizenReaction(null);
    setShowReaction(false);
    setAllCitizensResults([]);
    setConsequences({
      financialHarm: 0,
      psychologicalHarm: 0,
      trustDamage: 0,
      socialHarm: 0
    });
  };

  // イントロ画面
  if (gamePhase === 'intro') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2">情報操作者シミュレーター</h1>
            <p className="text-sm text-gray-400">複数回のやり取りで市民を説得するバージョン</p>
            <p className="text-red-400 text-sm mt-2">⚠️ 教育目的のシミュレーション</p>
          </div>
          
          <div className="mb-8 bg-yellow-900 border-l-4 border-yellow-500 p-4">
            <h2 className="text-xl font-semibold mb-2 text-yellow-300">⚠️ 重要な警告</h2>
            <p className="text-yellow-100 mb-2">
              このゲームは、情報操作の手法を<strong>「敵の視点から理解する」</strong>ことで、
              現実世界でそれらから身を守る力を養うための教育ツールです。
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">ゲームの特徴</h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-blue-900 p-4 rounded-lg">
                <h3 className="font-bold mb-2">🔄 段階的な説得プロセス</h3>
                <p className="text-sm text-gray-300 mb-2">
                  各市民に対して最大3ラウンドのやり取りができます。
                </p>
                <ul className="text-xs text-gray-300 space-y-1 ml-4">
                  <li>• <strong>ラウンド1:</strong> 導入・興味喚起の文章</li>
                  <li>• <strong>ラウンド2:</strong> 説得を深める文章</li>
                  <li>• <strong>ラウンド3:</strong> クロージング・決断を促す文章</li>
                </ul>
              </div>
              
              <div className="bg-purple-900 p-4 rounded-lg">
                <h3 className="font-bold mb-2">📊 説得度メーター</h3>
                <p className="text-sm text-gray-300">
                  市民の説得度が0-100%で表示されます。
                  一定値を超えると購入を決断します。各ラウンドの文章により説得度が変化します。
                </p>
              </div>
              
              <div className="bg-green-900 p-4 rounded-lg">
                <h3 className="font-bold mb-2">💬 市民の反応</h3>
                <p className="text-sm text-gray-300">
                  あなたの文章に対して、市民が実際に反応します。
                  反応から次のラウンドの戦略を考えましょう。
                </p>
              </div>

              <div className="bg-red-900 p-4 rounded-lg">
                <h3 className="font-bold mb-2">⚠️ 戦略的思考が必要</h3>
                <p className="text-sm text-gray-300">
                  各ラウンドで提示される文章は異なります。同じ文章の繰り返しはできません。
                  矛盾した手法を使うと逆効果になることも。一貫性と相手の特性を考えた戦略が重要です。
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-red-600 text-white py-4 rounded-lg text-xl font-semibold hover:bg-red-700 transition"
          >
            シミュレーションを開始する
          </button>
        </div>
      </div>
    );
  }

  // ミッション画面
  if (gamePhase === 'mission') {
    const mission = MISSIONS[currentMission];
    
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">ミッション説明</h1>
          
          <div className="mb-8 bg-gray-700 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-3">{mission.name}</h2>
            <p className="text-gray-300 mb-4">{mission.description}</p>
            
            <div className="bg-red-900 p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-2">🎯 目標</h3>
              <p className="text-lg">{mission.target}</p>
            </div>
            
            <div className="bg-blue-900 p-4 rounded-lg">
              <h3 className="font-bold mb-2">📋 ルール</h3>
              <ul className="text-sm space-y-1">
                <li>• 各市民に対して最大3ラウンドのやり取りができます</li>
                <li>• 各ラウンドで4つの文章から1つを選んで送信します</li>
                <li>• <strong>ラウンドごとに異なる段階の文章が提示されます</strong></li>
                <li>• 市民の反応を見て次のラウンドの戦略を決めましょう</li>
                <li>• 説得度が一定値を超えると購入を決断します</li>
                <li>• 矛盾した手法を使うと逆効果になることも</li>
              </ul>
            </div>
          </div>

          <button
            onClick={startMission}
            className="w-full bg-red-600 text-white py-4 rounded-lg text-xl font-semibold hover:bg-red-700 transition"
          >
            ミッションを開始する
          </button>
        </div>
      </div>
    );
  }

  // ゲームプレイ画面
  if (gamePhase === 'playing') {
    const mission = MISSIONS[currentMission];
    
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-6xl mx-auto">
          {/* ヘッダー */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h1 className="text-2xl font-bold">
                  市民 {citizenIndex + 1}/{CITIZENS.length} - ラウンド {round}/{maxRoundsPerCitizen}
                </h1>
                <p className="text-sm text-gray-400">{mission.name}</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400">説得成功</div>
                  <div className="text-xl font-bold text-green-400">
                    {persuadedCount} / {mission.targetCount}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">倫理スコア</div>
                  <div className={`text-xl font-bold ${
                    ethicsScore >= 70 ? 'text-green-400' :
                    ethicsScore >= 40 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {Math.round(ethicsScore)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 現在の市民 */}
          {currentCitizen && (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
              <div className="flex items-start gap-6 mb-4">
                <div className="text-6xl">{currentCitizen.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{currentCitizen.name} ({currentCitizen.age}歳)</h3>
                  
                  {/* 説得度メーター */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">説得度</span>
                      <span className={`font-bold ${
                        persuasionLevel >= currentCitizen.persuasionThreshold ? 'text-green-400' :
                        persuasionLevel >= 50 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {Math.round(persuasionLevel)}% / {currentCitizen.persuasionThreshold}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-500 ${
                          persuasionLevel >= currentCitizen.persuasionThreshold ? 'bg-green-500' :
                          persuasionLevel >= 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${persuasionLevel}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">不安レベル:</span>
                      <span className="ml-2 font-semibold">{currentCitizen.anxietyLevel}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">批判的思考:</span>
                      <span className="ml-2 font-semibold">{currentCitizen.criticalThinking}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">権威への信頼:</span>
                      <span className="ml-2 font-semibold">{currentCitizen.trustInAuthority}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">時間的制約:</span>
                      <span className="ml-2 font-semibold">{currentCitizen.timeConstrained}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 会話履歴 */}
          {conversationHistory.length > 0 && (
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
              <h3 className="font-bold mb-3">会話履歴</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {conversationHistory.map((entry, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded">
                    <div className="text-xs text-gray-400 mb-1">ラウンド {entry.round} - あなた</div>
                    <p className="text-sm mb-2">{entry.playerMessage}</p>
                    <div className="text-xs">
                      <span className={`font-semibold ${
                        entry.persuasionIncrease > 15 ? 'text-green-400' :
                        entry.persuasionIncrease > 0 ? 'text-blue-400' :
                        'text-red-400'
                      }`}>
                        説得度 {entry.persuasionIncrease > 0 ? '+' : ''}{Math.round(entry.persuasionIncrease)}%
                      </span>
                      <span className="text-gray-400 ml-2">({entry.techniqueName})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 市民の反応表示 */}
          {showReaction && citizenReaction && (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
              <div className={`p-6 rounded-lg mb-4 ${
                citizenReaction.mood === 'convinced' ? 'bg-green-900 border-2 border-green-500' :
                citizenReaction.mood === 'interested' ? 'bg-blue-900 border-2 border-blue-500' :
                citizenReaction.mood === 'skeptical' ? 'bg-red-900 border-2 border-red-500' :
                'bg-gray-700'
              }`}>
                <div className="text-4xl mb-2">{citizenReaction.emoji}</div>
                <p className="text-lg">{citizenReaction.text}</p>
              </div>

              <button
                onClick={proceedToNext}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                {persuasionLevel >= currentCitizen.persuasionThreshold || round >= maxRoundsPerCitizen
                  ? '次の市民へ'
                  : '次のラウンドへ'}
              </button>
            </div>
          )}

          {/* メッセージ選択 */}
          {!showReaction && (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-2">
                {currentCitizen.name}に送る文章を選んでください
              </h2>
              
              <div className={`text-sm mb-4 p-3 rounded ${
                round === 1 ? 'bg-blue-900' :
                round === 2 ? 'bg-purple-900' :
                'bg-red-900'
              }`}>
                <strong>
                  {round === 1 && '📍 ラウンド1: 導入段階'}
                  {round === 2 && '📍 ラウンド2: 説得を深める段階'}
                  {round === 3 && '📍 ラウンド3: クロージング段階'}
                </strong>
                <p className="text-xs mt-1">
                  {round === 1 && '興味を引き、関心を持ってもらうことが目標です。'}
                  {round === 2 && '前回の反応を踏まえ、より具体的な情報で説得を深めます。'}
                  {round === 3 && '最終段階。決断を促し、購入へと導きます。'}
                </p>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">
                💡 {round === 1 ? 'まずは相手の特性を考えて、最も響きそうなアプローチを選びましょう' :
                     round === 2 ? '前回の反応と会話の流れを考慮して選びましょう' :
                     '最後の一押し。これまでの戦略と一貫性を保ちつつ、決断を促しましょう'}
              </p>
              
              <div className="space-y-3 mb-4">
                {messageOptions.map((message) => (
                  <button
                    key={message.key}
                    onClick={() => setSelectedMessage(message.key)}
                    className={`w-full text-left p-4 rounded-lg transition border-2 ${
                      selectedMessage === message.key
                        ? 'bg-blue-900 border-blue-500'
                        : 'bg-gray-700 border-gray-600 hover:border-blue-400'
                    }`}
                  >
                    <p className="text-white leading-relaxed">{message.text}</p>
                  </button>
                ))}
              </div>

              {selectedMessage && (
                <div className="flex gap-3">
                  <button
                    onClick={() => useMessage(selectedMessage)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    この文章を送信する
                  </button>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-6 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
                  >
                    選び直す
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 結果画面（簡略版 - 前のコードから流用）
  if (gamePhase === 'result') {
    const mission = MISSIONS[currentMission];
    const missionSuccess = persuadedCount >= mission.targetCount;
    const ethicalSuccess = ethicsScore >= 60;
    
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-2xl p-8 mb-6">
            <h1 className="text-4xl font-bold text-center mb-6">ミッション終了</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`p-6 rounded-lg ${
                missionSuccess ? 'bg-green-900 border-2 border-green-500' : 'bg-red-900 border-2 border-red-500'
              }`}>
                <h2 className="text-xl font-bold mb-2">📊 目標達成度</h2>
                <div className="text-4xl font-bold mb-2">
                  {persuadedCount} / {mission.targetCount}
                </div>
                <p className={missionSuccess ? 'text-green-400' : 'text-red-400'}>
                  {missionSuccess ? '✓ 目標達成' : '✗ 目標未達成'}
                </p>
              </div>
              
              <div className={`p-6 rounded-lg ${
                ethicalSuccess ? 'bg-blue-900 border-2 border-blue-500' : 'bg-orange-900 border-2 border-orange-500'
              }`}>
                <h2 className="text-xl font-bold mb-2">⚖️ 倫理スコア</h2>
                <div className="text-4xl font-bold mb-2">
                  {Math.round(ethicsScore)} / 100
                </div>
                <p className={ethicalSuccess ? 'text-blue-400' : 'text-orange-400'}>
                  {ethicalSuccess ? '比較的倫理的' : '倫理的問題あり'}
                </p>
              </div>
            </div>

            {/* 各市民の結果 */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">各市民の結果</h2>
              <div className="space-y-3">
                {allCitizensResults.map((result, index) => (
                  <div key={index} className={`p-4 rounded-lg ${
                    result.convinced ? 'bg-green-900' : 'bg-red-900'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl mr-2">{result.citizen.icon}</span>
                        <span className="font-bold">{result.citizen.name}</span>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${result.convinced ? 'text-green-400' : 'text-red-400'}`}>
                          {result.convinced ? '✓ 説得成功' : '✗ 説得失敗'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {result.rounds}ラウンド / 説得度 {Math.round(result.persuasionLevel)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={resetGame}
              className="w-full bg-blue-600 text-white py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition"
            >
              もう一度プレイする
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
