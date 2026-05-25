

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

    const response = await fetch(
        `${API_BASE_URL}/api/activity/current/${lineUserId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            }
        }
    );

    console.log(response);

    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");

    console.log(`page: ${page}`);
    setTimeout(() => {


        if (!response.ok) {

            /*  window.location.href =
                 "./pages/register.html"; */
            console.error("活動狀態讀取失敗");
            return;
        }
        /*   switch (page) {
              case "register":
                  window.location.href =
                      "./pages/register.html";
                  break;
              case "spot-check":
                  window.location.href =
                      "./pages/spot-check.html";
                  break;
  
          }
   */
        const data =
            await response.json();

        /*
            status:
    
            NONE
            ACTIVE
            COMPLETED
            REWARDED
        */


        /*   if (page === "checkin") {
      
              window.location.href =
                  `./pages/checkin.html${window.location.search}`;
          } */

        /*  switch (data.status) {
 
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
  */

    }, 1500);
}

init();
