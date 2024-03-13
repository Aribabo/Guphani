(function(){
    function includeHtml() {
        const includeTarget = document.querySelectorAll('.includeJs');
        includeTarget.forEach(function(el, idx) {
            const targetFile = el.dataset.includeFile;
            if(targetFile){
                let xhttp = new XMLHttpRequest();
            
                xhttp.onreadystatechange = function() {
                    try {
                        if (this.readyState === XMLHttpRequest.DONE) {
                            if (this.status === 200) {
                                el.innerHTML = this.responseText;
                            } else if (this.status === 404) {
                                throw new Error('include not found.');
                            } else {
                                throw new Error(`Failed to fetch include file. Status: ${this.status}`);
                            }
                        }
                    } catch (error) {
                        console.error('Error during includeHtml:', error.message);
                        el.innerHTML = 'Error during includeHtml.';
                    }
                };
                
                xhttp.open('GET', targetFile, true);
                xhttp.send();
            }
        });
    }

    includeHtml();
})();

// 레이어 팝업창
function layerOn(el) {
    const layer = document.getElementById(el);
    layer.classList.add('fadeIn');
    layer.classList.remove('fadeOut');
}
function layerOut(el) {
    const layer = document.getElementById(el);
    layer.classList.add('fadeOut');
    layer.classList.remove('fadeIn');
}

function logout() {
    try {
        localStorage.removeItem('adminToken');
        window.location.href = '../user/login.html';
    } catch (error) {
        console.error('Error during logout:', error.message);
        // Handle the error as needed
    }
}
