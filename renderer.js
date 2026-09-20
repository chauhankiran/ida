const mainContainer = document.getElementById("main-container");
const requestContainer = document.getElementById("request-container");
const resizer = document.getElementById("resizer");

//
// Resizing.
// ================================================================================
//
let isResizing = false;
resizer.addEventListener("mousedown", () => {
    isResizing = true;
    document.body.style.cursor = "col-resize";
});

document.addEventListener("mousemove", (e) => {
    if (!isResizing) {
        return;
    }

    const rect = mainContainer.getBoundingClientRect();
    const width = e.clientX - rect.left;
    const per = (width / rect.width) * 100;

    requestContainer.style.width = `${per}%`;
});

document.addEventListener("mouseup", () => {
    if (!isResizing) {
        return;
    }

    isResizing = false;
    document.body.style.cursor = "";
});

resizer.addEventListener("dblclick", () => {
    requestContainer.style.width = '50%';
});

//
// Request.
// ================================================================================
//
const method = document.getElementById("method");
const url = document.getElementById("url");
const send = document.getElementById("send");
const responsePlaceholder = document.getElementById("response-placeholder");
const responseContent = document.getElementById("response-content");

send.addEventListener("click", async () => {
    const request = {
        method: method.value,
        url: url.value,
    }

    responsePlaceholder.style.display = "none";

    try {
        const res = await fetch(request.url, {
            method: request.method
        });

        if (!res.ok) {
            responseContent.textContent = res.status;
            return;
        }

        const data = await res.json();

        responseContent.innerText = JSON.stringify(data, null, 4);
    } catch (err) {
        console.log(err);
        responseContent.textContent = "Something goes wrong :(";
    }
});