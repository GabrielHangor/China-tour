import type { Route } from '@/shared/types'

export const routes: Route[] = [
  {
    id: 'golden-triangle',
    nameRu: 'Золотой треугольник',
    description:
      'Классика первого визита: Пекин (Стена и Запретный город), Сиань (терракота) и Шанхай (Вайтань). 10–14 дней.',
    cityIds: ['beijing', 'xian', 'shanghai'],
    placeIds: [
      'forbidden-city',
      'mutianyu',
      'temple-of-heaven',
      'terracotta',
      'xian-wall',
      'muslim-quarter',
      'the-bund',
      'yu-garden',
    ],
    images: ['Forbidden_City_Beijing_China.jpg', 'Terracotta_Army.jpg', 'The_Bund_Shanghai.jpg'],
  },
  {
    id: 'east-china',
    nameRu: 'Восточный Китай',
    description:
      'Шанхай как база плюс сады Сучжоу и Западное озеро Ханчжоу. Удобно на поездах 30–60 минут.',
    cityIds: ['shanghai', 'suzhou', 'hangzhou'],
    placeIds: [
      'the-bund',
      'french-concession',
      'humble-garden',
      'pingjiang',
      'west-lake',
      'lingyin',
    ],
    images: ['West_Lake_Hangzhou.jpg', 'Humble_Administrators_Garden.jpg'],
  },
  {
    id: 'sichuan',
    nameRu: 'Сычуань',
    description: 'Чэнду: панды, чай в Народном парке, хого и день к Большому Будде в Лэшане.',
    cityIds: ['chengdu'],
    placeIds: ['panda-base', 'peoples-park-chengdu', 'kuanzhai', 'jinli', 'leshan-buddha'],
    images: ['Chengdu_Research_Base_of_Giant_Panda_Breeding.jpg'],
  },
  {
    id: 'guilin-yangshuo',
    nameRu: 'Гуйлинь и Яншо',
    description: 'Карстовые пики, круиз по реке Ли и велосипед вдоль Юлунхе. 3–5 дней.',
    cityIds: ['guilin', 'yangshuo'],
    placeIds: [
      'elephant-hill',
      'li-river',
      'reed-flute',
      'west-street',
      'yulong-river',
      'moon-hill',
    ],
    images: ['Li_River.jpg', 'Elephant_Trunk_Hill.jpg'],
  },
  {
    id: 'yunnan',
    nameRu: 'Юньнань',
    description:
      'Куньмин — Дали — Лицзян: Каменный лес, Эрхай и старые города. Следите за высотой в Лицзяне.',
    cityIds: ['kunming', 'dali', 'lijiang'],
    placeIds: ['stone-forest', 'dali-old-town', 'erhai', 'lijiang-old-town', 'jade-dragon'],
    images: ['Lijiang_Old_Town.jpg', 'Dali_Ancient_City.jpg'],
  },
  {
    id: 'zhangjiajie-route',
    nameRu: 'Чжанцзяцзе',
    description:
      'Нацпарк с столбами, гора Тяньмэнь и стеклянный мост — три разных билета и локации.',
    cityIds: ['zhangjiajie'],
    placeIds: ['tianzi-mountain', 'tianmen', 'glass-bridge'],
    images: ['Zhangjiajie_National_Forest_Park.jpg'],
  },
  {
    id: 'beijing-classic',
    nameRu: 'Классический Пекин',
    description: 'Запретный город, Храм Неба, Летний дворец, хутуны и день на Великой стене.',
    cityIds: ['beijing'],
    placeIds: [
      'forbidden-city',
      'jingshan',
      'temple-of-heaven',
      'summer-palace',
      'mutianyu',
      'nanluoguxiang',
      'lama-temple',
    ],
    images: ['Forbidden_City_Beijing_China.jpg', 'Mutianyu_Great_Wall.jpg'],
  },
]
