// parseBtn
let parseBtn = document.getElementById("parseBtn");
parseBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: parseFormEntries,
  });
});

function parseFormEntries() {
  let data = {
    title: document.title,
    url: document.location.href.split("?")[0],
  };

  if (data.url.match(/^https:\/\/docs\.google\.com\/forms/)) {
    chrome.storage.sync.clear();
  } else {
    console.log("NG");
    return;
  }

  let list = document.querySelectorAll(
    'form input[type="hidden"][name^="entry."]'
  );
  for (let node of list) {
    // entry.611800152
    // entry.69819581_month
    var name = node.name.split("_")[0].split(".")[1];
    var label = document
      .querySelector('div[data-params*="[' + name + ',"] div.exportItemTitle')
      .innerText.replace(" *", "");
    data["label." + name] = label;
  }

  chrome.runtime.sendMessage(chrome.runtime.id, {
    kind: "parseBtn",
    data: data,
  });
}

// optionBtn
let optionBtn = document.getElementById("optionBtn");
optionBtn.addEventListener("click", async () => {
  chrome.runtime.openOptionsPage();
});

// runBtn
let runBtn = document.getElementById("runBtn");
runBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: sendMessageToBackground,
  });
});

function sendMessageToBackground() {
  chrome.runtime.sendMessage(chrome.runtime.id, {
    kind: "runBtn",
    data: {
      title: document.title,
      url: document.location.href,
    },
  });
}
