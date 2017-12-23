// allow song to play by pressing title
$(function(){
  $('#titlePlay-button').click(function() {
    $.ajax({
      type: 'POST',
      url: './browse'
    });
  });
  console.log('run');
});
