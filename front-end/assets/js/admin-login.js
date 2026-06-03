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

sendCodeBtn?.addEventListener(
    "click",
    handleSendCode
);

function handleSendCode() {

    loginStep1.classList.add(
        "hidden"
    );

    loginStep2.classList.remove(
        "hidden"
    );

    startCountdown();
}

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

document
    .getElementById(
        "verifyBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            const otp =
                Array.from(
                    otpInputs
                )
                    .map(
                        input =>
                            input.value
                    )
                    .join("");

            console.log(
                "otp",
                otp
            );

            /*
            TODO:
            POST /api/admin/verify-code
            */

        }
    );

document
    .getElementById(
        "resendBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            startCountdown();

            /*
            TODO:
            POST /api/admin/resend-code
            */

        }
    );