const config = {
    "url": "https://api.recursionist.io/builder/computers?type=",  
};

// CPUの情報をAPIから取得
const getCpuInfo = () => fetch(config.url + "cpu").then(response => response.json());

// GPUの情報をAPIから取得
const getGpuInfo = () => fetch(config.url + "gpu").then(response => response.json());

// RAMの情報をAPIから取得
const getRamInfo = () => fetch(config.url + "ram").then(response => response.json());

/**
 * ブランド名を重複を除いて配列として返す
 * @param {*} data APIで取得した配列のオブジェクト
 * @returns ブランド名の配列
 */
 const getBrandName = (data) => {
    return Array.from(new Set(data.map(( obj => { return obj.Brand; }))));
};

/**
 * ブランド名をhtmlに追加する
 * @param {*} brands ブランド名の配列
 * @param {*} component 構成要素の名前(cpu, gpu, ram, ssd, hdd)
 */
const putBrandName = (brands, component) => {
    const brandEle = document.getElementById(`${component}-brand`);

    // optionに追加
    for (const brand of brands) {
        brandEle.innerHTML += `<option value="${brand}">${brand}</option>`;
    }
}

// Step1 : Select Your CPU
// CPUのBrandを選択肢に表示
getCpuInfo().then(data => { putBrandName(getBrandName(data), "cpu"); });

// CPUのBrandを選択すると、Modelの選択を可能にする
document.getElementById("cpu-brand").addEventListener("change", () => {
    const brand = document.getElementById("cpu-brand").value;

    getCpuInfo().then(data => {
        const models = data.filter(obj => { return obj.Brand === brand; });

        const cpuModel = document.getElementById("cpu-model");
        // optionに追加
        cpuModel.innerHTML = "";
        for (const value of models) {
            cpuModel.innerHTML += `
                <option value="${value.Model}">${value.Model}</option>
            `;
        }
    });
});

// Step2 : Select Your GPU
// GPUのBrandを選択肢に表示
getGpuInfo().then(data => { putBrandName(getBrandName(data), "gpu"); });

// GPUのBrandを選択すると、Modelの選択を可能にする
document.getElementById("gpu-brand").addEventListener("change", () => {
    const brand = document.getElementById("gpu-brand").value;

    getGpuInfo().then(data => {
        const models = data.filter(obj => { return obj.Brand === brand; });

        const gpuModel = document.getElementById("gpu-model");
        // optionに追加
        gpuModel.innerHTML = "";
        for (const value of models) {
            gpuModel.innerHTML += `
                <option value="${value.Model}">${value.Model}</option>
            `;
        }
    });
});

// Step3 : Select Your Memory Card
// RAMのBrandを選択肢に表示
getRamInfo().then(data => { putBrandName(getBrandName(data), "ram"); });

// GPUのBrandを選択すると、Modelの選択を可能にする
document.getElementById("ram-brand").addEventListener("change", () => {
    const brand = document.getElementById("ram-brand").value;

    getRamInfo().then(data => {
        const models = data.filter(obj => { return obj.Brand === brand; });

        const ramModel = document.getElementById("ram-model");
        // optionに追加
        ramModel.innerHTML = "";
        for (const value of models) {
            ramModel.innerHTML += `
                <option value="${value.Model}">${value.Model}</option>
            `;
        }
    });
});

document.querySelectorAll(".add-btn")[0].addEventListener("click", () => {
    fetch(config.url + "gpu")
    .then(response => response.json())
    .then(data => {
        document.getElementById("storage-model").value = "click";
    })
});
