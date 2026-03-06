import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, HeartPulse, Sparkles, Search, 
  Fingerprint, ClipboardList, RefreshCw, 
  Calendar, Moon, Sun, User, Star, Lock, BookOpen, X, TrendingUp, DollarSign, Zap, AlertTriangle, ArrowLeft, Info, Book, ChevronRight, Shirt, Trophy, ShieldAlert, Activity, Coffee, Gavel, Stethoscope, Briefcase, Share2, Copy, Check, Target, Lightbulb
} from 'lucide-react';

// ============================================================================
// 🌟 1. 全域常數與數據庫
// ============================================================================

const SUPABASE_URL = 'https://iexqzqqmiqnblribrfzz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Hhqze1k_--7-30i1Umfw6A_5rIa93Cp';

const THEME_DEFAULTS = {
  innate: { icon: Sparkles, label: "先天盤" },
  yearly: { icon: Calendar, label: "流年" },
  monthly: { icon: Moon, label: "流月" },
  daily: { icon: Sun, label: "流日" }
};

const ELEMENT_THEMES = {
  "木": { primary: "#2E7D32", accent: "#E8F5E9", bg: "linear-gradient(135deg, #f0f7f0 0%, #e8f5e9 100%)", text: "#1B5E20", label: "木 (森林綠)" },
  "火": { primary: "#D84315", accent: "#FBE9E7", bg: "linear-gradient(135deg, #fff5f2 0%, #fbe9e7 100%)", text: "#BF360C", label: "火 (暖陽紅)" },
  "土": { primary: "#5D4037", accent: "#EFEBE9", bg: "linear-gradient(135deg, #f7f3f1 0%, #efebe9 100%)", text: "#3E2723", label: "土 (大地色)" },
  "金": { primary: "#455A64", accent: "#FAFAFA", bg: "linear-gradient(135deg, #f8f9f9 0%, #fafafa 100%)", text: "#263238", label: "金 (灰藍色)" },
  "水": { primary: "#1565C0", accent: "#E3F2FD", bg: "linear-gradient(135deg, #f2f8ff 0%, #e3f2fd 100%)", text: "#0D47A1", label: "水 (深海藍)" }
};

const MISSING_ENERGY_DB = {
  1: "缺乏獨立自主。決策時迷茫。需補足自我靈魂主位。",
  2: "溝通能級受阻。屬「刀子嘴豆腐心」。溫柔的話不懂溫柔說。",
  3: "行動力能級不足。對商機反應緩慢，容易在猶豫中錯失，屬於想多做少。",
  4: "自控力弱。財富去向不明，做事難持之以恆，常見學而不精。",
  5: "判斷力缺失。分不清貴人與小人，重大轉折點容易選錯方向。",
  6: "財富吸引力弱。習慣「大方別人、小氣自己」，忽略自身富足累積。",
  7: "貴人緣份薄。凡事親力親為，缺乏外界助力。注意中晚年健康防護。",
  8: "抗壓性不足。遇重大重任容易焦慮失眠，傾向逃避決策責任。",
  9: "存在感弱。付出良多卻在收穫時刻被邊緣化。"
};

const JOINT_CODES_DB = {
  "112": { title: "外交官/中介", pos: "非常有自信地與人溝通，具備表達能力成就自己。", neg: "過度自我，猶豫不決，性格強勢。", advice: "健康注意呼吸道。建議對接高端資源或建立標準化系統。" },
  "123": { title: "演說家/講師", pos: "直覺力強，說話坦白具說服力。", neg: "說話不經大腦，容易禍從口出。", advice: "建議建立知識輸出系統，對接教育平台。" },
  "134": { title: "功德號/創意策劃", pos: "有創意多才多藝，積極規劃生活。", neg: "內心脆弱依賴，容易鑽牛角尖。", advice: "建議參與公益事業，以利他思維引動財富。" },
  "145": { title: "專業領導", pos: "獨立穩重，擅長精打細算製作完美計劃。", neg: "容易半途與廢，自以為是。", advice: "適合管理型職務，需注重團隊授權。" },
  "156": { title: "五湖四海", pos: "有原則有事業心，適合外地發展。", neg: "固執大男人主義，原地發展易生不良嗜好。", advice: "建議對接高端資源或建立標準化系統。" },
  "358": { title: "效率能手", pos: "具備核心天賦能級，處事極具效率。", neg: "當能級低位時需注意調整，避免過度耗能。", advice: "建議對接高端資源或建立標準化系統。" },
  "382": { title: "應變能手/水火衝", pos: "處理事情積極，能尋求突破。", neg: "脾氣暴躁善變，只對親近的人發脾氣。", advice: "修煉定力，建議投入心靈成長或穩定資源對接。" },
  "821": { title: "銷售冠軍", pos: "極強的銷售能力，不管多大壓力都能承擔。", neg: "內心自卑，不願與人合作，猶豫不決。", advice: "適合帶領團隊，注重支付系統的穩定對接。" },
  "966": { title: "點石成金", pos: "智慧與財富兼具，能以錢生錢。", neg: "太貪心，財來財去不重金錢。", advice: "建議長期資產配置，建立被動收入系統。" }
};

const TRAITS_DB = {
  1: { trait: "開創領袖", pos: "展現領袖風範、獨立自主、目標明確。", neg: "容易流於自我中心、過度強勢、忽略他人感受。" },
  2: { trait: "溝通大師", pos: "口才優、親和力強、擅長調和他人、靈感想像豐富。", neg: "看重不快、猶豫不決、容易被他人情緒左右。" },
  3: { trait: "行動火炬", pos: "爆發力強、反應神速、熱情洋溢。", neg: "容易急躁衝動、缺乏耐性、半途而廢。" },
  4: { trait: "邏輯策劃", pos: "思維精密、處事有條理、重視穩定。", neg: "過於保守死板、想多做少、鑽牛角尖。" },
  5: { trait: "方向領袖", pos: "意志堅定、具幽默感、一呼百應。", neg: "固執難溝通、方向迷茫時容易沉淪。" },
  6: { trait: "財富管理", pos: "帶財高智、負責愛家、洞察商機。", neg: "完美主義、對人苛刻、承擔過多壓力。" },
  7: { trait: "人脈幸運", pos: "貴人眾多、洞察人心、運氣極佳。", neg: "反應慢拍、依賴性強、冷漠遲緩。" },
  8: { trait: "責任實幹", pos: "承擔力強、定海神針、使命必達。", neg: "死要面子活受罪、壓力過大導致情緒崩潰。" },
  9: { trait: "圓滿智者", pos: "格局宏大、心想事成、博學多才。", neg: "貪多不專、內心委屈、流於空談。" }
};

const SOURCE_DREAM_REPORT_DB = {
  1: { title: "當領導", motivation: "天生帶領團隊，能帶領千軍萬馬做一番大事業。", pos: "具備極強的領導力與掌控力。", neg: "表現得像「老闆」，聽不進他人意見。", action: "管理職、帶領團隊。", sentence: (n) => `「我${n}就是領導人！」` },
  2: { title: "靠嘴征服世界", motivation: "言語具有磁場療癒人心。", pos: "溝通流暢，具有說服力。", neg: "碎碎念、禍從口出。", action: "講師、顧問、銷售。", sentence: (n) => `「我${n}要靠嘴征服世界！」` },
  3: { title: "成為貴族", motivation: "追求精緻與高品質生活。", pos: "氣質優雅，生活有品味。", neg: "虛榮心重，過度追求外在形式。", action: "奢侈品行業、藝術創作。", sentence: (n) => `「我${n}會擁有貴族人生！」` },
  4: { title: "規畫人生", motivation: "幫助他人建立系統。", pos: "邏輯嚴謹，能將複雜事物簡化。", neg: "過於死板教條。", action: "財務規畫、流程設計。", sentence: (n) => `「我${n}可以幫助所有人規畫人生！」` },
  5: { title: "成為領袖", motivation: "一呼百應，目標清晰。", pos: "具備強大的影響力。", neg: "獨裁、不聽勸告。", action: "政治、社團首領。", sentence: (n) => `「我${n}要成為領袖！」` },
  6: { title: "用錢征服世界", motivation: "財富轉化為社會大愛。", pos: "極強的理財能力。", neg: "吝嗇、視財如命。", action: "投資家、慈善基金會。", sentence: (n) => `「我${n}要用錢利益眾生！」` },
  7: { title: "掌控所有人", motivation: "內心充滿愛而關心他人。", pos: "人脈經營大師。", neg: "算計他人，控制他人。", action: "公關、人資。", sentence: (n) => `「我${n}可以從容控制一切！」` },
  8: { title: "拿到權利", motivation: "重視尊嚴與責任實幹。", pos: "具備威懾力，處事公允。", neg: "濫用權力，死板固執。", action: "公職、高級主管。", sentence: (n) => `「我${n}會拿到屬於自己的權利！」` },
  9: { title: "君臨天下", motivation: "格局宏大建立利他制度。", pos: "智慧圓滿，具有高度靈性。", neg: "不切實際的幻想。", action: "全球化產業、心靈導師。", sentence: (n) => `「我${n}為人人,人人為我,將君臨天下！」` }
};

const YEARLY_DETAIL_DB = {
  1: { core: "開創重啟", career: "適合開創新行業或向外發展。", negative: "傲慢情緒大。", health: "婚姻功課年。" },
  2: { core: "溝通合作", career: "合作共富年，請多參與社交活動、擴展人脈。", negative: "猶豫不決，左右搖擺，需修煉定力。", health: "會表白吸引姻緣，多對另一半說甜蜜情話。" },
  3: { core: "變動磨練", career: "嚴禁投資。", negative: "容易招小人。", health: "注意心臟。" },
  4: { core: "策劃佈局", career: "投資學習。", negative: "鑽牛角尖。", health: "容易失眠。" },
  5: { core: "轉折主動", career: "必須主動。", negative: "固執被動。", health: "擁抱新環境。" },
  6: { core: "財富豐收", career: "遠瞻性投資。", negative: "挑剔計較。", health: "打扮圓融。" },
  7: { core: "貴人幸運", career: "人脈極旺。", negative: "拖延反應慢。", health: "適合結婚。" },
  8: { core: "壓力承擔", career: "不能借錢。", negative: "有無力感。", health: "注意體力。" },
  9: { core: "成功結果", career: "分享成果。", negative: "貪心無度。", health: "注意高壓。" }
};

const DAILY_DRESSING_DB = {
  "金": { wealth: ["紅、紫"], noble: ["藍、黑"], advice: "建議配戴金屬飾品強化威信。" },
  "木": { wealth: ["藍、黑"], noble: ["紅、紫"], advice: "建議穿搭棉麻面料平衡思維。" },
  "水": { wealth: ["黃、咖"], noble: ["白、銀"], advice: "建議選用流動面料強化磁場。" },
  "火": { wealth: ["白、銀"], noble: ["黃、金"], advice: "建議選用亮色飾品啟動直覺。" },
  "土": { wealth: ["藍、黑"], noble: ["紅、紫"], advice: "建議選用大地色系展現穩重感。" }
};

// ============================================================================
// 🌟 2. 輔助組件
// ============================================================================

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 p-6 text-center font-black">
        <AlertTriangle size={64} className="text-rose-500 mb-4" />
        <h2 className="text-xl text-rose-800 mb-2 font-black">系統解析異常</h2>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-rose-500 text-white rounded-full shadow-lg font-black">重新啟動</button>
      </div>
    );
    return this.props.children;
  }
}

const SvgNumNode = ({ x, y, value, label, elementColor, isCore = false, starPos = null }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-22" y="-22" width="44" height="44" rx="10" fill="white" stroke={elementColor} strokeWidth={isCore ? "4" : "2"} className="filter drop-shadow-sm" />
    {label && <text y="-32" textAnchor="middle" className="text-[9px] font-black fill-gray-400 uppercase tracking-tighter">{label}</text>}
    <text dominantBaseline="central" textAnchor="middle" className={`${isCore ? 'text-2xl' : 'text-lg'} font-black`} fill={elementColor}>{value}</text>
    {starPos === 'left-top' && <path d="M-30,-30 l2.5,6 l6,0 l-5,4 l2,7 l-5.5,-4.5 l-5.5,4.5 l2,-7 l-5,-4 l6,0 z" fill="#FFD700" className="animate-pulse" />}
    {starPos === 'right-top' && <path d="M30,-30 l2.5,6 l6,0 l-5,4 l2,7 l-5.5,-4.5 l-5.5,4.5 l2,-7 l-5,-4 l6,0 z" fill="#FFD700" className="animate-pulse" />}
    {starPos === 'top' && <path d="M0,-45 l2.5,6 l6,0 l-5,4 l2,7 l-5.5,-4.5 l-5.5,4.5 l2,-7 l-5,-4 l6,0 z" fill="#FFD700" className="animate-pulse" />}
  </g>
);

// ============================================================================
// 🌟 3. 主組件 App
// ============================================================================
export default function App() {
  const [formData, setFormData] = useState({
    name: '王小明', gender: '女', zodiac: '狗', birthDate: '1970-02-19', 
    targetYear: '2026', targetMonth: '3', targetDay: '2', isLateNight: false,
    twinType: 'none', parentBirthDate: '1945-01-01' 
  });
  const [viewMode, setViewMode] = useState('innate'); 
  const [showReport, setShowReport] = useState(false); 
  const [analysisCode, setAnalysisCode] = useState(null); 
  const [consultant, setConsultant] = useState('mata');
  const [shareLink, setShareLink] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState(null);

  const isLocked = viewMode !== 'innate';

  // 🌟 核心計算邏輯
  const reduce = (val) => {
    let current = String(val || '0').replace(/[^0-9]/g, '');
    if (!current || current === '0') return 0;
    while (current.length > 1) {
      current = String(current.split('').reduce((a, b) => parseInt(a) + parseInt(b), 0));
    }
    return parseInt(current, 10);
  };

  const active = useMemo(() => {
    let [bY, bM, bD] = (formData.birthDate || "1970-01-01").split('-').map(Number);
    let birthObj = new Date(bY, bM - 1, bD);
    if (formData.isLateNight) birthObj.setDate(birthObj.getDate() + 1);
    const iY = String(birthObj.getFullYear()), iM = birthObj.getMonth() + 1, iD = birthObj.getDate();
    const curYearStr = viewMode === 'innate' ? iY : formData.targetYear;
    let D = reduce(curYearStr.substring(0, 2)), E = reduce(curYearStr.substring(2, 4));
    if (curYearStr === "2000") { D = 2; E = 5; } 
    let baseDay = iD, baseMonth = iM;
    if (formData.twinType !== 'none' && formData.parentBirthDate) {
      const [pY, pM, pD] = formData.parentBirthDate.split('-').map(Number);
      if (!isNaN(pM) && !isNaN(pD)) { baseDay = iD + pD; baseMonth = iM + pM; }
    }
    const valA = viewMode === 'daily' ? (parseInt(formData.targetDay) + reduce(baseDay)) : baseDay;
    const valB = (viewMode === 'monthly' || viewMode === 'daily') ? (parseInt(formData.targetMonth) + reduce(baseMonth)) : baseMonth;
    const A = reduce(valA), B = reduce(valB), C = reduce(A + B), F = reduce(D + E), G = reduce(C + F); 
    const I = reduce(F + G), H = reduce(C + G), J = reduce(I + H);
    const K = reduce(A + C), L = reduce(B + C), M = reduce(K + L);
    const nN = reduce(D + F), nO = reduce(E + F), nP = reduce(nN + nO);
    
    const getEl = (n) => {
      if ([1, 6].includes(n)) return '金'; if ([2, 7].includes(n)) return '水';
      if ([3, 8].includes(n)) return '火'; if ([4, 9].includes(n)) return '木';
      return '土';
    };

    const getMotherEl = (childEl) => {
      const map = { "水": "金", "木": "水", "火": "木", "土": "火", "金": "土" };
      return map[childEl] || childEl;
    };

    const mainEl = getEl(G);
    const themeEl = getMotherEl(mainEl);
    const elOrder = { '金':['金','水','木','火','土'], '水':['水','木','火','土','金'], '火':['火','土','金','水','木'], '木':['木','火','土','金','水'], '土':['土','金','水','木','火'] }[mainEl];
    const counts = elOrder.map(e => [A,B,C,D,E,F,G,H,I,J,K,L,M,nN,nO,nP].filter(num => getEl(num) === e).length);
    
    return { 
      modeLabel: THEME_DEFAULTS[viewMode]?.label || "運勢",
      nums: { A, B, C, D, E, F, G, H, I, J, K, L, M, n: nN, O: nO, P: nP }, 
      missing: [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => ![A, B, C, D, E, F, G].includes(n)), 
      hidden: { H1: reduce(C + C), H2: reduce(F + F), H3: reduce(G + G) }, 
      sourceDream: reduce(A + E + G), elements: { mainEl, themeEl, elOrder, counts },
      theme: ELEMENT_THEMES[themeEl] || ELEMENT_THEMES["土"]
    };
  }, [formData, viewMode]);

  const currentTheme = active.theme;

  const indicators = useMemo(() => [
    { id: '①', n: '父基因(事業)', v: `${active.nums.A}${active.nums.B}${active.nums.C}` },
    { id: '②', n: '母基因(婚姻)', v: `${active.nums.D}${active.nums.E}${active.nums.F}` },
    { id: '③', n: '主性格組合', v: `${active.nums.C}${active.nums.F}${active.nums.G}` },
    { id: '④', n: '人生過程 1', v: `${active.nums.C}${active.nums.G}${active.nums.H}` },
    { id: '⑤', n: '人生過程 2', v: `${active.nums.F}${active.nums.G}${active.nums.I}` },
    { id: '⑥', n: '官鬼組合', v: `${active.nums.I}${active.nums.H}${active.nums.J}` },
    { id: '⑦', n: '事業過程 1', v: `${active.nums.A}${active.nums.C}${active.nums.K}` },
    { id: '⑧', n: '事業過程 2', v: `${active.nums.B}${active.nums.C}${active.nums.L}` },
    { id: '⑨', n: '朋友組合', v: `${active.nums.K}${active.nums.L}${active.nums.M}` },
    { id: '⑩', n: '婚姻過程 1', v: `${active.nums.D}${active.nums.F}${active.nums.n}` },
    { id: '⑪', n: '婚姻過程 2', v: `${active.nums.E}${active.nums.F}${active.nums.O}` },
    { id: '⑫', n: '未來財富組合', v: `${active.nums.n}${active.nums.O}${active.nums.P}` },
    { id: '⑬', n: '隱藏號矩陣', v: `${active.hidden.H1}${active.hidden.H2}${active.hidden.H3}` },
  ], [active]);

  // 🌟 動作處理
  const handleDeepReportClick = () => { setShowReport(true); };

  const handleShare = async () => {
    if (!supabaseClient) return;
    setIsSharing(true);
    try {
      const { data } = await supabaseClient.from('shares').insert([{ form_data: formData, consultant }]).select();
      if (data?.[0]?.id) {
        const baseUrl = window.location.origin + window.location.pathname;
        setShareLink(`${baseUrl}?sid=${data[0].id}&id=${consultant}`);
      }
    } catch (err) { console.error(err); } finally { setIsSharing(false); }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    script.onload = () => {
      if (window.supabase) {
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        setSupabaseClient(client);
        const urlParams = new URLSearchParams(window.location.search);
        const cId = urlParams.get('id');
        const sid = urlParams.get('sid');
        if (cId) setConsultant(cId);
        if (sid) {
          client.from('shares').select('form_data').eq('id', sid).single()
            .then(({ data }) => { if (data) setFormData(data.form_data); });
        }
      }
    };
    document.body.appendChild(script);
    return () => { if (document.body && document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  // ============================================================================
  // 🌟 渲染邏輯
  // ============================================================================

  if (showReport && active) {
    const yearlyData = YEARLY_DETAIL_DB[active.nums.G] || YEARLY_DETAIL_DB[1];
    const sourceDreamInfo = SOURCE_DREAM_REPORT_DB[active.sourceDream] || SOURCE_DREAM_REPORT_DB[1];
    const traitInfo = TRAITS_DB[active.nums.G] || TRAITS_DB[1];
    const dailyDressing = DAILY_DRESSING_DB[active.elements.mainEl] || DAILY_DRESSING_DB["土"];

    return (
      <ErrorBoundary>
        <div className="min-h-screen p-4 sm:p-10 font-sans text-[#4A3A2E] overflow-y-auto font-black" style={{ background: currentTheme.bg }}>
          
          {analysisCode && (
            <div className="fixed inset-0 z-[150] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setAnalysisCode(null)}>
              <div className="bg-white w-full max-w-xl rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-12 shadow-2xl relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <button onClick={() => setAnalysisCode(null)} className="absolute top-6 right-6 p-2 bg-gray-100 text-gray-400 rounded-full hover:bg-gray-200"><X size={20}/></button>
                <div className="flex items-center gap-6 sm:gap-8 mb-8 sm:mb-12">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-white text-3xl sm:text-5xl font-black font-mono shadow-xl bg-[#2E7D32]">
                    {analysisCode}
                  </div>
                  <div className="text-left font-black">
                    <h4 className="text-2xl sm:text-4xl font-black text-gray-800">核心能量解析</h4>
                    <p className="text-[10px] sm:text-sm text-gray-400 font-bold uppercase mt-1">JOINT CODE INSIGHT</p>
                  </div>
                </div>
                <div className="space-y-4 sm:space-y-6 font-black">
                  <div className="p-5 sm:p-8 bg-[#E8F5E9] rounded-[2rem] border border-[#C8E6C9] font-black">
                    <h5 className="text-[#2E7D32] font-black mb-2 flex items-center gap-2 text-lg"><Zap size={20} className="fill-current"/> 正向能量</h5>
                    <p className="text-gray-700 font-bold text-base sm:text-lg leading-relaxed">{JOINT_CODES_DB[analysisCode]?.pos || "具備核心天賦能級。"}</p>
                  </div>
                  <div className="p-5 sm:p-8 bg-[#FDF2F2] rounded-[2rem] border border-[#FDE2E2] font-black">
                    <h5 className="text-[#E02424] font-black mb-2 flex items-center gap-2 text-lg"><AlertTriangle size={20} className="fill-current"/> 負面預警</h5>
                    <p className="text-gray-700 font-bold text-base sm:text-lg leading-relaxed">{JOINT_CODES_DB[analysisCode]?.neg || "當能級低位時需注意調整。"}</p>
                  </div>
                  <div className="p-5 sm:p-8 bg-[#FFF9E6] rounded-[2rem] border border-[#FFE48A] font-black">
                    <h5 className="text-[#B8860B] font-black mb-2 flex items-center gap-2 text-lg"><TrendingUp size={20}/> [人生提醒]</h5>
                    <p className="text-gray-700 font-bold text-base sm:text-lg leading-relaxed">{JOINT_CODES_DB[analysisCode]?.advice || "建議對接高端資源。"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">
            <button onClick={() => setShowReport(false)} className="flex items-center gap-2 bg-white px-6 py-2 sm:px-8 sm:py-3 rounded-full border shadow-sm font-black transition-all hover:scale-105"><ArrowLeft size={18} /> 返回</button>
            <div className="text-center font-black">
              <h1 className="text-3xl sm:text-4xl font-black text-[#4A3A2E] mb-4">{active.modeLabel}五行深度解析報告</h1>
              <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-6 bg-white/50 py-3 px-6 sm:px-10 rounded-3xl sm:rounded-full border border-white font-bold backdrop-blur-md">
                <span className="text-sm sm:text-base">命主：{formData.name}</span>
                <span className="text-sm sm:text-base">核心數：<span className="text-xl font-black" style={{ color: ELEMENT_THEMES[active.elements.mainEl].primary }}>{active.nums.G}</span></span>
                <span className="text-sm sm:text-base">顧問：<span className="font-black text-rose-600">{consultant}</span></span>
              </div>
            </div>

            <div className="bg-white/90 rounded-[2rem] sm:rounded-[4rem] p-6 sm:p-10 shadow-2xl border-2 flex flex-col items-center">
                <h3 className="text-xl sm:text-2xl font-black mb-8 self-start border-b pb-4 w-full flex items-center gap-2"><Activity /> {active.modeLabel}核心佈局</h3>
                <div className="relative mb-12 flex flex-col items-center w-full">
                  <div className="w-full max-w-[400px]">
                    <svg viewBox="0 0 400 450" className="w-full h-auto drop-shadow-2xl overflow-visible font-black">
                      <path d="M50 80 L200 240 L350 80 Z" fill="none" stroke={ELEMENT_THEMES[active.elements.mainEl].primary} strokeWidth="1" strokeOpacity="0.2" />
                      <SvgNumNode x={50} y={80} value={active.nums.A} label="A" elementColor="#EF4444" starPos="left-top" />
                      <SvgNumNode x={120} y={80} value={active.nums.B} label="B" elementColor="#EF4444" />
                      <SvgNumNode x={280} y={80} value={active.nums.D} label="D" elementColor="#EF4444" />
                      <SvgNumNode x={350} y={80} value={active.nums.E} label="E" elementColor="#EF4444" starPos="right-top" />
                      <SvgNumNode x={85} y={160} value={active.nums.C} label="C" elementColor="#8B5CF6" />
                      <SvgNumNode x={315} y={160} value={active.nums.F} label="F" elementColor="#8B5CF6" />
                      <SvgNumNode x={200} y={240} value={active.nums.G} label="核心" elementColor={ELEMENT_THEMES[active.elements.mainEl].primary} isCore starPos="top" />
                      <SvgNumNode x={125} y={320} value={active.nums.I} label="I" elementColor="#10B981" />
                      <SvgNumNode x={275} y={320} value={active.nums.H} label="H" elementColor="#10B981" />
                      <SvgNumNode x={200} y={400} value={active.nums.J} label="J" elementColor="#374151" />
                    </svg>
                  </div>
                  <div className="mt-10 bg-gray-100/70 px-6 sm:px-12 py-4 rounded-full flex gap-6 sm:gap-12 border border-white shadow-inner font-black">
                    <div className="flex items-center gap-2 sm:gap-3 font-black"><span className="text-[9px] text-gray-400 font-black -rotate-90">KLM</span><div className="flex gap-1.5 sm:gap-2">{[active.nums.M, active.nums.L, active.nums.K].map((n, i) => (<span key={i} className="bg-white px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm text-lg sm:text-2xl text-blue-600 font-mono font-black">{n}</span>))}</div></div>
                    <div className="w-px bg-gray-300 h-6 sm:h-8 self-center"></div>
                    <div className="flex items-center gap-2 sm:gap-3 font-black"><div className="flex gap-1.5 sm:gap-2">{[active.nums.n, active.nums.O, active.nums.P].map((n, i) => (<span key={i} className="bg-white px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm text-lg sm:text-2xl text-orange-600 font-mono font-black">{n}</span>))}</div><span className="text-[9px] text-gray-400 rotate-90 font-black">NOP</span></div>
                  </div>
                </div>
            </div>

            <div className="bg-white/90 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] border-2 shadow-sm space-y-8 font-black">
              <h3 className="text-xl sm:text-2xl font-black mb-4 flex items-center gap-3 border-b pb-4"><TrendingUp /> {active.modeLabel}核心解析</h3>
              <div className="space-y-6">
                <div className="p-4 sm:p-6 rounded-3xl font-black bg-gray-50/50">
                  <p className="text-[10px] font-black text-gray-400 mb-1">核心特質</p>
                  <p className="text-xl sm:text-2xl font-black" style={{ color: ELEMENT_THEMES[active.elements.mainEl].primary }}>{yearlyData.core}</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:gap-6 text-gray-700">
                  <div className="bg-emerald-50 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-3xl border border-emerald-100"><h4 className="text-emerald-700 font-black mb-2 uppercase text-xs">專業向與財運建議</h4><p className="text-sm sm:text-base font-black leading-relaxed">{yearlyData.career}</p></div>
                  <div className="bg-rose-50 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-3xl border border-rose-100"><h4 className="text-rose-700 font-black mb-2 uppercase text-xs">當負面能級覺察</h4><p className="text-sm sm:text-base font-black leading-relaxed">{yearlyData.negative || "注意情緒平衡。"}</p></div>
                  <div className="bg-blue-50 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-3xl border border-blue-100"><h4 className="text-blue-700 font-black mb-2 uppercase text-xs">健康與感情提醒</h4><p className="text-sm sm:text-base font-black leading-relaxed">{yearlyData.health}</p></div>
                </div>
              </div>
            </div>

            {viewMode === 'innate' && (
              <div className="bg-white rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-10 shadow-sm space-y-8 font-black border border-gray-100">
                <h3 className="text-xl font-black text-blue-800 mb-6 flex items-center gap-3"><User size={24} /> 先天性格特質解析</h3>
                <div className="p-6 sm:p-8 bg-gray-50 rounded-[1.5rem] sm:rounded-[2.5rem] space-y-6 sm:space-y-8">
                  <div className="flex items-center gap-4"><span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black">角色定位</span><p className="text-lg sm:text-xl font-black">{active.nums.G} 號人 ({traitInfo.trait})</p></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 font-black">
                    <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-3xl border border-gray-100 shadow-sm"><h5 className="text-blue-600 font-black mb-2 flex items-center gap-2 text-xs font-black"><Zap size={14}/> 正向能級潛能</h5><p className="text-sm text-gray-600 leading-relaxed font-black">{traitInfo.pos}</p></div>
                    <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-3xl border border-gray-100 shadow-sm"><h5 className="text-gray-400 font-black mb-2 flex items-center gap-2 text-xs font-black"><AlertTriangle size={14}/> 負面能級卡點</h5><p className="text-sm text-gray-600 leading-relaxed font-black">{traitInfo.neg}</p></div>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'innate' && (
              <div className="bg-[#9B89B3] rounded-[2rem] sm:rounded-[4rem] p-8 sm:p-12 shadow-xl space-y-8 text-white relative overflow-hidden font-black">
                  <div className="absolute top-10 right-10 opacity-10"><Star size={180} /></div>
                  <div className="flex items-center gap-4 mb-8 border-b border-white/20 pb-6 relative z-10 font-black"><Lock size={28} /><h3 className="text-xl sm:text-3xl font-black font-black">潛意識的渴望深度解析</h3></div>
                  <div className="flex items-baseline gap-6 mb-8 relative z-10"><span className="text-6xl sm:text-8xl font-black opacity-40 font-black">{active.sourceDream}</span><h2 className="text-2xl sm:text-4xl font-black font-black">{sourceDreamInfo.title}</h2></div>
                  <div className="space-y-4 relative z-10 font-black">
                    {[{ label: "核心慾望", val: sourceDreamInfo.motivation }, { label: "使命使命", val: sourceDreamInfo.pos }, { label: "負向表現", val: sourceDreamInfo.neg }, { label: "適合環境", val: sourceDreamInfo.action }].map((item, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-md p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/10 font-black"><p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2 font-black">{item.label}</p><p className="text-sm sm:text-lg font-black leading-relaxed">{item.val}</p></div>
                    ))}
                    <div className="bg-white/20 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-dashed border-white/30 text-center mt-6 sm:mt-10"><p className="text-lg sm:text-2xl font-black text-yellow-200">「{sourceDreamInfo.sentence(formData.name)}」</p></div>
                  </div>
              </div>
            )}

            {/* 🌟 健康與缺失 (截圖 194159) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 font-black">
              <div className="bg-[#f0ece6] p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] border-2 shadow-inner text-[#4A3A2E] font-black">
                <div className="flex items-center gap-4 mb-6 border-b-2 pb-4 border-[#d9c5a4]"><HeartPulse size={36} className="text-[#a65a5a]" /><h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight font-black">五行健康訊息</h3></div>
                <p className="font-bold text-base sm:text-lg mb-6">官鬼能量組合 ⑥：<span className="text-3xl sm:text-4xl text-[#a65a5a] font-black ml-2">{active.nums.I}{active.nums.H}{active.nums.J}</span></p>
                <div className="space-y-3 sm:y-4 font-black">
                  {(active.missing.includes(1) || active.missing.includes(6)) && <div className="p-3 sm:p-4 bg-white/70 rounded-[1.2rem] sm:rounded-2xl shadow-sm font-bold text-xs sm:text-sm">● 「金系」肺腸缺失：建議 Auroa 極淨纖果粉</div>}
                  {(active.missing.includes(4) || active.missing.includes(9)) && <div className="p-3 sm:p-4 bg-white/70 rounded-[1.2rem] sm:rounded-2xl shadow-sm font-bold text-xs sm:text-sm">● 「木系」肝膽缺失：建議 DawnBliss 昕悅活力飲</div>}
                  {active.missing.includes(5) && <div className="p-3 sm:p-4 bg-white/70 rounded-[1.2rem] sm:rounded-2xl shadow-sm font-bold text-xs sm:text-sm">● 「土系」脾胃缺失：建議 Spark 閃朔系列</div>}
                  {active.missing.includes(2) && <div className="p-3 sm:p-4 bg-white/70 rounded-[1.2rem] sm:rounded-2xl shadow-sm font-bold text-xs sm:text-sm">● 「水系」腎骨低位：建議 Flora 亮妍嬌源飲</div>}
                </div>
              </div>
              <div className="rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-12 shadow-xl text-white bg-[#a65a5a] border-4 border-white/20 font-black">
                <div className="flex items-center gap-4 mb-8 font-black"><Search size={32} /><h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight">缺失能量詳細解析</h3></div>
                <div className="space-y-4 sm:space-y-6">
                  {active.missing.map(num => (
                    <div key={num} className="flex gap-4 sm:gap-5 items-start bg-white/10 p-4 sm:p-5 rounded-[1.5rem] sm:rounded-3xl border border-white/10 shadow-inner">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white text-[#a65a5a] rounded-xl sm:rounded-2xl flex items-center justify-center font-black shrink-0 text-xl sm:text-3xl">{num}</div>
                      <p className="text-sm sm:text-base font-bold leading-relaxed">{MISSING_ENERGY_DB[num]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 13項指標 (高亮) */}
            <div className="bg-white/80 rounded-[2.5rem] sm:rounded-[4rem] p-6 sm:p-12 border-2 shadow-sm text-center font-black">
              <h3 className="text-2xl font-black mb-8 text-gray-800">13 項指標解析</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 font-black">
                {indicators.map((item, i) => {
                  const isYellow = ['①', '②', '③', '④', '⑦', '⑧', '⑨', '⑫', '⑬'].includes(item.id);
                  return (
                    <button key={i} onClick={() => setAnalysisCode(item.v)} className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] border-2 flex flex-col items-center transition-all group active:scale-95 shadow-sm ${isYellow ? 'bg-[#FFF9E6] border-[#FFE48A]' : 'bg-white font-black'}`}>
                      <span className="text-[9px] sm:text-xs uppercase text-gray-400 font-bold mb-2">{item.id} {item.n}</span>
                      <span className="font-mono text-2xl sm:text-4xl text-gray-800 font-black">{item.v}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="text-center py-10 opacity-40 font-black"><p className="text-[12px] font-bold tracking-widest">[mata設計.版權所有]</p></div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen font-sans flex flex-col font-black overflow-x-hidden bg-[#f0f4f8]" style={{ background: currentTheme.bg }}>
        {shareLink && (
          <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm font-black">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative text-center font-black">
              <button onClick={() => setShareLink(null)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full font-black"><X size={20}/></button>
              <Share2 size={48} className="mx-auto text-emerald-500 mb-4" /><h3 className="text-xl sm:text-2xl mb-4 font-black">分享專屬連結</h3><p className="bg-gray-100 p-4 rounded-xl break-all text-xs font-mono mb-8 font-black">{shareLink}</p>
              <button onClick={() => { navigator.clipboard.writeText(shareLink); setShareLink(null); }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl shadow-lg font-black font-black">複製並關閉</button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full p-4 sm:p-10 space-y-8 font-black">
          <div className="bg-white/90 backdrop-blur-md rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-10 shadow-xl border-2 font-black">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pb-6 border-b font-black">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#374151]">MATA五行知命系統</h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">V3.7</span>
                  <div className="bg-[#fff1f1] px-4 py-1.5 rounded-full border border-[#ffe4e4] flex items-center gap-1.5 font-black">
                    <User size={12} className="text-rose-500" /><span className="text-[11px] font-black text-rose-600">專業顧問：{consultant}</span>
                  </div>
                  <div className="bg-white px-3 py-1 rounded-full border flex items-center gap-1.5 font-black shadow-sm" style={{ borderColor: currentTheme.primary }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentTheme.primary }}></div>
                    <span className="text-[10px] font-black" style={{ color: currentTheme.primary }}>補運色：{currentTheme.label}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-6 lg:mt-0 font-black">
                {Object.keys(THEME_DEFAULTS).map((m) => {
                   const Icon = THEME_DEFAULTS[m].icon;
                   return (
                    <button key={m} onClick={() => setViewMode(m)} className={`px-5 py-3 sm:px-8 sm:py-3.5 rounded-[1.2rem] sm:rounded-[1.5rem] font-black text-xs sm:text-sm transition-all flex items-center gap-2 ${viewMode === m ? 'bg-[#2563eb] text-white shadow-lg scale-105 font-black' : 'bg-gray-100 text-gray-400'}`}>
                      <Icon size={16} />{THEME_DEFAULTS[m].label}
                    </button>
                   );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8 text-left font-black">
              <div className="space-y-1"><label className="text-[10px] text-gray-400 ml-1">姓名</label><input value={formData.name} readOnly={isLocked} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border-2 rounded-[1rem] sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 font-bold bg-white focus:border-blue-200 outline-none" /></div>
              <div className="space-y-1"><label className="text-[10px] text-gray-400 ml-1">性別</label><select value={formData.gender} disabled={isLocked} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full border-2 rounded-[1rem] sm:rounded-2xl px-3 py-3 sm:px-5 sm:py-4 font-black bg-white outline-none"><option value="女">女</option><option value="男">男</option></select></div>
              <div className="space-y-1 min-w-[140px]"><label className="text-[10px] text-gray-400 ml-1">生日</label><input type="date" value={formData.birthDate} readOnly={isLocked} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} className="w-full border-2 rounded-[1rem] sm:rounded-2xl px-3 py-3 sm:px-4 sm:py-4 text-[13px] font-bold bg-white" /></div>
              <div className="space-y-1"><label className="text-[10px] text-gray-400 ml-1 font-black">生肖</label><input value={formData.zodiac} readOnly={isLocked} onChange={(e) => setFormData({...formData, zodiac: e.target.value})} className="w-full border-2 rounded-[1rem] sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 font-bold text-center bg-gray-50 font-black cursor-default" /></div>
              <div className="flex items-center justify-center pt-5 font-black">
                <label className={`flex items-center gap-2 px-4 py-3 rounded-[1rem] sm:rounded-2xl border-2 cursor-pointer transition-all w-full justify-center ${formData.isLateNight ? 'bg-amber-50 border-amber-300' : 'bg-gray-50'}`}>
                  <input type="checkbox" checked={formData.isLateNight} disabled={isLocked} onChange={(e) => setFormData({...formData, isLateNight: e.target.checked})} className="w-4 h-4 accent-blue-600" />
                  <span className="text-[10px] font-black leading-tight text-gray-600">子時加一日</span>
                </label>
              </div>
            </div>
            
            <div className="mt-8 bg-[#fafafa] border-2 border-dashed border-gray-200 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 font-black">
              <h4 className="text-[10px] sm:text-[11px] uppercase text-gray-400 mb-5 tracking-widest px-2 font-black">雙胞胎進階設定</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-end font-black">
                <select value={formData.twinType} disabled={isLocked} onChange={(e) => setFormData({...formData, twinType: e.target.value})} className="w-full border-2 rounded-[1rem] sm:rounded-[1.5rem] px-4 py-3 sm:px-6 sm:py-4 font-black text-sm bg-white focus:border-blue-300 outline-none"><option value="none">無雙胞胎</option><option value="oldest">老大 (需父生日)</option><option value="second">老二 (需母生日)</option></select>
                {formData.twinType !== 'none' && (
                  <div className="space-y-1 animate-in slide-in-from-left font-black"><label className="text-[10px] font-black text-rose-400 ml-1">{formData.twinType === 'oldest' ? '輸入父親生日' : '輸入母親生日'}</label><input type="date" value={formData.parentBirthDate} disabled={isLocked} onChange={(e) => setFormData({...formData, parentBirthDate: e.target.value})} className="w-full border-2 border-rose-100 rounded-[1rem] sm:rounded-[1.5rem] px-4 py-3 sm:px-6 sm:py-4 text-sm font-bold bg-white" /></div>
                )}
              </div>
            </div>
          </div>

          {active && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 pb-10 font-black">
              <div className="lg:col-span-8 space-y-8 sm:space-y-10 font-black">
                <div className="bg-white/90 rounded-[2rem] sm:rounded-[4rem] p-6 sm:p-12 shadow-2xl border-2 flex flex-col items-center">
                  <div className="w-full flex flex-col sm:flex-row justify-between mb-10 sm:mb-16 gap-6 relative z-10">
                    <div className="flex items-center gap-4 sm:gap-6 justify-center sm:justify-start">
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-[1.8rem] sm:rounded-[2.5rem] text-white flex flex-col items-center justify-center relative border-4 shadow-xl font-black" style={{ backgroundColor: ELEMENT_THEMES[active.elements.mainEl].primary }}><Star className="absolute -top-2 -right-2 text-yellow-300 fill-current animate-pulse" size={20} /><span className="text-[7px] sm:text-[8px] uppercase font-black opacity-80 leading-tight">渴望</span><span className="text-3xl sm:text-5xl font-black">{active.sourceDream}</span></div>
                      <h2 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase text-gray-800">{active.modeLabel}命盤</h2>
                    </div>
                    <div className="flex gap-3 justify-center sm:justify-end">
                      <button onClick={handleShare} disabled={isSharing} className={`bg-emerald-600 text-white px-6 py-3 sm:px-10 sm:py-4 rounded-[1.2rem] sm:rounded-[1.5rem] shadow-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all hover:bg-emerald-700 ${isSharing ? 'opacity-50' : ''}`}><Share2 size={16} /> 分享</button>
                      <button onClick={handleDeepReportClick} className="text-white px-8 py-3 sm:px-12 sm:py-4 rounded-[1.2rem] sm:rounded-[1.5rem] shadow-xl font-black text-xs sm:text-sm transition-all hover:opacity-90" style={{ backgroundColor: currentTheme.primary }}>深度報告</button>
                    </div>
                  </div>
                  <div className="relative mb-12 flex flex-col items-center w-full">
                    <div className="w-full max-w-[420px]">
                      <svg viewBox="0 0 400 450" className="w-full h-auto drop-shadow-2xl overflow-visible">
                        <path d="M50 80 L200 240 L350 80 Z" fill="none" stroke={currentTheme.primary} strokeWidth="1" strokeOpacity="0.2" />
                        <SvgNumNode x={50} y={80} value={active.nums.A} label="A" elementColor="#EF4444" starPos="left-top" />
                        <SvgNumNode x={120} y={80} value={active.nums.B} label="B" elementColor="#EF4444" />
                        <SvgNumNode x={280} y={80} value={active.nums.D} label="D" elementColor="#EF4444" />
                        <SvgNumNode x={350} y={80} value={active.nums.E} label="E" elementColor="#EF4444" starPos="right-top" />
                        <SvgNumNode x={85} y={160} value={active.nums.C} label="C" elementColor="#8B5CF6" />
                        <SvgNumNode x={315} y={160} value={active.nums.F} label="F" elementColor="#8B5CF6" />
                        <SvgNumNode x={200} y={240} value={active.nums.G} label="核心" elementColor={ELEMENT_THEMES[active.elements.mainEl].primary} isCore starPos="top" />
                        <SvgNumNode x={125} y={320} value={active.nums.I} label="I" elementColor="#10B981" />
                        <SvgNumNode x={275} y={320} value={active.nums.H} label="H" elementColor="#10B981" />
                        <SvgNumNode x={200} y={400} value={active.nums.J} label="J" elementColor="#374151" />
                      </svg>
                    </div>
                    <div className="mt-10 bg-gray-100/70 px-6 sm:px-12 py-4 rounded-full flex gap-6 sm:gap-12 border border-white shadow-inner font-black">
                      <div className="flex items-center gap-2 sm:gap-3 font-black"><span className="text-[9px] text-gray-400 font-black -rotate-90">KLM</span><div className="flex gap-1.5 sm:gap-2">{[active.nums.M, active.nums.L, active.nums.K].map((n, i) => (<span key={i} className="bg-white px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm text-lg sm:text-2xl text-blue-600 font-mono font-black font-black">{n}</span>))}</div></div>
                      <div className="w-px bg-gray-300 h-6 sm:h-8 self-center"></div>
                      <div className="flex items-center gap-2 sm:gap-3 font-black"><div className="flex gap-1.5 sm:gap-2">{[active.nums.n, active.nums.O, active.nums.P].map((n, i) => (<span key={i} className="bg-white px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm text-lg sm:text-2xl text-orange-600 font-mono font-black font-black">{n}</span>))}</div><span className="text-[9px] text-gray-400 rotate-90 font-black">NOP</span></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/95 rounded-[2rem] sm:rounded-[4rem] p-6 sm:p-12 shadow-2xl border-2 overflow-hidden font-black">
                  <h3 className="mb-8 text-xl sm:text-2xl font-black text-gray-800 tracking-tight">自身五行排列-留意金的位置</h3>
                  <div className="overflow-x-auto rounded-[1.5rem] border shadow-inner">
                    <table className="w-full text-center border-collapse min-w-[600px] font-black">
                      <thead className="bg-[#f9fafb] text-[11px] sm:text-[13px] text-gray-400 font-black">
                        <tr className="font-normal font-black"><th>日</th><th>當下財富</th><th>事業</th><th>官鬼</th><th>未來財富</th></tr>
                        <tr className="border-t border-gray-100 font-normal font-black"><th>己</th><th>子女錢財</th><th>伴侶</th><th>疾病</th><th>父母貴人</th></tr>
                        <tr className="border-t border-gray-100 bg-white font-black font-black"><th>我</th><th className="text-[#10b981] py-3 text-lg sm:text-xl font-black">生</th><th className="text-[#ef4444] py-3 text-lg sm:text-xl font-black">克</th><th className="text-[#ef4444] py-3 text-lg sm:text-xl font-black">克</th><th className="text-[#10b981] py-3 text-lg sm:text-xl font-black">生</th></tr>
                      </thead>
                      <tbody className="bg-white border-t-4 border-gray-50">
                        <tr className="text-xl font-black">
                          {active.elements.elOrder.map((el, i) => (<td key={i} className="py-8 sm:py-12" style={{ color: ELEMENT_THEMES[el]?.primary }}>{el}</td>))}
                        </tr>
                        <tr className="bg-gray-50/50 text-xl text-gray-700 font-black font-mono">
                          {active.elements.counts.map((c, i) => (<td key={i} className="py-8 sm:py-12 font-black">{c}</td>))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8 sm:space-y-10 text-center font-black">
                <div className="rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-12 bg-rose-600 text-white shadow-xl flex flex-col items-center border-4 border-white/20 font-black">
                  <h3 className="text-xl sm:text-2xl mb-8 font-black flex items-center gap-3 uppercase font-black font-black font-black"><Search size={24}/> 缺失能量</h3>
                  <div className="flex flex-wrap gap-4 sm:gap-5 justify-center font-black font-black">
                    {active.missing.length > 0 ? active.missing.map(n => (<div key={n} className="w-16 h-16 sm:w-20 sm:h-20 bg-white text-rose-900 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-3xl sm:text-5xl font-black shadow-xl font-black">{n}</div>)) : <div className="text-lg italic font-black uppercase tracking-widest">能量圓滿</div>}
                  </div>
                </div>
                <div className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 shadow-xl border-2 font-black">
                  <h3 className="text-lg sm:text-2xl mb-8 text-gray-800 tracking-tighter font-black font-black font-black">隱藏碼-3萬倍力量！<br/><span className="text-sm font-bold text-gray-400">快去深度報告看內容</span></h3>
                  <div className="bg-[#fcfcfc] p-10 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border-2 flex justify-center gap-6 sm:gap-8 text-4xl sm:text-6xl font-black shadow-inner font-black" style={{ color: currentTheme.primary }}>
                    <span>{active.hidden.H1}</span><span>{active.hidden.H2}</span><span>{active.hidden.H3}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="text-center py-10 opacity-40 font-black"><p className="text-[12px] font-bold tracking-widest">[mata設計.版權所有]</p></div>
        </div>
      </div>
    </ErrorBoundary>
  );
}