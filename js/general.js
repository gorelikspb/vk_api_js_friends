$(document).ready(function () { // без этой обертки не работает
 
  // Инициализация, авторизация и пр. согласно  https://vk.com/dev/openapi
  VK.init({   
    apiId: 7489715
  });

  VK.Auth.getLoginStatus(function(response){ //авторизирован ли пользователь?
    if(response.session)
    {
      getFriends(); //получит 5 рандомных друзей и вставит их в html
      $('div#friends').show(); 
      $('div#logout').show();  
    }
    else
    {
      $('div#login').show();  
    }
  });  

  $('#login').on('click', function () {
    VK.Auth.login( //callback после авторизации
      function (response) {
      
     console.log(response);
  
     if (response.status === 'connected') { // авторизация прошла успешно

          let user = response.session.user; //  информация о пользователе
            /*
             user.first_name - имя;
             user.last_name - фамилия;
             user.href - ссылка на страницу в формате https://vk.com/domain;
             user.id  - идентификатор пользователя;
             user.nickname -  отчество или никнейм (если указано);
             */

          location.reload(true);
          let username = user.first_name + ' ' + user.last_name;
          localStorage.setItem('username', username); //сохранить имя пользователя
          


        } else if (response.status === 'not_authorized') { // пользователь авторизован в ВКонтакте, но не разрешил доступ приложению;
        } else if (response.status === 'unknown') { // пользователь не авторизован ВКонтакте.

        }
    }, 
    VK.access.FRIENDS);
  });


  $('#logout').on('click', function () {
    VK.Auth.logout(function (response) {
    location.reload(true); 
    });
  });


  function render(response) { // формирует html код после запроса к API
    let username = localStorage.getItem('username'); 
    let html = '<h3>' + username 
    + ',<br>  5 random VK friends:</h3> <p>(refresh page to get new five) </p>';
    for(let i=0; i<response.length;i++){
        let f = response[i];
        html += "<b>" + f.first_name+' '+f.last_name+ "</b> <br>" 
        + "<img  src=\""+f.photo_200+"\">" + "<hr>";
    }

    $("#friends").html(html);
    console.log($("#friends").html());
  }

 function getFriends(){
    VK.Api.call(
      'friends.get', // название метода API https://vk.com/dev/methods
      // параметры:
      {
        fields: 'photo_200',
        order: 'random',
        v: '5.107', // версия API (обязательный параметр)
        count: 5 // количество фотографий
      }, function (r) {
        var items = r.response.items; // массив с фотографиями
        console.log(r.response.session);
        render(items);
      });
 };
});

