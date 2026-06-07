export type StoryItemId =
  | 'musicBox'
  | 'bookshelf'
  | 'runningShoes'
  | 'goggles'
  | 'computer'
  | 'photoWall'
  | 'giftBox'

export type AnimationType =
  | 'spin'
  | 'bookDrop'
  | 'route'
  | 'ripple'
  | 'boot'
  | 'photos'
  | 'gift'

export type SoundKey = 'musicBox' | 'musicBoxUnlock' | 'softClick' | 'none'

export type StoryItem = {
  id: StoryItemId
  label: string
  title: string
  body: string[]
  image?: {
    src: string
    alt: string
    layout?: 'wide' | 'square' | 'tall'
  }
  hoverHint: string
  noteAfterComplete?: string
  nextItemId?: StoryItemId
  animationType: AnimationType
  soundKey: SoundKey
}

export const storyOrder: StoryItemId[] = [
  'musicBox',
  'bookshelf',
  'runningShoes',
  'goggles',
  'computer',
  'photoWall',
  'giftBox',
]

export const storyItems: Record<StoryItemId, StoryItem> = {
  musicBox: {
    id: 'musicBox',
    label: '八音盒',
    title: '八音盒里藏着一点 R&B',
    hoverHint: '转一下，也许会有声音跑出来。',
    nextItemId: 'bookshelf',
    animationType: 'spin',
    soundKey: 'musicBox',
    body: [
      '我喜欢听 R&B，喜欢陶喆，也喜欢方大同。',
      '有时候音乐不是背景音，而是一种很轻的陪伴感。走路、剪视频、做东西的时候，耳机里有歌，就会觉得自己又被充了一点电。',
      '不知道你有没有看过陶喆和瑞幸联名的视频，那个“椰椰椰～”真的超级搞笑。每次刷到陶喆一些抽象的互动，都会莫名其妙笑一下，快乐就这么简单～',
    ],
  },
  bookshelf: {
    id: 'bookshelf',
    label: '书架',
    title: '书架不是很满，但脑子经常很吵',
    hoverHint: '这里放着一些我最近装进脑子里的东西。',
    nextItemId: 'runningShoes',
    animationType: 'bookDrop',
    soundKey: 'softClick',
    body: [
      '我平常会听一些播客，比如《纵横四海》《知行小酒馆》《岩中花述》。',
      '很喜欢听别人讲人生、关系、成长和选择。那种感觉像是隔着耳机，偷听到一些真实又柔软的人生经验。',
      '我也会看心理学、个人成长方向的书。最近在看《重新找回自己》，《像水一样吧，朋友》希望在书里获得一些力量！',
      '影视方面，偏向探案解谜类的英剧哈哈！像是《谜探路德维希》、《喜鹊&猫头鹰谋杀案》都很喜欢，也爱看皮克斯，宫崎骏，麦兜，功夫熊猫一些动画动漫电影。我怀疑自己爱看剧的原因之一，就是喜欢偷偷去别人的人生里串个门。',
    ],
  },
  runningShoes: {
    id: 'runningShoes',
    label: '跑鞋',
    title: '一年跑了 700 多公里之后',
    image: {
      src: '/assets/story/running.jpg',
      alt: '跑步里程数据截图',
      layout: 'wide',
    },
    hoverHint: '这双鞋好像走过不少路。',
    nextItemId: 'goggles',
    animationType: 'route',
    soundKey: 'softClick',
    body: [
      '跑步算是我坚持比较久的一件事。从最开始只能跑 1km，到后来一点点往上加，1.1km、1.5km、2km……不知不觉也能跑到 10km 了。',
      '一开始纯粹是在和自己较劲，总觉得别人能做到的事，我应该也能坚持下来。那时候跑步基本全程痛苦面具，边跑边怀疑人生（笑）。',
      '但后来发现，跑步反而成了我的解压神器。压力大的时候去操场跑几圈，吹吹晚风，流点汗，再吃顿好吃的，很多事情好像就没那么重要了。',
      '跑步没有让我变成更厉害的人，但它让我多了一个照顾自己的方式。',
    ],
  },
  goggles: {
    id: 'goggles',
    label: '泳镜',
    title: '花 900 块学会蛙泳之后',
    image: {
      src: '/assets/story/swimming.jpg',
      alt: '游泳、浆板和跨栏记录拼图',
      layout: 'square',
    },
    hoverHint: '这里藏着一点“不怕掉进水里”的底气。',
    nextItemId: 'computer',
    animationType: 'ripple',
    soundKey: 'softClick',
    body: [
      '我之前花了 900 块报班学蛙泳。',
      '学会游泳之后有一种很奇妙的感觉：好像不是突然变强了，而是多了一点“不怕掉进水里”的底气。',
      '后来我还去尝试了浆板。站在水面上的时候会有点紧张，但也会觉得很新鲜。',
      '未来我还想尝试滑雪、攀岩，还有马拉松。感觉人生里有很多东西，都是先有点害怕，然后试着试着就变成了新的自己。',
      '还有一件很离谱的事：我曾经本来报名的是 1500 米，结果因为填表的人填错，突然变成了 100 米跨栏，在比赛前一天猛练，把高度到腰这的栏跨过去的时候，那刻的喜悦真的无法言说，至今仍记忆犹新。',
      '人生有时候就是这样，莫名其妙被推上赛道，然后发现自己居然能跨过去。感谢那位填错表的人，不然我可能永远不知道自己还能跨栏（笑）。',
    ],
  },
  computer: {
    id: 'computer',
    label: '电脑',
    title: 'AI脑洞加工厂',
    image: {
      src: '/assets/story/creative.jpg',
      alt: '创意海报和视觉物料合集',
      layout: 'tall',
    },
    hoverHint: '小心，这里经常生成奇怪但有趣的东西。',
    nextItemId: 'photoWall',
    animationType: 'boot',
    soundKey: 'softClick',
    body: [
      '灵感进入这里之后，经常会变成一些奇奇怪怪的东西。',
      '我好像一直对各种有创意的东西毫无抵抗力。',
      '上学的时候特别喜欢看手书视频，后来又喜欢看定格动画、创意剪辑、AI 创意视频这类东西。经常刷着刷着就开始研究：',
      '“这个到底是怎么做出来的？”',
      '有时候甚至会因为一个几秒钟的转场效果反复看好多遍。',
      '平时看到有设计感的小饰品、包装、海报或者一些有趣的视觉创意，也总会忍不住收藏下来。',
      '别人收藏照片，我收藏灵感。',
      '后来接触 AI 的时候，我的第一反应不是：',
      '“这个效率好高。”',
      '而是：',
      '“哇，那些以前停留在脑子里的想法，好像真的能做出来了。”',
      '于是开始各种折腾。',
      '做过西兰花 BROCCOLI 这样的可爱 IP，做过 AI 短片，做过创意海报，也给活动设计过各种物料。',
      '虽然经常一研究就是大半天，',
      '但每次看到脑海里的东西一点点变成真实作品的时候，',
      '都会有种特别满足的感觉。',
      '我喜欢的好像从来不是某个具体工具，',
      '而是把一个想法从 0 到 1 做出来的过程。',
      '目前也在努力往 AI 产运 / 运营方向探索。',
      '如果你也喜欢折腾有趣的项目，',
      '欢迎来找我玩！',
    ],
  },
  photoWall: {
    id: 'photoWall',
    label: '照片墙',
    title: '原来还有这样的活法',
    image: {
      src: '/assets/story/events.jpg',
      alt: '活动策划和猫咖现场照片合集',
      layout: 'square',
    },
    hoverHint: '这些照片里，好像有很多奇奇怪怪的现场。',
    nextItemId: 'giftBox',
    animationType: 'photos',
    soundKey: 'softClick',
    body: [
      '这一年参加过很多有趣的活动，也参与过一些活动的策划。',
      '有在 KTV 里的开说，',
      '有在海底捞里的分享会，',
      '有在猫咖里的演出，',
      '还有很多关于成长、职业和创意的线下活动。',
      '最特别的一次，大概是在猫咖办演出。',
      '观众除了人，还有几只在场地里到处闲逛的小猫。大家围坐在一起分享故事、聊聊最近的生活，那种感觉很轻松，也很温暖。',
      '我喜欢这样的时刻。',
      '因为每个人都像一本完全不同的书。',
      '有人正在创业，',
      '有人准备换个城市生活，',
      '有人在研究 AI，',
      '有人在尝试一种从没见过的人生路径。',
      '每一次交流，都会让我发现新的可能性。',
      '原来还有这样的工作。',
      '原来还有这样的选择。',
      '原来还有这样看待世界的方式。',
      '这些相遇让我获得很多能量。',
      '也让我越来越相信，人与人的交流是一件很有意思的事情。',
      '所以直到现在，我依然喜欢参加各种有趣的活动，认识不同的人，听听他们的故事。',
      '有时候聊上几句，',
      '就会觉得世界又大了一点。',
    ],
  },
  giftBox: {
    id: 'giftBox',
    label: '礼盒',
    title: '恭喜你探索完这块新田',
    hoverHint: '好像只有探索完的人才能打开。',
    animationType: 'gift',
    soundKey: 'softClick',
    body: [
      '很高兴认识你。我是新田！',
      '这块新田里长着很多东西：有 R&B，有陶喆和方大同；有跑过 700 多公里的跑鞋；有花 900 块学会蛙泳之后多出来的底气；有 AI，创意内容和可爱的 IP；也有 KTV、海底捞、猫咖和很多有趣的人。',
      '我一直希望自己能保持一点好奇心。',
      '对人好奇，对世界好奇，对那些没见过的活法、没尝试过的事情、没接触过的领域都保持兴趣。',
      '我喜欢探索，喜欢创造，喜欢把脑海里的想法一点点变成真实存在的东西。也喜欢和有趣的人聊天、合作，一起折腾一些看起来有点疯狂但又很有意思的事情。',
      '希望很多年以后回头看，会发现自己认真体验过、勇敢尝试过，也因为好奇心走到了很多意想不到的地方。',
      '毕竟人生这么大，我想多去看看。',
      '如果你也喜欢 AI、创意、美食、运动、播客，或者正在折腾什么有意思的事情，欢迎随时来找我玩，期待能一起做些有趣的东西！',
    ],
  },
}
