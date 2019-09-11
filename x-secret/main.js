const API_KEY = "AIzaSyClgesAo8GxQZV0tcGw6FQdnPuQtYPp35w";
const BACKGROUNDS_FOLDER_ID = "1sqOozOX7spDmxYzOHjDUJ0Gkt2m3hYSl";
const CHARACTERS_FOLDER_ID = "1snTuMs9vPcQ3tjRJbqpk13vh3oCtwuAD";
const RECTANGLES_FOLDER_ID = "1snabwSy8sgtK6SfDJQcUKi3BoQ2_i29q";
const TITLES_FOLDER_ID = "1sk01Op4hrmABH4L0H_i-RL3O-Hb80wGu";

let backgrounds = [];
let characters = [];
let rectangles = [];
let titles = [];

let btnRandom = document.getElementById("btnRandom");
let btnSave = document.getElementById("btnSave");
let canvas = document.getElementById("mainDisplay");
let ctx = canvas.getContext("2d");

function getFolderImageIds(folderId) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        let url = "https://www.googleapis.com/drive/v3/files";
        url += `?q='${folderId}'+in+parents`;
        url += "&fields=files%2Fid";
        url += `&key=${API_KEY}`;
        request.open("GET", url);
        request.onload = function () {
            resolve(JSON.parse(this.response).files.map(x => x.id));
        };
        request.onerror = function (error) {
            console.error(error)
            reject(error);
        }
        request.send();
    });
}
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // Otherwise, CORS is not supported by the browser.
        xhr = null;
    }
    return xhr;
}
function getRandomImage(ids) {
    return new Promise((resolve, reject) => {
        let randomId = ids[~~(Math.random() * ids.length)];
        let url = `https://drive.google.com/uc?export=view&id=${randomId}`;
        let img = new Image();
        img.src = url;
        // img.crossOrigin = "anonymous";
        img.onload = function() {
            resolve(img);
        };
    });
}

function scaleDimensions(img) {
    let scale = Math.min(window.innerWidth, window.innerHeight) / Math.max(img.width, img.height);
    let w = img.width * scale;
    let h = img.height * scale;
    return { w, h };
}

function generateRandomImage() {
    Promise.all([
        getRandomImage(backgrounds),
        getRandomImage(characters),
        getRandomImage(rectangles),
        getRandomImage(titles),
    ]).then(results => {
        let [bg, char, rect, title] = results;
        let dim = scaleDimensions(bg);
        canvas.width = dim.w;
        canvas.height = dim.h;
        ctx.drawImage(bg, 0, 0, dim.w, dim.h);

        dim = scaleDimensions(char);
        ctx.drawImage(char, 0, 0, dim.w, dim.h);

        dim = scaleDimensions(rect);
        ctx.drawImage(rect, 0, 0, dim.w, dim.h);

        dim = scaleDimensions(title);
        ctx.drawImage(title, 0, 0, dim.w, dim.h);
    }).catch(error => {
        console.error(error);
    });
}

function saveImage() {
    let dataURL = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let link = document.createElement('a');
    link.setAttribute('href', dataURL);
    link.setAttribute('download', 'portada.png');
    link.click();
}

Promise.all([
    getFolderImageIds(BACKGROUNDS_FOLDER_ID).then(r => backgrounds = r),
    getFolderImageIds(CHARACTERS_FOLDER_ID).then(r => characters = r),
    getFolderImageIds(RECTANGLES_FOLDER_ID).then(r => rectangles = r),
    getFolderImageIds(TITLES_FOLDER_ID).then(r => titles = r),
]).then(() => {
    // got all image Ids

    btnRandom.onclick = generateRandomImage;
    btnSave.onclick = saveImage;
});