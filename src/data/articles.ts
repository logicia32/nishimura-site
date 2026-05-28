export interface Article {
  date: string; // YYYY-MM-DD
  title: string;
  url: string;
}

export const articles: Article[] = [
  {
    date: '2026-05-28',
    title:
      '「圏外だから衛星」と決める前に — 山間部 IoT のコストを、請求書に載らない分まで数えてみた',
    url: 'https://zenn.dev/logicia32/articles/2026-05-28-satellite-iot-cost',
  },
  {
    date: '2026-05-27',
    title:
      '実機なしの STM32 で三相電力、続き — 不平衡・低力率で崩れるもの、崩れないもの(2電力計法)',
    url: 'https://zenn.dev/logicia32',
  },
  {
    date: '2026-05-26',
    title:
      '実機を使わずに STM32 を動かして、三相電力を測ってみる — Python の中だけで(2電力計法)',
    url: 'https://zenn.dev/logicia32',
  },
  {
    date: '2026-05-25',
    title:
      'KiCad を使わずに、Python だけで基板を"配線"してみる — 素朴な迷路法で',
    url: 'https://zenn.dev/logicia32',
  },
  {
    date: '2026-05-22',
    title:
      '同じ RTL を 3 回シミュレートする — Yosys と iverilog で、合成と配置配線で剥がれていくもの',
    url: 'https://zenn.dev/logicia32',
  },
  {
    date: '2026-05-21',
    title:
      'FFT が汚れる前に — AD コンバータの手前で、4 次 LPF を E12 と E24 でどう組むか',
    url: 'https://zenn.dev/logicia32/articles/2026-05-20-pyspice-4th-order-lpf',
  },
  {
    date: '2026-05-20',
    title:
      '「これ、効いてるんでしょうか」— 産業用センシング基板の保護回路で、ずっと答えが出ない話',
    url: 'https://zenn.dev/logicia32/articles/2026-05-19-fa-protection-invisible-fight',
  },
  {
    date: '2026-05-19',
    title:
      'Z80(ゼッパチ)を4個つないで円周率を求めてみた — 並列で速くなる計算と、何台つないでも速くならない計算',
    url: 'https://zenn.dev/logicia32',
  },
  {
    date: '2026-05-18',
    title:
      'ゼッパチを、いまの机に蘇らせる — Z80 で C の printf と二分探索を、電源オンの 0x0000 から動かす',
    url: 'https://zenn.dev/logicia32',
  },
  {
    date: '2026-05-16',
    title:
      'ngspice の壁、sudo 無しで越えた — PySpice で本物の Bode 線図が出るまで',
    url: 'https://zenn.dev/logicia32',
  },
  {
    date: '2026-05-16',
    title:
      '回路図、Python で書けるのか？ — 現場の電子屋が schemdraw / skidl / PySpice を本気で試した',
    url: 'https://zenn.dev/logicia32/articles/2026-05-16-python-circuit-as-code',
  },
];
