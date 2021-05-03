// submitBtn
let submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", parseOptionEntries);

function parseOptionEntries() {
  let data = {};

  let list = document.querySelectorAll('#parentNode input[type="text"]');
  for (let node of list) {
    // always set value to delete entry.
    data[node.name] = node.value;
  }

  chrome.runtime.sendMessage(chrome.runtime.id, {
    kind: "submitBtn",
    data: data,
  });
}

// copyCmd
function AddCopyCmd() {
  let list = document.querySelectorAll(".copyCmd");
  for (item of list) {
    item.addEventListener("click", copyCmd);
  }
}
function copyCmd() {
  navigator.clipboard.writeText(this.dataset.text);
}

// loadStorage
function loadStorage() {
  chrome.storage.sync.get(null, function (data) {
    for (let key in data) {
      switch (key) {
        case "url":
          let url = document.querySelector("#url p a");
          url.innerText = data[key];
          url.href = data[key];

          break;
        case "title":
          let title = document.querySelector("#title p");
          title.innerText = data[key];

          break;
        default:
          if (key.match(/^label\./)) {
            let parentNode = document.getElementById("parentNode");

            var node = document
              .querySelector("#input-template div.input-field")
              .cloneNode(true);

            var label = node.querySelector("label");
            label.htmlFor = key;
            label.innerText = data[key];

            var entry = key.replace("label.", "entry.");
            var input = node.querySelector("input");
            input.id = entry;
            input.name = entry;
            if (data[entry]) {
              input.value = data[entry];
              label.classList.add("active");
            }

            parentNode.appendChild(node);
          }
      }
    }
  });
}

loadStorage();
AddCopyCmd();
