const discogs_search_link = 'https://api.discogs.com/database/search';

const discogsQuery = {
    per_page: '30',
    type: 'master',
    genre:"",
    style: "",
    page:"1",
}

function getDataFromApi(){
    $.ajax({
        headers: {
            Authorization: 'Discogs key=TvdijmQXQJoVKcxrkFcJ, secret=pzRyTYhlTDzaKHGVEmpCmHHGEgAVflWG'
        },
        dataType: "json",
        url: discogs_search_link,
        data: discogsQuery,
        success: showCoverThumbs,
    })
}

function sortByYear(a,b) {
    if(a.year === undefined){
        return 1;
    }
    let yearA = parseInt(a.year,10);
    let yearB = parseInt(b.year,10);
    if (yearA < yearB){
        return 1;
    }
    if (yearA > yearB){
        return -1;
    }
    if (yearA === yearB){
        return 0;
    }
}

function sortDataByYear(data){
    let sortedResults = data.results.slice(0).sort(sortByYear);
    return sortedResults;
}

function generateCoverThumbs(data){
    let results = sortDataByYear(data);
    let resultCoverString = results.map(function(a){
        if(a.year === undefined){
            a.year = 'Unknown Release Date';
        }
        if(a.thumb != false){
            return `<a class="result-cover" href="#${a.id}" data-lity>
            <img src="${a.thumb}" class="cover-art" alt="cover image for album: ${a.title}">
            <p class="album-year"><span class="sr-only">Release Year</span>${a.year}</p></a>
            <div id="${a.id}" class="lity-hide"><img class="cover-image" src="${a.cover_image}">
            <div class="album-info"><p class="album-artist-title">${a.title}</p><p class="album-label">Label: ${a.label}</div></p></div>
            </div>`;
    }
});
    return resultCoverString;
} 

function showCoverThumbs(data){
    let resultThumbs = generateCoverThumbs(data);
    let a11yNumOfResults = generateA11yResultsString(data, discogsQuery);
    $('.push-header').addClass('push-up-header');
    $('.search-feedback').addClass('sf-hidden');
    $('.typeahead').val('');
    $('.aria-results').append(a11yNumOfResults);
    $('.results-container').append(resultThumbs);
    generateMoreCoversFeature();
}

//a11y functions
function generateA11yResultsString(data, query){
    let ariaResultsString = `Showing ${data.results.length} album covers for ${query.genre}${query.style}`;
    return ariaResultsString;
}

//functions to handle more results
function generateMoreCoversFeature(){
    $('.results-container').append('<div class="result-cover get-more"><button class="more-covers-button">Get More Covers</button></div>');
    $(watchMoreResults);
}

function watchMoreResults(){
    $('.more-covers-button').click(function(event){
        $('.more-covers-button').parent().removeClass().addClass('see-more').empty().append('<span class="more-results">More Results --></span>')
        discogsQuery.page++;
        getDataFromApi();
    })
}

function watchSubmit(){
    $('.search-input').submit(function(event) {
        event.preventDefault();
        const searchInputVal = $(this).find('.tt-input').val();
        determineSearchValVaild(searchInputVal);
        $('.typeahead').typeahead('close');
    })
}

$(watchSubmit);

//eval if input is genre or style
function determineSearchValVaild(searchInputVal){
    let searchValGenreScore = $.inArray(searchInputVal, genres); //returns >= 0 if in array
    let searchValStyleScore = $.inArray(searchInputVal, styles); //returns >= 0 if in array
    let searchValScore =searchValGenreScore+searchValStyleScore;
    if(searchValScore >= 0){
        determineSearchInputCat(searchInputVal);
        $('.results-container').empty();
    }
    else{
        $('.search-feedback').removeClass('sf-hidden');
    }
}

function determineSearchInputCat(searchInputVal){
  let searchInputCatScore = $.inArray(searchInputVal,genres);
  if(searchInputCatScore>0){
    discogsQuery.genre = searchInputVal;
    discogsQuery.style = '';
  }
  else{
    discogsQuery.style = searchInputVal;
    discogsQuery.genre = '';
  }
  getDataFromApi();
}

//typeahead functions
//typeahead dataset
const genres = ["Blues","Brass & Military","Children's","Classical","Electronic","Folk, World, & Country","Funk / Soul",
"Hip-Hop","Jazz","Latin","Non-Music","Pop","Reggae","Rock","Stage & Screen",]

const styles = ["Pop Rock","House","Punk","Experimental","Synth-pop","Vocal","Techno","Disco","Alternative Rock","Soul","Indie Rock",
  "Hardcore","Electro","Ambient","Hard Rock","Trance","Folk","Ballad","Rock & Roll","Heavy Metal","Country","Downtempo","Chanson","Psychedelic Rock",
  "Classic Rock","Folk Rock","Noise","Funk","Prog Rock","Tech House","Euro House","Schlager","New Wave","Deep House","Soundtrack","Easy Listening","Industrial",
  "Drum n Bass","Black Metal","Blues Rock","Rhythm & Blues","Progressive House","Abstract","Minimal","Death Metal","Romantic","Garage Rock","Soft Rock","Europop",
  "RnB/Swing","Classical","Thrash","Acoustic","Dub","Breakbeat","Dancehall","Progressive Trance","Big Band","Contemporary Jazz","Swing","Country Rock","Breaks","Reggae",
  "Hard Trance","IDM","Drone","Gospel","Modern","Baroque","Roots Reggae","Avantgarde","Art Rock","Contemporary","Doom Metal","Fusion","Gangsta","Pop Rap","Jazz-Funk","Leftfield",
  "Grindcore","Acid","Rockabilly","Hard House","Hip Hop","Lo-Fi","Goth Rock","Ska","Dark Ambient","Beat","Dubstep","Post Rock","Soul-Jazz","African","Opera","Glam","Modern Classical",
  "Indie Pop","Italo-Disco","Comedy","Score","Power Pop","Trip Hop","Post-Punk","Jazz-Rock","Garage House","Spoken Word","Free Improvisation","Instrumental","Conscious","Bop","Theme",
  "Religious","Free Jazz","Electro House","Happy Hardcore","Latin Jazz","New Age","Oi","EBM","Jungle","Psy-Trance","Salsa","UK Garage","Stoner Rock","Hard Bop","Emo","Symphonic Rock",
  "Italodance","Surf","Shoegaze","Smooth Jazz","Tribal","Future Jazz","Musical","Cool Jazz","MPB","Doo Wop","Hardstyle","Post Bop","Latin","Field Recording","Gabber","Novelty","Story",
  "J-pop","Samba","Bolero","Grunge","Arena Rock","Bluegrass","Dance-pop","Hi NRG","Parody","Southern Rock","Glitch","Eurodance","Laïkó","Darkwave","Celtic","Acid House","Dixieland",
  "Krautrock","Nu Metal","Flamenco","Dub Techno","Space Rock","Radioplay","Thug Rap","Speed Metal","Cumbia","Tango","Freestyle","Pop Punk","Brit Pop","Acid Jazz","Big Beat","Power Electronics",
  "Reggae-Pop","Musique Concrète","Tribal House","Breakcore","Bossa Nova","Mod","Polka","Hardcore Hip-Hop","Rumba","Broken Beat","Bass Music","Cha-Cha","Rocksteady","Electric Blues","Poetry",
  "Bossanova","Country Blues","Neo-Classical","Neofolk","Interview","Metalcore","Hindustani","Power Metal","Ethereal","Math Rock","Afrobeat","Audiobook","Chiptune","Goa Trance","Hip-House",
  "Chicago Blues","Modal","Avant-garde Jazz","Lovers Rock","Calypso","Lounge","Mambo","Jazzy Hip-Hop","Contemporary R&B","Grime","Rhythmic Noise","Merengue","Ragga","Neo Soul","AOR",
  "Psychedelic","Psychobilly","Sludge Metal","Progressive Metal","Bollywood","Cut-up/DJ","Renaissance","Afro-Cuban","Ragtime","Ragga HipHop","Vaporwave","Education","Éntekhno","Marches",
  "Minimal Techno","Boogie","Pacific","Makina","Trap","Speedcore","Jazzdance","Volksmusik","Space-Age","Synthwave","Crust","Berlin-School","Funk Metal","Euro-Disco","Neo-Romantic","Dialogue",
  "Indian Classical","Boom Bap","Nursery Rhymes","Medieval","Gothic Metal","New Beat","Afro-Cuban Jazz","Post-Hardcore","Highlife","Impressionist","Ranchera","Son","Guaguancó","Eurobeat",
  "G-Funk","Political","Honky Tonk","Tech Trance","New Jack Swing","Soca","Acid Rock","Delta Blues","Educational","Fado","Guaracha","Harsh Noise Wall","Brass Band","Music Hall","Jumpstyle",
  "Viking Metal","Zouk","Nordic","Piano Blues","Speech","Monolog","Promotional","Modern Electric Blues","Nu-Disco","Speed Garage","Military","Soukous","Melodic Hardcore","Operetta","Horrorcore",
  "Folk Metal","Ghetto","Hard Techno","Post-Modern","P.Funk","Special Effects","Gypsy Jazz","Illbient","Cubano","Melodic Death Metal","Romani","Harmonica Blues","Boogaloo","Canzone Napoletana",
  "Cajun","No Wave","Texas Blues","Kayōkyoku","Mariachi","Descarga","Therapy","Light Music","Chillwave","Louisiana Blues","Italo House","Pub Rock","Jump Blues","DJ Battle Tool","Rebetiko",
  "Reggaeton","Deep Techno","Screw","Witch House","Forró","Pachanga","Swingbeat","Crunk","Deathcore","Norteño","Séga","Beguine","Sound Collage","Juke","Bounce","Free Funk","Deathrock",
  "Nueva Cancion","Hands Up","Charanga","Donk","Klezmer","Technical","Bubblegum","Boogie Woogie","Sermon","Corrido","Compas","Bayou Funk","Coldwave","Aboriginal","Enka","Bassline","Vallenato",
  "Raï","Hillbilly","Copla","Zydeco","Goregrind","Dungeon Synth","Sound Art","Son Montuno","Movie Effects","Guajira","Tejano","Népzene","Min'yō","Public Broadcast","Electroclash","Disco Polo",
  "Steel Band","Early","Batucada","Porro","Luk Thung","Chinese Classical","Skiffle","Tropical House","Choral","Britcore","Danzon","Turntablism","Miami Bass","Karaoke","Bachata","Western Swing",
  "Quechua","Pipe & Drum","Swamp Pop","Gamelan","Go-Go","Lambada","Schranz","Cloud Rap","Andalusian Classical","Conjunto","Doomcore","Bhangra","Progressive Breaks","Axé","Plena","Nueva Trova",
  "Kaseko","East Coast Blues","J-Core","Ghetto House","Sound Poetry","Dub Poetry","Persian Classical","Ottoman Classical","Funeral Doom Metal","Public Service Announcement","Catalan Music",
  "Sea Shanties","Hiplife","Beatdown","Hyphy","Phleng Phuea Chiwit","Reggae Gospel","Twelve-tone","Trova","Barbershop","Basque Music","Gogo","K-pop","Mento","Memphis Blues","Cape Jazz",
  "Piedmont Blues","Marimba","Kwaito","Minneapolis Sound","Skweee","Overtone Singing","Pasodoble","Jibaro","Guarania","Mizrahi","Griot","Música Criolla","Carnatic","Timba","Luk Krung",
  "Ghettotech","Sephardic","Baltimore Club","Favela Funk","Serial","Jota","Hard Beat","Beatbox","Neo Trance","Joropo","Mugham","Chamamé","Cuatro","Sámi Music","Sonero","Maloya",
  "Mbalax","Junkanoo","Thai Classical","Mouth Music","Gagaku","Post-Metal","Funkot","Keroncong","Rune Singing","Philippine Classical","Champeta","Break-In","Funaná","Klasik",
  "Rapso","Ballroom","Kizomba","Korean Court Music","Bubbling","Cambodian Classical","Lao Music","Salegy","Bangladeshi Classical","Bongo Flava","Zamba","Rock Opera","Néo Kyma",
  "UK Funky","Chacarera","Nitzhonot","Piobaireachd","Spaza","Liscio","Candombe","Motswako","Occitan","Zemer Ivri","Azonto","Yemenite Jewish","Musette"];


//typeahead
$(document).ready(function(){
  // Constructing the suggestion engine
var discogsGenres = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: genres
  });

var discogsStyles = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: styles
  });
  
  // Initializing the typeahead
  $('.typeahead').typeahead({
      hint: true,
      highlight: true, /* Enable substring highlighting */
      minLength: 1 /* Specify minimum characters required for showing result */
  },
  {
      name: 'genres',
      source: discogsGenres,
      templates: {
        header: '<h3 class="suggestion-cat">Genre</h3>',
      }
  },
  {
      name: 'styles',
      source: discogsStyles,
      templates: {
          header: '<h3 class="suggestion-cat">Styles</h3>'
          
      }
  });
});