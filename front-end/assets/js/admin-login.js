import {
    initLiff
} from "../liff/liff-init.js";

const API_BASE_URL =
    "https://9f4d-59-124-220-148.ngrok-free.app";

const sendCodeBtn =
    document.getElementById(
        "sendCodeBtn"
    );

const loginStep1 =
    document.getElementById(
        "loginStep1"
    );

const loginStep2 =
    document.getElementById(
        "loginStep2"
    );

const countdownElement =
    document.getElementById(
        "countdown"
    );

const otpInputs =
    document.querySelectorAll(
        ".otp"
    );

let countdownTimer = null;

/*
|--------------------------------------------------------------------------
| Modal
|--------------------------------------------------------------------------
*/

function showSuccess(
    message
) {

    document
        .getElementById(
            "successMessage"
        )
        .innerText =
        message;

    document
        .getElementById(
            "successModal"
        )
        .classList
        .remove(
            "hidden"
        );
}

function showError(
    message
) {

    document
        .getElementById(
            "errorMessage"
        )
        .innerText =
        message;

    document
        .getElementById(
            "errorModal"
        )
        .classList
        .remove(
            "hidden"
        );
}

document
    .getElementById(
        "successCloseBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "successModal"
                )
                .classList
                .add(
                    "hidden"
                );
        }
    );

document
    .getElementById(
        "errorCloseBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "errorModal"
                )
                .classList
                .add(
                    "hidden"
                );
        }
    );

/*
|--------------------------------------------------------------------------
| 取得驗證碼
|--------------------------------------------------------------------------
*/

sendCodeBtn?.addEventListener(
    "click",
    handleSendCode
);

async function handleSendCode() {

    const activityCode =
        document
            .getElementById(
                "activityCode"
            )
            ?.value
            .trim();

    if (!activityCode) {

        showError(
            "請輸入活動碼"
        );

        return;
    }

    try {

        const profile =
            await initLiff();

        if (!profile) {

            showError(
                "LINE 登入失敗"
            );

            return;
        }

        const lineUserId =
            profile.userId;

        const response =
            await fetch(
                `${API_BASE_URL}/api/admin/Login/${lineUserId}/登入頁面`,
                {
                    method: "POST",
                    headers: {
                        "ngrok-skip-browser-warning":
                            "true"
                    }
                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            showError(
                result.message
            );

            return;
        }

        showSuccess(
            result.message
        );
        document
            .getElementById(
                "activityCodeDisplay"
            )
            .innerText =
            `活動碼：${activityCode}`;

        loginStep1.classList.add(
            "hidden"
        );

        loginStep2.classList.remove(
            "hidden"
        );

        startCountdown();

    }
    catch (error) {

        console.error(error);

        showError(
            "取得驗證碼失敗"
        );
    }
}

/*
|--------------------------------------------------------------------------
| 倒數計時
|--------------------------------------------------------------------------
*/

function startCountdown() {

    let seconds = 300;

    clearInterval(
        countdownTimer
    );

    countdownTimer =
        setInterval(
            () => {

                const min =
                    Math.floor(
                        seconds / 60
                    );

                const sec =
                    seconds % 60;

                countdownElement.innerText =
                    `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

                seconds--;

                if (seconds < 0) {

                    clearInterval(
                        countdownTimer
                    );

                    countdownElement.innerText =
                        "驗證碼已失效";
                }

            },
            1000
        );
}

/*
|--------------------------------------------------------------------------
| OTP
|--------------------------------------------------------------------------
*/

otpInputs.forEach(
    (input, index) => {

        input.addEventListener(
            "input",
            () => {

                if (
                    input.value &&
                    index <
                    otpInputs.length - 1
                ) {

                    otpInputs[
                        index + 1
                    ].focus();
                }

            }
        );

    }
);

/*
|--------------------------------------------------------------------------
| 驗證登入
|--------------------------------------------------------------------------
*/

document
    .getElementById(
        "verifyBtn"
    )
    ?.addEventListener(
        "click",
        async () => {

            const otp =
                Array.from(
                    otpInputs
                )
                    .map(
                        input =>
                            input.value
                    )
                    .join("");

            if (otp.length !== 4) {

                showError(
                    "請輸入完整驗證碼"
                );

                return;
            }

            try {

                const profile =
                    await initLiff();

                const response =
                    await fetch(
                        `${API_BASE_URL}/api/admin/Login-Verify/${profile.userId}/登入頁面/${otp}`,
                        {
                            method:
                                "POST",
                            headers: {
                                "ngrok-skip-browser-warning":
                                    "true"
                            }
                        }
                    );

                const result =
                    await response.json();

                if (!response.ok) {

                    showError(
                        result.message
                    );

                    return;
                }

                localStorage.setItem(
                    "adminUser",
                    JSON.stringify(
                        result.data
                    )
                );

                showSuccess(
                    "登入成功"
                );

                setTimeout(
                    () => {

                        window.location.href =
                            "./dashboard.html";

                    },
                    1000
                );

            }
            catch (error) {

                console.error(
                    error
                );

                showError(
                    "驗證失敗"
                );
            }

        }
    );

/*
|--------------------------------------------------------------------------
| 重新發送
|--------------------------------------------------------------------------
*/

document
    .getElementById(
        "resendBtn"
    )
    ?.addEventListener(
        "click",
        async () => {

            try {

                const profile =
                    await initLiff();

                const response =
                    await fetch(
                        `${API_BASE_URL}/api/admin/Login/${profile.userId}/登入頁面`,
                        {
                            method:
                                "POST",
                            headers: {
                                "ngrok-skip-browser-warning":
                                    "true"
                            }
                        }
                    );

                const result =
                    await response.json();

                if (!response.ok) {

                    showError(
                        result.message
                    );

                    return;
                }

                startCountdown();

                showSuccess(
                    "驗證碼已重新發送"
                );

            }
            catch (error) {

                console.error(
                    error
                );

                showError(
                    "重新發送失敗"
                );
            }

        }
    );