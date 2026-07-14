"use client";

import { useMemo, useState } from "react";
import { dimensions, primaryCandidates, relativeIndices, scoreAnswers, type Dimension } from "./scoring";

const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

type Stage = "home" | "intro" | "quiz" | "tie" | "loading" | "result";

const profiles: Record<Dimension, {
  title: string; english: string; totem: string; mark: string; invocation: string; plain: string;
  alive: string; attract: string; life: string; reframe: string;
  nourish: string; now: string; actions: [string, string, string]; experiences: string[];
  book: string; film: string; echo: string;
}> = {
  探索: { title: "采撷山海", english: "Gather the Horizons", totem: "迁徙山眼", mark: "⌁", invocation: "去往地图尚未替你命名的地方，让陌生的风景唤醒一个仍在生长的自己。", plain: "你常在未知、变化与新的经验里，确认生命仍有可能。", alive: "你常常在世界尚未被说尽的地方感到自己正在活着。陌生街道、新知识和一次偶然改变的计划，都会让好奇重新打开。", attract: "你容易被有自己世界、愿意分享新视角的人吸引，也会留意地图、地方故事和带着时间痕迹的物件。", life: "你需要持续与“还不知道”相遇。工作与兴趣中，适度的研究、试验和跨领域输入会让你保持流动。", reframe: "探索不等于善变。你的持续性，也许不在多年只做同一件事，而在长期追随同一个更深的问题。", nourish: "最近，一点陌生感正在托住你。那些新出现的入口，让熟悉生活没有完全合拢。", now: "它邀请你主动为生活增加一点陌生感，而不是等待新鲜事偶然发生。", actions: ["查一条从未走过的附近路线。", "独自漫游一个陌生街区两小时。", "完成十二次城市或自然采集。"], experiences: ["城市漫游", "随机路线骑行", "地方文化走访"], book: "《迷失指南》· Rebecca Solnit", film: "《拾穗者与我》· Agnès Varda", echo: "未知不是路线的失败，也可能是重新发现自己与世界关系的入口。" },
  创造: { title: "万物塑形", english: "Shape the Unseen", totem: "掌心器皿", mark: "◡", invocation: "让无形的感受穿过双手，在纸、泥、木、光与语言里，长出一个可被触碰的新境。", plain: "你通过制作、表达与建构，让内在经验在世界上获得形状。", alive: "你需要让尚未成形的感受穿过双手、语言或材料，在世界上获得一个位置。创造是你确认自己认真生活过的方式。", attract: "你容易被拥有个人表达、敢于建立自己语言的人吸引，也会对工坊、器物、影像和未完成的材料感到亲近。", life: "只有输入而没有输出时，你可能完成很多工作，却觉得生活没有留下自己的痕迹。", reframe: "创造不等于必须成为艺术家。做饭、整理空间或写一封信，同样是为经验赋形。", nourish: "最近，一次表达或制作正在托住你。你留下的不只是作品，也是生活经过你的证据。", now: "它邀请你暂时离开只负责完成任务的状态，亲手做一点真正属于自己的表达。", actions: ["用手边材料完成一个微小造物。", "参加一次材料或手工体验。", "建立持续四周的个人作品计划。"], experiences: ["陶艺", "拼贴", "独立出版"], book: "《一间自己的房间》· Virginia Woolf", film: "《燃烧女子的肖像》· Céline Sciamma", echo: "诗不是奢侈品。感受拥有形状，才可能成为新的思想与行动。" },
  共鸣: { title: "聆听回声", english: "Listen for the Echo", totem: "双水回环", mark: "◎", invocation: "让两段不同的生命，在深处相遇而不彼此淹没。", plain: "你在真诚的互相看见中确认自己，也通过他人的故事扩展生命。", alive: "比起热闹，你更在意关系是否有回应：一句话有没有被真正听见，一段沉默能否被共同承接。", attract: "你容易被诚实、有内在层次、愿意倾听也愿意袒露的人吸引。你需要的是差异可以安全地被说出。", life: "关系并非生活的附属，而是你认识世界的重要路径。深谈、书信、电影人物与共同创作都可能点亮你。", reframe: "共鸣不是讨好。真正的回环是双方都能进入，也都能离开；你同样值得被认真回应。", nourish: "最近，一段真实回应正在托住你。有人听见了你，而你也短暂进入了另一段生命。", now: "它邀请你减少礼貌却空泛的联系，和一个值得信任的人交换真正的近况。", actions: ["发出一句不止于近况的问候。", "进行一次不被手机打断的长谈。", "发起双人书信或共同记录。"], experiences: ["深度访谈", "双人散步", "小型读书会"], book: "《爱的艺术》· bell hooks", film: "《二十世纪女人》· Mike Mills", echo: "爱不只是一种感觉，也是一种关怀、责任与共同实践。" },
  理解: { title: "寻迹问源", english: "Trace the Origins", totem: "地层星图", mark: "⋰", invocation: "从具体痕迹出发，沿时间与因果向上追问，直到零散经验显露它的星图。", plain: "你通过辨认规律、组织经验和追问，让复杂世界重新产生脉络。", alive: "你习惯沿着细小痕迹继续追问：一件事为何发生，一个人如何成为今天的样子。理解让生活重新显露脉络。", attract: "你容易被思想有纵深、能够提出好问题的人吸引，也对历史、心理、文化和事物的来处保持兴趣。", life: "阅读、研究、记录、电影与深谈都会成为线索。问题真正吸引你时，你可以长时间保持注意力。", reframe: "理解不等于站在生命之外分析一切。完整的理解，也允许身体和情绪提供尚未被命名的信息。", nourish: "最近，一条线索正在托住你。某些零散经验重新彼此靠近，让生活恢复了可理解的形状。", now: "它邀请你从不断接收信息，转向认真弄明白一个真正吸引你的问题。", actions: ["写下一个反复出现的问题。", "查阅三份可靠资料并做笔记。", "完成一次主题阅读与个人研究。"], experiences: ["地方史走访", "主题阅读", "纪录片讨论"], book: "《小说的提袋理论》· Ursula K. Le Guin", film: "《拾穗者与我》· Agnès Varda", echo: "故事不必只围绕英雄与征服；采集、承载与照料也能组织经验。" },
  感知: { title: "感知微光", english: "Sense the Glimmer", totem: "露水叶瞳", mark: "◉", invocation: "把身体重新交给风、雨、气味与四季，让尚未被语言惊动的生命进入怀中。", plain: "身体、自然与审美细节，是你直接接收世界的入口。", alive: "世界常从细微处进入你：叶面的水光、雨后的气味、布料的质地和一句话里几乎听不见的停顿。", attract: "你容易被自然、光影、植物、声音、食物和细致空间吸引，也会靠近尊重身体感受的人。", life: "当感官被温柔安放，生命会重新具体；当噪声与任务长期占据注意力，你也更容易过载。", reframe: "敏感不是软弱。高分辨率的感知需要边界、休息和选择权。", nourish: "最近，一些细微感受正在托住你。光、气味、声音或身体，让日子不只剩下任务。", now: "它邀请你暂时离开持续思考和看屏幕的状态，重新用身体感受周围。", actions: ["闭眼辨认三种声音与触感。", "去水边或市场慢走半天。", "建立四周季节感官档案。"], experiences: ["植物观察", "声音采集", "季节料理"], book: "《Devotions》· Mary Oliver", film: "《燃烧女子的肖像》· Céline Sciamma", echo: "世界把自己交给你的想象，也一遍遍召唤你在万物中的位置。" },
  扎根: { title: "耕耘守护", english: "Root into Care", totem: "年轮根庭", mark: "⌾", invocation: "让重复、照料与耐心沉入根系；漫长时光会在看不见的地方，为生命积蓄重量。", plain: "重复、照料与长期关系，为你建立可以依靠的生命节律。", alive: "熟悉的饭菜、固定散步、缓慢熟练的手艺和经得起年月的关系，会让生活从应付变成可以居住的地方。", attract: "你容易被可靠、耐心、有生活感的人吸引，也喜欢旧物、植物、家常仪式与带有使用痕迹的器物。", life: "你擅长维系、整理、保存和承托。真正重要的事，常在时间中逐渐长出重量。", reframe: "扎根不是保守，更不是必须替所有人维持生活。稳定也应承托你的生长。", nourish: "最近，一段稳定节律正在托住你。那些看似普通的重复，正在替生活保存重量。", now: "它邀请你减少一点临时应付，重新建立一件可以重复、可以依靠的小事。", actions: ["整理并照料一个日常角落。", "认真做一顿需要耐心的饭。", "恢复一项每周固定的小仪式。"], experiences: ["园艺", "旧物修补", "传统手艺"], book: "《编织甜草》· Robin Wall Kimmerer", film: "《伯德小姐》· Greta Gerwig", echo: "根系不是为了把你困住，而是让你有力量经历季节、伸向更远处。" },
  点燃: { title: "踏火破界", english: "Ignite the Threshold", totem: "裂石火种", mark: "◇", invocation: "让火种沿裂隙生长，为停滞之处打开新的生命通道。", plain: "行动、挑战与越过困难，让你的意志和身体重新汇合。", alive: "一个决定落地、身体越过原先的极限、长期停滞的事情终于被推动，会让你确认自己能够对现实产生作用。", attract: "你容易被勇敢、直接、有行动力和坚定边界的人吸引，也会欣赏不等待完美条件的人。", life: "你需要现场感与真正发生的动作。工作中，一定的决策空间和可见结果会让你更有生命力。", reframe: "点燃不等于永远强大或竞争。停止、拒绝和离开，也可能是最诚实的行动。", nourish: "最近，一次真实行动正在托住你。事情开始发生，你也重新感到自己可以影响现实。", now: "它邀请你停止等待完全准备好，先完成第一个可以验证的动作。", actions: ["完成拖延事项的第一个十五分钟。", "尝试一次让身体发热的新活动。", "为一个真实目标建立四周挑战。"], experiences: ["攀岩", "即兴戏剧", "力量训练"], book: "《局外人姐妹》· Audre Lorde", film: "《燃烧女子的肖像》· Céline Sciamma", echo: "沉默不会保护你。心仍在发抖时，也可以让脚诚实地向前。" },
  超越: { title: "凝望无垠", english: "Gaze into the Vast", totem: "星环天门", mark: "◌", invocation: "在星河、古老时间与万物秩序前放下答案，让有限的自我被更辽阔的存在环抱。", plain: "你需要让生命不只停留在眼前的效率与得失。", alive: "星空、古老建筑、历史、神话、自然整体和仪式，会让有限的自我重新找到位置，恢复生活的纵深。", attract: "你容易被有精神纵深、敬畏感和历史意识的人吸引，也会留意古老符号、宇宙与自然奇观。", life: "你需要感到正在回应比短期回报更大的价值；不可穷尽之物不一定给你答案，却会重新排列焦虑。", reframe: "超越不是逃避现实。真正的无垠并不取消有限，而是让具体生活被更温柔地看见。", nourish: "最近，一种更辽阔的尺度正在托住你。它没有替你回答问题，却让问题不再只有眼前大小。", now: "它邀请你暂时离开效率和结果，接触一件能让自己安静或感到敬畏的事。", actions: ["安静看十分钟天空或水面。", "走进旧建筑或自然深处半天。", "建立四周观星或私人仪式。"], experiences: ["天文观察", "古迹行走", "自然静默"], book: "《编织甜草》· Robin Wall Kimmerer", film: "《瞬息全宇宙》· Daniels", echo: "有些问题不需要被解开。它们存在，是为了让生命知道自己并不孤立。" }
};

const profileEnhancements: Record<Dimension, {
  image: string; connection: string; distinction: string; signals: string[];
}> = {
  探索: {
    image: assetPath("/results/explore.jpg"),
    connection: "你更习惯、也更需要通过接触未知、扩大经验边界，与世界建立连接。新的地点、知识、材料和生活样本会让你的注意力重新苏醒。这里测到的不是你一定擅长旅行或适应变化，而是当生活出现新入口时，你更容易感到自己正在真实地活着。",
    distinction: "高探索首先是一种连接偏好，不是能力证明。你可能很会探索，也可能只是深深需要探索；真正重要的是，你的生命会在世界仍有未知时保持流动。",
    signals: ["日程并不算糟，却越来越提不起兴趣", "反复收藏新的地点或课程，却很少真的出发", "熟悉环境开始让你感到世界正在变窄"]
  },
  创造: {
    image: assetPath("/results/create.jpg"),
    connection: "你更习惯、也更需要通过制作、表达和建构，与世界建立连接。内在感受只有获得文字、影像、器物、料理或空间的形状，才会真正被你消化。这里并不证明你天生更有艺术天赋，而是说明“让事物成形”是你确认自身存在的重要方式。",
    distinction: "高创造不等于必须成为艺术家。它描述的是你需要输出和赋形，而非评判作品是否专业、漂亮或成功。",
    signals: ["完成很多任务，却觉得没有一件真正属于自己", "脑中有许多想法，长期没有落到材料或行动上", "只输入、不输出时，容易感到空洞和堵塞"]
  },
  共鸣: {
    image: assetPath("/results/resonate.jpg"),
    connection: "你更习惯、也更需要通过真实回应和彼此看见，与世界建立连接。理解别人、被别人理解，以及在差异中仍能交换感受，会让生命获得深度。这里不代表你一定更会处理关系，而是关系中的回声对你尤其重要。",
    distinction: "高共鸣不是讨好、牺牲或无限承接。它是一种对互相回应的需要；只有双方都能说出真实，连接才不会变成消耗。",
    signals: ["身边不缺人，却很久没有说出真正想说的话", "总在倾听别人，却很少有人反过来理解你", "联系很多，但关系像停留在水面"]
  },
  理解: {
    image: assetPath("/results/understand.jpg"),
    connection: "你更习惯、也更需要通过弄清脉络、形成解释和追问原因，与世界建立连接。当零散事件被放回时间、因果和结构中，你才更容易安放感受、作出判断。这里不等于你一定比别人更聪明或更擅长分析，而是“理解”本身会为你带来生命感。",
    distinction: "高理解首先是一种认知需要，而非智力结论。它可能帮助你发展洞察力，也可能让你过度分析；完整的理解仍需要让身体和情绪参与。",
    signals: ["接收了大量信息，却觉得彼此毫无关系", "面对重要变化时，因为不知道为什么而持续不安", "不断寻找答案，却没有时间形成自己的解释"]
  },
  感知: {
    image: assetPath("/results/sense.jpg"),
    connection: "你更习惯、也更需要通过身体、自然与审美细节，与世界建立连接。光线、声音、气味、质地和空间氛围并非背景，而是你读取生活的重要信息。这里不证明你一定拥有更敏锐的感官，而是细微体验更容易成为你的生命入口。",
    distinction: "高感知不是脆弱。它意味着你重视直接体验，也提醒你需要主动选择环境、休息和感官边界。",
    signals: ["长时间看屏幕后，头脑很满但身体像消失了", "生活只剩效率，很久没有注意天气和季节", "嘈杂、拥挤或粗糙环境让你持续疲惫"]
  },
  扎根: {
    image: assetPath("/results/root.jpg"),
    connection: "你更习惯、也更需要通过重复、照料和长期积累，与世界建立连接。稳定节律、熟悉空间、持续关系和慢慢长成的手艺，会让生活变得可以居住。这里不证明你更保守或更会坚持，而是时间的沉淀对你格外重要。",
    distinction: "高扎根不是拒绝变化。真正的根系会承托变化，而不是把人固定在原处；照料也不应只由你单方面承担。",
    signals: ["每天都在处理临时事项，生活像一直借住", "重要关系和兴趣被零碎任务反复打断", "缺少任何可以每周重复、让自己安定的小事"]
  },
  点燃: {
    image: assetPath("/results/ignite.jpg"),
    connection: "你更习惯、也更需要通过行动、挑战和越过阻力，与世界建立连接。当决定真正落地、身体开始参与、现实因你而发生一点改变时，你会重新感到有力量。这里不证明你更勇敢或更有执行力，而是“真实发生”比停留在想法中更能点亮你。",
    distinction: "高点燃不等于永远强大、外向或好胜。停止、拒绝、求助和离开，也可能是最重要的破界行动。",
    signals: ["想法反复盘旋，却迟迟没有第一个动作", "生活安全稳定，但像隔着玻璃发生", "身体长期缺少力量、速度或挑战带来的现场感"]
  },
  超越: {
    image: assetPath("/results/transcend.jpg"),
    connection: "你更习惯、也更需要通过历史、自然、星空、仪式或更大的价值尺度，与世界建立连接。当自我被放回漫长时间和生命共同体中，眼前得失会重新排列。这里不证明你更有智慧或精神性，而是辽阔感能帮助你恢复生活的纵深。",
    distinction: "高超越不是逃避现实，也不要求承担宏大使命。真正的无垠最终会把你带回身体、关系和具体日常。",
    signals: ["生活功能正常，却越来越常问一切有什么用", "长期只处理绩效与得失，很少感到敬畏", "渴望安静和纵深，却总被即时信息填满"]
  }
};

type Option = { text: string; dims: Dimension[] };
const questions: { title: string; prompt: string; options: Option[] }[] = [
  { title: "无人催促的一天", prompt: "没有消息、没有安排，也没有谁在等待你的回应。你最愿意把这一天交给——", options: [
    { text: "沿一条从未走过的路线出发，让脚步决定今天。", dims: ["探索", "感知"] }, { text: "把一个模糊许久的念头，慢慢做成看得见的东西。", dims: ["创造", "理解"] }, { text: "与一个重要的人做饭、散步，让谈话延伸到夜里。", dims: ["共鸣", "扎根"] }, { text: "完成一件曾觉得困难，却一直想试试的事。", dims: ["点燃", "超越"] }
  ]},
  { title: "最想收到的礼物", prompt: "如果有人很认真地为你准备一份礼物，你更希望收到——", options: [
    { text: "一张去往陌生地方的车票，以及一句“去看看吧”。", dims: ["探索", "点燃"] }, { text: "一本亲手整理的小册子，写着与你有关的片段。", dims: ["共鸣", "创造"] }, { text: "一件可以使用很多年、会随时间留下痕迹的物品。", dims: ["扎根", "感知"] }, { text: "一本曾深深改变过对方、也可能打开你的书。", dims: ["理解", "超越"] }
  ]},
  { title: "雨夜的去处", prompt: "窗外忽然下起大雨，原来的计划被取消。你更愿意——", options: [
    { text: "关掉大灯，听雨、闻潮湿的空气，让时间慢下来。", dims: ["感知", "超越"] }, { text: "翻出材料或纸笔，做一点不为交付的东西。", dims: ["创造", "扎根"] }, { text: "给想念的人发消息，交换没说出口的心情。", dims: ["共鸣", "理解"] }, { text: "穿上雨衣出门，看看城市在雨里变成什么样子。", dims: ["探索", "点燃"] }
  ]},
  { title: "一间自己的房间", prompt: "如果你拥有一间完全属于自己的房间，最先会为它添上——", options: [
    { text: "能铺开地图、票根与途中采集物的大桌子。", dims: ["探索", "创造"] }, { text: "一扇采光很好的窗，让季节每天进入房间。", dims: ["感知", "扎根"] }, { text: "两把舒服的椅子，留给漫长而诚实的谈话。", dims: ["共鸣", "超越"] }, { text: "一整面写下问题、线索和计划的墙。", dims: ["理解", "点燃"] }
  ]},
  { title: "走进一部电影", prompt: "如果可以短暂走进一部电影，你更想成为——", options: [
    { text: "在陌生土地寻找线索、不断改变路线的人。", dims: ["探索", "理解"] }, { text: "在困局中率先决定、带大家打开出口的人。", dims: ["点燃", "共鸣"] }, { text: "在安静工坊里，让旧物获得第二次生命的人。", dims: ["创造", "感知"] }, { text: "守着一座老屋和记忆，让失散故事仍有归处的人。", dims: ["扎根", "超越"] }
  ]},
  { title: "值得保存的瞬间", prompt: "下面哪一种瞬间，更让你觉得“这一刻值得被保存”？", options: [
    { text: "零散线索突然连成一片，终于弄明白一个问题。", dims: ["理解", "感知"] }, { text: "一群人共同完成一件原本以为做不到的事。", dims: ["点燃", "扎根"] }, { text: "旅途中与陌生人交换故事，短暂进入彼此世界。", dims: ["探索", "共鸣"] }, { text: "作品完成后，表达出了此前说不清的感受。", dims: ["创造", "超越"] }
  ]},
  { title: "八十岁的来信", prompt: "八十岁的你寄来一封短信。哪一句最可能让现在的你鼻尖一酸？", options: [
    { text: "谢谢你一直愿意重新出发，世界因此没有变小。", dims: ["探索", "超越"] }, { text: "谢谢你把许多感受留下来，它们后来照亮过别人。", dims: ["创造", "共鸣"] }, { text: "谢谢你没有轻视普通日子，它们最终长成了生活。", dims: ["扎根", "理解"] }, { text: "谢谢你在害怕时仍然行动，也相信身体的感受。", dims: ["点燃", "感知"] }
  ]},
  { title: "想留给世界的东西", prompt: "如果不考虑名望或回报，你更希望自己最终为世界留下——", options: [
    { text: "一条被真正走通过的路，让后来的人知道边界可以移动。", dims: ["探索", "扎根"] }, { text: "一件诚实的作品，让未被说出的经验获得形状。", dims: ["创造", "点燃"] }, { text: "一些被认真理解和温柔接住的人。", dims: ["共鸣", "感知"] }, { text: "帮助人看见更大世界的思想、记录或精神线索。", dims: ["理解", "超越"] }
  ]}
];

const stateGroups = [
  { label: "生活出现了新的入口：陌生地方、新知识，或一次意外变化。", dims: ["探索"] as Dimension[] },
  { label: "我做成了一件东西，表达了自己，或真正推进了困难的事。", dims: ["创造", "点燃"] as Dimension[] },
  { label: "我与人真诚相处，或在稳定日常里感到被陪伴、被承接。", dims: ["共鸣", "扎根"] as Dimension[] },
  { label: "我停下来思考、感受自然，或触碰到更辽阔的存在。", dims: ["理解", "感知", "超越"] as Dimension[] }
];

const stateSubOptions: Record<number, { text: string; dim: Dimension }[]> = {
  1: [
    { text: "把心里的感受做了出来，它终于有了形状。", dim: "创造" },
    { text: "用材料、文字或影像留下了一件属于自己的东西。", dim: "创造" },
    { text: "跨过阻力真正行动，事情终于开始发生。", dim: "点燃" },
    { text: "身体参与了一次挑战，让我重新感到有力量。", dim: "点燃" }
  ],
  2: [
    { text: "我被认真理解，也真正听见了另一个人。", dim: "共鸣" },
    { text: "一次诚实回应，让关系重新有了深度。", dim: "共鸣" },
    { text: "熟悉的节律、照料和陪伴让我重新安定。", dim: "扎根" },
    { text: "一件被长期坚持的小事，让生活重新可以依靠。", dim: "扎根" }
  ],
  3: [
    { text: "我弄明白了一件事，零散经验重新有了脉络。", dim: "理解" },
    { text: "我重新感受到光、气味、声音、植物或身体。", dim: "感知" },
    { text: "艺术与自然的细节，让我重新回到当下。", dim: "感知" },
    { text: "我在历史、自然或星空面前感到安静与辽阔。", dim: "超越" }
  ]
};

function Totem({ dim, small = false }: { dim: Dimension; small?: boolean }) {
  const p = profiles[dim];
  return <div className={`totem totem-${dimensions.indexOf(dim)} ${small ? "totem-small" : ""}`} aria-label={`${p.totem}图腾`}><span>{p.mark}</span><i/><b/></div>;
}

function Radar({ scores }: { scores: Record<Dimension, number> }) {
  const indices = relativeIndices(scores);
  const normalized = dimensions.map(d => indices[d]);
  const points = normalized.map((v, i) => {
    const angle = -Math.PI / 2 + i * Math.PI / 4, r = 42 * v / 100;
    return `${50 + Math.cos(angle) * r}% ${50 + Math.sin(angle) * r}%`;
  }).join(",");
  return <div className="radar-wrap">
    <div className="radar"><div className="radar-grid grid-1"/><div className="radar-grid grid-2"/><div className="radar-fill" style={{clipPath:`polygon(${points})`}}/>
      {dimensions.map((d, i) => <div key={d} className={`radar-label label-${i}`}><strong>{d}</strong><span>{normalized[i]}</span></div>)}
    </div>
    <div className="score-list">{dimensions.map((d,i)=><div key={d}><span>{d}</span><em>{normalized[i]}</em><i style={{width:`${normalized[i]}%`}}/></div>)}</div>
  </div>;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("home");
  const [q, setQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [stateStep, setStateStep] = useState<"main"|"sub">("main");
  const [stateGroup, setStateGroup] = useState(0);
  const [nourished, setNourished] = useState<Dimension>("探索");
  const [invited, setInvited] = useState<Dimension>("扎根");
  const [selectedPrimary, setSelectedPrimary] = useState<Dimension | null>(null);
  const [saving, setSaving] = useState(false);

  const scores = useMemo(() => {
    return scoreAnswers(answers, questions);
  }, [answers]);
  const tiedPrimary = useMemo(() => primaryCandidates(scores, answers, questions), [scores, answers]);
  const primary = selectedPrimary ?? tiedPrimary[0] ?? "探索";

  function chooseTendency(index:number){
    const next=[...answers]; next[q]=index; setAnswers(next);
    window.setTimeout(()=>setQ(q+1),280);
  }
  function chooseStateGroup(index:number){
    setStateGroup(index); const dims=stateGroups[index].dims;
    if(dims.length===1){ finishState(dims[0]); } else setStateStep("sub");
  }
  function finishState(dim:Dimension){
    if(q===8){setNourished(dim);setQ(9);setStateStep("main");}
    else {
      setInvited(dim);
      if (tiedPrimary.length > 1) setStage("tie");
      else beginLoading();
    }
  }
  function beginLoading(){setStage("loading");window.setTimeout(()=>setStage("result"),2200);}
  function choosePrimary(dim: Dimension){setSelectedPrimary(dim);beginLoading();}
  function restart(){setStage("intro");setQ(0);setAnswers([]);setStateStep("main");setSelectedPrimary(null);window.scrollTo({top:0,behavior:"smooth"});}
  async function downloadCard(){
    setSaving(true);
    try {
      await document.fonts.ready;
      const canvas=document.createElement("canvas");canvas.width=1080;canvas.height=6800;
      const c=canvas.getContext("2d");if(!c)return;
      const p=profiles[primary], np=profiles[nourished], ip=profiles[invited];
      const enhancement=profileEnhancements[primary], indices=relativeIndices(scores);
      const left=120, width=840;
      const bg=c.createLinearGradient(0,0,0,6800);bg.addColorStop(0,"#102a24");bg.addColorStop(.5,"#0b211d");bg.addColorStop(1,"#071511");c.fillStyle=bg;c.fillRect(0,0,1080,6800);

      const lines=(text:string,max:number)=>{
        const result:string[]=[];let row="";
        for(const ch of text){if(row&&c.measureText(row+ch).width>max){result.push(row);row=ch}else row+=ch}
        if(row)result.push(row);
        if(result.length>1&&result[result.length-1].length===1){const previous=result[result.length-2];result[result.length-1]=previous.slice(-1)+result[result.length-1];result[result.length-2]=previous.slice(0,-1)}
        return result;
      };
      const text=(value:string,x:number,y:number,max:number,lineHeight:number,align:CanvasTextAlign="left")=>{c.textAlign=align;for(const row of lines(value,max)){c.fillText(row,x,y);y+=lineHeight}return y};
      const label=(value:string,y:number)=>{c.fillStyle="#c6a866";c.font='600 24px system-ui, sans-serif';c.letterSpacing="4px";c.textAlign="left";c.fillText(value,left,y);c.letterSpacing="0px";return y+58};
      const heading=(value:string,y:number)=>{c.fillStyle="#f0eee2";c.font='500 48px "Songti SC", serif';return text(value,left,y,width,68)};
      const paragraph=(value:string,y:number,color:"#cdd5ca"|"#9eb2a5"="#cdd5ca")=>{c.fillStyle=color;c.font='30px "Songti SC", serif';return text(value,left,y,width,53)+26};
      const rule=(y:number)=>{c.fillStyle="rgba(198,168,102,.22)";c.fillRect(left,y,width,2);return y+66};
      let y=110;
      c.textAlign="center";c.fillStyle="#c6a866";c.font="600 24px system-ui, sans-serif";c.fillText("生命火花连接 · 你的生命感来源",540,y);y+=92;
      c.fillStyle="#f5f1df";c.font='500 92px "Songti SC", serif';c.fillText(p.title,540,y);y+=56;
      c.fillStyle="#c9b77f";c.font="italic 31px Georgia, serif";c.fillText(p.english,540,y);y+=88;
      c.fillStyle="#e0e3d9";c.font='34px "Songti SC", serif';y=text(p.invocation,540,y,780,58,"center")+30;
      c.fillStyle="#9eb2a5";c.font="27px system-ui, sans-serif";y=text(p.plain,540,y,780,48,"center")+70;

      const artwork=new Image();artwork.src=enhancement.image;await artwork.decode();
      const artHeight=780, scale=Math.max(width/artwork.width,artHeight/artwork.height), w=artwork.width*scale,h=artwork.height*scale;
      c.save();c.beginPath();c.roundRect(left,y,width,artHeight,26);c.clip();c.drawImage(artwork,left+(width-w)/2,y+(artHeight-h)/2,w,h);const shade=c.createLinearGradient(0,y,0,y+artHeight);shade.addColorStop(0,"rgba(5,18,14,.02)");shade.addColorStop(1,"rgba(5,18,14,.32)");c.fillStyle=shade;c.fillRect(left,y,width,artHeight);c.restore();y+=artHeight+90;

      y=label("01  你的八维生命之花",y);y=heading("八条水脉，共同流经你",y)+28;
      c.font="25px system-ui, sans-serif";
      dimensions.forEach((dim,i)=>{const col=i%2,row=Math.floor(i/2),x=left+col*430,yy=y+row*76;c.fillStyle="#d9dfd5";c.textAlign="left";c.fillText(dim,x,yy);c.fillStyle="rgba(255,255,255,.1)";c.fillRect(x+75,yy-16,280,8);c.fillStyle="#c6a866";c.fillRect(x+75,yy-16,280*indices[dim]/100,8);c.textAlign="right";c.fillText(String(indices[dim]),x+400,yy)});y+=350;
      c.fillStyle="#789082";c.font="23px system-ui, sans-serif";y=text("它呈现的是你更常使用哪些方式与世界连接，不代表能力高低。",left,y,width,42)+45;y=rule(y);

      y=label(`02  ${p.title} · 生命连接解读`,y);y=heading("你通常如何与世界连接",y)+18;y=paragraph(enhancement.connection,y);
      c.fillStyle="rgba(57,125,120,.20)";c.fillRect(left,y,width,230);c.fillStyle="#c6a866";c.font="600 24px system-ui, sans-serif";c.textAlign="left";c.fillText("这意味着什么？",left+38,y+52);c.fillStyle="#e2e5db";c.font='28px "Songti SC", serif';text(enhancement.distinction,left+38,y+105,width-76,48);y+=282;
      c.fillStyle="#d9c998";c.font='500 34px "Songti SC", serif';c.fillText("你如何被点亮",left,y);y+=52;y=paragraph(p.alive,y);
      c.fillStyle="#d9c998";c.font='500 34px "Songti SC", serif';c.fillText("什么总会吸引你",left,y);y+=52;y=paragraph(p.attract,y);
      c.fillStyle="#d9c998";c.font='500 34px "Songti SC", serif';c.fillText("它如何进入生活",left,y);y+=52;y=paragraph(p.life,y);
      c.fillStyle="rgba(198,168,102,.10)";c.fillRect(left,y,width,190);c.fillStyle="#c6a866";c.font="600 22px system-ui, sans-serif";c.fillText("请别误解这一部分自己",left+38,y+48);c.fillStyle="#e0e2d8";c.font='28px "Songti SC", serif';text(p.reframe,left+38,y+100,width-76,48);y+=245;y=rule(y);

      y=label("最近，什么正在托住你",y);y=heading(np.title,y)+8;y=paragraph(np.nourish,y);y=rule(y);
      y=label("03  而此刻，生命邀请你",y);y=heading(ip.title,y)+8;y=paragraph(ip.now,y);
      if(primary!==invited)y=paragraph(`你长久依靠「${p.title}」获得生命感，而此刻「${ip.title}」正邀请你补回另一种呼吸。它们并不矛盾。`,y,"#9eb2a5");
      y+=12;c.fillStyle="rgba(198,168,102,.12)";c.fillRect(left,y,width,450);c.fillStyle="#c6a866";c.font="600 24px system-ui, sans-serif";c.fillText("给你的具体建议",left+38,y+56);
      const actionLabels=["现在 · 10 分钟","找一天 · 半天","接下来 · 四周"];
      ip.actions.forEach((action,i)=>{const yy=y+116+i*102;c.fillStyle="#91a89a";c.font="22px system-ui, sans-serif";c.fillText(actionLabels[i],left+38,yy);c.fillStyle="#f0eee4";c.font='28px "Songti SC", serif';text(action,left+245,yy,width-295,45)});y+=520;
      c.fillStyle="#789082";c.font="23px system-ui, sans-serif";c.textAlign="center";c.fillText("生命火花连接 · 愿你继续听见自己的微光",540,y);

      const output=document.createElement("canvas");output.width=1080;output.height=Math.ceil(y+100);const outputContext=output.getContext("2d");if(!outputContext)return;outputContext.drawImage(canvas,0,0);
      const blob=await new Promise<Blob|null>(resolve=>output.toBlob(resolve,"image/png"));if(!blob)return;
      const url=URL.createObjectURL(blob),a=document.createElement("a");a.download=`生命火花连接-${p.title}-完整结果.png`;a.href=url;a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
    } finally { setSaving(false); }
  }

  if(stage==="home") return <main className="full-screen hero"><Forest/><div className="hero-content"><span className="eyebrow">A LIFE CONNECTION JOURNEY</span><h1>生命火花<br/>连接</h1><p>你靠什么，确认自己正在活着？</p><button onClick={()=>setStage("intro")} className="primary-btn">沿着微光进入</button><small>约 3 分钟 · 没有标准答案</small></div><div className="stone"><span>✦</span></div></main>;
  if(stage==="intro") return <main className="full-screen intro"><Forest/><section className="paper"><span className="eyebrow">开始以前</span><h2>这里没有<br/>更好的答案</h2><p>每一道题都像一扇通向不同生活的门。请选择此刻最自然、最接近你的那一扇，而不是你认为更正确、更理想的答案。</p><blockquote>这是一场自我探索体验，不是心理诊断。结果描述的是相对倾向，并不定义你的全部。</blockquote><button onClick={()=>setStage("quiz")} className="primary-btn">开始寻找</button></section></main>;
  if(stage==="quiz") {
    const isState=q>=8; const title=q===8?"近期正在滋养你的连接":"近期正在缺席的连接";
    const prompt=q===8?"回想最近四周，哪一种时刻最常让你重新感觉“我正在生活”？":"仍然回想最近四周，哪一句最像你没有说出口的遗憾？";
    return <main className="quiz-shell"><Forest/><header><span>{String(q+1).padStart(2,"0")} / 10</span><div className="progress"><i style={{width:`${(q+1)*10}%`}}/></div></header><section className="question-card">
      {!isState ? <><span className="eyebrow">{questions[q].title}</span><h2>{questions[q].prompt}</h2><div className="options">{questions[q].options.map((o,i)=><button key={i} onClick={()=>chooseTendency(i)}><em>{String.fromCharCode(65+i)}</em><span>{o.text}</span></button>)}</div></>:
      <><span className="eyebrow">{title}</span><h2>{stateStep==="main"?prompt:q===8?"更接近你的，是哪一种生命感？":"你更想念哪一种状态？"}</h2><div className="options">{stateStep==="main"?stateGroups.map((g,i)=><button key={i} onClick={()=>chooseStateGroup(i)}><em>{String.fromCharCode(65+i)}</em><span>{q===9?g.label.replace("我做成了","我很久没有做成").replace("我与人真诚相处","我很久没有与人真诚相处").replace("我停下来","我很久没有停下来"):g.label}</span></button>):stateSubOptions[stateGroup].map((option,i)=><button key={`${option.dim}-${i}`} onClick={()=>finishState(option.dim)}><em>{String.fromCharCode(65+i)}</em><span>{q===9?option.text.replace("我被认真理解","我很久没有被认真理解").replace("一次诚实回应","我很久没有得到一次诚实回应").replace("熟悉的节律","我很久没有熟悉的节律").replace("一件被长期坚持","我很久没有一件被长期坚持").replace("我弄明白","我很久没有弄明白").replace("我重新感受到","我很久没有感受到").replace("艺术与自然","我很久没有让艺术与自然").replace("我在历史","我很久没有在历史").replace("把心里的感受做了出来","我很久没有把心里的感受做出来").replace("用材料、文字或影像留下了","我很久没有用材料、文字或影像留下").replace("跨过阻力真正行动","我很久没有跨过阻力真正行动").replace("身体参与了一次挑战","我的身体很久没有参与挑战"):option.text}</span></button>)}</div></>}
    </section><button className="back" onClick={()=>{if(stateStep==="sub")setStateStep("main");else if(q>0)setQ(q-1)}}>← 返回上一题</button></main>;
  }
  if(stage==="tie") return <main className="quiz-shell"><Forest/><header><span>最后一瞥</span><div className="progress"><i style={{width:"100%"}}/></div></header><section className="question-card">
    <span className="eyebrow">两股同样清晰的力量</span><h2>如果未来一个月，只能为生活重新打开一扇门，你更愿意先走向哪一种感受？</h2><div className="options">{tiedPrimary.map((dim,i)=><button key={dim} onClick={()=>choosePrimary(dim)}><em>{String.fromCharCode(65+i)}</em><span>{profiles[dim].plain}</span></button>)}</div><p className="note">这次选择只决定展开哪一条解读，不会改变你的八维生命之花。</p>
  </section></main>;
  if(stage==="loading") return <main className="full-screen loading"><Forest/><div className="glyph-ring"><span>✦</span></div><p>水脉正在汇合，岩层正在显露……</p></main>;
  const p=profiles[primary], np=profiles[nourished], ip=profiles[invited], enhancement=profileEnhancements[primary], invitedEnhancement=profileEnhancements[invited];
  return <main className="result"><Forest/><section className="result-intro"><span className="eyebrow">你的生命感来源</span><h1>{p.title}</h1><p className="result-english">{p.english}</p><p className="invocation">{p.invocation}</p><p className="plain">{p.plain}</p><span className="scroll-hint">向下展开你的生命之花 ↓</span></section>
    <figure className="result-art"><img src={enhancement.image} alt={`${p.title}生命感来源插画`}/></figure>
    <section className="result-section flower"><span className="section-no">01</span><p className="eyebrow">你的八维生命之花</p><h2>八条水脉，<br/>共同流经你</h2><Radar scores={scores}/><p className="note">它呈现的是你更常使用哪些方式与世界连接，不代表能力高低。</p></section>
    <section className="result-section reading"><span className="section-no">02</span><p className="eyebrow">{p.title} · 生命连接解读</p><h2>你通常如何<br/>与世界连接</h2><p className="lead-copy">{enhancement.connection}</p><div className="definition"><b>这意味着什么？</b><p>{enhancement.distinction}</p></div><h3>你如何被点亮</h3><p>{p.alive}</p><h3>什么总会吸引你</h3><p>{p.attract}</p><h3>它如何进入生活</h3><p>{p.life}</p><div className="reframe"><span>请别误解这一部分自己</span><p>{p.reframe}</p></div></section>
    <section className="result-section nourished"><Totem dim={nourished} small/><p className="eyebrow">最近，什么正在托住你</p><h2>{np.title}</h2><p>{np.nourish}</p></section>
    <section className="result-section invitation"><span className="section-no">03</span><p className="eyebrow">而此刻，生命邀请你</p><h2>{ip.title}</h2><p className="invitation-copy">{ip.now}</p><div className="signals"><b>它可能正在这样提醒你</b>{invitedEnhancement.signals.slice(0,2).map(signal=><p key={signal}>· {signal}</p>)}</div>{primary!==invited&&<p className="bridge">你长久依靠「{p.title}」获得生命感，而此刻「{ip.title}」正邀请你补回另一种呼吸。它们并不矛盾。</p>}</section>
    <section className="result-section actions"><span className="section-no">04</span><p className="eyebrow">给你的具体建议</p><h2>只选一个入口，也已经足够</h2>{ip.actions.map((a,i)=><article key={a}><span>{["现在 · 10 分钟","找一天 · 半天","接下来 · 四周"][i]}</span><p>{a}</p></article>)}</section>
    <section className="result-section result-actions"><p>保存一份完整结果，或再听一次内心的回答。</p><button className="primary-btn" onClick={downloadCard} disabled={saving}>{saving?"正在生成完整长图…":"保存我的结果插画"}</button><button className="text-btn" onClick={restart}>重新寻找一次</button></section>
  </main>;
}

function Forest(){return <div className="forest" aria-hidden="true"><i className="mist m1"/><i className="mist m2"/><b className="leaf l1"/><b className="leaf l2"/><b className="leaf l3"/><span className="rune r1">⌁</span><span className="rune r2">◌</span><span className="rune r3">⋰</span></div>}
