# Cubo Homework

## 題目描述

使用 Node.js 編寫一組 Restful API service，API endpoint 與 HTTP method

|METHOD| ROUTER|
|:-|:-|
|`POST`| /heartbeat/**<device_id>** |
|`GET` | /device/**<device_id>** |
|`GET` | /devices/ |

其中 <device_id> 為一個 UUID，每台 Cubo 裝置會有一個唯一且不重複的 <device_id> ，例如 `5F14A5A8-4A7E-4386-B54F-D01649D33710`

為了能夠在 Cubo 離線時透過推播通知使用者，假設每台 Cubo 裝置，每五分鐘會透過 `POST` **/heartbeat/<device_id>** 來更新該 Cubo 裝置是否持續在線上，如果有其中一台 Cubo 裝置在超過兩次沒有更新 heartbeat 的值時，API service 會主動呼叫另外一個 webhook ，並將該裝置的 device_id 以及上次更新 heartbeat 時間傳給 webhook，在呼叫兩次 webhook 後即停止呼叫，避免一直 spam 用戶造成困擾。直到下次 Cubo 裝置重新上線又離線時，API service 才會再次呼叫 webhook。

Webhook 網址:
https://5qaeek7sj0.execute-api.us-east-1.amazonaws.com/dev/webhook?device_id=<device_id>&last_udpated=<UTC_ISO_8601_format>

另外一個 API `GET` **/device/<device_id>** 用來取得目前該 device_id 是否在線上，如果不在線上，則回傳上次更新的時間戳記

`GET` **/devices/** 用來取得目前所有裝置的連線狀況，包含是否在線上，以及上次更新的時間。

該 webhook 會檢查參數，如果參數正確即回傳 status code 200
last_updated 參數請用 UTC time, ISO 8601 格式

## 作業要求

1. 請以 *Node.js* 實作該 Restful API service ，資料庫請採用 *redis* 來作設計
2. API 回傳皆採 *JSON* 格式 (請自行定義)，錯誤處理請 follow Restful API 設計原則 (HTTP response code)
3. 使用 *docker* container 包裝佈署
4. 請編寫你認為有需要的 *unit test* 程式碼
5. 編寫一個可以模擬 3000 個 Cubo 裝置的 client 在不同時間呼叫 /heartbeat API 用來測試 service 的正常運作 (optional)
