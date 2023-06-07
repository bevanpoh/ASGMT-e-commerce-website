// check if user is logged in and valid
function isLoggedIn() {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userid');

    return new Promise(function (resolve, reject) {
        $.ajax({
            headers: { 'authorization': 'Bearer ' + token },
            url: `http://localhost:8081/user/${userid}/verifyLogin`,
            type: 'GET',
            dataType: "json",
            success: function (response, textStatus) {
                resolve(response);
            },
            error: function (xhr, textStatus, error) {
                reject(error);
            }
        });
    });

}

function isAdmin() {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userid');

    return new Promise(function (resolve, reject) {
        $.ajax({
            headers: { 'authorization': 'Bearer ' + token },
            url: `http://localhost:8081/user/${userid}/verifyAdmin`,
            type: 'GET',
            dataType: "json",
            success: function (response, textStatus) {
                resolve(response);
            },
            error: function (xhr, textStatus, error) {
                reject(error);
            }
        });
    });
}

// clears localstorage and logs out user
function logout() {
    localStorage.clear();
    window.location.assign('index.html')
}