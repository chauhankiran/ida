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
    requestContainer.style.width = "50%";
});

//
// Request placeholder and content visiblity logic.
// ================================================================================
//

const requestPlaceholder = document.getElementById("request-placeholder");
const requestContent = document.getElementById("request-content");

requestPlaceholder.addEventListener("click", () => {
    requestPlaceholder.style.display = "none";
    requestContent.style.display = "block";

    requestContent.focus();
});

requestContent.addEventListener("blur", () => {
    if (requestContent.textContent.trim() === "") {
        requestContent.style.display = "none";
        requestPlaceholder.style.display = "flex";
    }
});

//
// Request execution engine.
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
    };

    responsePlaceholder.style.display = "none";

    try {
        const options = {
            method: request.method,
        };

        if (options.method === "POST") {
            options.headers = {
                "Content-Type": "application/json",
            };

            options.body = requestContent.textContent;
        }

        const res = await fetch(request.url, options);

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
