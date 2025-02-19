$(document).ready(function() {
    function fetchNowPlaying() {
        $.ajax({
            url: 'https://kernelkitty.it:2053/now-playing', 
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                var nowPlayingText = data.nowPlaying === 'No music currently playing' ? data.nowPlaying : `<a href="${data.url}" target="_blank">${data.nowPlaying}</a>`;
                $('#now-playing').html(nowPlayingText);
            },
            error: function(error) {
                console.log('Error:', error);
            }
        });
    }

    fetchNowPlaying();
    setInterval(fetchNowPlaying, 10000); // Fetch every 10 seconds
});
