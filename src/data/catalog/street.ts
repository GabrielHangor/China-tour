import type { Place } from '@/shared/types'

export type StreetFacts = Pick<Place, 'addressZh' | 'metroZh' | 'hours'>

export const streetFacts: Record<string, StreetFacts> = {
  'forbidden-city': {
    addressZh: '北京市东城区景山前街4号',
    metroZh: '天安门东 / 天安门西 · 1号线',
    hours: '8:30–17:00, вторник часто выходной',
  },
  tiananmen: {
    addressZh: '北京市东城区天安门广场',
    metroZh: '天安门东 / 天安门西 · 1号线',
    hours: 'площадь открыта, досмотр на входе',
  },
  'temple-of-heaven': {
    addressZh: '北京市东城区天坛内东里7号',
    metroZh: '天坛东门 · 5号线',
    hours: 'парк с 6:00, залы обычно 8:00–17:00',
  },
  'summer-palace': {
    addressZh: '北京市海淀区新建宫门路19号',
    metroZh: '北宫门 · 4号线, или 西苑',
    hours: '6:30–18:00, сезонно короче',
  },
  mutianyu: {
    addressZh: '北京市怀柔区渤海镇慕田峪村',
    hours: '7:30–17:30, лучше к открытию',
  },
  jingshan: {
    addressZh: '北京市西城区景山前街44号',
    metroZh: '南锣鼓巷 · 6/8号线, далее пешком',
    hours: '6:30–21:00',
  },
  'lama-temple': {
    addressZh: '北京市东城区雍和宫大街12号',
    metroZh: '雍和宫 · 2/5号线',
    hours: '9:00–16:30',
  },
  nanluoguxiang: {
    addressZh: '北京市东城区南锣鼓巷',
    metroZh: '南锣鼓巷 · 6/8号线',
  },
  'art-798': {
    addressZh: '北京市朝阳区酒仙桥路4号',
    metroZh: '将台 · 14号线, далее автобус/такси',
    hours: 'галереи часто 10:00–18:00, пн выходной',
  },
  'the-bund': {
    addressZh: '上海市黄浦区中山东一路',
    metroZh: '南京东路 · 2/10号线',
  },
  'yu-garden': {
    addressZh: '上海市黄浦区福佑路218号',
    metroZh: '豫园 · 10号线',
    hours: '9:00–16:30',
  },
  'oriental-pearl': {
    addressZh: '上海市浦东新区世纪大道1号',
    metroZh: '陆家嘴 · 2号线',
    hours: '8:00–21:30',
  },
  'nanjing-road': {
    addressZh: '上海市黄浦区南京东路',
    metroZh: '南京东路 · 2/10号线',
  },
  'french-concession': {
    addressZh: '上海市徐汇区武康路 / 衡山路一带',
    metroZh: '徐家汇 / 衡山路 · 1号线',
  },
  'shanghai-museum': {
    addressZh: '上海市黄浦区人民大道201号',
    metroZh: '人民广场 · 1/2/8号线',
    hours: '9:00–17:00, понедельник выходной',
  },
  'jingan-temple': {
    addressZh: '上海市静安区南京西路1686号',
    metroZh: '静安寺 · 2/7号线',
    hours: '7:30–17:00',
  },
  terracotta: {
    addressZh: '陕西省西安市临潼区秦陵镇',
    metroZh: '地铁9号线至华清池，再公交',
    hours: '8:30–18:00, сезонно раньше',
  },
  'xian-wall': {
    addressZh: '陕西省西安市碑林区南门',
    metroZh: '永宁门 · 2号线',
    hours: '8:00–22:00, велосипед до вечера',
  },
  'muslim-quarter': {
    addressZh: '陕西省西安市莲湖区北院门',
    metroZh: '钟楼 · 2号线',
  },
  'wild-goose-pagoda': {
    addressZh: '陕西省西安市雁塔区雁塔南路',
    metroZh: '大雁塔 · 3号线',
    hours: '8:00–17:00',
  },
  'bell-tower-xian': {
    addressZh: '陕西省西安市莲湖区东大街',
    metroZh: '钟楼 · 2号线',
    hours: '8:30–21:30',
  },
  'panda-base': {
    addressZh: '四川省成都市成华区熊猫大道1375号',
    metroZh: '3号线熊猫大道，再公交Panda专线',
    hours: '7:30–17:00, приходите к открытию',
  },
  jinli: {
    addressZh: '四川省成都市武侯区武侯祠大街231号',
    metroZh: '高升桥 · 3号线',
  },
  wuhou: {
    addressZh: '四川省成都市武侯区武侯祠大街231号',
    metroZh: '高升桥 · 3号线',
    hours: '8:00–18:00',
  },
  kuanzhai: {
    addressZh: '四川省成都市青羊区宽巷子',
    metroZh: '人民公园 · 2号线',
  },
  'peoples-park-chengdu': {
    addressZh: '四川省成都市青羊区少城路12号',
    metroZh: '人民公园 · 2号线',
    hours: '6:30–22:00',
  },
  'leshan-buddha': {
    addressZh: '四川省乐山市市中区凌云路',
    hours: '7:30–18:00, день из Чэнду',
  },
  'elephant-hill': {
    addressZh: '广西桂林市象山区滨江路1号',
    hours: '6:30–21:30',
  },
  'li-river': {
    addressZh: '广西桂林市竹江码头 / 磨盘山码头',
    hours: 'круизы утром, сезонно',
  },
  'reed-flute': {
    addressZh: '广西桂林市秀峰区芦笛路',
    hours: '8:00–17:30',
  },
  'west-street': {
    addressZh: '广西桂林市阳朔县西街',
  },
  'yulong-river': {
    addressZh: '广西桂林市阳朔县遇龙河',
    hours: 'плоты обычно 8:00–17:00',
  },
  'moon-hill': {
    addressZh: '广西桂林市阳朔县月亮山',
    hours: 'светлое время суток',
  },
  'west-lake': {
    addressZh: '浙江省杭州市西湖区',
    metroZh: '龙翔桥 / 定安路 · 1号线',
  },
  lingyin: {
    addressZh: '浙江省杭州市西湖区灵隐路法云弄1号',
    hours: '7:00–18:00',
  },
  leifeng: {
    addressZh: '浙江省杭州市西湖区南山路15号',
    metroZh: '龙翔桥 · 1号线, далее автобус',
    hours: '8:00–20:30',
  },
  'humble-garden': {
    addressZh: '江苏省苏州市姑苏区东北街178号',
    metroZh: '娄门 · 6号线',
    hours: '7:30–17:30',
  },
  pingjiang: {
    addressZh: '江苏省苏州市姑苏区平江路',
    metroZh: '临顿路 · 6号线',
  },
  'tiger-hill': {
    addressZh: '江苏省苏州市姑苏区虎丘山门内',
    hours: '7:30–17:30',
  },
  'tianzi-mountain': {
    addressZh: '湖南省张家界市武陵源区天子山',
    hours: 'по билету парка, лучше с ночёвкой',
  },
  tianmen: {
    addressZh: '湖南省张家界市永定区天门山',
    hours: 'канатка обычно 8:00–16:00',
  },
  'glass-bridge': {
    addressZh: '湖南省张家界市慈利县张家界大峡谷',
    hours: '8:00–16:00, отдельный билет',
  },
  'stone-forest': {
    addressZh: '云南省昆明市石林彝族自治县',
    hours: '8:00–18:00, день из Куньмина',
  },
  cuihu: {
    addressZh: '云南省昆明市五华区翠湖南路',
    metroZh: '市博物馆 / 小西门一带',
  },
  'dali-old-town': {
    addressZh: '云南省大理市大理古城',
  },
  erhai: {
    addressZh: '云南省大理市洱海',
  },
  'lijiang-old-town': {
    addressZh: '云南省丽江市古城区',
    hours: 'город круглосуточно, музеи по своим часам',
  },
  'jade-dragon': {
    addressZh: '云南省丽江市玉龙纳西族自治县玉龙雪山',
    hours: 'канатки по погоде, не в день прилёта',
  },
  'canton-tower': {
    addressZh: '广东省广州市海珠区阅江西路222号',
    metroZh: '广州塔 · APM / 3号线珠江新城+APM',
    hours: '9:30–22:30',
  },
  shamian: {
    addressZh: '广东省广州市荔湾区沙面',
    metroZh: '黄沙 · 1/6号线',
  },
  'chen-clan': {
    addressZh: '广东省广州市荔湾区中山七路',
    metroZh: '陈家祠 · 1号线',
    hours: '8:30–17:30',
  },
}
