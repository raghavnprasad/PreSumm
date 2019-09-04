$(document).ready(function() {
  console.log("ready!");

  // on form submission ...
  $('form').on('submit', function() {

    console.log("the form has beeen submitted");

    // grab values

    txt = $("#message").val();
    txt=txt.replace(/\"/g, "");
    txt=txt.replace(/\'/g, "");
    //alert($("#message").val())
    console.log(txt)

    $.ajax({
      type: "POST",
      url: "/summary",
      dataType: 'json',
      contentType: 'application/json',
      data : JSON.stringify( {'src': txt, 'id': 100}),
      beforeSend: function(){
        // Show image container
         $('#loader').show();
      },
      success: function(results) {
        console.log(results);

        if (results.tgt.length > 0) {
          h='<span style="font-weight:bold">Summary: </span>'
          $('#results').html(h+ results.tgt);


        } else {
          $('#results').html('Something went terribly wrong! Please try again.')
        }
      },
      error: function(error) {
        console.log(error)
      },
       complete:function(data){
       // Hide image container
       $("#loader").hide();
      }
    });
  });

  $('#input-text').on('click', function(){
    var ifrm = document.getElementById('myIframe');
    ifrm.style.display = "none";
    $('#message').val('').show();
    $('#results').html('');
  });

  $('#random-pick').on('click', function(){
    console.log("random clicked ");
    $('#results').html('');

    $.ajax({
      type: "GET",
      url: "/random",
      beforeSend: function(){
        // Show image container
         $('#loader').show();
      },
      success: function(results) {
        console.log(results);

        if (results.txt.length > 0) {
          $('#message').val(results.txt).show();
          console.log($('#message').val());
          $('#message').hide();

          var ifrm = document.getElementById('myIframe');
          var doc = ifrm.contentDocument? ifrm.contentDocument: ifrm.contentWindow.document;

          doc.open();
          doc.write(results.html_raw);
          doc.close();
          ifrm.style.display = "block";
        } else {
          $('#messages').val('Something went terribly wrong! Please try again.')
        }
      },
      error: function(error) {
        console.log(error)
      },
       complete:function(data){
       // Hide image container
       $("#loader").hide();
      }
    });

  });

});
