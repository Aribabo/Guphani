document.addEventListener('DOMContentLoaded', function () {
    // Function to add click event for inserting values into a list
    function insertBtnFunc(inputClassName, btnClassName, insertBoxName) {
        const btnElement = document.querySelector('.' + btnClassName);
        const inputElement = document.querySelector('.' + inputClassName);
        const insertBox = document.querySelector('.' + insertBoxName);

        btnElement.addEventListener('click', () => {
            try {
                const quickBtnText = inputElement.value.trim();

                const liList = insertBox.querySelectorAll('li');
                let exists = false;

                liList.forEach((li) => {
                    const liSpanText = li.querySelector('span').innerText;
                    if (liSpanText === quickBtnText) {
                        exists = true;
                        inputElement.value = '';
                    }
                });

                if (!exists) {
                    const createLi = document.createElement('li');
                    createLi.innerHTML = `<span>${quickBtnText}</span><button type="button" class="xi-close del-btn"></button>`;
                    insertBox.appendChild(createLi);
                    inputElement.value = '';

                    const delBtn = createLi.querySelector('.del-btn');
                    delBtn.addEventListener('click', () => {
                        insertBox.removeChild(createLi);
                    });
                }
            } catch (error) {
                console.error('값을 추가하는 도중 오류가 발생했습니다:', error.message);
                // 오류를 적절히 처리
            }
        });
    }

    // Function to get values from a list
    function getListValues(listClassName) {
        const list = document.querySelector(`.${listClassName}`);
        if (list) {
            const listItems = list.querySelectorAll('li span');
            return Array.from(listItems).map(item => item.innerText);
        }
        return [];
    }

    // Function to show a popup message
    function makePopup(popupMessage) {
        const message = document.getElementById('message');
        message.innerText = popupMessage;

        // Open the popup window
        layerOn('register3Layer');
    }

    // Function to handle form submission
    async function handleFormSubmission() {
        try {
            const sickListValues = getListValues('sickList');
            const allergyListValues = getListValues('allergyList');
            const medicineListValues = getListValues('medicineList');
            const guard_hp = document.getElementById('guard_hp').value.replace(/[^0-9]/g, '');
            const guard_rel = document.getElementById('guard_rel').value.trim();

            if (guard_hp.length < 10 && guard_hp.length > 0) {
                makePopup(`[${guard_hp}]번호를 확인해주세요${guard_hp.length}`);
            } else if (guard_hp !== '' && guard_rel === '') {
                makePopup('보호자와의 관계를 입력해주세요');
            } else {
                const storedUserData = localStorage.getItem('userData');
                if (storedUserData) {
                    console.log(storedUserData);
                    const userData = JSON.parse(storedUserData);

                    // Create new user data
                    if (sickListValues.length > 0 || allergyListValues.length > 0 || medicineListValues.length > 0 || guard_hp.length >= 10 || guard_rel !== '' || bloodValue != '') {
                        const newData = {};

                        if (sickListValues.length > 0) {
                            newData.sickList = sickListValues;
                        }

                        if (allergyListValues.length > 0) {
                            newData.allergyList = allergyListValues;
                        }

                        if (medicineListValues.length > 0) {
                            newData.medicineList = medicineListValues;
                        }

                        if (guard_hp.length >= 10) {
                            newData.guard_hp = guard_hp;
                        }

                        if (guard_rel !== '') {
                            newData.guard_rel = guard_rel;
                        }

                        if (bloodValue !== '') {
                            newData.bloodValue = bloodValue;
                        }

                        // Update the userData in localStorage if needed
                        // localStorage.setItem('userData', JSON.stringify(userData));
                        console.log('Bloody Type:', bloodValue);


                        console.log(newData);
                        console.log(userData);
                        window.location.href = 'register4.html';
                    } else {
                        window.location.href = 'register4.html';
                    }
                } else {
                    makePopup('오류가 발생했습니다. 회원가입을 다시 진행해주세요');
                }
            }
        } catch (error) {
            console.error('폼 제출 중 오류가 발생했습니다:', error.message);
            // 오류를 적절히 처리
        }
    }

    // Function to handle server and client connection
    async function handleServerClientConnection() {
        try {
            const sickListValues = getListValues('sickList');
            const allergyListValues = getListValues('allergyList');
            const medicineListValues = getListValues('medicineList');
            const guard_hp = document.getElementById('guard_hp').value.replace(/[^0-9]/g, '');
            const guard_rel = document.getElementById('guard_rel').value.trim();
            const bloodInputs = document.querySelectorAll('input[name="bloodType"]');
            let bloodValue = '';

            // Check if a gender option is selected
            let isBloodSelected = false;
            bloodInputs.forEach((el) => {
                if (el.checked) {
                    bloodValue = el.value;
                    isBloodSelected = true;
                }
            });

            // Retrieve userId from localStorage
            const userId = localStorage.getItem('userId');

            try {
                // PUT request
                const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/addInfo/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        guardianPhoneNumber: guard_hp,
                        guardianRelationship: guard_rel,
                        underlyingDisease: sickListValues,
                        allergy: allergyListValues,
                        medication: medicineListValues,
                        bloodType: bloodValue
                    }),
                });

                // Check if the request was successful (status code 2xx)
                if (response.ok) {
                    const data = await response.json();
                    console.log('Server Response:', data);

                    // Handle the data as needed, for example, redirect to another page
                    window.location.href = 'register4.html';
                } else {
                    // If the server returns an error (status code other than 2xx)
                    const errorMessage = await response.text();
                    console.error('Server Error:', errorMessage);
                    // Handle the error, show a message to the user, etc.
                }
            } catch (error) {
                // Network error or other issues
                console.error('Error:', error);
                // Handle the error, show a message to the user, etc.
            }
        } catch (error) {
            console.error('서버 및 클라이언트 연결 중 오류 발생:', error.message);
            // 오류를 적절히 처리
        }
    }

    // Call functions to set up event listeners
    insertBtnFunc('inputSick', 'btnSick', 'sickList');
    insertBtnFunc('inputAllergy', 'btnAllergy', 'allergyList');
    insertBtnFunc('inputMedicine', 'btnMedicine', 'medicineList');

    const submitFormButton = document.getElementById('submitForm');
    if (submitFormButton) {
        submitFormButton.addEventListener('click', handleFormSubmission);
    }

    const addInfoForm = document.getElementById('addInfoForm');
    if (addInfoForm) {
        addInfoForm.addEventListener('click', handleServerClientConnection);
    }

    const backBtn = document.querySelector('.inner-header')
    backBtn.addEventListener('click',(event)=>{
        event.preventDefault()
        localStorage.removeItem('userId')
        window.location.href =  '../index.html'
    })
});