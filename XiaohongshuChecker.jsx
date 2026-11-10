import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Layers,
  Wand2
} from 'lucide-react';

// --- 8大平台风控词库 ---
export const BANNED_CATEGORIES = {
  站外导流: {
    level: 'high',
    badge: '高危红线',
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    desc: '小红书零容忍红线，极易导致直接限流、笔记仅自己可见甚至账号封禁。',
    words: [
      '微信', '微信号', '加微', '加v', '加V', 'vx', 'VX', '薇信', '威信', '公众号',
      '淘宝', '天猫', '京东', '拼多多', '闲鱼', '外链', '网址', '网盘', '自取链接',
      '私我', '私信我', '私信领', '私聊', '戳我主页领', '关注公众号', '进群', '粉丝群加'
    ]
  },
  极限用语: {
    level: 'high',
    badge: '法律严管',
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    desc: '违反《新广告法》第九条，绝对化夸张用语极易被竞品举报或平台风控拦截。',
    words: [
      '国家级', '世界级', '最高级', '第一', '唯一', '首个', '首选', '顶级',
      '填补国内空白', '独家', '首家', '最新', '最先进', '第一品牌', '金牌',
      '名牌', '全网销量第一', '全球首发', '全国首家', '全网首发', '世界领先',
      '顶级工艺', '王牌', '销量冠军', 'NO1', 'Top1', '极致', '永久',
      '掌门人', '领袖品牌', '独一无二', '绝无仅有', '史无前例', '万能',
      '最高', '最低', '最具', '最便宜', '最大程度', '最新技术', '最先进科学',
      '最佳', '最大', '最好', '最新科学', '最先进加工工艺', '最时尚', '最受欢迎',
      '最先', '绝对值', '绝对', '超赚', '领导品牌', '领先上市', '巨星',
      '著名', '奢侈', '100%', '国际品质', '高档'
    ]
  },
  医疗与功效宣传: {
    level: 'high',
    badge: '越界风险',
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    desc: '非医药健康类消费品宣称医疗、治疗及生理病理改善效果，属高危违规。',
    words: [
      '治疗', '治愈', '消炎', '抗炎', '活血', '解毒', '抗敏', '脱敏',
      '减肥', '清热解毒', '清热祛湿', '除菌', '杀菌', '抗菌', '灭菌',
      '防菌', '消毒', '排毒', '防敏', '柔敏', '舒敏', '缓敏', '褪敏',
      '生肌', '补血', '安神', '养脑', '益气', '通脉', '利尿', '驱寒解毒',
      '调节内分泌', '延缓更年期', '补肾', '生发', '防癌', '抗癌', '祛疤',
      '降血压', '防治高血压', '改善内分泌', '平衡荷尔蒙', '去除体内毒素',
      '除湿', '润燥', '美容治疗', '消除斑点', '无斑', '生黑发', '止脱',
      '生发止脱', '毛发新生', '毛发再生', '酒糟鼻', '伤口愈合', '清除毒素',
      '缓解痉挛', '处方', '药方', '丘疹', '脓疱', '癣', '脚气', '牛皮癣',
      '湿疹', '毛囊炎', '皮肤感染', '念珠菌', '激素', '荷尔蒙', '抗生素',
      '药物', '中草药', '细胞再生', '疤痕', '冻疮', '冻伤'
    ]
  },
  化妆品虚假宣称: {
    level: 'medium',
    badge: '夸大宣传',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    desc: '夸大修饰、暗示瞬间改变生理机能或虚构绝对断语。',
    words: [
      '特效', '高效', '全效', '强效', '速效', '速白', '一洗白',
      '天见效', '周期见效', '超强', '溶脂', '吸脂', '燃烧脂肪',
      '瘦脸', '瘦腿', '延年益寿', '提高记忆力', '化解死细胞',
      '去除皱纹', '平皱', '修复断裂弹性纤维', '永不褪色',
      '破坏黑色素细胞', '阻断黑色素', '丰乳', '丰胸', '预防乳房松弛'
    ]
  },
  权威性背书词: {
    level: 'medium',
    badge: '背书不合规',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    desc: '虚构政府、官方或免检资质背书，涉嫌误导与欺诈。',
    words: [
      '国家领导人推荐', '国家机关推荐', '国家机关专供', '特供',
      '质量免检', '无需国家质量检测', '免抽检', '中国驰名商标', '专供'
    ]
  },
  刺激消费与虚假紧迫: {
    level: 'medium',
    badge: '诱导消费',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    desc: '制造非理性紧迫感，容易降低用户体验并被算法降权。',
    words: [
      '秒杀', '抢爆', '再不抢就没了', '不会再便宜了', '错过就没机会了',
      '万人疯抢', '抢疯了'
    ]
  },
  诱导点击与粗暴互动: {
    level: 'low',
    badge: '影响网感',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    desc: '机械式索要互动或虚假中奖引导，降低内容审美格调。',
    words: [
      '恭喜获奖', '全民免单', '点击有惊喜', '点击获取', '点击试穿',
      '领取奖品', '一键三连', '转发三三子'
    ]
  },
  迷信用语: {
    level: 'low',
    badge: '价值导向',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    desc: '宣扬玄学因果、改命辟邪，偏离理性与真实生活分享导向。',
    words: [
      '带来好运', '增强第六感', '化解小人', '增加事业运', '招财进宝',
      '健康富贵', '提升运气', '有助事业', '护身', '平衡正负能量',
      '消除精神压力', '逢凶化吉', '时来运转', '万事亨通', '旺人', '旺财',
      '助吉避凶', '转富招福'
    ]
  }
};

// --- 知性审美平替词库 ---
export const REPLACEMENT_DICT = {
  '微信': { best: '评论区交流', alts: ['私聊交流', '主页详阅'] },
  '微信号': { best: '联系通道', alts: ['主页通道', '后台留言'] },
  '加微': { best: '评论区聊聊', alts: ['私信我留步', '主页瞧瞧'] },
  '加v': { best: '后台悄悄话', alts: ['评论区蹲守', '主页指引'] },
  '加V': { best: '后台悄悄话', alts: ['评论区留步', '主页专栏'] },
  'vx': { best: '后台留言', alts: ['评论区找我', '主页互动'] },
  'VX': { best: '后台留言', alts: ['评论区互动', '主页链接'] },
  '公众号': { best: '同名文字专栏', alts: ['长文主页', '深度专栏'] },
  '淘宝': { best: '主流电商平台', alts: ['常规购买渠道', '正规官方店铺'] },
  '天猫': { best: '官方旗舰渠道', alts: ['正规平台', '品牌线上店'] },
  '京东': { best: '官方正规商城', alts: ['主流自营平台', '线上正品渠道'] },
  '拼多多': { best: '平价采购平台', alts: ['主流购物软件', '线上选品区'] },
  '外链': { best: '搜索指引', alts: ['路径指引', '主页入口'] },
  '自取链接': { best: '获取方式看评论', alts: ['操作指引见置顶', '步骤详见配图'] },
  '私我': { best: '评论区敲我', alts: ['后台打个招呼', '留个足迹'] },
  '私信我': { best: '评论区打个招呼', alts: ['后台悄悄告诉我', '留言互动'] },
  '私信领': { best: '评论区留言自取', alts: ['置顶笔记自取', '后台留爪'] },
  '进群': { best: '一起交流探讨', alts: ['加入同好讨论', '参与话题互动'] },

  '第一': { best: '口碑名列前茅', alts: ['很多人心头好', '热选榜首'] },
  '唯一': { best: '别具一格', alts: ['极具辨识度', '罕有其匹'] },
  '顶级': { best: '高规格品质', alts: ['匠心打磨', '旗舰质感'] },
  '最高级': { best: '精工细作', alts: ['上乘体验', '严苛打磨'] },
  '国家级': { best: '严苛规范认证', alts: ['高规格标准', '严格质检'] },
  '首个': { best: '开创性尝试', alts: ['率先探索', '新锐呈现'] },
  '首选': { best: '安心之选', alts: ['优选清单必备', '回购清单常客'] },
  '全网销量第一': { best: '连续多月稳居热销榜', alts: ['超十万人默契复购', '口碑实力出圈'] },
  '全球首发': { best: '全新重磅亮相', alts: ['领先一步尝鲜', '年度诚意之作'] },
  '全网首发': { best: '率先开箱测评', alts: ['新鲜一手测评', '抢先体验分享'] },
  '独家': { best: '特色专属', alts: ['原创研制', '私享定制'] },
  '最新': { best: '当季升级款', alts: ['全新升级批次', '近期力作'] },
  '最先进': { best: '前沿工艺加持', alts: ['新一代成熟架构', '突破性技术'] },
  '第一品牌': { best: '行业标杆代表', alts: ['大众信赖之选', '深耕多年的口碑牌'] },
  '销量冠军': { best: '高赞热卖爆款', alts: ['大家都在入的手头爱', '好评榜单常客'] },
  'NO1': { best: '心目中的白月光', alts: ['回购无间断', '稳居榜首'] },
  'Top1': { best: '心水推荐首位', alts: ['力推必入款', '心头好第一位'] },
  '极致': { best: '极为细腻', alts: ['打磨入微', '体贴周到'] },
  '独一无二': { best: '独具匠心', alts: ['与众不同', '自成一派'] },
  '绝无仅有': { best: '难得一见', alts: ['格外难能可贵', '万里挑一'] },
  '史无前例': { best: '突破以往体验', alts: ['诚意拉满', '刷新认知'] },
  '万能': { best: '多面手', alts: ['百搭好用', '从容应对多种场景'] },
  '最好': { best: '心水之选', alts: ['超满意的体验', '极具舒适度'] },
  '最佳': { best: '格外合拍', alts: ['理想状态', '得力助手'] },
  '100%': { best: '近乎全方位', alts: ['实实在在', '纯粹纯正'] },
  '大牌': { best: '知名品牌', alts: ['成熟大厂', '经典名牌'] },
  '正品': { best: '官方链路可溯', alts: ['安心采购渠道', '品质保真'] },
  '超赚': { best: '质价比极高', alts: ['诚意十足', '非常划算'] },

  '治疗': { best: '深层调理', alts: ['帮助改善', '温和舒缓'] },
  '治愈': { best: '抚平躁动', alts: ['带来满满治愈感', '让状态回稳'] },
  '消炎': { best: '舒缓泛红', alts: ['安抚脆弱', '维稳平息'] },
  '抗炎': { best: '多维修护舒缓', alts: ['抑制躁动泛红', '温和维稳'] },
  '抗敏': { best: '呵护娇嫩敏肌', alts: ['安抚易敏状态', '降低外界刺激'] },
  '脱敏': { best: '强韧肌肤屏障', alts: ['告别敏弱脆弱', '构筑安心防护'] },
  '减肥': { best: '体态轻盈管理', alts: ['紧致身体线条', '养成轻盈好状态'] },
  '排毒': { best: '促进身体新陈代谢', alts: ['由内而外净透轻盈', '告别浊重感'] },
  '生发': { best: '丰盈发量发根', alts: ['滋养发丝头皮', '显得颅顶蓬松'] },
  '止脱': { best: '减少脆弱掉发', alts: ['稳固发丝强韧度', '告别换季掉发焦虑'] },
  '祛疤': { best: '淡化岁月印痕', alts: ['抚平肌表痕迹', '恢复匀净平滑'] },
  '消除斑点': { best: '匀净透亮肤色', alts: ['淡化暗沉印痕', '找回光泽通透肌'] },
  '降血压': { best: '助力平稳日常指标', alts: ['呵护心血管舒适', '养成规律健康作息'] },
  '除菌': { best: '洁净卫生', alts: ['远离日常污渍困扰', '保持清爽安心'] },
  '杀菌': { best: '深层洁净抑污', alts: ['告别微生物异味', '洗出清爽洁净感'] },

  '特效': { best: '明显可见的改变', alts: ['多维起效', '高能修护'] },
  '高效': { best: '事半功倍', alts: ['吸收更透彻', '省心省力'] },
  '全效': { best: '多维兼顾', alts: ['全方位照顾', '一步到位解决'] },
  '速效': { best: '快速感受改变', alts: ['即时舒缓', '立竿见影的舒适'] },
  '速白': { best: '一扫熬夜暗黄', alts: ['焕亮通透光泽', '通透自带微光'] },
  '一洗白': { best: '洗后水润透亮', alts: ['带走老旧角质暗沉', '瞬间洗出清爽白净'] },
  '天见效': { best: '打卡见证改变', alts: ['循序渐进改善', '几周下来肉眼可见变化'] },
  '去除皱纹': { best: '抚平干纹细纹', alts: ['充盈岁月痕迹', '重塑饱满弹润'] },
  '平皱': { best: '淡化面部干纹', alts: ['恢复紧致柔润', '饱满平滑'] },
  '溶脂': { best: '紧塑轻盈轮廓', alts: ['收紧松垮多余肉感', '告别泡泡肉'] },
  '瘦脸': { best: '紧致下颌线条', alts: ['告别早晨浮肿', '视觉更显精致利落'] },
  '瘦身': { best: '轻盈体态管理', alts: ['穿衣服更有线条感', '紧致身姿'] },

  '秒杀': { best: '限时心动价', alts: ['抢鲜体验价', '超值惊喜好礼'] },
  '抢爆': { best: '大家都在蹲', alts: ['热度居高不下', '备受热烈追捧'] },
  '再不抢就没了': { best: '库存余量不多', alts: ['数量有限建议早入手', '且看且珍惜的宝藏'] },
  '万人疯抢': { best: '数万人关注讨论', alts: ['被大家问爆的同款', '口碑圈粉无数'] },

  '一键三连': { best: '顺手留个赞藏鼓励', alts: ['如果觉得有用不妨Mark住', '期待在评论区见你'] },
  '点击获取': { best: '按照指引自取', alts: ['方法整理在下文', '手把手带你上手'] }
};

export default function XiaohongshuChecker() {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'rewrite' | 'content'
  const [toastMsg, setToastMsg] = useState(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const analysis = useMemo(() => {
    if (!inputText.trim()) return null;

    const wordsMap = new Map();

    Object.entries(BANNED_CATEGORIES).forEach(([category, info]) => {
      info.words.forEach(word => {
        let startIndex = 0;
        while ((startIndex = inputText.indexOf(word, startIndex)) !== -1) {
          if (!wordsMap.has(word)) {
            wordsMap.set(word, {
              word,
              category,
              level: info.level,
              badge: info.badge,
              color: info.color,
              desc: info.desc,
              count: 1,
              positions: [startIndex]
            });
          } else {
            const item = wordsMap.get(word);
            item.count += 1;
            item.positions.push(startIndex);
          }
          startIndex += word.length;
        }
      });
    });

    const uniqueFound = Array.from(wordsMap.values());

    let deduction = 0;
    uniqueFound.forEach(item => {
      const weight = item.level === 'high' ? 14 : item.level === 'medium' ? 8 : 4;
      deduction += weight * item.count;
    });
    const healthScore = Math.max(0, 100 - deduction);

    let risk = { 
      level: '低风险 · 状态极佳', 
      tag: '低风险',
      color: 'text-emerald-600', 
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      ringColor: '#10b981',
      desc: '文案合规度极高，表达克制，未见明显限流风险。' 
    };

    if (healthScore < 50) {
      risk = { 
        level: '极高风险 · 严禁直发', 
        tag: '极高风险',
        color: 'text-rose-600', 
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        ringColor: '#e11d48',
        desc: '文案触碰站外导流或多项高危红线，极易导致直接限流下架或账号禁言！' 
      };
    } else if (healthScore < 70) {
      risk = { 
        level: '高风险 · 建议重构', 
        tag: '高风险',
        color: 'text-orange-600', 
        badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
        ringColor: '#f97316',
        desc: '包含较多绝对化夸大或越界宣传词，很可能触发平台审核风控。' 
      };
    } else if (healthScore < 90) {
      risk = { 
        level: '中风险 · 建议微调', 
        tag: '中风险',
        color: 'text-amber-600', 
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        ringColor: '#f59e0b',
        desc: '发现部分修饰词存在擦边风险，采纳平替方案后推流更顺畅。' 
      };
    }

    const charCount = inputText.length;
    const lines = inputText.split('\n');
    const paragraphs = lines.filter(p => p.trim().length > 0);
    const hasDenseParagraph = paragraphs.some(p => p.length > 120);
    const tags = (inputText.match(/#[^\s#]+/g) || []);
    const hasInteractiveEnding = /[？?]|你们|觉得|怎么看|吗$|呢$|评论区|聊聊|蹲一个/.test(inputText.slice(-60));

    const contentChecks = [];
    if (charCount < 100) {
      contentChecks.push({ status: 'warn', title: '字数偏少', desc: `当前仅 ${charCount} 字。小红书笔记建议 200~600 字，字数太少容易导致搜索词覆盖不足。` });
    } else if (charCount > 850) {
      contentChecks.push({ status: 'warn', title: '篇幅略长', desc: `当前已达 ${charCount} 字。手机端长文滑动易产生疲劳，建议拆解精简或做成图文合集。` });
    } else {
      contentChecks.push({ status: 'good', title: '黄金字数区间', desc: `当前 ${charCount} 字，处于小红书最利于阅读与完播的 200~600 字黄金区间。` });
    }

    if (hasDenseParagraph) {
      contentChecks.push({ status: 'warn', title: '段落过密（缺乏呼吸感）', desc: '检测到单段字数超过 120 字。手机端阅读容易压抑，建议增加空行或用 Emoji 切分要点。` });
    } else {
      contentChecks.push({ status: 'good', title: '微段落节奏舒适', desc: '换行与段落切分合理，手机端滑屏呼吸感舒适。' });
    }

    if (tags.length === 0) {
      contentChecks.push({ status: 'warn', title: '缺少 #话题 标签', desc: '尚未添加任何话题。小红书算法依赖标签做垂直流量分发，建议添加 3~5 个精准细分标签。' });
    } else if (tags.length > 8) {
      contentChecks.push({ status: 'warn', title: '话题标签堆砌', desc: `已添加 ${tags.length} 个标签。标签过多会被算法判定为堆砌蹭热度，保留 3~5 个即可。` });
    } else {
      contentChecks.push({ status: 'good', title: '标签数量理想', desc: `已包含 ${tags.length} 个垂直话题标签，利于算法精准推流。` });
    }

    if (!hasInteractiveEnding) {
      contentChecks.push({ status: 'info', title: '文末缺少互动钩子', desc: '结尾缺少自然提问或讨论话题。建议在文末补上一句“大家平时喜欢哪种？”等，拉动评论区互动权重。' });
    } else {
      contentChecks.push({ status: 'good', title: '带有互动讨论钩子', desc: '文末保留了自然的交流语态，利于激发读者留言互动。' });
    }

    let rewrittenText = inputText;
    const sortedWords = [...uniqueFound].sort((a, b) => b.word.length - a.word.length);
    const replacementsApplied = [];

    sortedWords.forEach(item => {
      const rep = REPLACEMENT_DICT[item.word];
      const substitute = rep ? rep.best : `【建议优化：${item.word}】`;
      if (rewrittenText.includes(item.word)) {
        rewrittenText = rewrittenText.split(item.word).join(substitute);
        replacementsApplied.push({ original: item.word, replaceWith: substitute });
      }
    });

    return {
      uniqueFound,
      totalIssues: uniqueFound.reduce((acc, cur) => acc + cur.count, 0),
      highRiskCount: uniqueFound.filter(i => i.level === 'high').length,
      healthScore,
      risk,
      charCount,
      tags,
      contentChecks,
      rewrittenText,
      replacementsApplied
    };
  }, [inputText]);

  const handleApplySingleWord = (originalWord, replacementWord) => {
    if (!inputText.includes(originalWord)) return;
    setInputText(inputText.split(originalWord).join(replacementWord));
    triggerToast(`已将 “${originalWord}” 替换为知性平替 “${replacementWord}”`);
  };

  const handleApplyAllRewrites = () => {
    if (!analysis?.rewrittenText) return;
    setInputText(analysis.rewrittenText);
    triggerToast('✨ 已将全篇合规平替应用至编辑工坊！');
  };

  const handleCopyText = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      triggerToast(`📋 ${label} 已复制到剪贴板！`);
    });
  };

  const renderHighlightedText = () => {
    if (!analysis || analysis.uniqueFound.length === 0) {
      return <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">{inputText}</div>;
    }

    const matches = [];
    analysis.uniqueFound.forEach(({ word, level, category, badge }) => {
      let idx = 0;
      while ((idx = inputText.indexOf(word, idx)) !== -1) {
        matches.push({ start: idx, end: idx + word.length, word, level, category, badge });
        idx += word.length;
      }
    });

    matches.sort((a, b) => a.start - b.start);
    const nonOverlapping = [];
    matches.forEach(m => {
      if (!nonOverlapping.some(o => (m.start >= o.start && m.start < o.end) || (m.end > o.start && m.end <= o.end))) {
        nonOverlapping.push(m);
      }
    });

    const nodes = [];
    let lastPos = 0;
    nonOverlapping.forEach(m => {
      if (m.start > lastPos) {
        nodes.push(<span key={`txt-${lastPos}`}>{inputText.slice(lastPos, m.start)}</span>);
      }
      const isHigh = m.level === 'high';
      const markClass = isHigh
        ? 'bg-rose-100 text-rose-700 border-b-2 border-rose-500 font-medium'
        : 'bg-amber-100 text-amber-800 border-b-2 border-amber-500 font-medium';

      nodes.push(
        <mark
          key={`mark-${m.start}`}
          className={`${markClass} px-1.5 py-0.5 mx-0.5 rounded cursor-pointer`}
          title={`【${m.category}】${m.badge}，点击平替`}
          onClick={() => {
            const rep = REPLACEMENT_DICT[m.word];
            if (rep) handleApplySingleWord(m.word, rep.best);
          }}
        >
          {m.word}
        </mark>
      );
      lastPos = m.end;
    });

    if (lastPos < inputText.length) {
      nodes.push(<span key={`txt-${lastPos}`}>{inputText.slice(lastPos)}</span>);
    }

    return <div className="whitespace-pre-wrap leading-relaxed text-slate-800 text-sm md:text-base">{nodes}</div>;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {toastMsg && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            {toastMsg}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-xs font-semibold mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          WenSenLab_ · 小红书创作者生产力工场
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          小红书违禁词排雷与文案优化工坊
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-500 max-w-xl mx-auto">
          8大平台风控词库智能扫描 · 4A级知性审美平替改写 · 爆款排版与生态体检
        </p>
      </div>

      {/* 输入编辑区 */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-slate-100 p-6 mb-8">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="在此粘贴你的小红书标题与正文文案，智能引擎将实时检测违禁词、生成审美平替与排版建议..."
          className="w-full h-48 p-4 rounded-2xl bg-white border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none text-slate-800 text-sm md:text-base leading-relaxed resize-none transition"
        />
        <div className="flex justify-between items-center mt-3 text-xs text-slate-400">
          <span>{inputText.length} 字</span>
          {inputText && (
            <button
              onClick={() => setInputText('')}
              className="text-slate-400 hover:text-rose-600 transition"
            >
              清空内容
            </button>
          )}
        </div>
      </div>

      {/* 结果工作区 */}
      {analysis && (
        <div className="space-y-6">
          {/* 综合看板 */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 pr-4">
              <div className="text-center flex-shrink-0">
                <span className={`text-3xl font-black ${analysis.risk.color}`}>
                  {analysis.healthScore}
                </span>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">健康分</span>
              </div>
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${analysis.risk.badgeBg}`}>
                  {analysis.risk.tag}
                </span>
                <p className="text-xs text-slate-500 mt-1">{analysis.risk.desc}</p>
              </div>
            </div>

            <div className="md:col-span-5 grid grid-cols-3 gap-2 text-center md:border-r border-slate-100 md:pr-4">
              <div className="p-2.5 rounded-xl bg-slate-50">
                <span className="text-[11px] text-slate-400 block">敏感词</span>
                <span className="text-base font-bold text-rose-600">{analysis.totalIssues} 处</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50">
                <span className="text-[11px] text-slate-400 block">高危红线</span>
                <span className="text-base font-bold text-rose-700">{analysis.highRiskCount} 类</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50">
                <span className="text-[11px] text-slate-400 block">总字数</span>
                <span className="text-base font-bold text-slate-700">{analysis.charCount} 字</span>
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col gap-2">
              {analysis.totalIssues > 0 ? (
                <button
                  onClick={handleApplyAllRewrites}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <Wand2 size={14} /> 一键应用合规平替
                </button>
              ) : (
                <div className="text-center text-xs text-emerald-700 bg-emerald-50 py-2.5 px-3 rounded-xl border border-emerald-200">
                  ✨ 文案无敏感词，状态安全！
                </div>
              )}
              <button
                onClick={() => setActiveTab('rewrite')}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition"
              >
                <Sparkles size={13} className="text-rose-500" /> 查看全篇合规推荐稿
              </button>
            </div>
          </div>

          {/* 选项卡控制器（三栏） */}
          <div className="p-1 bg-slate-200/60 rounded-2xl flex items-center gap-1 text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 py-2.5 rounded-xl transition ${activeTab === 'audit' ? 'bg-white text-rose-600 shadow-sm' : ''}`}
            >
              违禁词排雷 ({analysis.uniqueFound.length})
            </button>
            <button
              onClick={() => setActiveTab('rewrite')}
              className={`flex-1 py-2.5 rounded-xl transition ${activeTab === 'rewrite' ? 'bg-white text-rose-600 shadow-sm' : ''}`}
            >
              合规推荐定稿
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-2.5 rounded-xl transition ${activeTab === 'content' ? 'bg-white text-rose-600 shadow-sm' : ''}`}
            >
              爆款排版体检
            </button>
          </div>

          {/* TAB 1 */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm text-slate-800">原文敏感词高亮标注</h3>
                  <span className="text-xs text-slate-400">点击高亮词直接替换</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 font-sans text-sm leading-relaxed">
                  {renderHighlightedText()}
                </div>
              </div>

              {analysis.uniqueFound.length > 0 && (
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
                  <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">
                    手术刀式审美平替建议矩阵
                  </h3>
                  {analysis.uniqueFound.map((item, idx) => {
                    const rep = REPLACEMENT_DICT[item.word];
                    return (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 mr-2">
                            {item.word}
                          </span>
                          <span className="text-slate-500 mr-1">【{item.category}】</span>
                          <span className="text-[10px] text-slate-400">{item.desc}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {rep ? (
                            <>
                              <button
                                onClick={() => handleApplySingleWord(item.word, rep.best)}
                                className="px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 transition"
                              >
                                {rep.best} (首选)
                              </button>
                              {rep.alts?.map((alt, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleApplySingleWord(item.word, alt)}
                                  className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
                                >
                                  {alt}
                                </button>
                              ))}
                            </>
                          ) : (
                            <span className="text-slate-400 italic">建议删除或用客观事实替代</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2 */}
          {activeTab === 'rewrite' && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">全篇合规推荐定稿</h3>
                  <p className="text-xs text-slate-400">已将所有敏感词替换为高质感知性平替词</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleApplyAllRewrites}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 transition"
                  >
                    覆写输入框
                  </button>
                  <button
                    onClick={() => handleCopyText(analysis.rewrittenText, '合规定稿')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Copy size={13} /> 一键复制
                  </button>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 text-sm leading-relaxed whitespace-pre-wrap text-slate-800">
                {analysis.rewrittenText}
              </div>
              {analysis.replacementsApplied.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 block mb-2">替换对照：</span>
                  <div className="flex flex-wrap gap-2">
                    {analysis.replacementsApplied.map((rep, idx) => (
                      <span key={idx} className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-700 flex items-center gap-1">
                        <span className="line-through text-rose-500">{rep.original}</span>
                        <ArrowRight size={10} className="text-slate-400" />
                        <span className="text-emerald-700 font-semibold">{rep.replaceWith}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 排版体检 */}
          {activeTab === 'content' && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-800">小红书移动端排版与生态体检</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {analysis.contentChecks.map((check, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border ${
                      check.status === 'good'
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50/60 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="font-bold mb-1">{check.title}</div>
                    <div className="opacity-80 leading-relaxed">{check.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 底部署名 */}
      <div className="text-center mt-12 text-xs text-slate-400">
        WenSenLab_ ©文森策
      </div>
    </div>
  );
}
