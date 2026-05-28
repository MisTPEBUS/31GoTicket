
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
        renderSpotList(activity);
        renderSpotCarousel(activity);
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

        if (!liff.isInClient()) {

            alert(
                "請使用 LINE 開啟活動頁面"
            );

            return;
        }

        const result = await liff.scanCodeV2();
        console.log("scan result:", JSON.stringify(result));
        alert(JSON.stringify(result));

        if (!result || !result.value) {

            alert(
                "未掃描到有效 QRCode"
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

    const NextSPOT = document.getElementById(
        "NextSPOT"
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
    | Progress Bar
    |--------------------------------------------------------------------------
    */

    const progressBar =
        document.getElementById(
            "progressBar"
        );

    let completedCount =
        activity.spots.filter(
            spot =>
                spot.status ===
                "COMPLETED"
        ).length;

    let totalCount =
        activity.spots.length;

    let progressPercent =
        totalCount === 0
            ? 0
            : Math.round(
                (completedCount / totalCount) * 100
            );

    progressBar.style.width =
        `${progressPercent}%`;

    /*
    |--------------------------------------------------------------------------
    | Progress Text
    |--------------------------------------------------------------------------
    */

    let completedText =
        document.getElementById(
            "completedText"
        );

    let remainingText =
        document.getElementById(
            "remainingText"
        );

    completedCount =
        activity.spots.filter(
            spot =>
                spot.status ===
                "COMPLETED"
        ).length;

    totalCount =
        activity.spots.length;

    let remainingCount =
        totalCount - completedCount;

    completedText.innerText =
        `已完成 ${completedCount} 個景點`;

    remainingText.innerText =
        remainingCount <= 0
            ? "已完成全部景點"
            : `尚差 ${remainingCount} 個景點`;
    /*
 |--------------------------------------------------------------------------
 | Next Spot 
 |--------------------------------------------------------------------------
 */



    const pendingSpot =
        activity.spots.find(
            spot =>
                spot.status ===
                "PENDING"
        );

    NextSPOT.innerText =
        pendingSpot?.name || "";

    /*
|--------------------------------------------------------------------------
| Spot Count
|--------------------------------------------------------------------------
*/

    completedCount =
        activity.spots.filter(
            spot =>
                spot.status ===
                "COMPLETED"
        ).length;

    totalCount =
        activity.spots.length;

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



        return;
    }
}



function renderSpotCarousel(activity) {

    const spotCarousel =
        document.getElementById(
            "spotCarousel"
        );

    if (!spotCarousel) {
        return;
    }

    spotCarousel.innerHTML =
        activity.spots.map(
            spot => {

                /*
                |--------------------------------------------------------------------------
                | Google Navigation URL
                |--------------------------------------------------------------------------
                */

                const googleMapUrl =
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.address)}`;

                return `
                <section
                    class="
                        relative
                        overflow-hidden
                        rounded-[32px]
                        bg-white
                        border
                        border-slate-100
                        shadow-xl
                        p-6
                        min-w-full
                        snap-center
                        flex-shrink-0
                    "
                >

                    <div
                        class="
                            absolute
                            top-0
                            right-0
                            w-32
                            h-32
                            bg-sky-50
                            rounded-full
                            blur-3xl
                        "
                    >
                    </div>

                    <div class="relative z-10">

                        <div
                            class="
                                flex
                                items-start
                                justify-between
                            "
                        >

                            <div>

                                <p
                                    class="
                                        text-xs
                                        tracking-[0.2em]
                                        text-slate-400
                                    "
                                >
                                    CURRENT DESTINATION
                                </p>

                                <h2
                                    class="
                                        text-2xl
                                        font-black
                                        mt-3
                                    "
                                >
                                    ${spot.name}
                                </h2>

                                <p
                                    class="
                                        text-sm
                                        text-slate-500
                                        leading-7
                                        mt-3
                                    "
                                >
                                    ${spot.description}
                                </p>

                            </div>

                            <div
                                class="
                                    w-14
                                    h-14
                                    rounded-2xl
                                    bg-[#EDF5FB]
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-7 h-7 text-[#295A86]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="1.8"
                                        d="M19 21H5a2 2 0 01-2-2V7h18v12a2 2 0 01-2 2z"
                                    />

                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="1.8"
                                        d="M16 3v4M8 3v4M3 11h18"
                                    />
                                </svg>

                            </div>

                        </div>

                        <button
                            onclick="
                                window.open(
                                    '${googleMapUrl}',
                                    '_blank'
                                )
                            "
                            class="
                                w-full
                                mt-6
                                rounded-2xl
                                bg-gradient-to-r
                                from-[#183B5B]
                                to-[#2F6998]
                                text-white
                                py-4
                                font-bold
                                tracking-wide
                                shadow-lg
                            "
                        >
                            開始導航
                        </button>

                    </div>

                </section>
                `;
            }
        ).join("");
}




function renderSpotList(activity) {

    const spotList =
        document.getElementById(
            "spotList"
        );

    if (!spotList) {
        return;
    }

    const now =
        new Date();

    const expiredAt =
        new Date(
            activity.expiredAt
                .replace(" ", "T")
        );

    const isExpired =
        expiredAt < now;

    spotList.innerHTML =
        activity.spots.map(
            spot => {


                /*
                |--------------------------------------------------------------------------
                | COMPLETED
                |--------------------------------------------------------------------------
                */

                if (
                    spot.status ===
                    "COMPLETED"
                ) {

                    return `
                    <div
                        class="bg-white rounded-[28px] border border-slate-100 shadow-lg p-5"
                    >

                        <div class="flex items-center justify-between">

                            <div>

                                <p class="text-xs tracking-[0.2em] text-slate-400">
                                    COMPLETED
                                </p>

                                <h3 class="font-black text-lg mt-2">
                                    ${spot.name}
                                </h3>

                                <p class="text-sm text-slate-500 mt-2">
                                    已完成景點集章
                                </p>

                            </div>

                            <div
                                class="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"
                            >

                                ✓

                            </div>

                        </div>

                    </div>
                    `;
                }

                /*
                |--------------------------------------------------------------------------
                | PENDING
                |--------------------------------------------------------------------------
                */
                if (
                    spot.status ===
                    "PENDING"
                ) {

                    return `
                    <div
                        class="bg-gradient-to-br from-[#183B5B] to-[#2C628F] rounded-[30px] shadow-2xl p-5 text-white"
                    >
    
                        <p class="text-xs tracking-[0.2em] text-cyan-100">
                            IN PROGRESS
                        </p>
    
                        <h3 class="text-2xl font-black mt-3">
                            ${spot.name}
                        </h3>
    
                        <p class="text-cyan-100 text-sm leading-7 mt-3">
                            前往現場掃描 QRCode，
                            完成景點集章。
                        </p>
    
                       <button
                           id="scanButton-${spot.spotId}"
                            ${isExpired ? "disabled" : ""}
                            class="
                                mt-6
                                rounded-2xl
                                px-6
                                py-3
                                font-bold
                                shadow-lg
                                transition-all

                                ${isExpired
                            ? `
                                        bg-slate-300
                                        text-slate-500
                                        cursor-not-allowed
                                    `
                            : `
                                        bg-white
                                        text-[#183B5B]
                                    `
                        }
                            "
                        >
                            ${isExpired
                            ? "活動已逾時"
                            : "前往打卡"
                        }
                        </button>

    
                    </div>
                    `;
                }

                if (isExpired) {

                    return `
                <div
                    class="bg-white rounded-2xl shadow p-4 flex items-center justify-between border-2 border-dashed border-gray-300"
                >

                    <div>
                        <p class="text-xs tracking-[0.2em] text-cyan-100">
                                                    TIME EXPIRED
                        </p>
                        <h2
                            class="font-bold text-lg text-gray-400"
                        >
                            ${spot.name}
                        </h2>

                        <p
                            class="text-sm text-gray-400 mt-1"
                        >
                            活動逾時
                        </p>

                    </div>

                    <div
                        class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-red-400 text-xl"
                    >
                        ✕
                    </div>

                </div>
                `;
                }
            }
        ).join("");
}