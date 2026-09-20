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
// Request placeholder visiblity logic.
// ================================================================================
//

// Request headers.
const requestHeadersPlaceholder = document.getElementById("request-headers-placeholder");
const requestHeadersContent = document.getElementById("request-headers-content");

requestHeadersPlaceholder.addEventListener("click", () => {
    requestHeadersPlaceholder.style.display = "none";
    requestHeadersContent.style.display = "block";

    requestHeadersContent.focus();
});

requestHeadersContent.addEventListener("blur", () => {
    if (requestHeadersContent.textContent.trim() === "") {
        requestHeadersContent.style.display = "none";
        requestHeadersPlaceholder.style.display = "flex";
    }
});

// Request query strings.
const requestQueryStringsPlaceholder = document.getElementById("request-query-strings-placeholder");
const requestQueryStringsContent = document.getElementById("request-query-strings-content");

requestQueryStringsPlaceholder.addEventListener("click", () => {
    requestQueryStringsPlaceholder.style.display = "none";
    requestQueryStringsContent.style.display = "block";

    requestQueryStringsContent.focus();
});

requestQueryStringsContent.addEventListener("blur", () => {
    if (requestQueryStringsContent.textContent.trim() === "") {
        requestQueryStringsContent.style.display = "none";
        requestQueryStringsPlaceholder.style.display = "flex";
    }
});

// Request body.
const requestBodyPlaceholder = document.getElementById("request-body-placeholder");
const requestBodyContent = document.getElementById("request-body-content");

requestBodyPlaceholder.addEventListener("click", () => {
    requestBodyPlaceholder.style.display = "none";
    requestBodyContent.style.display = "block";

    requestBodyContent.focus();
});

requestBodyContent.addEventListener("blur", () => {
    if (requestBodyContent.textContent.trim() === "") {
        requestBodyContent.style.display = "none";
        requestBodyPlaceholder.style.display = "flex";
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
        const uri = new URL(request.url);
        const options = {
            method: request.method,
        };

        // Add request headers.
        if (requestHeadersContent.textContent.trim() !== "") {
            options.headers = JSON.parse(requestHeadersContent.textContent);
        }

        // Add request query strings.
        if (requestQueryStringsContent.textContent.trim() !== "") {
            uri.search = requestQueryStringsContent.textContent;
        }

        // Add request body.
        if (requestBodyContent.textContent.trim() !== "") {
            options.body = requestBodyContent.textContent;
        }

        const res = await fetch(uri, options);

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
