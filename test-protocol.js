/**
 * 單元 03：二進位協議測試腳本
 * 用於驗證學生實作的 DataView 映射是否正確對齊 28 Bytes
 */

function verifyProtocol(buffer) {
    const view = new DataView(buffer);
    
    if (buffer.byteLength !== 28) {
        console.error(`❌ 長度錯誤：預期 28 Bytes，實際收到 ${buffer.byteLength} Bytes`);
        return false;
    }

    const results = [
        { name: "maxPwmLimit", offset: 0, expected: 255 },
        { name: "minPwmLimit", offset: 4, expected: 0 },
        { name: "accelStep", offset: 8, expected: 5 },
        { name: "pwmStartKickT", offset: 12, expected: 40 },
        { name: "decelStep", offset: 16, expected: 10 },
        { name: "controlTimeoutMs", offset: 20, expected: 500 },
        { name: "idleWaitMs", offset: 24, expected: 30000 }
    ];

    let allPassed = true;
    console.log("--- 協議解析測試中 ---");

    results.forEach(test => {
        const val = view.getInt32(test.offset, true);
        if (val === test.expected) {
            console.log(`✅ ${test.name.padEnd(18)}: 偏移量 ${test.offset.toString().padStart(2)} | 數值 ${val}`);
        } else {
            console.error(`❌ ${test.name.padEnd(18)}: 偏移量 ${test.offset.toString().padStart(2)} | 預期 ${test.expected}, 實際收到 ${val}`);
            allPassed = false;
        }
    });

    return allPassed;
}

// 模擬學生實作的資料輸入
const mockInputs = {
    maxPwmLimit: 255,
    minPwmLimit: 0,
    accelStep: 5,
    pwmStartKickT: 40,
    decelStep: 10,
    controlTimeoutMs: 500,
    idleWaitMs: 30000
};

// 模擬學生應寫的 DataView 邏輯
function studentImplementation(inputs) {
    const buffer = new ArrayBuffer(28);
    const view = new DataView(buffer);
    
    // 學生需填充此處
    view.setInt32(0, inputs.maxPwmLimit, true);
    view.setInt32(4, inputs.minPwmLimit, true);
    view.setInt32(8, inputs.accelStep, true);
    view.setInt32(12, inputs.pwmStartKickT, true);
    view.setInt32(16, inputs.decelStep, true);
    view.setInt32(20, inputs.controlTimeoutMs, true);
    view.setInt32(24, inputs.idleWaitMs, true);
    
    return buffer;
}

// 執行測試
const buffer = studentImplementation(mockInputs);
const success = verifyProtocol(buffer);

if (success) {
    console.log("\n🎉 恭喜！二進位橋樑測試通過！你的偏移量與位元編碼完全正確。");
} else {
    console.log("\n⚠️ 測試失敗，請檢查 DataView 的偏移量 (Offset) 或 Little-Endian 設定。");
}
