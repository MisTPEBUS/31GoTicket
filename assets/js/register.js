
import {
    initLiff
} from "..liff/liff-init.js";

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

    const response =
        await fetch(
            `${API_BASE_URL}/api/activity/current/${userId}`
        );

    const data =
        await response.json();

    if (data.hasActivity) {

        window.location.href =
            "/pages/progress.html";

        return;
    }

    document.getElementById(
        "name"
    ).value =
        profile.displayName;
}

init();

