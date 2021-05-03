chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.kind) {
    case "runBtn":
      chrome.storage.sync.get(null, function (data) {
        var url = "";
        var query = new URLSearchParams({});
        for (let key in data) {
          switch (key) {
            case "url":
              url = data[key];

              break;
            default:
              if (key.match(/^entry\./) && data[key]) {
                var val = data[key];
                if (val == "${url}") {
                  val = message.data.url;
                } else if (val == "${title}") {
                  val = trimTitle(message.data.title, message.data.url);
                } else if (val == "${today}") {
                  val = formatDate(new Date());
                }
                query.set(key, val);
              }
          }
        }
        let qs = query.toString();
        chrome.tabs.create({ url: url + "?" + qs });
      });

      break;
    case "parseBtn":
      chrome.storage.sync.set(message.data);
      chrome.runtime.openOptionsPage();

      break;
    case "submitBtn":
      chrome.storage.sync.set(message.data);

      break;
    default:
      console.log("undefined!");
  }

  return false;
});

function trimTitle(title, url) {
  if (url.match(/^https:\/\/github\.com\//)) {
    return title.replace(/\[.*?\]/g, "").replace(/ by .*/, "");
  } else if (url.match(/^https:\/\/aitravel\.atlassian\.net\//)) {
    return title
      .replace(/\[.*?\]/g, "")
      .replace(" - Jira", "")
      .replace(/^ */, "");
  }
  return title;
}

function formatDate(date) {
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  var val = y + "-";
  if (m < 10) {
    val = val + "0";
  }
  val = val + m + "-";
  if (d < 10) {
    val = val + "0";
  }
  val = val + d;

  return val;
}
