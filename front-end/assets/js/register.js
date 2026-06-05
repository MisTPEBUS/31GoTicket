import {
    initLiff
} from "../liff/liff-init.js";

const API_BASE_URL =
    "https://9f4d-59-124-220-148.ngrok-free.app";

const CAMPAIGN_ID =
    "2750ef49-8292-42fa-9660-273c46678aad";

let scannerInstance = null;

let currentMode =
    "manual";

let currentProfile =
    null;

/*
|--------------------------------------------------------------------------
| DOM
|--------------------------------------------------------------------------
*/

const manualModeBtn =
    document.getElementById(
        "manualModeBtn"
    );

const scanModeBtn =
    document.getElementById(
        "scanModeBtn"
    );

const manualPanel =
    document.getElementById(
        "manualPanel"
    );

const scanPanel =
    document.getElementById(
        "scanPanel"
    );

const startScanBtn =
    document.getElementById(
        "startScanBtn"
    );

const scannerContainer =
    document.getElementById(
        "scannerContainer"
    );

const ticketNoInput =
    document.getElementById(
        "ticketNoInput"
    );

const resultMessage =
    document.getElementById(
        "resultMessage"
    );

const submitBtn =
    document.getElementById(
        "submitBtn"
    );

const successModal =
    document.getElementById(
        "successModal"
    );

const successText =
    document.getElementById(
        "successText"
    );

const successCloseBtn =
    document.getElementById(
        "successCloseBtn"
    );

/*
|--------------------------------------------------------------------------
| Init
|--------------------------------------------------------------------------
*/

async function init() {

    try {

        currentProfile =
            await initLiff();

        if (!currentProfile) {

            showMessage(
                "LINE 初始化失敗，請重新開啟頁面。"
            );

            return;
        }

        console.log(
            currentProfile
        );

        await checkCurrentActivity();

        bindEvents();

    }
    catch (error) {

        console.error(
            error
        );

        showMessage(
            "LIFF 初始化失敗"
        );
    }
}

init();

/*
|--------------------------------------------------------------------------
| Current Activity
|--------------------------------------------------------------------------
*/

async function checkCurrentActivity() {

    const response =
        await fetch(
            `${API_BASE_URL}/api/activity/current/${currentProfile.userId}`,
            {
                method: "GET",

                headers: {
                    "Content-Type":
                        "application/json",

                    "ngrok-skip-browser-warning":
                        "true"
                }
            }
        );

    if (!response.ok) {

        showMessage(
            "活動狀態讀取失敗"
        );

        return;
    }

    const data =
        await response.json();

    console.log(
        "current activity",
        data
    );

    /*
    如果要阻擋已參加活動者，再打開：

    if (data.status && data.status !== "NONE") {
        window.location.href =
            "./progress.html";
    }
    */
}

/*
|--------------------------------------------------------------------------
| Events
|--------------------------------------------------------------------------
*/

function bindEvents() {

    manualModeBtn?.addEventListener(
        "click",
        () => {

            switchMode(
                "manual"
            );
        }
    );

    scanModeBtn?.addEventListener(
        "click",
        () => {

            switchMode(
                "scan"
            );
        }
    );

    ticketNoInput?.addEventListener(
        "input",
        formatTicketNo
    );

    startScanBtn?.addEventListener(
        "click",
        startScanner
    );

    submitBtn?.addEventListener(
        "click",
        submitRegister
    );

    successCloseBtn?.addEventListener(
        "click",
        () => {

            successModal.classList.add(
                "hidden"
            );

            window.location.href =
                `./progress.html?campaignId=${CAMPAIGN_ID}`;
        }
    );
}

/*
|--------------------------------------------------------------------------
| Mode Switch
|--------------------------------------------------------------------------
*/

function switchMode(
    mode
) {

    currentMode =
        mode;

    if (mode === "manual") {

        manualPanel.classList.remove(
            "hidden"
        );

        scanPanel.classList.add(
            "hidden"
        );

        manualModeBtn.className =
            "h-12 rounded-2xl bg-white text-[#2C6E9B] font-black shadow-sm transition";

        scanModeBtn.className =
            "h-12 rounded-2xl text-slate-500 font-black transition";

        return;
    }

    scanPanel.classList.remove(
        "hidden"
    );

    manualPanel.classList.add(
        "hidden"
    );

    scanModeBtn.className =
        "h-12 rounded-2xl bg-white text-[#2C6E9B] font-black shadow-sm transition";

    manualModeBtn.className =
        "h-12 rounded-2xl text-slate-500 font-black transition";
}

/*
|--------------------------------------------------------------------------
| Ticket Format
|--------------------------------------------------------------------------
*/

function formatTicketNo() {

    ticketNoInput.value =
        ticketNoInput
            .value
            .toUpperCase()
            .replace(
                /[^A-Z0-9]/g,
                ""
            )
            .slice(
                0,
                10
            );
}

function getOrderNo() {

    const ticketNumber =
        ticketNoInput
            .value
            .trim()
            .toUpperCase();

    return `PO-${ticketNumber}`;
}

function isValidOrderNo(
    orderNo
) {

    return /^PO-[A-Z0-9]{10}$/.test(
        orderNo
    );
}

/*
|--------------------------------------------------------------------------
| Scanner
|--------------------------------------------------------------------------
*/

async function startScanner() {

    try {

        scannerContainer.classList.remove(
            "hidden"
        );

        scannerContainer.scrollIntoView({
            behavior:
                "smooth",

            block:
                "center"
        });

        startScanBtn.disabled =
            true;

        startScanBtn.innerText =
            "掃描中...";

        if (scannerInstance) {

            await stopScanner();
        }

        scannerInstance =
            new Html5Qrcode(
                "reader"
            );

        await scannerInstance.start(
            {
                facingMode:
                    "environment"
            },
            {
                fps: 10,
                qrbox: 240
            },
            handleScanSuccess
        );

    }
    catch (error) {

        console.error(
            error
        );

        showMessage(
            "無法開啟相機，請確認瀏覽器權限。"
        );

        startScanBtn.disabled =
            false;

        startScanBtn.innerText =
            "開啟相機掃描";
    }
}

async function handleScanSuccess(
    decodedText
) {

    const orderNo =
        parseTicketNo(
            decodedText
        );

    const ticketNumber =
        orderNo.replace(
            /^PO-/,
            ""
        );

    ticketNoInput.value =
        ticketNumber;

    showMessage(
        `已掃描票號：${orderNo}`
    );

    await stopScanner();

    scannerContainer.classList.add(
        "hidden"
    );

    startScanBtn.disabled =
        false;

    startScanBtn.innerText =
        "重新掃描";

    switchMode(
        "manual"
    );
}

function parseTicketNo(
    decodedText
) {

    let value =
        decodedText
            .trim()
            .toUpperCase();

    try {

        const url =
            new URL(
                value
            );

        const ticketNo =
            url
                .searchParams
                .get(
                    "ticketNo"
                );

        if (ticketNo) {

            value =
                ticketNo
                    .trim()
                    .toUpperCase();
        }

    }
    catch {
    }

    if (
        value.startsWith(
            "PO-"
        )
    ) {

        return value;
    }

    return `PO-${value}`;
}

async function stopScanner() {

    if (!scannerInstance) {
        return;
    }

    try {

        await scannerInstance.stop();

    }
    catch {
    }

    try {

        await scannerInstance.clear();

    }
    catch {
    }

    scannerInstance =
        null;
}

/*
|--------------------------------------------------------------------------
| Submit
|--------------------------------------------------------------------------
*/

async function submitRegister() {

    hideMessage();

    const orderNo =
        getOrderNo();

    if (
        !isValidOrderNo(
            orderNo
        )
    ) {

        showMessage(
            "請輸入正確票號格式：PO-xxxxxxxxxx"
        );

        return;
    }

    if (!currentProfile) {

        showMessage(
            "LINE 使用者資料讀取失敗，請重新開啟頁面。"
        );

        return;
    }

    submitBtn.disabled =
        true;

    submitBtn.innerText =
        "註冊中...";

    const payload = {
        LineUserId:
            currentProfile.userId,

        Name:
            currentProfile.displayName,

        OrderNo:
            orderNo,

        TicketNo:
            orderNo,

        CampaignId:
            CAMPAIGN_ID
    };

    console.log(
        "register payload",
        payload
    );

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/activity/register`,
                {
                    method:
                        "POST",

                    headers:
                    {
                        "Content-Type":
                            "application/json",

                        "ngrok-skip-browser-warning":
                            "true"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            showMessage(
                result.message ||
                "報名失敗"
            );

            return;
        }

        if (result.success === false) {

            showMessage(
                result.message ||
                "報名失敗"
            );

            return;
        }

        successText.innerText =
            result.message ||
            `車票號碼 ${orderNo} 已完成註冊。`;

        successModal.classList.remove(
            "hidden"
        );

    }
    catch (error) {

        console.error(
            error
        );

        showMessage(
            "系統發生錯誤，請稍後再試。"
        );
    }
    finally {

        submitBtn.disabled =
            false;

        submitBtn.innerText =
            "確認註冊";
    }
}

/*
|--------------------------------------------------------------------------
| UI
|--------------------------------------------------------------------------
*/

function showMessage(
    message
) {

    resultMessage.innerText =
        message;

    resultMessage.classList.remove(
        "hidden"
    );
}

function hideMessage() {

    resultMessage.innerText =
        "";

    resultMessage.classList.add(
        "hidden"
    );
}