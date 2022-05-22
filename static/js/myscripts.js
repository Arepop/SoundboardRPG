let button_id = 0


function playPause(button_id) {
    var text = document.getElementById(button_id).firstChild;
    text.data = text.data == "play_arrow" ? "pause" : "play_arrow";

}

function playAudio(button_id) {
    var repeat = document.getElementById(`rep${button_id}`).checked;
    var interval = document.getElementById(`interval${button_id}`).value;
    var audioPath = document.getElementById(button_id).dataset.audio;
    audio = document.getElementById(`audio${button_id}`);
    if (!audio) {
        var audio = document.createElement("audio");
        audio.id = `audio${button_id}`;
        audio.setAttribute('src', `${audioPath}`);
        audio.load();
        $("#myAudio").append(audio);
    }
    switch (true) {
        case (repeat && !interval) :
            audio.loop = true;
            audio.play();
            break;
        case (repeat && interval!=""):
            audio.loop = false;
            audio.play();
            window.setTimeout(function() {
                    audio.addEventListener('ended', playAudio(button_id));
                }, parseInt(interval)*1000);
            break;
        case audio.currentTime == 0.001:
            audio.currentTime = 0;
            break;
        default:
            audio.play();
            break;
        }

}

function pauseAudio(button_id) {
    audio = document.getElementById(`audio${button_id}`);
    if (!audio) {
        return;
    }
    audio.removeEventListener('ended', audio.pasue);
    audio.currentTime = 0.001;
    audio.pause();
}
    

function openFileSelectionModal() {
    const elem = document.getElementById('modal-songs-list')
    const instance = M.Modal.init(elem, {dimissible: true});
    var ul = document.getElementById("ul-songs-list")
    ul.innerHTML = "";
    fetch('/get_sounds')
            .then((response) => response.json())
            .then((user) => {
                for (var i = 0; i < user.music.length; i++) {
                    var elem = document.createElement("a");
                    elem.id = `li-sound-${i}`;
                    elem.classList.add("collection-item");
                    elem.append(`${user.music[i]}`);
                    elem.setAttribute("onclick", "markSelectedSound(this.id);");
                    ul.appendChild(elem);

                } 
                
            });
    instance.open();
}

function fillTabsWithTracks() {
    const playset = document.getElementById("track_ul");
    const tracks = document.getElementById("track_div")
    playset.innerHTML = "";
    fetch('/get_tracks')
        .then((response) => response.json())
        .then((user) => {
            for (const [p_name, t_names] of Object.entries(user.tracks)) {
                var elem = document.createElement("li");
                var a_elem = document.createElement("a");
                var t_div = document.createElement('div')
                t_div.classList.add('collection')
                t_div.id = `div-tracks-${p_name}`
                elem.classList.add("tab");
                a_elem.setAttribute("href", `#div-tracks-${p_name}`)
                a_elem.append(`${p_name}`);
                elem.append(a_elem)
                playset.appendChild(elem);
                for (const t_name of t_names) {
                    var t_elem = document.createElement("li");
                    t_elem.id = `li-track-${t_name}`;
                    t_elem.classList.add('collection-item')
                    t_elem.append(t_name)
                    t_div.append(t_elem)
                    tracks.appendChild(t_div)
                }
            } 
        });
}

// TODO: Adding tracks to playset, adding what is clicked/played/stoped/paused, 
// autostop old when new is played

function markSelectedSound(elem_id) {
    const parent_elem = document.getElementById("ul-songs-list")
    const elem = document.getElementById(elem_id);
    const childern = parent_elem.childNodes;
    childern.forEach(element => {
        if (element.classList.contains("active")) {
            element.classList.remove("active");
        
        }
    });
    elem.classList.add("active");
    }

function addSoundToButton() {
    const parent_elem = document.getElementById("ul-songs-list")
    const elem = document.getElementById('add_button');
    const sound = parent_elem.getElementsByClassName("active");
    const sound_name = sound[0].innerHTML;
    const title = document.getElementById("selected-sound-title").value;

    const widget = $(`        <div class="col s3">
    <div class="card blue-grey darken-1">
        <div id="${button_id}" data-audio="/static/music/${sound_name}" class="card-content white-text waves-effect waves-light center-align"
            style="width: 100%; padding-top: 25%; padding-bottom: 25%;" onclick="playAudio(this.id);">
            <span class="card-title">${title}</span>
        </div>
        <div class="card-action">
            <div class="row">
                <div class="col s2"></div>
                <div class="col s3">
                    <div class="switch">
                        <label>
                            <input type="checkbox" id="rep${button_id}" onclick="pauseAudio(${button_id});">
                            <span class="lever" style="font-size: small;">
                                <p>Repeat</p>
                            </span>
                        </label>
                    </div>
                </div>

                <div class="col s1"></div>

                <div class="col s3">
                    <div class="input-field" style="margin-top: -15%;">
                        <input placeholder="sec" id="interval${button_id}" type="text" class="validate white-text"
                            style="text-align: center;">
                    </div>
                </div>
                <div class="col s3"></div>


            </div>
        </div>
    </div>
</div>`);
    button_id++
    widget.insertBefore(elem);

}

$(document).ready(function(){
    $('.tabs').tabs();
  });

$(window).on('load', function() {
    fillTabsWithTracks();
});