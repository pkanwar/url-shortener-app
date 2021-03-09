const longUrlInput = document.querySelector('#longUrlInput');
const convertBtn = document.querySelector('#convertBtn');
const clearBtn = document.querySelector('#clearBtn');
const getAllUrlBtn = document.querySelector('#getAllUrlBtn');
const originalUrlTxt = document.querySelector('.originalUrlTxt');
const shortUrlTxt = document.getElementsByClassName('.shortUrlTxt');
const shortUrlLink = document.querySelector('.shortUrlLink');
const shortUrlId = document.querySelector('#shortUrlId');
const urlSection = document.querySelector('.urlSection');
const errorSection = document.querySelector('#errorSection');
const table2 = document.querySelector('#table2');
const container = document.querySelector('.container');

longUrlInput.value ='';
let urlSectionHeight = 80;
let displayFlag = false;
let numberOfUrls = 0;

const checkValidUrl = (url)=>{
    let urlRegEx = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
    return urlRegEx.test(url) ? true : false
}

function displayAllUrls()
{
    fetch('./api/urls')
        .then((res) => res.json())
        .then((json) => {

            if (json.error) {
                errorSection.style.display = 'block';
                urlSection.style.display = 'none';
                table2.style.display = 'none'
                container.style.height = '800px';
            } else {
                errorSection.style.display = 'none';
                urlSection.style.display = 'block';
                table2.style.display = 'block'
                container.style.height = '800px';
                const urls = json;
                numberOfUrls = urls.length;
                table2.innerHTML =
                    "<tr><td><span id='originalUrlResult' >Original URL</span></td><td><span id='shortUrlResult' >Short URL</span></td></tr>";
                urls.forEach((url) => {
                    const shortUrl = `${document.location.origin}/u/${url.id}`;
                    table2.innerHTML +=
                        "<tr><td class='originalUrlClass' ><div class='originalUrlTxt' disabled >"+ url.long_url +"</div></td><td class='shortUrlClass' ><div class='shortUrlTxt' disabled ><a target='_blank' href="+ shortUrl +" class='shortUrlLink' >"+ shortUrl +"</a></div></td></tr>";
                });
                urlSectionHeight = 80 + numberOfUrls * 80;
                console.log(`urlSectionHeight : ${urlSectionHeight}`);
                urlSection.style.height = `${urlSectionHeight}px`;
            }
        })
        .catch((err) => {
            console.log(`error : ${err}`);
        });

}

convertBtn.addEventListener('click', () => {
    const longUrl = longUrlInput.value;
    if(longUrl.length ===0 ){
        alert('please enter a URL');
    } else if (!checkValidUrl(longUrl)) {
        alert('please enter a valid URL');
    } else {
        fetch('./api/urls',{
            method: 'POST',
            body: JSON.stringify({
                long_url: longUrl
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
            .then((res) => res.json())
            .then((json) => {
                const shortUrl = document.location.origin + '/u/' + json.id;
                originalUrlTxt.innerHTML = longUrl;
                shortUrlLink.innerHTML = shortUrl;
                shortUrlLink.setAttribute('href', shortUrl);
                if (displayFlag) {
                    displayAllUrls();
                }
            })
            .catch((err) => {
                console.log(`error : ${err}`);
            });
    }
});

clearBtn.addEventListener('click', () => {
    urlSection.style.display = 'none';
    originalUrlTxt.innerHTML = '';
    shortUrlLink.innerHTML = '';
    longUrlInput.value = '';
});

getAllUrlBtn.addEventListener('click', () => {
    displayFlag = true;
    displayAllUrls();
});
