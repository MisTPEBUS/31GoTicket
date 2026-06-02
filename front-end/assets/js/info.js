import {
    initLiff
} from "../liff/liff-init.js";

const API_BASE_URL =
    "https://9f4d-59-124-220-148.ngrok-free.app";
let html5QrCode = null;

async function init() {

    const profile =
        await initLiff();

    if (!profile) {
        return;
    }

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
            "memberName"
        )
        .innerText =
        profile.displayName;

    document
        .getElementById(
            "statusMessage"
        )
        .innerText =
        profile.statusMessage ||
        "三鶯 GO 數位會員";
    document
        .getElementById(
            "displayName"
        )
        .innerText =
        profile.displayName;
}

init();