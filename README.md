# ComputerBuilder
  - デモ画面 : https://T-Kobam.github.io/ComputerBuilder/main.html
  - コンピュータの主要部品を選択して構築し、その性能を評価するアプリ
  - コンピュータの主用部品は以下の4つで構成されている
    1. CPU
    2. GPU
    3. メモリーカード (RAM) (1~4メモリモジュール)
    4. ストレージ (HDD or SSD)
  - 各主要部品はAPIを使用して、上位100製品のデータから選択できる
    -  エンドポイント : https://api.recursionist.io/builder/computers
    -  GETリクエストでアクセス
    -  パラメータはtype (可能なタイプ: cpu、gpu、ram、hdd、ssd)
  - 性能は、ゲーミング用と作業用で評価する
    - ゲーミング用は、GPU 性能 60%、CPU 性能 25%、RAM 12.5%、ストレージ 2.5% を基準
    - 作業用は、CPU 性能 60%、GPU 性能 25%、RAM 10%、ストレージ 5% を基準
