// gets details of logged in user
function getUserDetails() {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userid');

    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `http://localhost:8081/users/${userid}`,
        type: 'GET',
        dataType: "json",
        success: function (response, textStatus) {
            const { username, email, contact, profile_pic_url } = response;
            // format user detail card html
            var userHTML = `
                    <!-- img container -->
                    <div class="col-3 offset-1 my-auto">
                        <div class="form-group">
                            <img src="" alt="${username} image"
                                class='img-fluid img-thumbnail img-responsive' id="profile_img">
                        </div>
                        <!-- /form group -->
                    </div>
                    <!-- /img container -->

                    <!-- user info -->
                    <div class="col-6 offset-1 my-auto card-body">
                        <div class="form-group">
                            <label for="">Username:</label>
                            <input type="text" id="username" value="${username}" class="form-control">

                            <label for="">Email:</label>
                            <input type="email" id="email" value="${email}" class="form-control">

                            <label for="">Contact:</label>
                            <input type="text" id="contact" value="${contact}" class="form-control">
                        </div>
                        <!-- /form group -->
                    </div>
                    <!-- /user info -->
                    `
            //add user detail html 
            $('#userContainer').html(userHTML);
        },
        error: function (xhr, textStatus, error) {
            $('#userContainer').html(`<span class="font-weight-light font-italic mx-auto my-5">
            <h3 class="err"> Something went wrong, please return to home page</h3>
        </span>`);
            console.log('error ' + error);
        }
    });
}

//creates radio form for category preferences
function createPreferenceCheckbox() {
    $.ajax({
        url: `http://localhost:8081/category`,
        type: 'GET',
        dataType: "json",
        success: function (response, textStatus) {
            var categoryRadioHtml = `<h3 class="font-weight-bold my-3 ml-3">Category Preferences</h3>
            <form class='form-row mx-5' id="preferencesForm">`
            response.forEach(function (category) {
                const { categoryid, categoryname } = category;
                categoryRadioHtml += `
                <div class="form-check custom-checkbox col-3">
                    <input type="checkbox" class="form-check-input" 
                    id="categoryPreference${categoryid}" value="${categoryid}" name="preference">
                    <label class="form-check-label" for="categoryPreference${categoryid}">
                        ${categoryname}
                    </label>
                </div>
                `
            });

            categoryRadioHtml += `<input type="button" id="changePreferencesButton"
            class="btn blue-btn-color my-3 mx-auto"
            value="Change Preferences">
            </form>`
            $('#profileContainer').append(categoryRadioHtml);

            getCategoryPreferences();
        },
        error: function (xhr, textStatus, error) {
            switch (error) {
                case 'Not Found':
                    $('#profileContainer').append(`<span class="font-weight-light font-italic mx-auto my-5">
                                                <h3 class="err">No Categories</h3>
                                                </span>`);
                    break;
                default:
                    $('#profileContainer').append(`<span class="font-weight-light font-italic mx-auto my-5">
                                                <h4 class="err"> Something went wrong</h4>
                                                </span>`);
            }
            console.log('error ' + error);
        }
    });
}

//gets category preferences to activate checkboc form
//runs in success of createPreferenceCheckbox() 
function getCategoryPreferences() {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userid');

    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `http://localhost:8081/user/${userid}/interests`,
        type: 'GET',
        dataType: "json",
        success: function (response, textStatus, xhr) {
            for (let i = 0; i < response.length; i++) {
                console.log(response[i].categoryid)
                $(`input#categoryPreference${response[i].categoryid}`).attr('checked', true);
            }
            console.log('get interests')
        },
        error: function (xhr, textStatus, error) {
            console.log(error);
            console.log(xhr.responseJSON);

        }
    });
}

//submits category preference form
function postCategoryPreferences() {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userid');
    var categoryids = '';
    console.log($('#preferencesForm').serializeArray())
    const categoryPreferences = $('#preferencesForm').serialize().split('&')
    for (let i = 0; i < categoryPreferences.length; i++) {
        let id = categoryPreferences[i].split('=')[1];
        if (i > 0)
            categoryids += ',';
        categoryids += id;
    }

    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `http://localhost:8081/interest/${userid}/`,
        type: 'POST',
        data: JSON.stringify({ categoryids: categoryids }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, textStatus, xhr) {
            // window.alert('Preference update successful');
            window.location.assign(window.location.href);
        },
        error: function (xhr, textStatus, error) {
            console.log(error);
            console.log(xhr.responseJSON);
            if (error !== 'Conflict' && xhr.responseJSON)
                window.alert(`Preference update unsuccessful
                \nMessage:${xhr.responseJSON.message}`);
            window.location.assign(window.location.href);
        }
    });
}

//deletes category preferences
function deleteCategoryPreferences() {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userid');
    var categoryids = '';
    var uncheckedPreferences = document.querySelectorAll('input[type="checkbox"]:not(:checked)');

    for (let i = 0; i < uncheckedPreferences.length; i++) {
        var categoryid = $(uncheckedPreferences[i]).val();
        if (i > 0) categoryids += ',';
        categoryids += categoryid
    }

    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `http://localhost:8081/user/${userid}/interests`,
        type: 'DELETE',
        data: JSON.stringify({ categoryids: categoryids }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, textStatus, xhr) {
            // window.alert('Preference update successful');
            postCategoryPreferences();
        },
        error: function (xhr, textStatus, error) {
            console.log(error);
            console.log(xhr.responseJSON);
            window.alert(`Preference update unsuccessful
                \nMessage:${xhr.responseJSON.message}`)
        }
    });
}


//add button to admin dashboard
function addDashboardButton() {
    $('div#dashboardButton').html(`<button class="btn blue-btn-color mx-auto"
    onclick="window.location.assign('adminDashboard.html')"> 
    Admin Dashboard </a> 
    </button>`)
}