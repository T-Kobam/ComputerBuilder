const config = {
    "url": "https://api.recursionist.io/builder/computers?type=",
    "component": ["cpu", "gpu", "ram", "storage"],
    "workBenchMark" : {
        "cpu": 0.6,
        "gpu": 0.25,
        "ram": 0.1,
        "storage": 0.05,
    },
    "gameBenchMark" : {
        "cpu": 0.6,
        "gpu": 0.25,
        "ram": 0.125,
        "storage": 0.25,
    },
};

// APIのオブジェクト取得
const getInfo = {
    "cpu": fetch(config.url + "cpu").then(response => response.json()),
    "gpu": fetch(config.url + "gpu").then(response => response.json()),
    "ram": fetch(config.url + "ram").then(response => response.json()),
    "hdd": fetch(config.url + "hdd").then(response => response.json()),
    "ssd": fetch(config.url + "ssd").then(response => response.json()),
}

/**
 * ブランド名を重複を除いて配列として返す
 * @param {*} data APIで取得した配列のオブジェクト
 * @returns ブランド名の配列
 */
 const getBrandNames = (data) => {
    return Array.from(new Set(data.map(( obj => { return obj.Brand; }))));
};

/**
 * ブランド名をhtmlに追加する
 * @param {*} brands ブランド名の配列
 * @param {*} component 構成要素の名前(cpu, gpu, ram, ssd, hdd)
 */
const putBrandNames = (brands, component) => {
    const brandEle = document.getElementById(`${component}-brand`);

    brandEle.innerHTML = `<option selected value="none">-</option>`;
    for (const brand of brands) {
        brandEle.innerHTML += `<option value="${brand}">${brand}</option>`;
    }
}

/**
 * イベントリスナーで選択されたブランドからモデルを表示
 * @param {*} event イベントリスナー(addEventListenerでは関数名のみ引数に入れる)
 */
const putModelNames = (event) => {
    // 選択されたブランド名をイベントから取得
    const brand = event.currentTarget.value;

    // イベントのidから構成要素を取得
    const id = event.currentTarget.id.substring(0, event.currentTarget.id.indexOf("-"));

    // 構成要素がstorageの場合、HDDorSSDを判断
    const component = (id === "storage" ? document.getElementById("hdd-or-ssd").value : id);

    // 選択されたブランドのモデルを表示
    getInfo[component].then(data => {
        const models = data.filter(obj => { 
            if (id === "storage") {
                const storage = document.getElementById("storage-capa").value;
                return obj.Brand === brand && obj.Model.indexOf(storage) > -1;
            }
            return obj.Brand === brand; 
        });
        const modelEle = document.getElementById(`${id}-model`);

        // optionに追加
        modelEle.innerHTML = `<option selected value="none">-</option>`;
        for (const value of models) {
            modelEle.innerHTML += `
                <option value="${value.Model}">${value.Model}</option>
            `;
        }
    });
};

/**
 * APIで取得したストレージのモデル名から容量(●TB or ●GB)の文字列を取得
 * @param {*} model モデル
 * @returns 容量
 */
const getStorage = (model) => {
    // "TB" or "GB"の文字列の配列番号を取得
    const indexOfByte = model.indexOf("TB") !== -1 ? model.indexOf("TB") + 2 : model.indexOf("GB") + 2;

    // 空白を含めて単位の前5つの文字列を取得
    const predictStr = model.substring(indexOfByte - 6, indexOfByte);

    // 空白を除いた容量の文字列を返す
    return predictStr.substring(predictStr.indexOf(" ") + 1, indexOfByte);
}

/**
 * 文字列に"TB"が含まれているか判定
 * @param {*} capacity 文字列
 * @returns
 */
const isTB = (capacity) => { return capacity.indexOf("TB") !== -1 ? true : false; }

/**
 * 配列の前後の要素を入れ替える
 * @param {*} index 対象の配列番号(前の番号)
 * @param {*} value 配列
 */
const exchangeValue = (index, value) => {
    const temp = value[index];
    value[index] = value[index + 1];
    value[index + 1] = temp;
}

/**
 * 降順のバブルソートで容量を整列させる
 * @param {*} data 容量の文字列が入った配列
 */
const bubbleSortDesc = (data) => {
    for (let i = 0; i < data.length; i++) {
        for (let j = 1; j < data.length - i; j++) {
            // 比較対象が"TB"or"GB"同士の場合、数字を比較
            if ( (isTB(data[j - 1]) && isTB(data[j])) || 
                 (!isTB(data[j - 1]) && !isTB(data[j])) ) {

                if (parseFloat(data[j - 1]) < parseFloat(data[j])) {
                    exchangeValue(j - 1, data);
                }
                // 1つ隣の要素の方が数字が大きい場合、次の処理へ
                continue;
            }
            // 比較対象が"GB"と"TB"(要素の順番で見て)の場合、交換
            else if (!isTB(data[j - 1]) && isTB(data[j])) {
                exchangeValue(j - 1, data);
            }
        }
    }
}

/**
 * 全項目が入力されているかを確認
 * @param {*} component 
 * @returns 
 */
const validation = (component) => {
    const brand = document.getElementById(`${component}-brand`).value;
    const model = document.getElementById(`${component}-model`).value;

    if (brand === "none" || model === "none") {
        alert("全ての項目を入力してください");
        return true;
    }

    if (component === "storage") {
        const disk = document.getElementById("hdd-or-ssd").value;
        const capacity = document.getElementById("storage-capa").value;
        if (disk === "none" || capacity === "none") {
            alert("全ての項目を入力してください");
            return true;
        }
    }
    createShowPage(component);

    return false;
};

/**
 * 結果のページを作成
 * @param {*} component 
 */
const createShowPage = (component) => {
    const showDiv = document.getElementById(component);

    const brand = document.getElementById(`${component}-brand`).value;
    const model = document.getElementById(`${component}-model`).value;

    if (component === "storage") {
        const disk = document.getElementById("hdd-or-ssd").value;
        const capacity = document.getElementById("storage-capa").value;
        showDiv.innerHTML = `
            <h3 class="">${component.toUpperCase()}</h3>
            <p>Disk: ${disk.toUpperCase()}</p>
            <p>Storage: ${capacity}</p>
            <p>Brand: ${brand}</p>
            <p>Model: ${model}<p>
        `;
    } else {
        showDiv.innerHTML = `
            <h3 class="">${component.toUpperCase()}</h3>
            <p>Brand: ${brand}</p>
            <p>Model: ${model}<p>
        `;
    }
};

/**
 * 作業用とゲーム用の性能スコアを返す
 * @param {*} components 
 * @returns [作業用スコア、ゲーム用スコア]
 */
const calcBenchMark = () => {
    let benchMarks = [0, 0];
    for (const component of config.component) {
        const benchMark = document.getElementById(`${component}-benchmark`).value;

        if (component === "ram") {
            const ramCount = document.getElementById(`${component}-num`).value;
            benchMarks = calcMatrix(benchMarks, [benchMark * config.workBenchMark[component] * ramCount, benchMark * config.gameBenchMark[component] * ramCount]);
        }

        calcMatrix(benchMarks, [benchMark * config.workBenchMark[component], benchMark * config.gameBenchMark[component]]);
    }

    return benchMarks;
}

/**
 * N×N行列の和を計算
 * @param {*} x 
 * @param {*} y 
 * @returns 
 */
const calcMatrix = (x, y) => {
    if (x.length != y.length) {
        console.log("err");
        return;
    }

    let result = [];
    for (let i = 0; i < x.length; i++) {
        result.push(x[i] + y[i]);
    }

    return result;
}

// 共通の初期設定
for (const component of config.component) {
    if (component === "storage") {
        document.getElementById("hdd-or-ssd").addEventListener("change", (e) => {
            const disk = e.currentTarget.value;
            const capacityEle = document.getElementById(`${component}-capa`);
        
            getInfo[disk].then(data => { 
                const capacity = Array.from(new Set(data.map(( obj => { return getStorage(obj.Model); }))));
        
                // バブルソートで容量の降順にする
                bubbleSortDesc(capacity);
        
                capacityEle.innerHTML = `<option selected value="none">-</option>`;
                for (const value of capacity) {
                    capacityEle.innerHTML += `
                        <option value="${value}">${value}</option>
                    `;
                }
            });
        
            // BrandとModelを初期化する
            document.getElementById(`${component}-brand`).innerHTML = `<option selected value="none">-</option>`;
            document.getElementById(`${component}-model`).innerHTML = `<option selected value="none">-</option>`;
        
        });
        
        // Storageが選択されたら、Brandを表示する
        document.getElementById(`${component}-capa`).addEventListener("change", (e) => {
            const disk = document.getElementById("hdd-or-ssd").value;
            const capacity = e.currentTarget.value;
        
            getInfo[disk].then(data => { 
                // 選択した容量に該当しないブランドは除外
                const validModels = data.filter(obj => { return obj.Model.indexOf(capacity) > -1; });
        
                // storageのBrandを選択肢に表示
                putBrandNames(getBrandNames(validModels), component);
            });
        
            // Modelを初期化する
            document.getElementById(`${component}-model`).innerHTML = `<option selected value="none">-</option>`;
        
        });
    } else {
        // Brandを選択肢に表示
        getInfo[component].then(data => { putBrandNames(getBrandNames(data), component) } );
    }

    // Brandを選択後、Modelに選択肢を表示
    document.getElementById(`${component}-brand`).addEventListener("change", putModelNames);

    // Modelを選択後、Benchmarkに値をセットする
    document.getElementById(`${component}-model`).addEventListener("change", () => {
        let componentKey = component;
        if (component === "storage") {
            componentKey = document.getElementById("hdd-or-ssd").value;
        }
        getInfo[componentKey].then(data => {
            const model = document.getElementById(`${component}-model`).value;
            const brand = document.getElementById(`${component}-brand`).value;
            const hardware = data.find((obj) => obj.Brand === brand && obj.Model === model)
            document.getElementById(`${component}-benchmark`).value = hardware.Benchmark;
        });
    });
}

// Add PCがクリックされた時の処理
document.querySelectorAll(".add-btn")[0].addEventListener("click", () => {
    // 項目の抜け漏れがないかチェック
    for (const component of config.component) {
        // バリデーションエラーの場合、メッセージを表示しbreak
        if (validation(component)) {
            return;
        }
    }

    const benchMarks = calcBenchMark();
    document.getElementById("game-score").innerHTML = `
    <h3>Gaming: ${Math.floor(benchMarks[1] * 100) / 100}</h3>
    `;
    document.getElementById("work-score").innerHTML = `
        <h3>Gaming: ${Math.floor(benchMarks[0] * 100) / 100}</h3>
    `;

    // 性能結果を表示
    document.getElementById("score").classList.remove("d-none");
    document.getElementById("score").classList.add("d-block");
});
