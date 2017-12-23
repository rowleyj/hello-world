// allow song to play by pressing title
$(function(){
  $('#titlePlay-button').click(function() {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:8080/browse'
    });
  });
  console.log('run');
});
