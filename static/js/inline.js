(function onLoading() {
  searchAndShowSentence({sentence: '使用说明', type: 'term'});
  addKeyboardListener();
  initializeTextareaContent();
})();

let search_content;

function sendMessageToParentIframe(msg) {
  window.parent.postMessage(msg, '*');
}

function initializeTextareaContent() {
  let params = new URLSearchParams(window.location.search);
  if (params.has('writing'))
    $('textarea#writing-area').val(params.get('writing'));
  if (params.has('searching'))
    $('textarea#searching-area').val(params.get('searching'));
}

window.addEventListener('message', function (e) {
  console.debug(e);
  if (e.source !== window.parent) return;
  if (e.data === 'popup') {
    let url = new URL('inline', 'http://127.0.0.1:8000');
    url.searchParams.set('writing', $('textarea#writing-area').val());
    url.searchParams.set('searching', $('textarea#searching-area').val());
    window.open(url);
  }
}, false);

// $('#prod-env').on('click', function () {
//   window.location.replace('http://47.96.167.50/inline');
// });

$('#sign-in').on('click', function () {
  // window.location.replace('https://www.baidu.com');
});

$('#searching-area').on('keyup paste', function () {
  console.debug("keyup or paste event occurred...");

  let input_text = $(this).val();
  if (search_content === input_text) return;
  search_content = input_text;
  if (WORD_TRIGGER.test(input_text)) {
    let word = getLastWordObj(input_text);

    word && searchAndShowWord(word);
  }

  if (SENTENCE_TRIGGER.test(input_text)) {
    let sentence = getLastSentenceObj(input_text);
    searchAndShowSentence(sentence);
  }
});

$('blockquote a#got-it').on('click', function (e) {
  $(this).closest('blockquote').hide();
});

// TODO
window.onbeforeunload = function (event) {
  // LS.setItem('extension_search', $('textarea#searching-area').val());
  // event.returnValue = "确认要丢弃编辑的内容吗？";
};


function consumeWordSearchResult(data) {
  console.debug(data);
  let word = data[0].word;
  let translation = data[0].translation;
  let ex = $('#explanations');
  let new_div = buildCombinationDiv(word, translation);
  ex.prepend(new_div);
}

function consumeSentenceSearchResult(result, search) {
  console.debug(result);
  let op, en, cn;
  op = $('<div class="sentence-search-op"></div>');
  op.append($('<hr>'));
  op.append($('<div class="sentence-searched">' + search.sentence + '</div>'));
  result &&
  result.forEach(function (d) {
    en = d.en;
    cn = d.cn;
    op.append(buildCombinationDiv(en, cn));
  });
  $('#sentence-area').append(op);
  EXPL.scrollToDiv(op);
}
