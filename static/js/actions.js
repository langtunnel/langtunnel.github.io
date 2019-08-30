let PUNCTUATION_REGEX = '//';
let WORD_TRIGGER = /[\s,.;?!:，。；？！、：]+$/;
let SENTENCE_TRIGGER = /[,.;?!:，。；？！、：]+\s*$/;
let WORD_SPLITTER = /[\s,.;?!:，。；？！、：]+/g;
let SENTENCE_SPLITTER = /[\n,.;?!:，。；？！：]+\s*/g;
let LINE_SPLITTER = /\n+/;
let CN_WORD = /[\u4e00-\u9fa5]/;


function addKeyboardListener() {
  $(document).on('keydown', function (event) {
    // console.debug(event, event.key);
    if (event.key === 'Tab') {
      event.preventDefault();
      let textareas = $('textarea');
      if (textareas.eq(0).is(event.target)) {
        textareas.eq(1).focus();
      } else {
        textareas.eq(0).focus();
      }
    }
  });
}

function searchAndShowWord(word) {
  if (!word) return;
  postAjaxRequestServer('/langtunnel/word', word, consumeWordSearchResult);
}

function searchAndShowSentence(sentence) {
  if (!sentence) return;
  postAjaxRequestServer('/langtunnel/sentence', sentence, consumeSentenceSearchResult);
}


function buildCombinationDiv(word, translation) {
  return $('<div class="combination">'
    + '<pre class="en">' + word + '</pre>'
    + '<pre class="cn">' + translation + '</pre>'
    + '</div>');
}

function getSelectedWord(section) {
  var sel, word = "";
  if (window.getSelection && (sel = window.getSelection()).modify) {
    var selectedRange = sel.getRangeAt(0);
    sel.collapseToStart();
    sel.modify("move", "backward", "word");
    sel.modify("extend", "forward", "word");

    word = sel.toString();

    // Restore selection
    sel.removeAllRanges();
    sel.addRange(selectedRange);
  } else if ((sel = document.selection) && sel.type !== "Control") {
    var range = sel.createRange();
    range.collapse(true);
    range.expand("word");
    word = range.text;
  }
  alert(word);
}

function getLastWordObj(section) {
  let words = section && section.trim().split(WORD_SPLITTER).filter(w => !!w);
  let last_word = words[words.length - 1];
  let word_obj = {
    word: last_word,
    lang: CN_WORD.test(last_word) ? 'cn' : 'en',
  };
  console.debug(section, '|| getLastWordObj:', word_obj);
  return filterOutCookedWord(word_obj);
}

function getLastSentenceObj(section) {
  let sentences = section && section.split(SENTENCE_SPLITTER);
  let last_sentence = sentences && sentences[sentences.length - 2];
  last_sentence = last_sentence && last_sentence.trim();
  let sentence_obj = {sentence: last_sentence, type: 'match'};
  console.debug(section, '|| getLastSentenceObj:', sentence_obj);
  return filterOutCookedSentence(sentence_obj);
}

function filterOutCookedWord(word_obj) {
  // let j = $('#explanations .combination .word:contains(' + word_obj + ')');
  $('#explanations .combination *').removeClass('highlight');

  let divs = $('#explanations .combination .en').filter(function () {
    return $(this).text() === word_obj.word;
  });
  let cooked = divs.length > 0;
  if (!cooked && word_obj.lang === 'cn') {
    divs = $('#explanations .combination .cn').filter(function () {
      return $(this).text().includes(word_obj.word);
    });
    cooked = divs.length > 0;
  }

  console.debug(word_obj.word, '|| cooked:', cooked);
  if (cooked) {
    divs.addClass('highlight');
    EXPL.moveToTop(divs.closest('.combination'));
    return null;
  } else
    return word_obj;
}

function filterOutCookedSentence(sentence_obj) {
  let searched = $('pre#sentence-area .sentence-searched');
  searched.removeClass('highlight');

  let divs = searched.filter(function () {
    return $(this).text() === sentence_obj.sentence;
  });
  let cooked = divs.length > 0;

  console.debug(sentence_obj.sentence, '|| cooked:', cooked);
  if (cooked) {
    divs.addClass('highlight');
    EXPL.scrollToDiv(divs.closest('.sentence-search-op'));
    return null;
  } else
    return sentence_obj;
}

function preFilter(text) {

}


let EXPL = {
  scrollToDiv: function (div) {
    let ex = $('#sentence-area');
    ex.animate({
      scrollTop: div.offset().top - ex.offset().top + ex.scrollTop() - 2
    }, 200);
    // ex.scrollTop(div.offset().top - ex.offset().top + ex.scrollTop());
  },
  moveToTop: function ($div) {
    $div.prependTo($div.parent());
  },
};

