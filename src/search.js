// 영화 제목을 입력하고 옆에 버튼을 누르면
// 해당 내용을 쿼리스트링으로 붙여서 URL 보내주는 파일

// 버튼, input, 검색어(input.value) 선언
const $searchBtn = document.querySelector("#search__btn");
const $searchInput = document.querySelector("#search__input");

// 욕설 정규표현식
const filter1 = new RegExp(/(썅|씹|씨발|등신|머저리|똥개|연병)/g);
    
// 검색어 입력 후 검색 버튼 클릭 시
$searchBtn.addEventListener("click", () => {
    // 각 filtering 결과를 변수로 선언
    const result1 = filtering1($searchInput.value)
    const result2 = filtering2(filter1, $searchInput.value)
    
    // 각 filtering 결과에 따라 다르게 메시지 출력
    let message = ''
    if(result1 === true && result2 === true) {
        message += '검색어를 공백없이 2글자 이상으로 입력해주세요. 그리고 욕설은 입력하지 말아주세요.'
    } else if(result1 === true && result2 !== true) {
        message += '검색어를 공백없이 2글자 이상으로 입력해주세요.'
    } else if(result1 !== true && result2 === true) {
        message += '욕설은 입력하지 말아주세요.'
    } else if(result1 !== true && result2 !== true) {
        //message += '입력하신 검색어로 검색하겠습니다.'
    }

    alert(message)
});
  
// 검색어 입력 후 enter 입력 시
window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        // 각 filtering 결과를 변수로 선언
        const result1 = filtering1($searchInput.value)
        const result2 = filtering2(filter1, $searchInput.value)
        
        // 각 filtering 결과에 따라 다르게 메시지 출력
        let message = ''
        if(result1 === true && result2 === true) {
            message += '검색어를 공백없이 2글자 이상으로 입력해주세요. 그리고 욕설은 입력하지 말아주세요.'
        } else if(result1 === true && result2 !== true) {
            message += '검색어를 공백없이 2글자 이상으로 입력해주세요.'
        } else if(result1 !== true && result2 === true) {
            message += '욕설은 입력하지 말아주세요.'
        } else if(result1 !== true && result2 !== true) {
            //message += '입력하신 검색어로 검색하겠습니다.'
        }

        alert(message)
    }
});

// 앞뒤 공백 제거하고 2글자 이상인지 확인하는 함수
function filtering1(input) {
    console.log(input)
    console.log(input.trim())

    // 2글자 이상인지 확인
    console.log(input.trim().length)

    if(input.trim().length >= 2) {
        return false;
    } else {
        return true;
    }
}

// 욕설 필터링하는 함수
function filtering2(filter, input) {
    console.log(input)
    
    console.log(filter.test(input))
    console.log(typeof(filter.test(input))) // ....?
    return filter.test(input)
}

// // 마지막에 보내줄 링크
// const link = `www.linnnnk.com?search=${$searchInput.value}`