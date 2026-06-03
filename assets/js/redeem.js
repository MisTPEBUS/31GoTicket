let html5QrCode = null;

document
    .getElementById(
        "startScanBtn"
    )
    .addEventListener(
        "click",
        startScanner
    );

async function startScanner() {

    document
        .getElementById(
            "scanner"
        )
        .classList.remove(
            "hidden"
        );

    html5QrCode =
        new Html5Qrcode(
            "scanner"
        );

    await html5QrCode.start(
        {
            facingMode:
                "environment"
        },
        {
            fps: 10,
            qrbox: 240
        },
        onScanSuccess
    );
}

async function onScanSuccess(
    decodedText
) {

    document
        .getElementById(
            "scanResult"
        )
        .innerText =
        decodedText;

    alert(
        `QRCode內容：${decodedText}`
    );

    if (html5QrCode) {

        await html5QrCode.stop();
    }
}