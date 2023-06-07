//gets search results
// queryStr passed over from frontend url
function getSearchResults(queryStr) {
    console.log(queryStr);

    $.ajax({
        url: `http://localhost:8081/products/search?${queryStr}`,
        type: 'GET',
        dataType: "json",
        success: function (response, textStatus) {
            console.log(response);

            let productHTML = '';

            for (let i = 0; i < response.length; i++) {
                const { productname, productid, brand, price, imageurl } = response[i];

                productHTML += `
                    <div class="col-5 offset-1 card mb-3 search-container p-0"
                    onclick="window.location.assign('productDetail.html?product=${productid}')">
                    <div class="card-header">
                        <img src="http://localhost:8081/images/${imageurl}" alt="${productname} image"
                            class="img-fluid img-responsive card-img-top" style="max-height:19rem;">
                    </div>

                    <div class="card-body">
                        <div class="row">
                            <div class="col-7">
                                <h5>${productname}</h5>
                                <p class="font-weight-light font-italic">${brand}</p>
                            </div>

                            <div class="col-5">
                                <h4>$${price.toFixed(2)}</h4>
                                <div id='avgRating${productid}'></div>
                            </div>
                        </div>
                    </div>
                </div>
                    `

                getProductIdAvgRating(productid);
            }
            $('div#searchResultsContainer').html(productHTML);


        },
        error: function (xhr, textStatus, error) {
            console.log(error);
            console.log(xhr.responseJSON.message);
            switch (error) {
                case "Not Found":
                    $('div#searchResultsContainer').html(`<h3 
                    class="font-weight-light font-italic my-5">
                    No matches found </h3>`)
                    break;
                default:
                    $('div#searchResultsContainer').html(`<h3 
                    class="err font-weight-light font-italic my-5">
                    Something went wrong: ${xhr.responseJSON.message}</h3>`)
            }

        }
    });
}

//get average rating of product
//and displays in html
function getProductIdAvgRating(productid) {
    $.ajax({
        url: `http://localhost:8081/product/${productid}/averageRating`,
        type: 'GET',
        dataType: "json",
        success: function (response, textStatus) {
            console.log(response);

            const { avgRating } = response;

            avgRatingHTML = `${avgRating.toFixed(1)}/5 stars`;

            $(`#avgRating${productid}`).html(avgRatingHTML);

        },
        error: function (xhr, textStatus, error) {
            console.log('error category ' + error);
            document.getElementById('productDetails').style = 'color:red';
            document.getElementById('productDetails').innerHTML = 'Something went wrong';
        }
    });
}
