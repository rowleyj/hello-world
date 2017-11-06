// thanks to Traversy Media & BrayTraversy @ https://github.com/bradtraversy/html5audioplayer for beginning of media player
var audio;

//Hide Pause Initially
$('#pause').hide(); //use jquery to find pause by id then hide

//Initializer - Play First Song
initAudio($('#playlist li:first-child')); //goes to li with the first child attribute

function initAudio(element){
	var song = element.attr('song'); //song is equal to element attribute song
    var title = element.text(); // acquires title attribute
    var cover = element.attr('cover'); //acquires cover attribute
    var artist = element.attr('artist'); // acquires artist attribute

	//Create a New Audio Object
	audio = new Audio('../uploads/' + song); //passes in song inside of ?upload? folder

	if(!audio.currentTime){  //if song has not started yet
		$('#duration').html('0.00'); //html for duration div is 0.00
	}

	$('#audio-player .title').text(title); // finds title thru html and puts it under cover
    $('#audio-player .artist').text(artist); // finds artist thru html and puts it under cover

	//Insert Cover Image
	$('img.cover').attr('src','../images/' + cover); // sets cover image to path + cover variable

	$('#playlist li').removeClass('active'); //removes active off every list item
    element.addClass('active'); //adds active to the current list item
}


//Play Button
$('#play').click(function(){
	audio.play();
	$('#duration').fadeIn(200);
	showDuration();
});

//Pause Button
$('#pause').click(function(){
	audio.pause();
});

//Next Button
$('#next').click(function(){
    audio.pause();
    var next = $('#playlist li.active').next(); // find next li after active
    if (next.length == 0) {
        next = $('#playlist li:first-child');
    }
    initAudio(next);
	audio.play();
	showDuration();
});

//Prev Button
$('#prev').click(function(){
    audio.pause();
    var prev = $('#playlist li.active').prev();
    if (prev.length == 0) {   //if at 1st song go to last song
        prev = $('#playlist li:last-child');
    }
    initAudio(prev);
	audio.play();
	showDuration();
});

//Playlist Song Click
$('#playlist li').click(function () {
    audio.pause();
    initAudio($(this));
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(200);
	audio.play();
	showDuration();
});

//Volume Control
$('#volume').change(function(){
	audio.volume = parseFloat(this.value / 10);
});

//Time Duration
function showDuration(){
	$(audio).bind('timeupdate', function(){
		//Get seconds and minutes
		var s = parseInt(audio.currentTime % 60);
		var m = parseInt((audio.currentTime / 60) % 60);
		//Add 0 if seconds less than 10
		if (s < 10) {
			s = '0' + s;
		}
		$('#duration').html(m + '.' + s);
		var value = 0;
		if (audio.currentTime > 0) {
			value = Math.floor((100 / audio.duration) * audio.currentTime);
		}
		$('#progress').css('width',value+'%');
	});
}
