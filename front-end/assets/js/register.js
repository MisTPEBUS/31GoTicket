import {
    initLiff
} from "../liff/liff-init.js";

const API_BASE_URL =
    "https://9f4d-59-124-220-148.ngrok-free.app";

/*
|--------------------------------------------------------------------------
| 使用者須知狀態
|--------------------------------------------------------------------------
*/

let isAgreeNotice = false;

/*
|--------------------------------------------------------------------------
| Modal DOM
|--------------------------------------------------------------------------
*/

const noticeModal =
    document.getElementById(
        "noticeModal"
    );

const confirmNoticeBtn =
    document.getElementById(
        "confirmNoticeBtn"
    );

const cancelNoticeBtn =
    document.getElementById(
        "cancelNoticeBtn"
    );

/*
|--------------------------------------------------------------------------
| 使用者須知事件
|--------------------------------------------------------------------------
*/

confirmNoticeBtn?.addEventListener(
    "click",
    () => {

        isAgreeNotice = true;

        noticeModal.classList.add(
            "hidden"
        );
    }
);

cancelNoticeBtn?.addEventListener(
    "click",
    () => {

        if (window.liff) {

            liff.closeWindow();

            return;
        }

        window.history.back();
    }
);

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
        | 讀取活動狀態
        |--------------------------------------------------------------------------
        */

        const response =
            await fetch(
                `${API_BASE_URL}/api/activity/current/${userId}`,
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
                "活動狀態讀取失敗"
            );

            return;
        }

        const data =
            await response.json();

        console.log(data);

        /*
        |--------------------------------------------------------------------------
        | 已參加活動
        |--------------------------------------------------------------------------
        */

        /*
        if (data.status !== "NONE") {

            window.location.href =
                "./progress.html";

            return;
        }
        */

        /*
        |--------------------------------------------------------------------------
        | 顯示資料
        |--------------------------------------------------------------------------
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
        |--------------------------------------------------------------------------
        | Submit
        |--------------------------------------------------------------------------
        */

        const registerForm =
            document.getElementById(
                "registerForm"
            );

        registerForm.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();

                /*
                |--------------------------------------------------------------------------
                | 須知驗證
                |--------------------------------------------------------------------------
                */

                if (!isAgreeNotice) {

                    alert(
                        "請先閱讀並同意使用者須知"
                    );

                    return;
                }

                const submitBtn =
                    document.getElementById(
                        "submitBtn"
                    );

                submitBtn.disabled =
                    true;

                submitBtn.innerText =
                    "送出中...";

                const payload = {

                    LineUserId:
                        profile.userId,

                    Name:
                        document.getElementById(
                            "name"
                        ).value.trim(),

                    OrderNo:
                        document.getElementById(
                            "orderNo"
                        ).value.trim(),

                    CampaignId:
                        "2750ef49-8292-42fa-9660-273c46678aad"
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

                    /*
                    |--------------------------------------------------------------------------
                    | API Error
                    |--------------------------------------------------------------------------
                    */

                    if (!registerResponse.ok) {

                        alert(
                            "報名失敗"
                        );

                        return;
                    }

                    const registerData =
                        await registerResponse.json();

                    console.log(
                        registerData
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | Success
                    |--------------------------------------------------------------------------
                    */

                    if (
                        registerData.success
                    ) {

                        alert(
                            registerData.message
                        );


                        window.location.href = `./progress.html?campaignId=${campaignId}`;

                        return;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Fail Message
                    |--------------------------------------------------------------------------
                    */

                    /*  */

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

    } catch (error) {

        console.error(error);

        alert(
            "LIFF 初始化失敗"
        );
    }
}

init();