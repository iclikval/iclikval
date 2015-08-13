$(document).ready(function() {
    var url   = "http://iclikval.riken.jp/api/annotation";
    var token = "xxxxxxxxxxxxxxxxxxxxxxx"; // Replace with your access token

    $.ajax(url, {
        type       : 'GET',
        dataType   : 'json',
        beforeSend : function (xhr) {
             xhr.setRequestHeader("Authorization", "Bearer " + token)
        },
        complete: function (response) {
          // Do something with response
          console.log(response);
        },
        error: function (jqXHR,  textStatus,  errorThrown) {
          console.log(textStatus);
        }
      }
    );
});
