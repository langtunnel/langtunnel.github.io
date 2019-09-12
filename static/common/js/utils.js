function postAjaxRequestServer(url, dataJson, successCallback = () => {
}) {
  console.debug('postAjaxRequestServer::request::url: ', url, ', dataJson: ', dataJson, ', successCallback: ', successCallback);
  if (!url || !dataJson) {
    showMessage('ajax 请求中url和dataJson不能为空', 'error');
    return;
  }
  showMessage('', 'error');
  showMessage('url-->' + url);
  showMessage('dataJson-->', 'info', true);
  showMessage(dataJson, 'info', true);
  $.ajax({
    url: 'http://47.96.167.50'+url,
    type: "post",
    datatype: "application/json",
    data: dataJson,
    success: function (resultData) {
      console.debug('postAjaxRequestServer::response::success: ', resultData);
      let logLevel = 'info';
      if (JSON.stringify(resultData.succeed) === 'true') {
        try {
          resultData = resultData.result ? JSON.parse(resultData.result) : resultData.msg;
        } catch {
          resultData = resultData.result;
        }
      } else {
        logLevel = 'error';
      }
      successCallback(resultData, dataJson);
      showMessage('返回结果：', logLevel, logLevel === 'info');
      showMessage(resultData, logLevel, true);
      say(logLevel === 'error' ? '执行失败' : '执行成功');
    },
    error: function (e, ajaxOptions, errorDetail) {
      console.debug('postAjaxRequestServer::response::error: ', errorDetail, e);
      showMessage(e.responseJSON || e.responseText, 'error');
      say('执行失败');
    },
    statusCode: {
      404: function () {
        showMessage('ajax got 404', 'error');
        say('执行失败');
      },
    },
  });
}

function getAjaxRequestServer(url, callback = () => {
}) {
  console.debug('getAjaxRequestServer::request::url: ', url, ', callback: ', callback);
  if (!url) {
    showMessage('ajax 请求中url不能为空', 'error');
    return;
  }
  showMessage('url-->' + url);
  $.ajax({
    url: url,
    success: function (data) {
      console.debug('getAjaxRequestServer::response::success: ', data);
      let logLevel = 'info';
      if (JSON.stringify(data.succeed) === 'true') {
        try {
          data = data.result ? JSON.parse(data.result) : data.msg;
        } catch {
          data = data.result;
        }
      } else {
        logLevel = 'error';
      }
      callback(data);
      showMessage('返回结果：', logLevel, true);
      showMessage(data, logLevel, true);
      say(logLevel === 'error' ? '执行失败' : '执行成功');
    },
    error: function (e, ajaxOptions, errorDetail) {
      console.debug('getAjaxRequestServer::response::error: ', errorDetail, e);
      showMessage(e.responseJSON || e.responseText, 'error');
      say('执行失败');
    },
    statusCode: {
      404: function () {
        showMessage('ajax got 404', 'error');
        say('执行失败');
      },
    },
  });
}


function showMessage(message, level = 'info', append = false) {
  let device;
  if (typeof message !== "string")
    message = JSON.stringify(message, null, 2);

  if ((device = $('blockquote')).length && level==='error' && message) {
    device.find('p').text(message);
    device.show();
  } else {
    device = level === 'info' ? $('#display-info') : $('#display-error');
    if (!device.length) return;

    append ? $(device).append('&#10;' + message) : $(device).text(message);
    blinkDiv(device);
  }
}

function blinkDiv(selector) {
  $(selector).fadeOut('slow', function () {
    $(this).fadeIn('slow');
  });
}

function say(text) {
  let utterThis = new SpeechSynthesisUtterance();
  utterThis.lang = 'zh-CN';
  utterThis.text = text;
  utterThis.rate = 1.2;
  utterThis.volume = 0.5;
  speechSynthesis.speak(utterThis);
}

$.fn.focusWithoutScrolling = function () {
  var x = window.scrollX, y = window.scrollY;
  this.focus();
  window.scrollTo(x, y);
};

function assert(condition, message) {
  if (!condition) {
    message = message || "Assertion failed";
    if (typeof Error !== "undefined") {
      throw new Error(message);
    }
    throw message;
  }
}
