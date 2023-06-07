function addSignOutAndProfileLinks() {
    $('#loginLink').addClass('d-none');
    $('#profileLink').removeClass('d-none');
    $('#profileLink').attr('href', `profile.html?user=${localStorage.getItem('userid')}`)
    $('#logoutLink').removeClass('d-none');
}

function headerSearch() {
    const nameKeyword = $('input#nameSearchBox').val();
    const brandKeyword = $('input#brandSearchBox').val();

    var inputQuery = '';
    if (nameKeyword) inputQuery += `name=${nameKeyword}`;
    if (brandKeyword) {
        if (inputQuery) inputQuery += '&'
        inputQuery += `brand=${brandKeyword}`
    }
    window.location.assign(`search.html?${inputQuery}`)
}