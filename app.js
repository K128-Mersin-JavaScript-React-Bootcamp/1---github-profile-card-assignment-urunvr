const userInput = document.getElementById('userInput');
const submitBtn = document.getElementById('submitBtn');
const profileImgPart = document.getElementById('profileImg');
const userNamePart = document.getElementById('userName');
const profileNamePart = document.getElementById('profileName');
const userReposPart = document.getElementById('userRepos');
const memoryPart = document.getElementById('memory');
const usedLanguagesPart = document.getElementById('usedLanguagesPart');


let userName;
let totalSize = 0;
let publicReposLength = 0;
let holder = {};



function langDetails(lang) {
    lang.forEach(element => {
        totalSize += element.size
        console.log(totalSize);
        if (element.language != null) {
            if (holder.hasOwnProperty(element.language)) {
                holder[element.language] = holder[element.language] + 1;
            } else {
                holder[element.language] = 1;
            }
        }
    });

    console.log(holder);
    memoryPart.innerHTML = `<p>${totalSize / 1000} MB</p>`;
    let width = 100 / Object.keys(holder).length;
    if (Object.keys(holder).length > 0) {
        for (const key in holder) {
            let langInfo = document.createElement('div');
            langInfo.classList.add('langInfo');
            langInfo.style.width = `${width}%`;
            usedLanguagesPart.appendChild(langInfo);

            let square = document.createElement('div');
            square.classList.add('square');
            langInfo.appendChild(square);

            let langName = document.createElement('div');
            langName.classList.add('langName');
            langName.innerHTML = `<p>${key}</p>`;
            langInfo.appendChild(langName);

            let usedPercentage = document.createElement('div');
            usedPercentage.classList.add('usedPercentage');
            usedPercentage.innerHTML = `<p>%${(holder[key] * 100 / publicReposLength).toFixed()}</p>`;
            langInfo.appendChild(usedPercentage);

        }
    } else {
        usedLanguagesPart.style.width = "100%";
        usedLanguagesPart.style.display = "flex";
        usedLanguagesPart.style.justifyContent = "center";
        usedLanguagesPart.innerHTML = `<p>There is no program written in any language.</p>`;
    }


}



function repoDetails(repUrl) {
    fetch(repUrl)
        .then(function(response) {
            if (!response.ok) {
                usedLanguagesPart.innerHTML = `<p>HTTP error! status: ${response.status}</p>`;
            } else {
                usedLanguagesPart.innerHTML = ``;
                return response.json();
            }
        })
        .then((responseJson) => {
            langDetails(responseJson);
        })
        .catch((err) => console.log(err))
}


function mainInfoFunc(resp) {
    userNamePart.innerHTML = `<p>${resp.name}</p>`;
    profileNamePart.innerHTML = `<p>${resp.login}</p>`;
    profileImgPart.innerHTML = `<img src="${resp.avatar_url}">`;
    userReposPart.innerHTML = `<p>${resp.public_repos}</p>`;
    publicReposLength = resp.public_repos;
    repoDetails(resp.repos_url);
}


submitBtn.addEventListener('click', () => {
    fetch("https://api.github.com/users/" + userInput.value)
        .then(function(response) {
            if (!response.ok) {
                userNamePart.innerHTML = ``;
                profileNamePart.innerHTML = ``;
                profileImgPart.innerHTML = ``;

                usedLanguagesPart.style.width = "100%";
                usedLanguagesPart.style.display = "flex";
                usedLanguagesPart.style.justifyContent = "center";
                usedLanguagesPart.innerHTML = `<p>HTTP error! status: ${response.status}</p>`;
            } else {
                usedLanguagesPart.innerHTML = ``;
                return response.json();
            }
        })
        .then((responseJson) => {
            mainInfoFunc(responseJson)
        })
        .catch((err) => console.log(err))
});