var video = document.getElementById('video-player');
var duration;

$(document).ready(function() {

    $(".video-container").hover(function(){
        $("#video-controls").fadeIn("fast");
    }, function(){
        $("#resolution-menu").hide();
        $("#video-controls").fadeOut("fast");
    });

    $(".video-container").contextmenu(function(e){
        //e.preventDefault();
    });

    // Play/pause video when the spacebar is pressed
    $(document).keypress(function(e) {
        e.preventDefault();
        if (e.keyCode == 32) {
            var btn = $(".play-pause");
            if (document.getElementById('video-player').playing) {
                btn.addClass("play");
                btn.children("i.fa").removeClass("fa-pause");
                btn.children("i.fa").addClass("fa-play");
                document.getElementById('video-player').pause();
            } else {
                btn.removeClass("play");
                btn.children("i.fa").removeClass("fa-play");
                btn.children("i.fa").addClass("fa-pause");
                document.getElementById('video-player').play();
            }
        }
    });

    $(".play-pause").on("click", function() {
        var video = document.getElementById('video-player');
        if ($(this).hasClass("play")) {
            $(this).removeClass("play");
            $(this).children("i.fa").removeClass("fa-play");
            $(this).children("i.fa").addClass("fa-pause");
            video.play();
        } else {
            $(this).addClass("play");
            $(this).children("i.fa").removeClass("fa-pause");
            $(this).children("i.fa").addClass("fa-play");
            video.pause();
        }
    });

    $(".volume-control").hover(function() {
        $(".volume-range").css("display", "inline-block");
    }, function() {
        $(".volume-range").hide();
    });

    $(document).on("click", ".volume-button", function() {
        var volume = $(".volume").val();
        if (volume > 0) {
            $(".volume").val(0);
            changeVolume(0);
        } else {
            $(".volume").val(100);
            changeVolume(100);
        }
    });

    var clicking = false;

    $("#player-scrollbar").on("click", function(e) {
        var x = e.pageX - $('#player-scrollbar').offset().left;
        var width = document.getElementById('player-scrollbar').clientWidth;
        var perc = ((x / width)).toFixed(4);
        var newTime = duration * perc;
        video.currentTime = newTime;
        document.getElementById("player-scrollbar-background").style.width = (perc * 100).toString() + "%";
    });

    $('#player-scrollbar').hover(function() {
        $("#player-scrollbar-thumbnail").fadeIn();
    }, function() {
        $("#player-scrollbar-thumbnail").fadeOut();
    });

    $('#player-scrollbar').mousedown(function() {
        $(this).mousemove(function (e) {
            if (document.getElementById('video-player').playing) {
                document.getElementById('video-player').pause();
            }
            var x = e.pageX - $('#player-scrollbar').offset().left;
            var width = document.getElementById('player-scrollbar').clientWidth;
            var perc = ((x / width)).toFixed(4);
            var newTime = duration * perc;
            video.currentTime = newTime;
            document.getElementById("player-scrollbar-background").style.width = (perc * 100).toString() + "%";
            document.getElementById("player-scrollbar-thumbnail").style.left = (perc * 100).toString() + "%";
        });
    }).mouseup(function() {

        if (!document.getElementById('video-player').playing) {
            document.getElementById('video-player').play();
        }
        $(this).unbind('mousemove');
    });

    $(document).on("click", "#resolution-btn", function(e) {
        $("#resolution-menu").toggle();
    });

    $(document).on("click", "li.resolution-option", function(e) {
        var isPlaying = video.playing;
        // Get the check icon and move it to the selected option
        $(this).append($("i#resolution-check"));
        // Retrieve the video URL for that resolution
        var videoURL = $(this).attr("rel");
        // Retrive the current time of the current video playing
        var resCurrentTime = video.currentTime;
        // Get the source tag
        var sources = video.getElementsByTagName('source');
        // Replace the old source with the new video source
        sources[0].src = videoURL;
        // Load the new video
        video.load();
        // Set the time to the current time
        video.currentTime = resCurrentTime;
        // Resume playing if the video was already playing
        if (isPlaying) { video.play(); }
    });

    var fullscreen = false;
    $(document).on("click", ".fullscreen", function() {
        if (fullscreen) {
            fullscreen = false;
            $(".video-container").removeAttr("style");
        } else {
            fullscreen = true;
            $(".video-container").css("position", "absolute");
            $(".video-container").css("height", "100%");
            $(".video-container").css("width", "100%");
        }
    });

});

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended);
    }
});

function addingAptIconForPlayer() {
    var video = document.getElementById("video-player");
    if (video.playing) {
        $(this).children("i.fa").removeClass("fa-play");
        $(this).children("i.fa").addClass("fa-pause");
    } else {
        $(this).children("i.fa").removeClass("fa-pause");
        $(this).children("i.fa").addClass("fa-play");
    }
}


function init(video, duration) {
    globVideo = video;
    globDuration = Math.floor(duration);
}

function changeVolume(value) {
    var volume = (value / 100);
    if (volume > 0.7) {
        document.getElementById('volume-icon').className = "fa fa-volume-up";
    } else if (volume > 0) {
        document.getElementById('volume-icon').className = "fa fa-volume-down";
    } else {
        document.getElementById('volume-icon').className = "fa fa-volume-off";
    }
    document.getElementById('video-player').volume = volume;
}

function timeToDuration(time) {
    var duration = new Date(time * 1000).toISOString().substr(11, 8);
    var array = duration.split(":");
    if (duration === "00:00:00") {
        return "0:00";
    }
    if (array[0] != "00") {
        array[0] = parseInt(array[0]);
        duration = array.join(":");
        return duration;
    }

    if (array[1] != "00") {
        array[1] = parseInt(array[1]);
        duration = array[1].toString() + ":" + array[2];
        return duration;
    }

    if (array[2] != "00") {
        duration = "0:" + array[2];
        return duration;
    }

}

function timeUpdate(video) {
    // Assign an ontimeupdate event to the <video> element, and execute a function if the current playback position has changed
    video.ontimeupdate = function() {myFunction()};

    function myFunction() {
    // Display the current position of the video in a <p> element with id="demo"
        scrollbarWidth(video.currentTime);
        document.getElementById("current-time").innerHTML = timeToDuration(video.currentTime);
        if (video.ended) {
            document.getElementById('play-pause-btn').className = "control-block play-pause play";
            document.getElementById('fa-icon').className = "fa fa-repeat";
        }
        //buffer(video, video.duration);
    }
}

var count = 0
function buffer(video, duration) {
    var buffered = video.buffered.end(0);
    scrollbarBuffer(duration, buffered);
    if (duration !== buffered) {
        count++;
        if (count > 1) {
            count = 0;
            buffer(video, duration);
        }
    }
}

function scrollbarBuffer(duration, buffered) {
    var perc = (buffered / duration) * 100;
    document.getElementById("player-scrollbar-buffer").style.width = perc.toString() + "%";
}

function scrollbarWidth(currentTime) {
    var perc = (currentTime / duration) * 100;
    document.getElementById("player-scrollbar-background").style.width = perc.toString() + "%";
    document.getElementById("player-scrollbar-thumbnail").style.left = perc.toString() + "%";
}

video.addEventListener('loadedmetadata', function() {
    duration = video.duration;
    document.getElementById('duration').innerHTML = timeToDuration(duration);
    this.onprogress = function() {
        buffer(this, duration);
    }
});

timeUpdate(video);
