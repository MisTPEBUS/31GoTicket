
import {
    initLiff
} from "../liff/liff-init.js";

const API_BASE_URL =
    "https://9f4d-59-124-220-148.ngrok-free.app";
let html5QrCode = null;
/*
|--------------------------------------------------------------------------
| 初始化
|--------------------------------------------------------------------------
*/

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

async function init() {
    try {

        const profile =
            await initLiff();

        if (!profile) {
            return;
        }

        console.log(profile);

        const lineUserId =
            profile.userId;

        const response =
            await fetch(
                `${API_BASE_URL}/api/user/info/${lineUserId}`,
                {
                    method: "GET",

                    headers: {
                        "ngrok-skip-browser-warning":
                            "true"
                    }
                }
            );

        console.log(response.data);

        document
            .getElementById(
                "coverImage"
            )
            .src =
            profile.pictureUrl;

        document
            .getElementById(
                "avatarImage"
            )
            .src =
            profile.pictureUrl;

        document
            .getElementById(
                "displayName"
            )
            .innerText =
            profile.displayName;

        renderRoleBadge(
            data.result.role
        );
    }
    catch (error) {
        alert(error.message || "發生錯誤，請稍後再試。");
        console.error(error);
    }
}

init();

function renderRoleBadge(role) {

    const container =
        document.getElementById(
            "roleBadgeContainer"
        );

    if (!container) {
        return;
    }

    const roleConfig = {
        "一般會員": {
            bg: "bg-emerald-100",
            text: "text-emerald-700"
        },

        "管理者": {
            bg: "bg-red-100",
            text: "text-red-700"
        },

        "核銷人員": {
            bg: "bg-fuchsia-100",
            text: "text-fuchsia-700"
        }
    };

    const config =
        roleConfig[role] ??
        roleConfig["一般會員"];

    container.innerHTML = `
        <span
            class="
                px-4
                py-2
                rounded-full
                ${config.bg}
                ${config.text}
                text-xs
                font-bold
            "
        >
            ${role}
        </span>
    `;
}