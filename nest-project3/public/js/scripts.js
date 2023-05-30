// io에 네임스페이스를 정해준다.
const socket = io('/chattings');

// 각 DOM Element 가져오기
const helloStrangerElement = document.getElementById('hello_stranger');
const chattingBoxElement = document.getElementById('chatting_box');
const formElement = document.getElementById('chat_form');

const drawStranger = (data) => {
  return (helloStrangerElement.innerText = `Welcom ${data} :)`);
};

const drawChat = (data) => {
  const wrapperChatBox = document.createElement('div');
  const chatBox = `<div> ${data} </div>`;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

const handleSubmit = (event) => {
  event.preventDefault();
  const inputvalue = event.target.elements[0].value;

  if (inputvalue !== '') {
    socket.emit('submit_chat', inputvalue);
    drawChat(`Me : ${inputvalue}`);
    event.target.elements[0].value = '';
  }
};

socket.on('user_connected', (data) => {
  drawChat(`Connecnted : ${data}`);
});

socket.on('new_chat', (data) => {
  const newchat = `${data.username} : ${data.chat}`;
  drawChat(newchat);
});

socket.on('disconnect_user', (data) => {
  drawChat(`${data} is Gone...`);
});

function helloUser() {
  const username = prompt('이름을 입력해주세요~');

  // socket.emit를 이용하여 서버에 데이터를 보낸다.
  // 첫번째 인자로는 이벤트명(엔드포인트 느낌)
  // 두번째 인자로는 보낼 데이터를 넣어준다.
  // 세번쨰 인자로는 콜백 함수가 오는데 서버측에서 보낸 리턴값이 온다.
  if (username) {
    socket.emit('new_user', username, (data) => {
      drawStranger(data);
    });
  }

  //   socket.on('hello_user', (data) => {
  //     console.log(data);
  //   });
}

function init() {
  helloUser();
  formElement.addEventListener('submit', handleSubmit);
}
init();
