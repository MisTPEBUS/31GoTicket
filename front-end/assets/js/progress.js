
import {
    initLiff
} from "../liff/liff-init.js";

const API_BASE_URL =
    "https://9f4d-59-124-220-148.ngrok-free.app";

/*
|--------------------------------------------------------------------------
| 初始化
|--------------------------------------------------------------------------
*/

async function init() {

    try {

        const profile =
            await initLiff();

        if (!profile) {
            return;
        }

        console.log(profile);

        const userId =
            profile.userId;

        /*
        |--------------------------------------------------------------------------
        | 讀取活動資料
        |--------------------------------------------------------------------------
        */

        const response =
            await fetch(
                `${API_BASE_URL}/api/activity/user-activities/${userId}`,
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

            alert(
                "活動資料讀取失敗"
            );

            return;
        }

        const activity =
            await response.json();

        console.log(activity);
        renderHeroStatus(activity);
        /*
        |--------------------------------------------------------------------------
        | 綁定 QRCode 掃描
        |--------------------------------------------------------------------------
        */

        const scanButton =
            document.getElementById(
                "scanButton"
            );

        if (scanButton) {

            scanButton
                .addEventListener(
                    "click",
                    async () => {

                        await handleScanQRCode(
                            userId
                        );
                    }
                );
        }

    } catch (error) {

        console.error(error);

        alert(
            "LIFF 初始化失敗"
        );
    }
}

init();

/*
|--------------------------------------------------------------------------
| 掃描 QRCode
|--------------------------------------------------------------------------
*/

async function handleScanQRCode(
    lineUserId
) {

    try {

        /*
        |--------------------------------------------------------------------------
        | LINE QRCode Scan
        |--------------------------------------------------------------------------
        */

        const result =
            await liff.scanCodeV2();

        console.log(result);
        alert(result.value);

        /*
        |--------------------------------------------------------------------------
        | 掃描結果
        |--------------------------------------------------------------------------
        */

        const qrValue =
            result.value;

        if (!qrValue) {

            alert(
                "未掃描到 QRCode"
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | 送 API
        |--------------------------------------------------------------------------
        */

        const response =
            await fetch(
                `${API_BASE_URL}/api/spot-check`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "ngrok-skip-browser-warning":
                            "true"
                    },

                    body: JSON.stringify({
                        lineUserId,
                        spotToken:
                            qrValue
                    })
                }
            );

        const data =
            await response.json();

        console.log(data);

        /*
        |--------------------------------------------------------------------------
        | 成功
        |--------------------------------------------------------------------------
        */

        if (data.success) {

            alert(
                data.message ||
                "打卡成功"
            );

            window.location.reload();

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | 失敗
        |--------------------------------------------------------------------------
        */

        alert(
            data.message ||
            "打卡失敗"
        );

    } catch (error) {

        console.error(error);

        alert(
            $`QRCode 掃描失敗:{error.message || error}`
        );
    }
}

function renderHeroStatus(activity) {

    const heroCard =
        document.getElementById(
            "heroCard"
        );

    const heroLabel =
        document.getElementById(
            "heroLabel"
        );

    const heroTitle =
        document.getElementById(
            "heroTitle"
        );

    /*
    |--------------------------------------------------------------------------
    | 狀態判斷
    |--------------------------------------------------------------------------
    */

    const now =
        new Date();

    const expiredAt =
        new Date(
            activity.expiredAt
                .replace(" ", "T")
        );

    /*
    |--------------------------------------------------------------------------
    | 已逾時
    |--------------------------------------------------------------------------
    */

    if (expiredAt < now) {

        heroLabel.innerText =
            "ACTIVITY EXPIRED";

        heroTitle.innerText =
            "已逾時";

        heroCard.className =
            `
            relative overflow-hidden
            rounded-[32px]
            bg-gradient-to-br
            from-slate-700
            via-slate-800
            to-black
            shadow-2xl
            border border-white/10
            `;

        return;
    }

    /*
    |--------------------------------------------------------------------------
    | 待核可
    |--------------------------------------------------------------------------
    */

    if (
        activity.status
            .toLowerCase()
        === "pending"
    ) {

        heroLabel.innerText =
            "PENDING APPROVAL";

        heroTitle.innerText =
            "待核可";

        heroCard.className =
            `
            relative overflow-hidden
            rounded-[32px]
            bg-gradient-to-br
            from-amber-500
            via-orange-500
            to-red-500
            shadow-2xl
            border border-white/10
            `;

        return;
    }

    /*
    |--------------------------------------------------------------------------
    | 活動進行中
    |--------------------------------------------------------------------------
    */

    if (
        activity.status
            .toLowerCase()
        === "active"
    ) {

        heroLabel.innerText =
            "ACTIVITY PROGRESS";

        heroTitle.innerText =
            "活動進行中";

        heroCard.className =
            `
            relative overflow-hidden
            rounded-[32px]
            bg-gradient-to-br
            from-cyan-500
            via-sky-600
            to-indigo-700
            shadow-2xl
            border border-white/10
            `;

        return;
    }
}