"use strict";
const MODEL = "gpt-3.5-turbo";
const inputEl = document.querySelector(".input-area");
const btnEl = document.querySelector(".fa-microphone");
const cardBodyEl = document.querySelector(".card-body");
const error = document.querySelector("#error");

let userMessage;
const API_KEY = "";
const URL = "https://api.openai.com/v1/chat/completions";

try {
  var speech = new SpeechSynthesisUtterance();
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
} catch (e) {
  error.innerHTML = "Web Speech API not supported in this device.";
}

const chatGenerator = (assistant) => {
  assistant = assistant.querySelector(".assistant");
  const requestOption = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: userMessage,
        },
      ],
    }),
  };

  fetch(URL, requestOption)
    .then((res) => res.json())
    .then((data) => {
      assistant.textContent = data.choices[0].message.content;
      speak(assistant.textContent);
    })
    .catch((error) => {
      assistant.textContent = error;
    });
};

// manage chat
function manageChat() {
  userMessage = inputEl.value.trim();
  if (!userMessage) return;
  inputEl.value = "";
  cardBodyEl.appendChild(messageEl(userMessage, "user"));
  setTimeout(() => {
    const assistantMessage = messageEl("...........", "chat-bot");
    cardBodyEl.append(assistantMessage);
    chatGenerator(assistantMessage);
  }, 600);
}

function tapToSpeak() {
  recognition.onstart = function () { }

  recognition.onresult = function (event) {
    const curr = event.resultIndex;
    const transcript = event.results[curr][0].transcript;
    inputEl.value = transcript;
    manageChat();
  }
  recognition.onerror = function (ev) {
    console.error(ev);
  }
  recognition.start();
}

function speak(message) {
  speech.text = message
  speech.volume = 1
  speech.rate=1
  speech.pitch=1
  window.speechSynthesis.speak(speech)
}

// messages
const messageEl = (message, className) => {
  const chatEl = document.createElement("div");
  chatEl.classList.add("chat", `${className}`);
  let chatContent =
    className === "chat-bot"
      ? `<span class="user-icon"><i class="fa fa-robot"></i></span>
  <p class='assistant'>${message}</p>`
      : ` <span class="user-icon"><i class="fa fa-user"></i></span>
  <p>${message}</p>`;
  chatEl.innerHTML = chatContent;
  return chatEl;
};

btnEl.addEventListener("click", tapToSpeak);
inputEl.addEventListener("keydown", (keyboard) => {
  if (keyboard.key === "Enter") {
    manageChat();
  }
});
