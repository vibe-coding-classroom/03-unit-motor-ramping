#include <Arduino.h>

/**
 * 單元 03：馬達 Ramping 韌體模板
 * 
 * 安全聲明：此韌體包含「軟體超時保護」機制。
 * 如果在 controlTimeoutMs 內未收到新指令，馬達將強制停止。
 */

// 定義與前端對齊的 28 位元組資料結構
struct __attribute__((packed)) RampingConfig {
    int32_t maxPwmLimit;       // Offset 0
    int32_t minPwmLimit;       // Offset 4
    int32_t accelStep;        // Offset 8
    int32_t pwmStartKickT;    // Offset 12
    int32_t decelStep;        // Offset 16
    int32_t controlTimeoutMs; // Offset 20
    int32_t idleWaitMs;       // Offset 24
};

RampingConfig currentConfig;
unsigned long lastCommandTime = 0;
bool isMotorRunning = false;

// 模擬馬達控制
void stopMotor() {
    if (isMotorRunning) {
        Serial.println("[SAFETY] Timeout - Motor Stop");
        // digitalWrite(MOTOR_PIN, LOW); // 實際硬體控制
        isMotorRunning = false;
    }
}

void setup() {
    Serial.begin(115200);
    Serial.println("Unit 03: Motor Ramping Firmware Initialized");
    
    // 初始化預設組態
    currentConfig.controlTimeoutMs = 500; // 預設 500ms
}

void loop() {
    // 檢查二進位資料輸入 (假設從 Serial 接收)
    if (Serial.available() >= sizeof(RampingConfig)) {
        Serial.readBytes((char*)&currentConfig, sizeof(RampingConfig));
        
        Serial.println("--- Received New Config ---");
        Serial.printf("Max PWM: %d\n", currentConfig.maxPwmLimit);
        Serial.printf("Kick Force: %d\n", currentConfig.pwmStartKickT);
        Serial.printf("Timeout: %d ms\n", currentConfig.controlTimeoutMs);
        
        lastCommandTime = millis();
        isMotorRunning = true;
    }

    // 任務 3：斷電與超時保護驗證
    if (isMotorRunning && (millis() - lastCommandTime > currentConfig.controlTimeoutMs)) {
        stopMotor();
    }
    
    delay(10);
}
