const config = {
    "url": "https://api.recursionist.io/builder/computers?type=",  
};

// Step1 : Select Your CPU
// ブランドとモデルを設定
fetch(config.url + "cpu").then(response => response.json())
.then(data => {
    // 重複を排除
    const brands = Array.from(new Set(
        data.map((obj) => { return obj.Brand; })
    ));

    const cpuBrand = document.getElementById("cpu-brand");
    // optionに追加
    for (const value of brands) {
        cpuBrand.innerHTML += `
            <option value="${value}">${value}</option>
        `;
    }

    document.getElementById("cpu-brand").addEventListener("change", () => {
        const brand = document.getElementById("cpu-brand").value;
        document.getElementById("storage-model").value = brand;
        const models = Array.from(new Set(
            data.map((obj) => {
                if (obj.Brand === brand)
                return obj.Model; 
            })
        ));
        document.getElementById("gpu-model").value = brand;

        const cpuModel = document.getElementById("cpu-model");
        // optionに追加
        for (const value of models) {
            cpuModel.innerHTML += `
                <option value="${value}">${value}</option>
            `;
        }
    });
});

// Brandが選択されたら、そのBrandのModelを表示させる

const getCpuBrand = (data) => {
    const div = document.createElement("div");
    for (const key in data) {
        div.innerHTML += `
            <option value="${data[key].Brand}">${data[key].Brand}</option>
        `;
    }
    return div;
}

const putCpuBrand = (cpuBrand, data) => {
    const brands = Array.from(new Set(
        data.map((obj) => { return obj.Brand })
    ));

    for (const value of brands) {
        cpuBrand.innerHTML += `
            <option value="${value}">${value}</option>
        `;
    }
}


// Step2 : Select Your GPU

// Step3 : Select Your Memory Card
document.querySelectorAll(".add-btn")[0].addEventListener("click", () => {
    fetch(config.url + "gpu")
    .then(response => response.json())
    .then(data => {
        document.getElementById("storage-model").value = "click";
    })
});
