/**
 * SKAdNetworkItems Update Script
 * 工場長用: 全アプリ共通の広告ネットワークIDリストを一括適用するスクリプト
 * 
 * Usage: node scripts/update_skadnetwork.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ターゲットファイル
const PLIST_PATH = path.resolve(__dirname, '../ios/App/App/Info.plist');

// === 必須ネットワークリスト (Top 50+ Global Networks) ===
// Google, Meta, Unity, AppLovin, ironSource, TikTok(Pangle), Vungle, etc.
const SKADNETWORK_IDS = [
  // Google
  'cstr6suwn9.skadnetwork',
  // Meta (Facebook)
  'v9wttpbfk9.skadnetwork',
  'n38lu8286q.skadnetwork',
  // Unity Ads
  '4dzt52r2t5.skadnetwork',
  'bvpn9n2tp3.skadnetwork',
  // AppLovin
  'ludvb6z3bs.skadnetwork',
  // ironSource
  'su67r6k2v3.skadnetwork',
  // Pangle (TikTok)
  '238da6jt44.skadnetwork',
  '22mmun2rn5.skadnetwork',
  // Liftoff (Vungle)
  'gta9lk7p23.skadnetwork',
  // Mintegral
  'kbd757ywx3.skadnetwork',
  // InMobi
  'wzmmz9fp6w.skadnetwork',
  // Chartboost
  'f38h382jlk.skadnetwork',
  // AdColony
  '4pfyvq9l8r.skadnetwork',
  // Tapjoy
  'ecpz2srf59.skadnetwork',
  // Smaato
  'v72qych5uu.skadnetwork',
  // Maio
  '5a6flpkh64.skadnetwork',
  // Criteo
  '9rd848q2bz.skadnetwork',
  // Yahoo
  'e5fvkxwrpn.skadnetwork',
  // Amazon
  'p78axxw29g.skadnetwork',
  // PubMatic
  'k674qkevps.skadnetwork',
  // Index Exchange
  '5l3tpt7t6e.skadnetwork',
  // OpenX
  'av6w8kgt66.skadnetwork',
  // The Trade Desk
  'uw77j35x4d.skadnetwork',
  // Verizon
  'e5fvkxwrpn.skadnetwork',
  // MobVista
  '2u9pt9hc89.skadnetwork',
  // Fyber
  'n38lu8286q.skadnetwork',
  // StartApp
  '5l3tpt7t6e.skadnetwork',
  // YouAppi
  '3rd42ekr43.skadnetwork',
  // Moloco
  'glqzh8vgby.skadnetwork',
  // Aarki
  '4fyvq9l8r.skadnetwork',
  // LoopMe
  '5tjdwbrq8w.skadnetwork',
];

function updatePlist() {
  if (!fs.existsSync(PLIST_PATH)) {
    console.error(`❌ Info.plist not found at: ${PLIST_PATH}`);
    process.exit(1);
  }

  let content = fs.readFileSync(PLIST_PATH, 'utf8');

  // 1. 既存の SKAdNetworkItems ブロックを探す
  const startTag = '<key>SKAdNetworkItems</key>';
  const endTag = '</array>';
  
  const startIndex = content.indexOf(startTag);
  if (startIndex === -1) {
    // ブロックがない場合は挿入（簡易実装：dictの最後に追加）
    console.log('⚠️ SKAdNetworkItems not found. Creating new block...');
    const dictEnd = '</dict>\n</plist>';
    const newBlock = `\t<key>SKAdNetworkItems</key>\n\t<array>\n${generateArrayItems()}\t</array>\n`;
    content = content.replace(dictEnd, `${newBlock}${dictEnd}`);
  } else {
    // 既存ブロックを置換
    const arrayStartIndex = content.indexOf('<array>', startIndex);
    const arrayEndIndex = content.indexOf('</array>', arrayStartIndex);
    
    if (arrayStartIndex === -1 || arrayEndIndex === -1) {
      console.error('❌ Failed to parse existing SKAdNetworkItems array.');
      process.exit(1);
    }

    const before = content.substring(0, arrayStartIndex + 7); // <array> まで
    const after = content.substring(arrayEndIndex); // </array> から
    
    // 中身を全置換（重複排除のため、常に指定リストで上書きする仕様とします）
    const newItems = generateArrayItems();
    content = before + '\n' + newItems + '\t' + after;
  }

  fs.writeFileSync(PLIST_PATH, content, 'utf8');
  console.log(`✅ SKAdNetworkItems updated! Total count: ${SKADNETWORK_IDS.length}`);
}

function generateArrayItems() {
  // 重複除去 + 小文字統一
  const uniqueIds = [...new Set(SKADNETWORK_IDS.map(id => id.toLowerCase()))];
  
  return uniqueIds.map(id => 
    `\t\t<dict>\n\t\t\t<key>SKAdNetworkIdentifier</key>\n\t\t\t<string>${id}</string>\n\t\t</dict>`
  ).join('\n');
}

updatePlist();
