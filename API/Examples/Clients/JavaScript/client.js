// This example is based on jQuery $ajax method.
$(document).ready(function() {
    var url   = "http://api.iclikval.riken.jp/annotation";
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
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
      }
    );
});
