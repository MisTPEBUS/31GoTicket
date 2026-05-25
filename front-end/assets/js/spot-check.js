
import {
    initLiff
} from "../liff/liff-init.js";

async function init() {

    try {

        /*
            LIFF Login
        */

        const profile =
            await initLiff();

        if (!profile) {
            return;
        }

        console.log(profile);

        /*
            Query String
        */

        const params =
            new URLSearchParams(
                window.location.search
            );

        const spotToken =
            params.get("spot");

        console.log(
            "spotToken:",
            spotToken
        );

        if (!spotToken) {

            showError(
                "缺少景點資訊"
            );

            return;
        }

        /*
            mock api result
        */

        setTimeout(() => {

            showSuccess(
                `景點打卡成功 (${spotToken})`
            );

        }, 1000);

    } catch (error) {

        console.error(error);

        showError(
            "系統發生錯誤"
        );
    }
}

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
}

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
}

init();
