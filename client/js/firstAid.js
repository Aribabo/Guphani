// 데이터패치
try {
    fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/firstAid/user/list`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const listWrap = document.querySelector('.list-wrap');
        let html = '';
        console.log(data);
        if (data.length === 0) {
          html += `
            <li class="no-data">
              <p>등록된 응급처치가 없습니다</p>
            </li>
          `;
        } else {
          data.forEach((el) => {
            html += `
              <li class="list">
                <a href="./detail.html?id=${el._id}">
                  <div class="head">
                    <p class="bo-tit ellip2">${el.title}</p>
                  </div>
                  <div class="body">
                    <p class="ellip2">${el.contents}</p>
                  </div>
                  <div class="foot">
                    <div class="bo-date">${String(el.createdAt).split('T')[0]}</div>
                  </div>
                </a>
              </li>
            `;
          });
        }
        listWrap.innerHTML = html;
      });
  } catch (error) {
    console.error('데이터 패치 중 오류 발생:', error.message);
  }