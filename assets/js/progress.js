
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
        renderReward(activity, userId);

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


        document
            .querySelectorAll("[id^='scanButton-']")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const spotId =
                            button.id.replace(
                                "scanButton-",
                                ""
                            );

                        console.log(
                            "spotId:",
                            spotId
                        );

                        await handleScanQRCode(
                            userId,
                            spotId
                        );
                    }
                );
            });



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
    lineUserId,
    spotId
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


        const result =
            await liff.scanCodeV2();

        console.log(
            "scan result:",
            result
        );




        if (!result || !result.value) {

            alert(
                "未掃描到有效 QRCode"
            );

            return;
        }


        const qrValue =
            result.value;

        console.log(qrValue);

        /*
        |--------------------------------------------------------------------------
        | parse url
        |--------------------------------------------------------------------------
        */

        const url =
            new URL(qrValue);

        const spot =
            url.searchParams.get("spot");






        /*
        |--------------------------------------------------------------------------
        | 送 API
        |--------------------------------------------------------------------------
        */

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
                    },

                    body: JSON.stringify({
                        lineUserId,
                        spotToken:
                            spot
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

            document
                .getElementById(
                    "modalLoading"
                )
                .classList.add("hidden");

            document
                .getElementById(
                    "modalSuccess"
                )
                .classList.remove("hidden");

            document
                .getElementById(
                    "modalSuccessMessage"
                )
                .innerText =
                data.message;

            setTimeout(() => {

                setTimeout(async () => { closeSpotCheckModal(); await fetchActivity(); }, 1000);
            }, 1000);



            return;

        }

        /*
        |--------------------------------------------------------------------------
        | 失敗
        |--------------------------------------------------------------------------
        */
        else {
            alert(
                data.message ||
                "打卡失敗"
            );

            document
                .getElementById(
                    "modalLoading"
                )
                .classList.add("hidden");

            document
                .getElementById(
                    "modalError"
                )
                .classList.remove("hidden");

            document
                .getElementById(
                    "modalErrorMessage"
                )
                .innerText =
                data.message;


        }



        init();
    } catch (error) {

        console.error(error);


        alert(
            `QRCode 掃描失敗: ${error.message || error
            }`
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


function renderReward(
    activity,
    userId
) {

    const rewardButton =
        document.getElementById(
            "rewardButton"
        );

    const completedCount =
        activity.spots.filter(
            spot => spot.status === "COMPLETED"
        ).length;

    const totalCount =
        activity.spots.length;

    const isCompleted =
        completedCount === totalCount;

    if (!isCompleted) {

        rewardButton.disabled = true;

        rewardButton.className =
            "w-full bg-gray-300 text-gray-500 py-3 rounded-2xl cursor-not-allowed";

        rewardButton.innerText =
            "尚未達成領獎資格";

        return;
    }

    rewardButton.disabled = false;

    rewardButton.className =
        "w-full bg-emerald-600 text-white py-3 rounded-2xl";

    rewardButton.innerText =
        "立即領獎";

    rewardButton.onclick =
        () => openRewardModal(userId);
}

async function openRewardModal(
    userId
) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/reward/${userId}`,
                {
                    headers: {
                        "ngrok-skip-browser-warning":
                            "true"
                    }
                }
            );

        if (!response.ok) {

            alert("QRCode 取得失敗");

            return;
        }

        const result =
            await response.json();

        document
            .getElementById(
                "rewardQrImage"
            )
            .src =
            result.qrCodeUrl;

        document
            .getElementById(
                "rewardModal"
            )
            .classList.remove(
                "hidden"
            );

        document
            .getElementById(
                "rewardModal"
            )
            .classList.add(
                "flex"
            );

    } catch (error) {

        console.error(error);

        alert("QRCode 取得失敗");
    }
}
document
    .getElementById(
        "closeRewardModal"
    )
    ?.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "rewardModal"
                )
                .classList.remove(
                    "flex"
                );

            document
                .getElementById(
                    "rewardModal"
                )
                .classList.add(
                    "hidden"
                );
        }
    );

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