import {
    initLiff
} from "../liff/liff-init.js";

let html5QrCode = null;

const startScanBtn =
    document.getElementById(
        "startScanBtn"
    );

const scanner =
    document.getElementById(
        "scanner"
    );

const scanResult =
    document.getElementById(
        "scanResult"
    );

const confirmModal =
    document.getElementById(
        "confirmModal"
    );

const cancelBtn =
    document.getElementById(
        "cancelBtn"
    );

const confirmBtn =
    document.getElementById(
        "confirmBtn"
    );

let currentQrCode =
    null;

/*
|--------------------------------------------------------------------------
| Init
|--------------------------------------------------------------------------
*/

async function init() {

    try {

        const profile =
            await initLiff();

        console.log(
            "profile",
            profile
        );

    }
    catch (error) {

        console.error(
            error
        );
    }
}

init();

/*
|--------------------------------------------------------------------------
| Start Scanner
|--------------------------------------------------------------------------
*/

startScanBtn?.addEventListener(
    "click",
    startScanner
);

async function startScanner() {

    try {

        scanner.classList.remove(
            "hidden"
        );

        startScanBtn.disabled =
            true;

        startScanBtn.innerText =
            "掃描中...";

        html5QrCode =
            new Html5Qrcode(
                "scanner"
            );

        await html5QrCode.start(
            {
                facingMode:
                    "environment"
            },
            {
                fps: 10,
                qrbox: 240,
                aspectRatio: 1
            },
            onScanSuccess
        );

    }
    catch (error) {

        console.error(
            error
        );

        alert(
            "無法開啟相機"
        );
    }
}

/*
|--------------------------------------------------------------------------
| Scan Success
|--------------------------------------------------------------------------
*/

async function onScanSuccess(
    decodedText
) {

    try {

        currentQrCode =
            decodedText;

        scanResult.innerText =
            decodedText;

        if (html5QrCode) {

            await html5QrCode.stop();
        }

        /*
        TODO

        API:
        POST /api/checkin/verify

        decodedText
        */

        showConfirmModal({
            activityCode:
                "00001234",

            userName:
                "王小明",

            spotName:
                "鶯歌陶瓷博物館"
        });

    }
    catch (error) {

        console.error(
            error
        );
    }
}

/*
|--------------------------------------------------------------------------
| Confirm Modal
|--------------------------------------------------------------------------
*/

function showConfirmModal(
    data
) {

    document
        .getElementById(
            "modalActivityCode"
        )
        .innerText =
        data.activityCode;

    document
        .getElementById(
            "modalName"
        )
        .innerText =
        data.userName;

    document
        .getElementById(
            "modalSpot"
        )
        .innerText =
        data.spotName;

    confirmModal
        .classList
        .remove(
            "hidden"
        );
}

function closeConfirmModal() {

    confirmModal
        .classList
        .add(
            "hidden"
        );
}

/*
|--------------------------------------------------------------------------
| Cancel
|--------------------------------------------------------------------------
*/

cancelBtn?.addEventListener(
    "click",
    async () => {

        closeConfirmModal();

        await restartScanner();

    }
);

/*
|--------------------------------------------------------------------------
| Confirm Redeem
|--------------------------------------------------------------------------
*/

confirmBtn?.addEventListener(
    "click",
    async () => {

        try {

            confirmBtn.disabled =
                true;

            confirmBtn.innerText =
                "核銷中...";

            /*
            TODO

            POST
            /api/checkin/redeem

            currentQrCode
            */

            closeConfirmModal();

            showSuccessPage();

        }
        catch (error) {

            console.error(
                error
            );

            alert(
                "核銷失敗"
            );
        }
        finally {

            confirmBtn.disabled =
                false;

            confirmBtn.innerText =
                "確認核銷";
        }

    }
);

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

function showSuccessPage() {

    document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div
            id="successOverlay"
            class="
                fixed
                inset-0
                z-[999]
                bg-white
                flex
                items-center
                justify-center
                p-6
            ">

            <div class="text-center">

                <div
                    class="
                        w-28
                        h-28
                        rounded-full
                        bg-emerald-50
                        border
                        border-emerald-100
                        flex
                        items-center
                        justify-center
                        mx-auto
                    ">

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="
                            w-14
                            h-14
                            text-emerald-600
                        "
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">

                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2.5"
                            d="M5 13l4 4L19 7" />

                    </svg>

                </div>

                <h2
                    class="
                        mt-8
                        text-3xl
                        font-black
                    ">
                    打卡成功
                </h2>

                <p
                    class="
                        mt-4
                        text-slate-500
                    ">
                    已完成景點核銷
                </p>

            </div>

        </div>
        `
    );

    setTimeout(
        async () => {

            document
                .getElementById(
                    "successOverlay"
                )
                ?.remove();

            await restartScanner();

        },
        2000
    );
}

/*
|--------------------------------------------------------------------------
| Restart Scanner
|--------------------------------------------------------------------------
*/

async function restartScanner() {

    scanner.innerHTML =
        "";

    scanner.classList.add(
        "hidden"
    );

    startScanBtn.disabled =
        false;

    startScanBtn.innerText =
        "開始掃描";

    currentQrCode =
        null;
}