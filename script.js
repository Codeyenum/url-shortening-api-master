const url = document.querySelector("#url");
const form = document.querySelector(".search_form");
const formBtn = document.querySelector("button");
const formContainer = document.querySelector(".statistics_section");
const inputField = url.parentElement;
let linkContainers = document.querySelectorAll("short_link");
let error_message = inputField.querySelector("small");
let loadingAnim = document.querySelector(".snippet");
let menuBtn = document.querySelector(".menu_btn");
let navCard = document.querySelector(".nav_card");

menuBtn.addEventListener("click", () => {
    navCard.classList.toggle("hide");
})

let hideAnim = async () => {
    loadingAnim.classList.add("hide");
    loadingAnim.classList.remove("show");
}

let showAnim = () => {
    loadingAnim.classList.add("show");
    loadingAnim.classList.remove("hide");
}

let createLinkBox = (searchTerm, key) => {
    let resultContainer = document.createElement("div");
    let longLink = document.createElement("p");
    let sLinkDiv = document.createElement("div");
    let sLink = document.createElement("a");
    let copyBtn = document.createElement("button");

    if (searchTerm !== undefined) {
        resultContainer.classList.add("short_link");
        longLink.innerText = searchTerm;
        sLink.href = key;
        sLink.innerText = key;
        copyBtn.innerText = "Copy";
        sLinkDiv.append(sLink, copyBtn);
        resultContainer.append(longLink, sLinkDiv);
        form.after(resultContainer);
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let children = Array.from(formContainer.children);
    let i = 1;
    let removeLinks = () => {
        while (children[i].nodeName === "DIV" && children[i].className === "short_link") {
            children[i].remove();
            i++;
        }
    }
    
    if (url.value.trim() === "") {
        inputField.classList.add("error");
        error_message.innerHTML = `<em>Please add a link</em>`;
        removeLinks();

    } else {
        inputField.classList.remove("error");
        error_message.innerHTML = "";
        removeLinks();
        showAnim();

        let searchTerm = url.value;
        let shortenURL = async () => {
            try {
                let response = await fetch(`https://api.shrtco.de/v2/shorten?url=${searchTerm}`);
                let objectData = await response.json();
                let results = objectData.result;

                hideAnim();
                for (let key in results) {
                    if (key.includes("full_short")) {
                        createLinkBox(searchTerm, results[`${key}`]);

                        let copyButton = document.querySelector(".short_link button"); 
                        let sLink = document.querySelector(".short_link a");      

                        copyButton.addEventListener("click", () => {
                            copyButton.innerText = "Copied!"
                            copyButton.style.backgroundColor = "hsl(257, 27%, 26%)";
                            navigator.clipboard.writeText(sLink.href);
                        })          
                    }
                }                
            } 
            catch(e) {
                console.log(e);
            }
        }
        setTimeout(shortenURL, 2000);
    }

})

