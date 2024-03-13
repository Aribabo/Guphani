const userId = localStorage.getItem('userId')
const token = localStorage.getItem('token')

// 인풋들
const bloodType = document.getElementsByName('bloodType')
const sickList = document.querySelector('.sickList')
const sickListLi = sickList.querySelectorAll('li')
const allergyList = document.querySelector('.allergyList')
const medicineList = document.querySelector('.medicineList')
const guardHp = document.getElementById('guard_hp')
const guardRel = document.getElementById('guard_rel')

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

function del_fn(el) {
    el.addEventListener('click',()=>{
        el.remove()
    })
}

async function infoFetch() {
    try {
        const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/detail/${userId}`, {
            method: 'GET',
            headers
        });
        const data = await response.json();
        const user = data.user;

        // 혈액형
        bloodType.forEach((el) => {
            if (el.value == user.bloodType) {
                el.checked = true;
            }
        });

        // 기저질환
        updateList('sickList', user.underlyingDisease);

        // 알러지
        updateList('allergyList', user.allergy);

        // 평소복용약
        updateList('medicineList', user.medication);

        // 보호자번호
        guardHp.value = user.guardianPhoneNumber ===undefined ? '' : user.guardianPhoneNumber;

        // 보호자관계
        guardRel.value = user.guardianRelationship ===undefined ? '' : user.guardianRelationship;

    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

// 리스트 업데이트 함수
function updateList(listClassName, items) {
    const list = document.querySelector(`.${listClassName}`);
    list.innerHTML = ""; // Clear existing content

    items.forEach((el) => {
        if (el !== '') {
            list.innerHTML += `<li><span>${el}</span><button type="button" class="xi-close del-btn"></button></li>`;
        }
        
    });
}


// 질병, 알러지, 평소복용약 추가 함수
function addList(btn, input, list) {
    const insertBtn = document.getElementById(btn)
    const listUl = document.querySelector(`.${list}`)

    insertBtn.addEventListener('click',()=>{
        const inputArea = document.getElementById(input)
        let innerList = listUl.innerHTML
        let addVal = ''
        
        const val = inputArea.value.trim()

        const elements = listUl.querySelectorAll('li span');
        if (elements.length === 0 ) {
            // el이 없을 때 val을 addVal에 추가
            addVal = val;
        } else {
            elements.forEach((el) => {
                if (val !== el.innerText || val !== '') {
                    console.log(val);
                    addVal = val;
                }
            });
        }

        if(val == ''){
            if(listUl != ''){
                listUl.innerHTML = innerList;
                inputArea.value = ''
            }
        }else{
            innerList += `
                    <li><span>${addVal}</span><button type="button" class="xi-close del-btn"></button></li>
            `
            listUl.innerHTML = innerList
            innerList = ''
            inputArea.value = ''
        }    
    })    
}

// 기저질환
addList('insertSick', 'sick', 'sickList')
// 알려지
addList('insertAllergy', 'allergy', 'allergyList')
// 평소 복용약
addList('insertMedicine', 'medicine', 'medicineList')


// 삭제버튼
document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('del-btn')) {
        event.target.parentElement.remove()
    }
});


infoFetch()

// 업데이트
let sickListValues = []
let allergyListValues = []
let medicineListValues = []
let bloodValue = ''
let guardHpInput = guardHp.value.replace(/[^0-9]/g, '')
let guardRelInput = guardRel.value.trim()

async function setData() {
    try {
        const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/updateOther`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: userId,
                guardianPhoneNumber: guardHpInput,
                guardianRelationship: guardRelInput,
                underlyingDisease: [...new Set(sickListValues)],
                allergy: [...new Set(allergyListValues)],
                medication: [...new Set(medicineListValues)],
                bloodType: bloodValue,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('sick').value = ''
            document.getElementById('allergy').value = ''
            document.getElementById('medicine').value = ''
            makePopup('추가정보가 수정되었습니다.') 
        } else {
            const errorMessage = await response.text();
            console.error('Server Error:', errorMessage);
            makePopup('오류가 발생했습니다.') 
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



function makePopup(popupMessage){
    const message = document.getElementById('message');
    message.innerText = popupMessage;

    // 팝업창 열기
    layerOn('register3Layer');
}


// 업데이트 버튼
const submitFormButton = document.getElementById('submitForm');
submitFormButton.addEventListener('click',()=>{

    guardHpInput = guardHp.value.replace(/[^0-9]/g, '')
    guardRelInput = guardRel.value.trim()

    if (guardHpInput.length > 0 && guardHpInput.length < 9 || guardHpInput.length > 11) {
        makePopup('보호자 전화번호를 다시 입력해주세요')
    } else if(guardHpInput.length >= 9 && guardRelInput === ''){
        makePopup('보호자와의 관계를 입력해주세요')
    }else{
        sickList.querySelectorAll('li').forEach((el)=>{
            sickListValues.push(el.innerText)
        })
        allergyList.querySelectorAll('li').forEach((el)=>{
            allergyListValues.push(el.innerText)
        })
        medicineList.querySelectorAll('li').forEach((el)=>{
            medicineListValues.push(el.innerText)
        })
    
        
        bloodType.forEach((el)=>{
            if(el.checked){
                bloodValue = el.value
            }
        })
        setData()
    }

})
infoFetch()