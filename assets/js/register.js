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

        const lineUserId =
            profile.userId;

        document
            .getElementById(
                "lineUserId"
            )
            .value =
            lineUserId;

        /*
        |--------------------------------------------------------------------------
        | 查詢目前活動
        |--------------------------------------------------------------------------
        */

        const response =
            await fetch(
                `${API_BASE_URL}/api/activity/current/${lineUserId}`,
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

        const data =
            await response.json();

        console.log(data);

        /*
        |--------------------------------------------------------------------------
        | 有活動
        |--------------------------------------------------------------------------
        */

        if (
            data &&
            data.userActivityId
        ) {

            showActivityBox(
                data
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | 無活動
        |--------------------------------------------------------------------------
        */

        showRegisterBox();

    } catch (error) {

        console.error(error);

        showRegisterBox();
    }
}

function showRegisterBox() {

    document
        .getElementById(
            "loadingBox"
        )
        .classList.add(
            "hidden"
        );

    document
        .getElementById(
            "activityBox"
        )
        .classList.add(
            "hidden"
        );

    document
        .getElementById(
            "registerForm"
        )
        .classList.remove(
            "hidden"
        );
}

function showActivityBox(
    activity
) {

    document
        .getElementById(
            "loadingBox"
        )
        .classList.add(
            "hidden"
        );

    document
        .getElementById(
            "registerForm"
        )
        .classList.add(
            "hidden"
        );

    document
        .getElementById(
            "activityBox"
        )
        .classList.remove(
            "hidden"
        );

    document
        .getElementById(
            "activityStatus"
        )
        .innerText =
        activity.status;

    document
        .getElementById(
            "activityOrderNo"
        )
        .innerText =
        activity.orderNo;

    document
        .getElementById(
            "activityStartedAt"
        )
        .innerText =
        activity.startedAt;

    document
        .getElementById(
            "activityExpiredAt"
        )
        .innerText =
        activity.expiredAt;

    /*
    |--------------------------------------------------------------------------
    | 查看進度
    |--------------------------------------------------------------------------
    */

    document
        .getElementById(
            "goProgressBtn"
        )
        .addEventListener(
            "click",
            () => {

                window.location.href =
                    "./progress.html";
            }
        );

    /*
    |--------------------------------------------------------------------------
    | 重新報名
    |--------------------------------------------------------------------------
    */

    document
        .getElementById(
            "reRegisterBtn"
        )
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "activityBox"
                    )
                    .classList.add(
                        "hidden"
                    );

                showRegisterBox();
            }
        );
}

init();