
import {
    initLiff
} from "../liff/liff-init.js";

const API_BASE_URL =
    "https://9f4d-59-124-220-148.ngrok-free.app";

async function init() {

    const profile =
        await initLiff();

    if (!profile) {
        return;
    }

    console.log(profile);

    const userId =
        profile.userId;

    /*
        讀取活動狀態
    */

    const response =
        await fetch(
            `${API_BASE_URL}/api/activity/current/${userId}`
            ,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            }
        );



    if (!response.ok) {

        alert(
            "活動狀態讀取失敗"
        );

        return;
    }

    const data =
        await response.json();

    /*
        已參加活動
    */

    if (
        data.status !== "NONE"
    ) {

        window.location.href =
            "./progress.html";

        return;
    }

    /*
        顯示資料
    */

    document.getElementById(
        "lineUserId"
    ).value =
        profile.userId;

    document.getElementById(
        "name"
    ).value =
        profile.displayName;

    document.getElementById(
        "loading"
    ).classList.add(
        "hidden"
    );

    document.getElementById(
        "registerForm"
    ).classList.remove(
        "hidden"
    );

    /*
        submit
    */

    const registerForm =
        document.getElementById(
            "registerForm"
        );

    registerForm
        .addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();

                const submitBtn =
                    document.getElementById(
                        "submitBtn"
                    );

                submitBtn.disabled =
                    true;

                submitBtn.innerText =
                    "送出中...";

                const payload = {

                    lineUserId:
                        profile.userId,

                    name:
                        document.getElementById(
                            "name"
                        ).value,

                    orderNo:
                        document.getElementById(
                            "orderNo"
                        ).value
                };

                console.log(payload);

                try {

                    const registerResponse =
                        await fetch(
                            `${API_BASE_URL}/api/activity/register`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        payload
                                    )
                            }
                        );

                    const registerData =
                        await registerResponse.json();

                    alert(
                        registerData.message
                    );

                    if (
                        registerData.success
                    ) {

                        window.location.href =
                            "./progress.html";
                    }

                } catch (error) {

                    console.error(error);

                    alert(
                        "系統發生錯誤"
                    );

                } finally {

                    submitBtn.disabled =
                        false;

                    submitBtn.innerText =
                        "立即參加";
                }
            }
        );
}

init();

