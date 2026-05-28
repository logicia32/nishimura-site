export interface Service {
  title: string;
  price: string;
  leadTime: string;
  deliverables: string;
  summary: string;
  items: string[];
}

export const services: Service[] = [
  {
    title: '組込み・FPGA 設計／コードレビュー',
    price: '30,000円〜',
    leadTime: '納期 3〜5 営業日',
    deliverables: '成果物: レビュー所見・改善差分・口頭フォロー',
    summary:
      'Verilog の RTL、組込み C / C++、マイコンファームウェアを第三者の目で確認します。レビューだけでなく、構成や見積もりの妥当性判断もお伝えします。',
    items: [
      'RTL レビュー(タイミング・リソース・テスト可能性)',
      '組込み C / C++ コードレビュー(割り込み・メモリ・通信周り)',
      '仕様書・見積もり書の妥当性チェック',
    ],
  },
  {
    title: 'Python による業務自動化・データ処理',
    price: '50,000円〜',
    leadTime: '納期 1〜2 週間',
    deliverables: '成果物: スクリプト＋手順書、または結果データ(CSV/Excel)',
    summary:
      'Excel / CSV の整形、Web からのデータ収集、ログ解析、レポート自動化など。結果データの納品でも、スクリプト・実行可能ファイル(exe)の納品でも対応します。',
    items: [
      '定型作業の自動化(Excel / CSV / Web)',
      '大量データの整形・集計・可視化',
      'FFT・統計処理・簡易な信号処理',
    ],
  },
  {
    title: '産業 AI 導入・実装相談',
    price: '15,000円 / 時間',
    leadTime: '',
    deliverables: '成果物: 構成図・落とし穴メモ・PoC スクリプト(必要に応じて)',
    summary:
      '異常検知・信号処理・分類など、組込みや産業の現場で動かす AI について、構成の妥当性・落とし穴・運用負担の見積もりを一緒に整理します。',
    items: [
      '「いまの手作業を AI でどこまで置き換えられるか」の整理',
      'モデル選定と実装方針のレビュー',
      'PoC 段階の小さな実装支援',
    ],
  },
];
