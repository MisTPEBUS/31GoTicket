
import {
    initLiff
} from "../liff/liff-init.js";

const API_BASE_URL =
    "https://9f4d-59-124-220-148.ngrok-free.app";
let html5QrCode = null;
let isScanningLocked = false;
let scanResultTimer = null;
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

        renderPage(
            activity,
            userId
        );

        document
            .getElementById(
                "profileButton"
            )
            ?.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "./info.html";
                }
            );

        document
            .querySelectorAll(".navigateButton")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const name =
                            button.dataset.name;

                        const googleMapUrl =
                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;

                        liff.openWindow({
                            url: googleMapUrl,
                            external: true
                        });


                    }
                );
            });



        /*
        |--------------------------------------------------------------------------
        | 綁定 QRCode 掃描
        |--------------------------------------------------------------------------
        */
        const checkBtn =
            document.getElementById(
                "checkBtn"
            );

        if (checkBtn) {

            checkBtn.addEventListener(
                "click",
                async () => {

                    console.log(
                        "checkBtn clicked"
                    );

                    await openScanner(
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
document
    .getElementById("closeScanner")
    .addEventListener("click", closeScanner);
async function closeScanner() {

    const modal = document
        .getElementById(
            "scannerModal"
        );
    modal.classList.remove(
        "flex"
    );
    modal.classList.add(
        "hidden"
    );

    if (html5QrCode) {

        try {

            await html5QrCode.stop();
            await html5QrCode.clear();
            html5QrCode = null;

        } catch {

        }

        html5QrCode = null;
    }
}

/*
|--------------------------------------------------------------------------
| 掃描 QRCode
|--------------------------------------------------------------------------
*/


async function openScanner(
    lineUserId
) {
    resetScanState();
    isScanningLocked =
        false;
    const modal =
        document.getElementById(
            "scannerModal"
        );

    modal.classList.remove(
        "hidden"
    );

    modal.classList.add(
        "flex"
    );

    if (html5QrCode) {

        try {
            await html5QrCode.stop();
        } catch { }

        try {
            await html5QrCode.clear();
        } catch { }

        html5QrCode = null;
    }

    html5QrCode =
        new Html5Qrcode(
            "reader"
        );

    const qrSize =
        Math.min(
            window.innerWidth * 0.8,
            320
        );

    await html5QrCode.start(
        {
            facingMode:
                "environment"
        },
        {
            fps: 10,
            qrbox: {
                width: qrSize,
                height: qrSize
            }
        },
        async decodedText => {

            if (isScanningLocked) {
                return;
            }

            isScanningLocked =
                true;

            await closeScanner();

            await handleScanResult(
                lineUserId,
                decodedText
            );
        }
    );
}

async function handleScanResult(
    lineUserId,
    qrValue
) {
    let spot = "";

    try {

        const url =
            new URL(
                qrValue
            );

        spot =
            url.searchParams.get(
                "spot"
            ) || "";

    }
    catch {

        showScanError(
            "QRCode 格式錯誤"
        );

        scanResultTimer =
            setTimeout(
                () => {

                    resetScanState();

                },
                3000
            );

        return;
    }

    console.log(
        "spot:",
        spot
    );

    if (!spot) {

        showScanError(
            "QRCode 缺少景點參數"
        );

        scanResultTimer =
            setTimeout(
                () => {

                    resetScanState();

                },
                3000
            );

        return;
    }

    const response =
        await fetch(
            `${API_BASE_URL}/api/activity/spot-check/${lineUserId}/${spot}`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                    "ngrok-skip-browser-warning":
                        "true"
                }
            }
        );

    const data =
        await response.json();

    if (data.success) {

        showScanSuccess(
            data.message ||
            "景點打卡完成"
        );

        scanResultTimer =
            setTimeout(
                async () => {

                    const activity =
                        await fetchActivity(
                            lineUserId
                        );

                    renderPage(
                        activity,
                        lineUserId
                    );

                    resetScanState();

                },
                3000
            );

        return;
    }

    showScanError(
        data.message ||
        "打卡失敗"
    );

    scanResultTimer =
        setTimeout(
            () => {

                resetScanState();

            },
            3000
        );
}

function hideScanResultModal() {

    const modal =
        document.getElementById(
            "scanResultModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "flex"
    );

    modal.classList.add(
        "hidden"
    );
    if (scanResultTimer) {

        clearTimeout(
            scanResultTimer
        );

        scanResultTimer =
            null;
    }
}
function renderReward(
    activity
) {

    const rewardBox =
        document.getElementById(
            "rewardBox"
        );

    const completedCount =
        activity.spots.filter(
            spot =>
                spot.status ===
                "COMPLETED"
        ).length;

    const totalCount =
        activity.spots.length;

    const canClaim =
        completedCount === totalCount &&
        activity.status?.toLowerCase() ===
        "active";

    rewardBox.innerHTML =
        canClaim
            ? `
            <div class="mt-6 bg-white rounded-3xl shadow p-6 text-center">

                <h2 class="text-xl font-bold mb-2">
                    活動獎勵
                </h2>

                <p class="text-emerald-600 mb-4 font-medium">
                    恭喜完成所有景點集章
                </p>

                <button
                    id="rewardButton"
                    class="
                        w-full
                        bg-gradient-to-r
                        from-emerald-500
                        to-green-600
                        text-white
                        py-3
                        rounded-2xl
                        font-bold
                    "
                >
                    前往領獎
                </button>

            </div>
            `
            : `
            <div class="mt-6 bg-white rounded-3xl shadow p-6 text-center">

                <h2 class="text-xl font-bold mb-2">
                    活動獎勵
                </h2>

                <p class="text-gray-500 mb-4">
                    完成全部景點即可兌換限量紀念禮
                </p>

                <button
                    class="
                        w-full
                        bg-gray-300
                        text-gray-500
                        py-3
                        rounded-2xl
                        cursor-not-allowed
                    "
                    disabled
                >
                    尚未達成領獎資格
                </button>

            </div>
            `;
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
                    `https://www.google.com/maps/search/?api=1&query=${spot.name}`;

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
                         w-full
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
                           data-name="${spot.name}"
                            class="
                                navigateButton
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

function openSpotCheckModal() {

    document
        .getElementById(
            "spotCheckModal"
        )
        .classList.remove(
            "hidden"
        );

    document
        .getElementById(
            "spotCheckModal"
        )
        .classList.add(
            "flex"
        );
}

function closeSpotCheckModal() {

    document
        .getElementById(
            "spotCheckModal"
        )
        .classList.remove(
            "flex"
        );

    document
        .getElementById(
            "spotCheckModal"
        )
        .classList.add(
            "hidden"
        );
}


/*
|--------------------------------------------------------------------------
| 成功
|--------------------------------------------------------------------------
*/

function showSuccess(message) {

    document
        .getElementById("loading")
        .classList.add("hidden");

    document
        .getElementById("successBox")
        .classList.remove("hidden");

    document
        .getElementById("successMessage")
        .innerText =
        message;

    /*
    |--------------------------------------------------------------------------
    | redirect
    |--------------------------------------------------------------------------
    */

    setTimeout(() => {



    }, 2000);
}

/*
|--------------------------------------------------------------------------
| 失敗
|--------------------------------------------------------------------------
*/

function showError(message) {

    document
        .getElementById("loading")
        .classList.add("hidden");

    document
        .getElementById("errorBox")
        .classList.remove("hidden");

    document
        .getElementById("errorMessage")
        .innerText =
        message;

    /*
    |--------------------------------------------------------------------------
    | redirect
    |--------------------------------------------------------------------------
    */

    setTimeout(() => {



    }, 2000);
}

function renderPage(activity,
    userId) {

    renderHeroStatus(activity);

    renderSpotList(activity);

    renderSpotCarousel(activity);

    renderReward(activity);

    bindEvents(userId, activity);
}
function bindEvents(
    userId,
    activity
) {
    const checkBtn =
        document.getElementById(
            "checkBtn"
        );

    if (checkBtn) {

        checkBtn.onclick =
            async () => {

                await openScanner(
                    userId
                );
            };
    }

    document
        .querySelectorAll(
            ".navigateButton"
        )
        .forEach(button => {

            button.onclick =
                () => {

                    const name =
                        button.dataset.name;

                    const url =
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;

                    liff.openWindow({
                        url,
                        external: true
                    });
                };
        });
    const rewardButton =
        document.getElementById(
            "rewardButton"
        );

    if (rewardButton) {

        rewardButton.onclick =
            async () => {

                try {

                    rewardButton.disabled =
                        true;

                    rewardButton.innerText =
                        "處理中...";

                    /* const response =
                        await fetch(
                            `${API_BASE_URL}/api/activity/user-activities/complete/${activity.userActivityId}`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "ngrok-skip-browser-warning":
                                        "true"
                                }
                            }
                        );

                    const data =
                        await response.json();

                    if (!response.ok) {

                        alert(
                            data.message ||
                            "領獎失敗"
                        );

                        rewardButton.disabled =
                            false;

                        rewardButton.innerText =
                            "前往領獎";

                        return;
                    } */

                    window.location.href =
                        `./info.html?userActivityId=${activity.userActivityId}`;

                } catch (error) {

                    console.error(
                        error
                    );

                    alert(
                        "系統忙碌中"
                    );

                    rewardButton.disabled =
                        false;

                    rewardButton.innerText =
                        "前往領獎";
                }
            };
    }
}

async function fetchActivity(userId) {

    const response =
        await fetch(
            `${API_BASE_URL}/api/activity/user-activities/${userId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true"
                }
            }
        );

    if (!response.ok) {
        throw new Error("活動資料讀取失敗");
    }

    return await response.json();
}

function showScanSuccess(
    message
) {

    showScanResultModal(
        true,
        "打卡成功",
        message || "景點打卡完成"
    );
}

function showScanError(
    message
) {

    showScanResultModal(
        false,
        message,
        "請確認 QRCode 是否正確或是已經打卡成功"
    );
}

function showScanResultModal(
    success,
    title,
    message
) {
    if (scanResultTimer) {

        clearTimeout(
            scanResultTimer
        );

        scanResultTimer =
            null;
    }
    const modal =
        document.getElementById(
            "scanResultModal"
        );

    const resultIcon =
        document.getElementById(
            "resultIcon"
        );

    const resultTitle =
        document.getElementById(
            "resultTitle"
        );

    const resultMessage =
        document.getElementById(
            "resultMessage"
        );

    if (
        !modal ||
        !resultIcon ||
        !resultTitle ||
        !resultMessage
    ) {
        return;
    }

    modal.classList.remove(
        "hidden"
    );

    modal.classList.add(
        "flex"
    );

    resultIcon.innerHTML =
        success
            ? `
                <div
                    class="
                        w-24
                        h-24
                        rounded-full
                        bg-emerald-50
                        border
                        border-emerald-100
                        flex
                        items-center
                        justify-center
                        mx-auto
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-12 h-12 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2.5"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
            `
            : `
                <div
                    class="
                        w-24
                        h-24
                        rounded-full
                        bg-red-50
                        border
                        border-red-100
                        flex
                        items-center
                        justify-center
                        mx-auto
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-12 h-12 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2.5"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>
            `;

    resultTitle.innerText =
        title;

    resultMessage.innerText =
        message;
}

function resetScanState() {

    isScanningLocked =
        false;

    if (scanResultTimer) {

        clearTimeout(
            scanResultTimer
        );

        scanResultTimer =
            null;
    }

    hideScanResultModal();
}