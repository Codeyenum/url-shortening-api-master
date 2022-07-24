const url = document.querySelector("#url");
const form = document.querySelector(".search_form");
const formBtn = document.querySelector("button");
const formContainer = document.querySelector(".statistics_section");
let linkContainers = document.querySelectorAll("short_link");

const inputField = url.parentElement;
let error_message = inputField.querySelector("small");

let loadingAnim = document.querySelector(".snippet");

let hideAnim = async () => {
    loadingAnim.classList.add("hide");
    loadingAnim.classList.remove("show");
}

let showAnim = () => {
    loadingAnim.classList.add("show");
    loadingAnim.classList.remove("hide");
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (url.value.trim() === "") {
        inputField.classList.add("error");
        error_message.innerHTML = `<em>Please add a link</em>`;

        let children = Array.from(formContainer.children);
        let i = 1;

        while (children[i].nodeName === "DIV" && children[i].className === "short_link") {
            children[i].remove();
            i++;
        }

    } else {
        inputField.classList.remove("error");
        error_message.innerHTML = "";

        let children = Array.from(formContainer.children);
        let i = 1;

        while (children[i].nodeName === "DIV" && children[i].className === "short_link") {
            children[i].remove();
            i++;
        }

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
                            // sLink.href.select();
                            navigator.clipboard.writeText(sLink.href);
                            alert("Copied text " + sLink.href)
                        })          
                    }
                }
                
            } catch (e) {
                console.log(e);
            }

            

            // for (let button in copyButtons) {
            //     button.addEventListener("click", () => {
            //         console.log("vlofkidkd");
            //     })
            // }
        }
        setTimeout(shortenURL, 2000);


    }

})



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
