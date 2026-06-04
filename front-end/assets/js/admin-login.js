import {
    initLiff
} from "../liff/liff-init.js";

const API_BASE_URL =
    "https://你的-ngrok-url";

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
| 取得驗證碼
|--------------------------------------------------------------------------
*/

sendCodeBtn?.addEventListener(
    "click",
    handleSendCode
);

async function handleSendCode() {

    try {

        const profile =
            await initLiff();

        if (!profile) {

            alert(
                "LINE 登入失敗"
            );

            return;
        }

        const response =
            await fetch(
                `${API_BASE_URL}/api/admin/Login/${profile.userId}/管理頁面`,
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

            alert(
                result.message
            );

            return;
        }

        loginStep1.classList.add(
            "hidden"
        );

        loginStep2.classList.remove(
            "hidden"
        );

        startCountdown();

        alert(
            "驗證碼已發送至 LINE"
        );

    }
    catch (error) {

        console.error(
            error
        );

        alert(
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
| OTP 自動跳下一格
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

                alert(
                    "請輸入完整驗證碼"
                );

                return;
            }

            try {

                const profile =
                    await initLiff();

                if (!profile) {

                    alert(
                        "LINE 登入失敗"
                    );

                    return;
                }

                const response =
                    await fetch(
                        `${API_BASE_URL}/api/admin/Login-Verify/${profile.userId}/管理頁面/${otp}`,
                        {
                            method:
                                "POST",

                            headers:
                            {
                                "ngrok-skip-browser-warning":
                                    "true"
                            }
                        }
                    );

                const result =
                    await response.json();

                if (
                    !response.ok
                ) {

                    alert(
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

                alert(
                    "登入成功"
                );

                window.location.href =
                    "./dashboard.html";

            }
            catch (
            error
            ) {

                console.error(
                    error
                );

                alert(
                    "驗證失敗"
                );
            }

        }
    );

/*
|--------------------------------------------------------------------------
| 重新發送驗證碼
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

                if (!profile) {

                    alert(
                        "LINE 登入失敗"
                    );

                    return;
                }

                const response =
                    await fetch(
                        `${API_BASE_URL}/api/admin/Login/${profile.userId}/管理頁面`,
                        {
                            method:
                                "POST",

                            headers:
                            {
                                "ngrok-skip-browser-warning":
                                    "true"
                            }
                        }
                    );

                const result =
                    await response.json();

                if (
                    !response.ok
                ) {

                    alert(
                        result.message
                    );

                    return;
                }

                startCountdown();

                alert(
                    "驗證碼已重新發送"
                );

            }
            catch (
            error
            ) {

                console.error(
                    error
                );

                alert(
                    "重新發送失敗"
                );
            }

        }
    );