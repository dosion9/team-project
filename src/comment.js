const $commentForm = document.querySelector(".comment-form");
const $userName = document.querySelector("#username");
const $password = document.querySelector("#password");
const $commentInput = document.querySelector("#comment");
const $submitBtn = document.querySelector("#submit-btn");
const $printComment = document.querySelector(".comment-list");
const $commentNum = document.querySelector(".comment-number");

const $deleteBtn = document.querySelector("delete-btn");
const $deleteInput = document.querySelector(".delete-pwd");

let savedComment = ""; // 저장된 댓글 내용
let savedUserName = ""; // 저장된 사용자 이름
let savedPassword = ""; // 저장된 비밀번호

// 로컬 스토리지에서 해당 영화의 댓글을 가져와 화면에 출력하는 함수
const displayComments = function (movieId) {
  const comments = JSON.parse(localStorage.getItem(movieId));
  $commentNum.textContent = Boolean(comments?.length) ? `(${comments?.length})` : "(0)";

  if (comments && comments.length > 0) {
    $printComment.innerHTML = ""; //댓글 목록 초기화
    comments.sort((a, b) => new Date(b.time) - new Date(a.time)); // 최신 순으로 정렬

    comments.forEach((commentObj) => {
      //현재 코멘트 갯수
      if (!commentObj.deleted) {
        const opinion = document.createElement("li");
        opinion.classList.add("opinion");

        const commentTime = new Date(commentObj.time);
        const hours = commentTime.getHours();
        const minutes = String(commentTime.getMinutes()).padStart(2, "0");
        const seconds = String(commentTime.getSeconds()).padStart(2, "0");

        // 각 댓글과 시간을 <p> 태그로 감싸서 추가
        const leftDiv = document.createElement("div");
        leftDiv.classList.add("left-div");
        opinion.appendChild(leftDiv);

        const usernameDiv = document.createElement("p");
        usernameDiv.classList.add("username");
        usernameDiv.textContent = commentObj.username;

        const commentDiv = document.createElement("p");
        commentDiv.classList.add("comment-line");
        commentDiv.textContent = commentObj.comment;

        const timeDiv = document.createElement("p");
        timeDiv.classList.add("time");
        timeDiv.textContent = `${hours}:${minutes}:${seconds}`;

        leftDiv.appendChild(usernameDiv);
        leftDiv.appendChild(commentDiv);
        leftDiv.appendChild(timeDiv);

        const rightDiv = document.createElement("div");
        rightDiv.classList.add("right-div");
        opinion.appendChild(rightDiv);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "삭제";
        rightDiv.appendChild(deleteBtn);

        const confirmPwd = document.createElement("input");
        confirmPwd.type = "password";
        confirmPwd.classList.add("delete-pwd");
        rightDiv.appendChild(confirmPwd);

        $printComment.appendChild(opinion);
      }
    });
  } else {
    $printComment.innerHTML = `댓글이 없습니다.`;
  }
};
// 댓글 삭제
function deleteComment(commentId) {
  const movieId = searchUrlParam("id");
  const comments = JSON.parse(localStorage.getItem(movieId)) || [];
  const commentIndex = comments.findIndex((comment) => comment.id === commentId);

  if (commentIndex !== -1) {
    // 비밀번호 확인은 삭제 버튼을 누를 때 이벤트 핸들러에서 수행됨
    comments.splice(commentIndex, 1);
    localStorage.setItem(movieId, JSON.stringify(comments));
    displayComments(movieId);
  }
}

// 삭제 버튼 클릭 이벤트 핸들러
$printComment.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const deleteBtn = event.target;
    const opinion = deleteBtn.closest(".opinion");
    const commentId = opinion.dataset.commentId; // Get the comment's ID
    const movieId = searchUrlParam("id");
    const comments = JSON.parse(localStorage.getItem(movieId)) || [];
    const commentObj = comments.find((comment) => comment.id === commentId); // Find the comment object by its ID

    // Get the entered password from the corresponding delete input field
    const enteredPassword = opinion.querySelector(".delete-pwd").value;

    if (enteredPassword !== null) {
      // Check if the entered password matches the comment's password
      if (enteredPassword === commentObj.password) {
        // Password matches, delete the comment
        deleteComment(commentId);
      } else {
        alert("비밀번호가 일치하지 않습니다. 댓글을 삭제할 수 없습니다.");
      }
    }
  }
});

const filter1 = new RegExp(
  /(씹|썅|18놈|18새끼|ㄱㅐㅅㅐㄲl|ㄱㅐㅈㅏ|강간|개가튼년|개가튼뇬|개같은년|개걸레|개고치|개너미|개넘|개년|개놈|개늠|개똥|개떵|개떡|개라슥|개보지|개부달|개부랄|개불랄|개붕알|개새|개세|개쓰래기|개쓰레기|개씁년|개씁블|개씁자지|개씨발|개씨블|개자식|개자지|개잡년|개젓가튼넘|개좆|개지랄|개후라년|개후라들놈|개후라새끼|걔잡년|걸래년|걸레같은년|걸레년|걸레핀년|게부럴|게세끼|게새끼|게늠|게자식|게지랄놈|깨쌔끼|난자마셔|난자먹어|난자핧아|내꺼빨아|내꺼핧아|내버지|내자지|내잠지|내조지|너거애비|니기미|니뿡|니뽕|니씨브랄|니아범|니아비|니애미|니애뷔|니애비|니할애비|닝기미|닌기미|니미|닳은년|돈새끼|돌으년|돌은넘|돌은새끼|딸딸이|똥구녁|똥꾸뇽|똥구뇽|똥|띠발뇬|띠팔|띠펄|띠풀|띠벌|띠벨|띠빌|막간년|맛간년|맛없는년|맛이간년|멜리스|미친구녕|미친구멍|미친넘|미친년|미친놈|미친눔|미친새끼|미친쇄리|미친쇠리|미친쉐이|미친씨부랄|미튄|미티넘|미틴|미틴넘|미틴년|미틴놈|미틴것|백보지|버따리자지|버지구녕|버지구멍|버지냄새|버지따먹기|버지뚫어|버지뜨더|버지물마셔|버지벌려|버지벌료|버지빨아|버지빨어|버지썰어|버지쑤셔|버지털|버지핧아|버짓물|버짓물마셔|벌창같은년|벵신|병닥|병딱|병신|보쥐|보지|보지핧어|보짓물|보짓물마셔|봉알|부랄|불알|붕알|붜지|뷩딱|븅쉰|븅신|빙띤|빙신|빠가십새|빠가씹새|빠구리|빠굴이|뻑큐|뽕알|뽀지|뼝신|사까시|상년|새꺄|새뀌|새끼|색갸|색끼|색키|샤발|써글|써글년|세꺄|세끼|섹히|쉐끼|쉑갸|쉬발|쉬방|쉬밸년|쉬벌|쉬불|쉬붕|쉬빨|쉬이발|쉬이방|쉬이벌|쉬이불|쉬이붕|쉬이빨|쉬이팔|쉬이펄|쉬이풀|쉬팔|쉬펄|쉬풀|쉽쌔|시댕이|시발|시발년|시발놈|시발새끼|시방새|시밸|시벌|시불|시붕|시이발|시이벌|시이불|시이붕|시이팔|시이펄|시이풀|시팍새끼|시팔|시팔넘|시팔년|시팔놈|시팔새끼|시펄|실프|십8|십때끼|십떼끼|십버지|십부랄|십부럴|십새|십세이|십셰리|십쉐|십자석|십자슥|십지랄|십창녀|십창|십탱|십탱구리|십탱굴이|십팔새끼|ㅆㅣ|쌍넘|쌍년|쌍놈|쌍눔|쌍보지|쌔끼|쌔리|썅년|썅놈|썅뇬|썅늠|쓉새|쓰바새끼|쓰브랄쉽세|씌발|씌팔|씨가랭넘|씨가랭년|씨가랭놈|씨발|씨발년|씨발롬|씨발병신|씨방새|씨방세|씨밸|씨뱅가리|씨벌|씨벌년|씨벌쉐이|씨부랄|씨부럴|씨불|씨불알|씨붕|씨브럴|씨블|씨블년|씨븡새끼|씨빨|씨이발|씨이벌|씨이불|씨이붕|씨이팔|씨파넘|씨팍새끼|씨팍세끼|씨팔|씨펄|씨퐁넘|씨퐁뇬|씨퐁보지|씨퐁자지|씹년|씹물|씹미랄|씹버지|씹보지|씹부랄|씹브랄|씹빵구|씹뽀지|씹새|씹새끼|씹세|씹쌔끼|씹자석|씹자슥|씹자지|씹지랄|씹창|씹창녀|씹탱|씹탱굴이|씹탱이|씹팔|애미|애미랄|애미보지|애미씨뱅|애미자지|애미잡년|애미좃물|애비|애자|어미따먹자|어미쑤시자|영자|엄창|에미|에비|엔플레버|엠플레버|염병|염병할|염뵹|엿먹어라|왕버지|왕자지|왕잠지|왕털버지|왕털보지|왕털자지|왕털잠지|우미쑤셔|육갑|자기핧아|자지|자지구녕|자지구멍|자지꽂아|자지넣자|자지뜨더|자지뜯어|자지박어|자지빨아|자지빨아줘|자지빨어|자지쑤셔|자지쓰레기|자지정개|자지짤라|자지털|자지핧아|자지핧아줘|자지핧어|작은보지|잠지|잠지뚫어|잠지물마셔|잠지털|잠짓물마셔|잡년|잡놈|저년|점물|젓가튼|젓가튼쉐이|젓같내|젓같은|젓까|젓나|젓냄새|젓대가리|젓떠|젓마무리|젓만이|젓물|젓물냄새|젓밥|정액마셔|정액먹어|정액발사|정액짜|정액핧아|정자마셔|정자먹어|정자핧아|젖같은|젖까|젖밥|젖탱이|조개넓은년|조개따조|조개마셔줘|조개벌려조|조개속물|조개쑤셔줘|조개핧아줘|조까|조또|족같내|족까|족까내|존나|존나게|존니|졸라|좀마니|좀물|좀쓰레기|좁빠라라|좃가튼뇬|좃간년|좃까|좃까리|좃깟네|좃냄새|좃넘|좃대가리|좃도|좃또|좃만아|좃만이|좃만한것|좃만한쉐이|좃물|좃물냄새|좃보지|좃부랄|좃빠구리|좃빠네|좃빠라라|좃털|좆같은놈|좆같은새끼|좆까|좆까라|좆나|좆년|좆도|좆만아|좆만한년|좆만한놈|좆만한새끼|좆먹어|좆물|좆밥|좆빨아|좆새끼|좆털|좋만한것|주글년|주길년|쥐랄|지랄|지랼|지럴|지뢀|쪼까튼|쪼다|쪼다새끼|찌랄|찌질이|창남|창녀|창녀버지|창년|처먹고|처먹을|쳐먹고|쳐쑤셔박어|촌씨브라리|촌씨브랑이|촌씨브랭이|크리토리스|큰보지|클리토리스|트랜스젠더|페니스|항문수셔|항문쑤셔|허덥|허버리년|허벌년|허벌보지|허벌자식|허벌자지|허접|허젚|허졉|허좁|헐렁보지|혀로보지핧기|호냥년|호로|호로새끼|호로자슥|호로자식|호로짜식|호루자슥|호모|호졉|호좁|후라덜넘|후장|후장꽂아|후장뚫어|흐접|흐젚|흐졉|bitch|fuck|fuckyou|nflavor|penis|pennis|pussy)/gi
);

function filtering2(filter, input) {
  return input.search(filter) != -1 ? true : false;
}
// 욕설 필터링 추가
const setInputValue = function (event) {
  event.preventDefault();

  const result2 = filtering2(filter1, $commentInput.value);

  const comment = $commentInput.value;
  const username = $userName.value;
  const password = $password.value;

  if (result2) {
    alert("욕설이 포함된 내용은 등록할 수 없습니다.");
    return;
  }

  // input 유효성 검사
  if (comment === "") {
    alert("한줄평을 입력해주세요.");
    return;
  }

  const movieId = searchUrlParam("id");

  let comments = JSON.parse(localStorage.getItem(movieId)) || [];

  comments.push({ username, comment, time: new Date(), password });
  localStorage.setItem(movieId, JSON.stringify(comments));

  displayComments(movieId); //댓글 입력 후 화면에 댓글 목록 업데이트

  //입력 필드 초기화
  $commentInput.value = "";
  $userName.value = "";
  $password.value = "";

  // 입력한 댓글 내용 저장
  savedComment = comment;
  savedUserName = username;
  savedPassword = password;
};

// url 파라미터에 있는 movieId에 맞는 코멘트 가져오기
const searchUrlParam = function (key) {
  return new URLSearchParams(window.location.search).get(key);
};

// 페이지 로드시 해당 영화의 댓글을 가져와 화면에 출력해주기
document.addEventListener("DOMContentLoaded", function () {
  const movieId = searchUrlParam("id");
  if (movieId) {
    displayComments(movieId);
  }

  $commentInput.value = savedComment;
  $userName.value = savedUserName;
  $password.value = savedPassword;
});

$commentForm.addEventListener("submit", setInputValue);
