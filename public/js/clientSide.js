// allow song to play by pressing title
$(function(){
  $('#titlePlay-button').click(function() {
    var id = ($('#titlePlay-button').val());
    console.log(id);
    $.ajax({
      type: 'GET',
      url: './music',
      data: {id: id}
    });
  });
});
