$(function () {
    var preLoader = $('#preLoader');
    $(document).ajaxStart(function () {
        preLoader.show();
    });
    $(document).ajaxStop(function () {
        preLoader.hide();
    });
//=======================================================================================
    var country1;
    var codes = [];
    var request = function (url) {
        return $.ajax({
            method: 'GET',
            url: 'https://restcountries.eu/rest/v2/name/' + url
        })}

    $('#show').on('click', function (event) {
        request(url).then(function (response) {
            country1 = response[0];
            return response[0].borders
        }).then(function (borders) {
            return Promise.all(borders.map(function (border) {
                var codeUrl = 'https://restcountries.eu/rest/v2/alpha?codes=' + border;
                return fetch(codeUrl);
            }))
        })
            .then(function (result) {

                return Promise.all(result.map(function (country) {
                    return country.json()
                }))
            })
            .then(function (country) {
                codes = [];
                for(var i = 0; i < country.length; i++) {
                    codes.push(country[i][0].name);
                }
                createList(country1);
            })
            .catch(handleError)
    });

    $('#show-extra').click(function () {
        $('#ul_1').toggle(1000);
    });

    var createList = function (country1) {
        var country = country1;
        latlng = country.latlng
        $('#name').text(country.name);
        $('#region').text(country.region);
        $('#subregion').text(country.subregion);
        $('#capital').text(country.capital);
        var flagUrl = country.flag;
        $('#flag').attr('src', "").attr('src', flagUrl);
        $('#ul_1').html('');
        var list = '<ul class="main_ul">';

        for (var key in country) {
            var childKey = country[key];

            for (key2 in Words) {
                if (key2 === key) {
                    key = Words[key2];
                }
            }

            list += '<li class="main_li">' + key;
            var list2 = '<ul class="2">';

            if (Array.isArray(childKey)) {

                if (typeof childKey[0] === 'object') {
                    var objKey = Object.keys(childKey[0]);
                    var objVal = Object.values(childKey[0]);
                    var list3 = '<ul>';
                    for (var i = 0; i < objKey.length; i++) {
                        list3 += '<li>' + objKey[i] + ' : ' + objVal[i] + '</li>';
                    }
                    list3 += '</ul>';
                    list2 += '<li>' + list3 + '</li>';
                } else {
                    list2 += '<li>' + childKey + '</li>';
                }
            } else if (typeof childKey === 'object') {
                var objKey = Object.keys(childKey);
                var objVal = Object.values(childKey);
                var list3 = '<ul>';
                for (var i = 0; i < objKey.length; i++) {
                    list3 += '<li>' + objKey[i] + ' : ' + objVal[i] + '</li>';
                }
                list3 += '</ul>';
                list2 += '<li>' + list3 + '</li>';
            } else {
                list2 += '<li>' + childKey + '</li>';
            }
            list2 += '</ul>';
            list += list2 + '</li>'
        }
        list += '</ul>';
        $('#ul_1').append(list);
        $('.main_li:contains("Граничит")').append('<ul><li>' + codes + '</li></ul>');
        return list;
    };

    var handleError = function (error) {
        console.error(error);
    };

    var Words = {
        name: 'Название',
        topLevelDomain: 'Домен верхнего уровня',
        alpha2Code: 'Двухзначный код',
        alpha3Code: 'Трехзначный код',
        callingCodes: 'Телеф. код страны',
        capital: 'Столица',
        region: 'Регион',
        subregion: 'Субрегион',
        population: 'Население',
        latlng: 'Геокоординаты',
        demonym: 'Этнохороним',
        area: 'Площадь',
        timezones: 'Часовой пояс',
        borders: 'Граничит',
        currencies: 'Валюта',
        languages: 'Языки',
        translations: 'Перевод',
        gini: 'индекс Джини',
        cioc: 'Код Между-го олимпийского комитета',
        nativeName: 'Оригинальное название',
        numericCode: 'Номерной код',
        altSpellings: 'Альтернативное название',
        regionalBlocs: 'Участник организаций'
    };
});
