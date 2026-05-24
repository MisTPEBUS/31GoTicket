

const LIFF_ID = "2010150440-sbW0urAy";


const API_BASE_URL =
    "https://9f4d-59-124-220-148.ngrok-free.app";

async function init() {

    await liff.init({
        liffId: LIFF_ID
    });

    if (!liff.isLoggedIn()) {

        liff.login();

        return;
    }

    const profile =
        await liff.getProfile();

    const lineUserId =
        profile.userId;

    const response =
        await fetch(
            `${API_BASE_URL}/api/activity/current/${lineUserId}`
        );

    if (!response.ok) {

        window.location.href =
            "./pages/register.html";

        return;
    }

    const data =
        await response.json();

    /*
        status:

        NONE
        ACTIVE
        COMPLETED
        REWARDED
    */

    switch (data.status) {

        case "ACTIVE":

            window.location.href =
                "./pages/progress.html";

            break;

        case "COMPLETED":

            window.location.href =
                "./pages/reward.html";

            break;

        case "REWARDED":

            window.location.href =
                "./pages/progress.html";

            break;

        default:

            window.location.href =
                "./pages/register.html";

            break;
    }
}

init();
