const config = {
    "url": "https://api.recursionist.io/builder/computers?type=",  
};

// APIのオブジェクト取得
const getInfo = {
    "cpu": fetch(config.url + "cpu").then(response => response.json()),
    "gpu": fetch(config.url + "gpu").then(response => response.json()),
    "ram": fetch(config.url + "ram").then(response => response.json()),
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

    // optionに追加
    for (const brand of brands) {
        brandEle.innerHTML += `<option value="${brand}">${brand}</option>`;
    }
}

/**
 * イベントリスナーで選択されたブランドからモデルを表示
 * @param {*} event イベントリスナー(addEventListenerでは関数名のみ引数に入れる)
 */
const putBrandModels = (event) => {
    // 選択されたブランド名をイベントから取得
    const brand = event.currentTarget.value;

    // イベントのidから構成要素を取得
    const component = event.currentTarget.id.substring(0, event.currentTarget.id.indexOf("-"));

    // 選択されたブランドのモデルを表示
    getInfo[component].then(data => {
        const models = data.filter(obj => { return obj.Brand === brand; });
        const modelEle = document.getElementById(`${component}-model`);
        // optionに追加
        modelEle.innerHTML = "";
        for (const value of models) {
            modelEle.innerHTML += `
                <option value="${value.Model}">${value.Model}</option>
            `;
        }
    });
};

// Step1 : Select Your CPU
// CPUのBrandを選択肢に表示
getInfo["cpu"].then(data => { putBrandNames(getBrandNames(data), "cpu"); });

// CPUのBrandを選択すると、Modelの選択を可能にする
document.getElementById("cpu-brand").addEventListener("change", putBrandModels);

// Step2 : Select Your GPU
// GPUのBrandを選択肢に表示
getInfo["gpu"].then(data => { putBrandNames(getBrandNames(data), "gpu"); });

// GPUのBrandを選択すると、Modelの選択を可能にする
document.getElementById("gpu-brand").addEventListener("change", putBrandModels);

// Step3 : Select Your Memory Card
// RAMのBrandを選択肢に表示
getInfo["ram"].then(data => { putBrandNames(getBrandNames(data), "ram"); });

// GPUのBrandを選択すると、Modelの選択を可能にする
document.getElementById("ram-brand").addEventListener("change", putBrandModels);


document.querySelectorAll(".add-btn")[0].addEventListener("click", () => {
    fetch(config.url + "gpu")
    .then(response => response.json())
    .then(data => {
        document.getElementById("storage-model").value = "click";
    })
});
