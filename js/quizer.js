let sec_per_turn = 30;

let sec = 0;
let song_count = 0;
let poster_count = 1;
let answers;
let correct = 0;
let score = 0;
let f_packages = 1;
let m_packages = 1;
let gr_packages = 1;
let hardcore_level = 1;
let options;
let skill = '';
let rate = '';
let lang = '';
let year = '';
let genre = '';
let artist_type = '';
let audioPath = 'audio/ru/';
let imgPath = 'img/';
let finalMessage = '';
let modeToggle;
let setMedia;
let rightAnswer;
let toggleFlag = false;
let withoutAnswers = false;
let isSingle = true;
let audio;
let start_count_down = false;
let rating = [];
let songs_backup;
let overall;

function mirror(txt, speed = 20, color){
$('#mirror_txt').replaceWith( '<marquee id="mirror_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function mirror_eval(txt, speed = 20, color){
$('#eval_txt').replaceWith( '<marquee id="eval_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function choose(num){
	$('#pause').show();
	let answer = '';
	if(num){
		answer = options[num-1];
	} else {
		answer = $('#answer_input').val();
	}
	start_count_down = false;
	if(audio && audio.paused){
		audio.play();
	}
	modeToggle();
	let group = songs[song_count].group;
	let song = songs[song_count].song;
	let song_year = songs[song_count].year;
	if(!song_year) {
		song_year = '';
	} else {
		song_year = ' (' + song_year + ')';
	}
	if(answer.toUpperCase() == songs[song_count].group.toUpperCase()){
		mirror_eval(rightAnswer(song_year), 20, "green");
		$("#option_" + num).addClass("green");
		correct++;
		if (!~rate.indexOf('+ ' + group)){
			$('#rate').html(rate = '<br/>+ ' + group + rate);
		}
		$('#score').html(++score);
	} else {
		mirror_eval(rightAnswer(song_year), 20, "red");
		$("#option_" + num).addClass("red");
		$('#skill').html(skill = '<br/>- ' + group + '<br/>"' + song + '"' + song_year + skill);
	}
		toggleGameButton();
		next();
}

function rightAnswer_EN(){
	return songs[song_count].song;
}

function rightAnswer_RU(year){
	return songs[song_count].group + ' "' + songs[song_count].song + '"' + year;
}

function next(){
	if(song_count==songs.length-1){
		$('#song_count').html(song_count+1);
		$('#song').css("visibility", "hidden");
		$('#mirror').show();
		let overall = songs.length
		let percent = calculatePercent(correct,overall);
		let msg = 'Верно: ' + percent + '%('
		+ correct + '/' + overall + ').';
		let color = 'red';
		if(percent>=65){
			color = 'green';
			msg+=finalMessage; 
		} else{
			msg+=' Послушайте ещё песенок и попробуйте снова.'
		}
		mirror(msg, 20, color);
		emptyOptions();
		song_count=0;
		shuffle(songs);
	} else {
		$('#song_count').html(++song_count);
		toggleLearn();
	}
}

function calculatePercent(correct,overall){
	let num = correct/overall*100;
	return parseFloat(num).toFixed(0);
}

function toggle(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
		$('.game_button').prop('disabled', true);
	} else {
		$('#learn').prop('disabled', true);
		$('.game_button').prop('disabled', false);
	}
}

function toggleLearn(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
	} else {
		$('#learn').prop('disabled', true);
	}
}

function toggleGameButton(){
	if($('.game_button').is('[disabled]')){
		$('.game_button').prop('disabled', false);
	} else {
		$('.game_button').prop('disabled', true);
	}
}

let lang_letter;

function learn(){
	hide_navi_icons();
	if(withoutAnswers){
		$('.without_answers').show();
	} else {
		$('.answer').show();
	}
	$('#pause').hide();
	$('#back').hide();
	$('#package_content').hide();
	$('#answer_input').val('');
	decolorOptions();
	modeToggle();
	toggleLearn();
	toggleGameButton();
	randomAnswers();
	setMedia();
	count_down(sec_per_turn);
	$('#mirror').hide();
}

async function sec_15(){
	if(audio.paused){
		audio.play();
		count_down(15);
	} else {
		audio.currentTime += 15;
		if(time_left < 15){
			time_left = 15;
		}
	}
}

function song_pause() {
	if(audio.paused){
		audio.play();
	} else {
		audio.pause();
	}
}

let time_left = 0;
async function count_down(end){
	start_count_down = true;
	time_left = end;
	while(start_count_down && time_left-- > 0){
		await sleep(1000);
		if(isSingle){	
			$('#sec').html(new Intl.NumberFormat().format(sec+=1));
		} else if(isP1Turn) {
			$('#p1_sec').html(new Intl.NumberFormat().format(p1_sec+=1));
		} else {
			$('#p2_sec').html(new Intl.NumberFormat().format(p2_sec+=1));
		}
	}
	if(start_count_down){
		audio.pause();
	}
}

let time_min = 0;
async function count_time(){
	while(true){
		await sleep(60000);
		$('#min').html(++time_min);
	}
}

function time_toggle() {
	$('#sec_h2').toggle();
	$('#min_h2').toggle();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function decolorOptions(){
	for(let i = 1; i <= 4; i++){
		$("#option_" + i).removeClass("red");
		$("#option_" + i).removeClass("green");
	}
}

function setAudio(){
	if(audio){
		audio.pause();
	}
	if(!songs[song_count].audioPath){
		audio = new Audio(audioPath + songs[song_count].id + '.mp3');
	} else {
		audio = new Audio(songs[song_count].audioPath + '.mp3');
	}
	audio.play();
}

function randomAnswers(){
	options = [];
	let current_answers = answers;
	current_answers = removeDuplicates(current_answers);
	let correctAnswer = songs[song_count].group;
	options.push(correctAnswer);
	removeItemOnce(current_answers,correctAnswer);
	if(current_answers.length > 4){
		removeItemOnce(answers,correctAnswer);
	} else {
		current_answers = removeItemOnce(removeDuplicates(songs.map(item=>item.group)),correctAnswer);
	}
	shuffle(current_answers);
	options.push(current_answers[0]);
	options.push(current_answers[1]);
	options.push(current_answers[2]);
	shuffle(options);
	$('#option_1').html(options[0]);
	$('#option_2').html(options[1]);
	$('#option_3').html(options[2]);
	$('#option_4').html(options[3]);
}

function skipGroup(flag, group){
	group = group.replace("#", "'");
	if(!flag.checked){
		songs = jQuery.grep(songs, function(value) {
		  return value.group != group;
		});
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	} else {
		$('.group_item').prop('checked', true);
		songs = songs_backup;
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	}
}

function emptyOptions(){
	$('#option_1').html('');
	$('#option_2').html('');
	$('#option_3').html('');
	$('#option_4').html('');
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeDuplicates(arr) {
	var uniqueValues = [];
	$.each(arr, function(i, el){
		if($.inArray(el, uniqueValues) === -1) uniqueValues.push(el);
	});
	return uniqueValues;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function play_pause() {
   var mediaVideo = $("#song").get(0);
   if (mediaVideo.paused) {
       mediaVideo.play();
   } else {
       mediaVideo.pause();
  }
}

function toggleArtist(){
	if(toggleFlag){
		$('#artist').attr("src",  songs[song_count].imgPath + ".jpg");
		$('#artist').toggle();
	} else {
		toggleFlag = true;
	}
}

function load(){
	$('#answer_input').keypress(function (e) {
	  if (e.which == 13) {
		choose();
		return false;
	  }
	});	
	setup();
}

// RU songs

const ru_2000_m_icon = [
	'easy',
	'medium',
	'fabrika'
];

const RU_2000_M_PACK_1 = 1;
const RU_2000_M_PACK_2 = 2;	
const RU_2000_M_PACK_3 = 3;	

let ru_2000_m = [
	{
		pack : RU_2000_M_PACK_1,
		group : 'Стас Пьеха',
		song : "Одна звезда"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Иракли',
		song : "Лондон-Париж"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Николай Расторгуев',
		song : "Берёзы (ft Сергей Безруков)"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Андрей Губин',
		song : "Такие девушки как звезды"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Андрей Губин',
		song : "Танцы"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Валерий Меладзе',
		song : "Параллельные"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Дима Билан',
		song : "Мулатка"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Александр Маршал',
		song : "Белый пепел"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Игорь Корнелюк',
		song : "Город, которого нет"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Григорий Лепс',
		song : "Рюмка водки"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Данко',
		song : "Малыш"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Иракли',
		song : "Капли абсента"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Стас Пьеха',
		song : "На ладони линия"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Сергей Трофимов',
		song : "Город в пробках"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Денис Майданов',
		song : "Вечная любовь"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Владимир Кузьмин',
		song : "Зачем уходишь ты?"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Леонид Агутин',
		song : "Граница (ft Отпетые мошенники)"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Леонид Агутин',
		song : "Аэропорты (ft Владимир Пресняков)"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Mr Credo',
		song : "Чудная долина"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Андрей Алексин',
		song : "Страшная"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Тимати',
		song : "Не сходи с ума"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'DJ SMASH',
		song : "Moscow Never Sleeps"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'DJ Дождик',
		song : "Почему же"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Noise MC',
		song : "За Закрытой Дверью"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Серёга',
		song : "Возле дома твоего"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Серёга',
		song : "Кружим по району"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Лигалайз',
		song : "Джаная (ft Dato)"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Лигалайз',
		song : "Я Хочу Быть С Тобой (ft Бархат)"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Лигалайз',
		song : "Моя Москва"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Юрий Шатунов',
		song : "Забудь"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Баста',
		song : "Моя игра"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Юрий Титов',
		song : "Понарошку"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Сергей Зверев',
		song : "Алла"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Джанго',
		song : "Холодная весна"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Айдамир Мугу',
		song : "Чёрные Глаза"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Паскаль',
		song : "Шёлковое Сердце"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Дмитрий Колдун',
		song : "Я для тебя"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Дмитрий Колдун',
		song : "Звезда"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Дмитрий Колдун',
		song : "Настройся на меня"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Никита',
		song : "Слова Как Пули"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Никита',
		song : "Не бойся и беги"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Никита',
		song : "Я не люблю тебя (ft Анастасия Стоцкая)"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Mr Credo',
		song : "Буду, думать"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Mr Credo',
		song : "Автобан"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Валерий Меладзе',
		song : "Небеса"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Валерий Меладзе',
		song : "Иностранец"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Дима Билан',
		song : "Changes"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Дима Билан',
		song : "Я твой номер один"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Антон Зацепин',
		song : "Ниже ростом только Губин"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Антон Зацепин',
		song : "Книжки о любви"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Антон Зацепин',
		song : "Улетаю"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'DJ SMASH',
		song : "Волна (ft Fast Food, Люды Соколовой и Павла «Снежка» Воли)"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'DJ SMASH',
		song : "Любовь побеждает время (ft Дмитрий Дибров)"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Юрий Шатунов',
		song : "Не бойся"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Юрий Шатунов',
		song : "Запиши мой голос на кассету"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Евгений Анегин',
		song : "Луна"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Евгений Анегин',
		song : "Песня О Любви"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Серёга',
		song : "Мой бит"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Никита Малинин',
		song : "Вспышка в ночи"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Леонид Руденко',
		song : "Everybody"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Михаил Гребенщиков',
		song : "Танцы-Обниманцы"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Михаил Гребенщиков',
		song : "Булки"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Сергей Лазарев',
		song : "Найди меня",
		year : 2009
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Сергей Лазарев',
		song : "Lazerboy (ft Тимати)",
		year : 2008
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Сергей Лазарев',
		song : "Вспоминай",
		year : 2006
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Корни',
		song : "Я теряю корни (2002) Фабрика-1"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Корни',
		song : "5000 тонн света (2002) Фабрика-1"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Фабрика',
		song : "Про любовь (2002) Фабрика-1"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Фабрика',
		song : "Ой, мама, я влюбилась (2002) Фабрика-1"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Михаил Гребенщиков',
		song : "Танцы-обниманцы (2002) Фабрика-1"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Михаил Гребенщиков',
		song : "Как хорошо нам сегодня вечером (2002) Фабрика-1"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Михаил Гребенщиков',
		song : "Уйдём вдвоём (2002) Фабрика-1"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Юлия Савичева',
		song : "Высоко (2003) Фабрика-2"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Юлия Савичева',
		song : "Корабли (2003) Фабрика-2"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Юлия Савичева',
		song : "Прощай, моя любовь (2003) Фабрика-2"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Полина Гагарина',
		song : "Где ты? (2003) Фабрика-2"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Мария Ржевская',
		song : "Когда я стану кошкой (2003) Фабрика-2"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Мария Ржевская',
		song : "Зачем я ждала тебя (2003) Фабрика-2"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Пьер Нарцисс',
		song : "Я шоколадный заяц (2003) Фабрика-2"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Пьер Нарцисс',
		song : "Акуна Матата (2003) Фабрика-2"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Иракли',
		song : "Вова-чума (2003) Фабрика-2"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Иракли',
		song : "Закрой глаза рукой (2003) Фабрика-2"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Елена Терлеева',
		song : "Нам-Нам (2003) Фабрика-2"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Елена Темникова',
		song : "Тайна (2003) Фабрика-2"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Елена Темникова',
		song : "Дальше всех (2003) Фабрика-2"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Никита Малинин',
		song : "Котёнок (2003) Фабрика-3"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Никита Малинин',
		song : "Для неё (2003) Фабрика-3"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Юлия Михальчик',
		song : "Питер (2003) Фабрика-3"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Юлия Михальчик',
		song : "Птица (2003) Фабрика-3"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Юлия Михальчик',
		song : "Письмо (2003) Фабрика-3"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Юлия Михальчик',
		song : "Голоса (2003) Фабрика-3"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Светлана Светикова',
		song : "Навсегда (2003) Фабрика-3"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Светлана Светикова',
		song : "Вешняя (2003) Фабрика-3"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Александр Киреев',
		song : "Мир, который подарил тебя (2003) Фабрика-3"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Александр Киреев',
		song : "Ночь любви (2003) Фабрика-3"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Александр Киреев',
		song : "Маленький мальчик (2003) Фабрика-3"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Тутси',
		song : "Самый-самый (2003) Фабрика-3"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Ирина Дубцова',
		song : "О нём (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Антон Зацепин',
		song : "Книжки о любви (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Антон Зацепин',
		song : "Ниже ростом только Губин (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Стас Пьеха',
		song : "Одна звезда (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Алекса',
		song : "Где же ты? (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Алекса',
		song : "Лунная тропа (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Юрий Титов',
		song : "Понарошку (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Ангина',
		song : "Кому какое дело (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Ксения Ларина',
		song : "Пузырьки лимонада (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Доминик Джокер',
		song : "Рим-Париж (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Доминик Джокер',
		song : "Ты нужна мне (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Тимати',
		song : "Плачут небеса (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Тимати',
		song : "Боль — это любовь (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Тимати',
		song : "О, Боже (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Банда',
		song : "Новые люди (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Анастасия Кочеткова',
		song : "Мне нужен один ты (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Анастасия Кочеткова',
		song : "Мама, я люблю тебя (2004) Фабрика-4"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Виктория Дайнеко',
		song : "Лейла (2004) Фабрика-5"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Виктория Дайнеко',
		song : "Я буду лучше (2004) Фабрика-5"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Руслан Масюков',
		song : "Аривидерчи, малышка (2004) Фабрика-5"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Руслан Масюков',
		song : "Целься (2004) Фабрика-5"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Наталья Подольская',
		song : "Поздно (2004) Фабрика-5"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Наталья Подольская',
		song : "Everybody dance (2004) Фабрика-5"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Михаил Веселов',
		song : "Моя вина (2004) Фабрика-5"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Михаил Веселов',
		song : "Ты скажи (2004) Фабрика-5"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Елена Кукарская',
		song : "По маленькой (2004) Фабрика-5"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Елена Кукарская',
		song : "Жу-жу (2004) Фабрика-5"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Дарья Клюшникова',
		song : "Сердце не тронешь (2004) Фабрика-5"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Юлианна Караулова',
		song : "Я попала в сети (2004) Фабрика-5"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Мигель',
		song : "Песня настоящего фаната Кайли Миноуг (2004) Фабрика-5"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Дмитрий Колдун',
		song : "Несерьёзно (2006) Фабрика-6"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Дмитрий Колдун',
		song : "Прости за всё (2006) Фабрика-6"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Челси',
		song : "Самая любимая (2006) Фабрика-6"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Челси',
		song : "Чужая невеста (2006) Фабрика-6"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Согдиана',
		song : "Сердце-магнит (2006) Фабрика-6"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Согдиана',
		song : "Подожди (2006) Фабрика-6"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Прохор Шаляпин',
		song : "Волшебная скрипка (2006) Фабрика-6"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Прохор Шаляпин',
		song : "Проказница (2006) Фабрика-6"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Зара',
		song : "Любовь-красавица (2006) Фабрика-6"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Анастасия Приходько',
		song : "Вера (2007) Фабрика-7"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Анастасия Приходько',
		song : "Группа крови (2007) Фабрика-7"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Анастасия Приходько',
		song : "Три зимы (2007) Фабрика-7"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'БиС',
		song : "Твой или ничей (2007) Фабрика-7"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'БиС',
		song : "Нет, нет, нет (2007) Фабрика-7"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Дакота',
		song : "Я всё знала (2007) Фабрика-7"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Дакота',
		song : "Спички (2007) Фабрика-7"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Дакота',
		song : "Одна (2007) Фабрика-7"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Дакота',
		song : "Лучшему другу (2007) Фабрика-7"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Инь-Ян',
		song : "Мало да помалу (2007) Фабрика-7"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Инь-Ян',
		song : "Сохрани меня (2007) Фабрика-7"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Марк Тишман',
		song : "Я стану твоим ангелом (2007) Фабрика-7"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Марк Тишман',
		song : "Пять цветов (2007) Фабрика-7"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Марк Тишман',
		song : "Ярким пламенем (2007) Фабрика-7"
	},
	{
		pack : RU_2000_M_PACK_3,
		group : 'Юлианна Караулова',
		song : "Дождь (2004) Фабрика-5"
	}
];

let ru_2000_m_1 =	ru_2000_m.filter(item => item.pack == 1);
let ru_2000_m_2 =	ru_2000_m.filter(item => item.pack == 2);
let ru_2000_m_3 =	ru_2000_m.filter(item => item.pack == 3);

let music = [
	{
		arr: ru_2000_m,
		lang: 'ru',
		year: '2000',
		type: 'm',
		packs: [
				{
					arr: ru_2000_m_1,
					name: 'RU 2000s Male: Easy',
				},
				{
					arr: ru_2000_m_2,
					name: 'RU 2000s Male: Medium',
				},
				{
					arr: ru_2000_m_3,
					name: 'RU 2000s Star Fabrics',
				}
			]
	},
]

let songs_to_map;
let mapping_result;
function map_songs(){
	back = back_to_current_pack;
	$('.package').hide();
	$('#mirror').hide();
	$('#map').hide();
	$('#package_content').hide();
	$('#mapping_content').show();
	toggleLearn();
	for(var j=0; j < music.length; j++){
		music[j].arr = generateSongIdsWithPrefix(music[j].arr, music[j].lang, 
												music[j].year, music[j].type);
	}
	showMapping(0, "en_2000_gr", "gr");
}

function select_mapping_button(suffix, type){
	$('.gr').attr('src', 'img/chart/gr.png');
	$('.m').attr('src', 'img/chart/m.png');
	$('.f').attr('src', 'img/chart/f.png');
	let selected = 'img/chart/' + type + '_selected.png';
	$('#btn_' + suffix).attr('src', selected);
}

function showMapping(index, suffix, type){
	select_mapping_button(suffix, type);
	mapping_result = '';
	let h1_start = `<h1>`;
	let h1_end = `</h1>`;
	let br = `<br/>`;
	let hr = `<hr/>`;
	for(var j=0; j < music[index].packs.length; j++){
		mapping_result += h1_start + music[index].packs[j].name + h1_end;
		mapping_result += map_songs_format(music[index].packs[j].arr);
		mapping_result += br + hr;
	}
	$('#mapping_content').html(mapping_result);
}

function generateSongIdsWithPrefix(arr, lang, year, type){
	let prefix = lang + '_' + year + '_' + type + '_';
	let audioPath = 'audio/' + lang + '/' + year + '/' + type + '/';
	let imgPath = 'img/' + lang + '/' + year + '/' + type + '/';
	let id;
	for(var i=1; i <= arr.length; i++){
		id = 'Song (' + i + ')';
		arr[i-1].id = prefix + id;
		arr[i-1].audioPath = audioPath + id;
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generateSongIdsByPaths(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function generateSongIdsImgGroup(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generatePathsBySongName(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].audioPath = audioPath + arr[i-1].group;
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function map_songs_format(arr){
	arr = arr.filter(song => !song.ignore);
	let h2_start = `<h2 style='margin-bottom: -20px;'>`;
	let h2_end = `</h2>`;
	let h3_start = `<h3 style='font-family: serif; margin-left: 30px;' >`;
	let h3_end = `</h3>`;
	let div_start = `<div>`;
	let div_end = `</div>`;
	let br = `<br/>`;
	//let img_start = `<img width="300" height="300" src="`;
	let img_end = `.jpg" />`;
	let img_play_start = `<img class='pointer onhover' width="30" height="30" src="img/navi/play.png" onclick="playSong('`;
	let img_play_middle = `')" id='`;
	let img_play_end = `'" />`;
	let space = '&nbsp;';
	songs_to_map = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let curr_group = songs_to_map[0].group;
	//let result = img_start + songs_to_map[0].imgPath + img_end + br
	let result = h2_start + curr_group + ':' + h2_end + h3_start;
	let id;
	for(let i = 0; i < songs_to_map.length; i++){
		id = songs_to_map[i].id.replace(' ', '_').replace('(', '').replace(')', '');
		if(curr_group != songs_to_map[i].group){
			curr_group = songs_to_map[i].group;
			result += h3_end + h2_start + songs_to_map[i].group + ':' + h2_end 
			+ h3_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id
			+ img_play_middle + id + img_play_end + div_end;
		} else {
			result += div_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id 
			+ img_play_middle + id + img_play_end
			+ div_end;
		}
	}
	result += h3_end;
	return result;
}

let last_song_id;
let is_playing = false;
function playSong(audioPath, id){
	if(id == last_song_id){
		if(is_playing){
			audio.pause();
			$('#' + id).attr('src', 'img/navi/play.png');
			is_playing = false;
		} else {
			audio.play();
			$('#' + id).attr('src', 'img/navi/pause.png');
			is_playing = true;
		}
	} else {
		if(audio){
			audio.pause();
		}
		$('#' + last_song_id).attr('src', 'img/navi/play.png');
		last_song_id = id;
		is_playing = true;
		$('#' + id).attr('src', 'img/navi/pause.png');
		audio = new Audio(audioPath + '.mp3');
		audio.play();
	}
}

function getGroupNamesSorted(){
	let group_names = removeDuplicates(songs.map(item=>item.group)).sort();
	return group_names;
}

function showGroupNames(){
	songs_backup = songs;
	let group_names = getGroupNamesSorted();
	
	let tag_1 = `<h3><label class='checkbox-google'><input class='group_item' checked id='group_`;
	let tag_2 = `' type='checkbox' onchange='skipGroup(this,"`;
	let tag_3 = `");'><span class='checkbox-google-switch'></span></label> `;
	let tag_4 =	`</h3>`;
	let result = '';
	for(let i = 0; i < group_names.length; i++){
		result += tag_1 + i + tag_2 + group_names[i].replace("'", "#") + tag_3 + group_names[i] + tag_4;
	}
	$('#package_content').html(result);
	$('#package_content').show();
	toggleLearn();
}

function hide_navi_icons(){
	$('#map').hide();
	$('#mirror').hide();
	$('.settings').hide();
	
	$('#sec_15').show();
	$('#back').show();
}

let gr_package_names = [];
let package_names;

function show_packages(num){
	for(var i=1; i <= num; i++){
		if(package_names[i-1]){
			$('#package_' + i).attr("src", 'img/package/' + package_names[i-1] + ".png");
		} else {
			$('#package_' + i).attr("src", 'img/package/' + i + ".png");
		}
		$('#package_' + i).show();
	}
}

function package_num(num){
	$('#current_pack').show();
	$('#current_pack').attr('src', $('#package_' + num).attr('src'));
	$('.package').hide();
	setPathsByPack(num);
	showGroupNames();
}

function setPaths(artist_type, package_num, genre){
		let songs_str = lang + '_' + year;
			audioPath = 'audio/' + lang + '/' + year + '/';
			imgPath = 'img/' + lang + '/' + year + '/';
		if(genre){
			songs_str += '_' + genre;
			audioPath += genre + '/';
			imgPath += genre + '/';
		}
		if(artist_type){
			songs_str += '_' + artist_type;
			audioPath += artist_type + '/';
			imgPath += artist_type + '/';
		}
		if(package_num){
			songs_str += '_' + package_num;
			audioPath += package_num + '/';
			imgPath += package_num + '/';
		}
		songs = generateSongIds(eval(songs_str));
		answers = songs.map(item=>item.group);
		finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
		$('#total').html(songs.length);
		shuffle(songs);
}

function setPathsByPack(num){
	let arr = generateSongIds(eval(lang + '_' + year + '_' + artist_type));
	songs = arr.filter(song => song.pack == num && !song.ignore);
	songs.forEach(song => {
		song.audioPath = 'audio/' + lang + '/' + year + '/' + artist_type + '/' + song.id;
		song.imgPath = 'img/' + lang + '/' + year + '/' + artist_type + '/' + song.group;
	});
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	shuffle(songs);
}
	
function setMusicalAlphabet(){
	let result = [];
	let arr = generateSongIds(eval(lang + '_' + year + '_gr'));
	let arr_pack;
	audioPath = 'audio/' + lang + '/' + year + '/gr/';
	imgPath = 'img/' + lang + '/' + year + '/gr/';
	for(let i = 1; i <= gr_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Группа', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_m'));
	audioPath = 'audio/' + lang + '/' + year + '/m/';
	imgPath = 'img/' + lang + '/' + year + '/m/';
	for(let i = 1; i <= m_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнитель', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_f'));
	audioPath = 'audio/' + lang + '/' + year + '/f/';
	imgPath = 'img/' + lang + '/' + year + '/f/';
	for(let i = 1; i <= f_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнительница', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	result = result.flat();
	shuffle(result);
	songs = result.slice(0, 20);
	answers = songs.map(item=>item.group);
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	showGroupNames();
}
	
function setMusicalAlphabetPack(arr, type, audioPath, imgPath){
	shuffle(arr);
	arr = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let group = arr[0].group;
	let result = [];
	result.push(arr[0]);
	for(let i = 1; i < arr.length; i++){
		if(group == arr[i].group){
			continue;
		} else {
			group = arr[i].group;
			result.push(arr[i]);
		}
	}
	result.forEach(song => {
		song.letter = Array.from(song.group)[0];
		song.type = type;
		song.audioPath = audioPath + song.id;
		song.imgPath = imgPath + song.group;
	});
	return result;
}

function generateSongIds(arr){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
	}
	return arr;
}

let back;
let expressMode = false;
let generateSongs;
let generateArr;
let generateAudioPath;
let generateImgPath;

function setup(){
	lang = 'ru';
	year = '2000';
	artist_type = 'm';
	modeToggle = toggleArtist;
	setMedia = setAudio;
	rightAnswer = rightAnswer_RU;
	count_time();
	package_names = ru_2000_m_icon;
	show_packages(package_names.length);
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	useUrlParam();
}

let pack_num;
let year_url = 'https://sunquiz.netlify.app/2000';

function useUrlParam() {
	var url_string = window.location.href; 
	var url = new URL(url_string);
	pack_num = url.searchParams.get("pack");
	if(pack_num){
		package_num(pack_num);
	}
	back = back_to_browser;
}

function back_to_browser(){
	window.location.href = year_url;
}

function back_to_current_pack(){
	back = back_to_browser;
	$('#mapping_content').hide();
	$('#map').show();
	package_num(pack_num);
}