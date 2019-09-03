$(document).ready(function() {
  console.log("ready!");

  $('#try-again').hide();

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
          $('#try-again').show();
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

  $('#try-again').on('click', function(){
    $('#message').val('').show();
    $('#try-again').hide();
    $('#results').html('');
  });

  $('#random-pick').on('click', function(){
    console.log("random clicked ");
    $('#try-again').hide();
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
          const popup = window.open('', '', 'width=700, height=700');
          popup.document.open();
          popup.document.write(results.html_raw);
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
