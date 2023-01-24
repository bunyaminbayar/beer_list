var beerListConteiner = document.querySelector('.beerList'); // beer list main table
var beerInfoModal = document.querySelector('.beerInfoModal'); // Info modal

var beerList = [];

fetch('https://api.punkapi.com/v2/beers').then(
    response => response.json()
).then(responseJson => {
    beerList = responseJson;
    responseJson.forEach(item => {
        let trItem = document.createElement('tr');
        trItem.setAttribute("onClick", "getDetail(" + item.id + ")");
        trItem.innerHTML = "<td><img class='beerItemImage' src='" + item.image_url + "' alt='" + item.name + "png'></td><td><p>" + item.name + "</p></td><td><p>" + item.description + "</p></td><td><p>" + item.food_pairing + "</p></td>";
        beerListConteiner.appendChild(trItem)
    })
});

/** Modal */
var getDetail = function (e) {

    /** Select Elements */
    var modalImg = document.querySelector('.İmgCont');
    var infoMalt = document.querySelector('.infoMalt');
    var infoHops = document.querySelector('.infoHops');
    var infoYeast = document.querySelector('.infoYeast');
    var beerModalTitle = document.querySelector('.beerModalTitle');
    var tips = document.querySelector('.tips');
    var closeModal = document.querySelector('.closeModal');
    var modalOverlay = document.querySelector('.modalOverlay');

    /** find beer item in data  */
    let beerItem = beerList.find(el => el.id === e);

    /** Make Modal Visible */
    beerInfoModal.style.display = "flex";

    /** Title Info */
    beerModalTitle.innerHTML = beerItem.name;

    /** İmage Info */
    modalImg.innerHTML = "<img src='" + beerItem.image_url + "' />";

    /** Malt info */
    beerItem.ingredients.malt.forEach(item => {
        let trItem = document.createElement('tr');
        trItem.innerHTML = "<td>" + item.name + "</td><td>" + item.amount.value + "<span>" + item.amount.unit + "</span></td>";
        infoMalt.appendChild(trItem)
    })

    /** Hops info */
    beerItem.ingredients.hops.forEach(item => {
        let trItem = document.createElement('tr');
        trItem.innerHTML = "<td>" + item.name + "</td><td>" + item.amount.value + "<span>" + item.amount.unit + "</span></td><td>" + item.attribute + "</td>";
        infoHops.appendChild(trItem)
    })

    /** Yeast info */
    infoYeast.innerHTML = beerItem.ingredients.yeast;

    /** Yeast info */
    tips.innerHTML = beerItem.brewers_tips;

    /** Close Modal  */
    closeModal.addEventListener("click", e => {
        beerInfoModal.style.display = "none";
    });
    // Modal overlay
    modalOverlay.addEventListener("click", e => {
        beerInfoModal.style.display = "none";
    });

}

/** Chart first_brewed {value: 70, label: 'foo'}, */

var chartArray = [];
var charArrayYear = [];
var finalChatArray = [];

let setIntervalForGetData = setInterval(() => {

    if (beerList.length > 0) {
        clearInterval(setIntervalForGetData);
        /** Get just year in data */
        beerList.forEach(item => {
            charArrayYear.push(item.first_brewed.split('/').pop());
        })
        /** make data for chart */
        charArrayYear.forEach(item => {
            chartArray.push({ value: charArrayYear.filter(x => x == item).length, label: item })
        })

        /** Delete same data */
        function uniqByKeepLast(a, key) {
            return [
                ...new Map(
                    a.map(x => [key(x), x])
                ).values()
            ]
        }
        // push it final array
        finalChatArray.push(uniqByKeepLast(chartArray, it => it.label))
        
        Morris.Donut({
            element: 'graph',
            data: finalChatArray[0],
            labelColor: '#fff',
            formatter: function (x) { return x + " Pieces" }
        }).on('click', function (i, row) {
            console.log(i, row);
        });

    }

}, 1000);












