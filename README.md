Ran command: `ls functions/private_courses/ | grep "motor-ramping"`
Viewed 03-unit-motor-ramping.html:1-551

針對 **`03-unit-motor-ramping` (馬達 Ramping 組態設定)** 單元，這是一個結合了「二進位通訊協議 (Binary Protocol)」與「物理安全控制」的高難度單元。

以下是在 **GitHub Classroom** 部署其作業 (Assignments) 的具體建議：

### 1. 範本倉庫 (Template Repo) 配置建議
由於此單元涉及精確的位元組對齊（28 Bytes），建議範本中包含：
*   **📂 `ramping-app.html`**：提供 UI 骨架，但將 `DataView` 的讀寫邏輯改為 `// TODO`。
*   **📂 `test-protocol.js`**：預置一個單元測試，模擬一組 28 位元組的二進位數據，讓學生練習是否能正確解析回數值。
*   **📂 `firmware/main.cpp`**：提供對應的 ESP32 韌體源碼，讓有硬體的學生能進行真實測試。

---

### 2. 作業任務部署細節

#### 任務 1：軟體保險絲 - 前端輸入驗證 (UI Validation)
*   **目標**：防止非法數值（如 PWM 限制設為 999）導致馬達損毀。
*   **Classroom 部署建議**：
    *   **自動評分 (Autograding)**：使用無頭瀏覽器測試（如 Playwright）。
    *   **測試案例**：嘗試在油門限制欄位輸入 `999`。如果「傳送」按鈕沒有被禁用 (Disabled) 或沒有出現紅框警告，則自動評分失敗。這能訓練學生重視「前端第一線安全控管」。

#### 任務 2：二進位橋樑 - 資料結構映射 (DataView Lab)
*   **目標**：精確操作位元組偏移量 (Offset) 與位元編碼格式 (Little-Endian)。
*   **Classroom 部署建議**：
    *   **核心代碼檢核**：
        ```javascript
        // 學生需實作：偏移量 12 應對應到 pwmStartKickT
        view.setInt32(12, parseInt(inputs.pwmStartKickT.value), true); 
        ```
    *   **驗證方式**：學生需撰寫一個 `verify-bytes.js`，將填充好的 `ArrayBuffer` 轉換為十六進位字串（Hex String）並與導師提供的預期結果比對。

#### 任務 3：斷電與超時保護驗證 (Fail-Safe Check)
*   **目標**：驗證韌體的「安全停車」機制。
*   **Classroom 部署建議**：
    *   **操作證明**：由於這涉及物理行為，要求學生提交一段 **GIF 錄影** 或 **序列埠日誌截圖**。
    *   **任務內容**：設定 `controlTimeoutMs` 為 `500ms`，啟動馬達後關閉網頁。截圖需證明馬達在半秒內自動停止（終端機出現 `[SAFETY] Timeout - Motor Stop`）。

---

### 3. 翻轉教室與導師評估指標
*   **教學重難點**：
    *   **Endians (位元組序)**：很多學生會卡在為什麼數據讀出來是亂碼（因為沒設 `true` 開啟 Little-Endian）。
    *   **Struct Alignment (記憶體對齊)**：引導學生思考為什麼 `uint32` 佔 4 個位元組。
*   **評語建議 (Tutor Benchmarks)**：
    *   [ ] **封裝正確性**：DataView 寫入時是否使用了正確的整數型別 (`Int32` vs `Uint32`)？
    *   [ ] **容錯邏輯**：是否處理了「空值」或「非數字」輸入的例外狀況？
    *   [ ] **協議文件化**：是否在 README 中清楚標註了 28 Bytes 分別代表哪些資料項？

這套部署方案能將原本抽象的「二進位協議」轉化為「可測試、可觀察」的具體任務，讓學生在學習 Web 控制硬體時，建立起極致效能與物理安全性併重的觀念。
