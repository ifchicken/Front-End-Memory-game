/*
 * Create a list that holds all of your cards
 */
let deck = document.querySelectorAll('.card');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
//    console.log(array);
    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let star = 3;
const star_arr = document.querySelectorAll('.fa-star');
let move = 0;
let moves = document.querySelector('.moves');
let secs = 0;
let sec = 0;
let min = 0;
let timer = document.querySelector('.timer');
let time_start = false;
let time_x;
const reset = document.querySelector('.restart');
const open_card_class = ['open', 'show'];
const not_init_card_class = ['match', 'open', 'show'];
let remain = 16;

// used for delay the comparisin
let flag = false;

// for 2 cards comparison
let opened = new Array();

// reset event listener
reset.addEventListener('click', function() {
  console.log('abcd');
  game_init();
})

// compare 2 cards
function card_open(card) {
  let pattern = card.firstElementChild.classList[1];
//  console.log(opened);
  // 3-condition: first card, match, unmatch
  if (opened.length == 0) {
      opened.push(card);
  } else if (opened.length == 1 && opened[0].firstElementChild.classList[1] == pattern) {
      //console.log(opened[0].classList[1] == opened[1].classList[1]);
      console.log('match');
      opened[0].classList.add('match');
      card.classList.add('match');
      opened.pop();
      remain -= 2;
      //flag = true;
  } else {
    flag = true;
    setTimeout(function() { //give time to let user see the 2nd card
      opened[0].classList.remove(...open_card_class);
      card.classList.remove(...open_card_class);
      opened.pop();
      flag = false;
    }, 2000);
  }
}

// event listener for click card
deck.forEach(function(card) {
  card.addEventListener('click', function() {
    if (!card.classList.contains('match') && !card.classList.contains('open') && !flag) {
      card.classList.add(...open_card_class);
      card_open(card);
      update();
      if (time_start == false) {
        time_start = true;
        time_x = time_count();
      }
    }
  });
});

// timer
function time_count() {
  return setInterval(function() {
  //let x = setTimeout(function() {
    secs += 1;
    sec = secs % 60;
    min = Math.floor(secs / 60);
    timer.innerHTML = `${min}m ${sec}s`;
  }, 1000);
}

// update global variable after each 2 cards open
function update() {
  move += 1;
  moves.textContent = Math.floor(move / 2);
  if (Math.floor(move) > 29) {
    star = 1;
    star_arr[1].style.color='';
  } else if (Math.floor(move) > 19) {
    star = 2;
    star_arr[2].style.color='';
  }
  if (remain === 0) {
    end();
  }
}

// init, set global var to init condition
function game_init() {
  console.log('init');
  star = 3;
  move = 0;
  secs = 0;
  timer.innerHTML = `0m 0s`;
  window.clearInterval(time_x);
  time_start = false;
  remain = 16;
  flag = false;
  opened = [];

  console.log('init');
  moves.textContent = move;

  // put all cards into arr, then shuffle
  var arr = new Array();
  for (var i = 0; i < deck.length; i++) {
    deck[i].classList.remove(...not_init_card_class);
    arr.push(deck[i].innerHTML);
  }
  //arr = shuffle(arr);
  for (let i = 0; i < deck.length; i++) {
    deck[i].innerHTML = arr[i];
  }

  // set star
  star_arr.forEach(function(star) {
    star.style.cssText = 'color: yellow;'
  });
}

// use .hide to switch between game and end
function end() {
  const containers = document.querySelectorAll('.container');
  for (let container of containers) {
    container.classList.toggle('hide');
    container.style.cssText='min-height: 100vh;'
  }

  const end_p = document.querySelector('#end_p');

  let end_min = min;
  let end_sec = sec;
  let end_move = moves.textContent;
  end_p.textContent = `With ${end_move} Moves, ${star} Stars and ${end_min}m ${end_sec}s`;

  const end_button = document.querySelector('#end_b');
  //end_button.setAttribute('onClick', 'history.go(0)');
  end_button.addEventListener('click', function() {
    containers.forEach(function(element) {
      element.classList.toggle('hide');
    })
    game_init();
  });
}

//end();
game_init();
