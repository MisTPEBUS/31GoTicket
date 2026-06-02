import {
    initLiff
} from "../liff/liff-init.js";

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