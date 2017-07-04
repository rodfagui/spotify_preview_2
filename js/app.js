var template = Handlebars.compile($('#tracks-template').html());
$('input#input').hide();
$('img.loading').hide();
$('.not-found').hide();

$('button').on('click', function() {
  var spoAuth = "https://accounts.spotify.com/authorize";
  var clientID = "d8d36e0d65a9490f967ad4779b79d4d0";
  var redirectUri = "https%3A%2F%2Frodfagui.github.io%2Fspotify_preview_2";
  var responseType = "token";
  window.location = spoAuth + "?client_id=" + clientID + "&redirect_uri=" + redirectUri + "&response_type=" + responseType
});

var params = getHashParams();
var access_token = params.access_token;
var token_type = params.token_type;

if(access_token) {
  $('button.btn-default').hide();
  $('input#input').show();
  $('#input').on('keypress', function(e) {
    if (e.which == 13) {
      $.ajax({
        url: 'https://api.spotify.com/v1/search?q=' + $(this).val() + '&type=track',
        type: 'GET',
        dataType: 'json',
        headers: {'Authorization': token_type + ' ' + access_token},
          beforeSend: function(){
              $('.tracks').empty();
              $('.not-found').empty().hide();
              $('img.loading').show();
          }
      })
      .done(function(data) {
          if (data.tracks.total == 0) {
            $('.not-found').text('No results found!').show();
          } else {
            var html = template({preview: data.tracks.items});
            $('.tracks').html(html);
          }
      })
      .fail(function() {
          $('.not-found').text('Unauthorized for this search!').show();
      })
      .always(function() {
        $(this).val('');
          $('img.loading').hide();
      });   
    }
  });
}

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while (e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;          
}