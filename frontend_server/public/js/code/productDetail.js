//get details of specified productid
function getProductIdDetails(productid) {
    // promise to ensure id avgRating exists before insert avgRAting
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: `http://localhost:8081/product/${productid}/`,
            type: 'GET',
            dataType: "json",
            success: function (response, textStatus) {
                console.log(response);

                const { productname, description, categoryname, brand, price, imageurl } = response;

                productHTML = `
                <div class="col-12">
                <h1 class='font-weight-bold'>${productname}</h1>
                <h4 class="font-weight-light">${brand}</h4>
            </div>
            <div class="col-12">
                <hr>
            </div>
            <div class="col-6 mx-auto">
                <img src='http://localhost:8081/images/${imageurl}' alt='${productname} image' 
                class="d-block img-fluid img-responsive mx-auto my-auto">
            </div>
    
            <div class="col-6 mx-auto text-center">
                <h5 class="font-weight-light font-italic">${categoryname}</h5>
                <h3 class="font-italic"> $${price.toFixed(2)}</h3>
    
                <div>
                    <h5 id='avgRating'>
                    </h5>
                </div>
                
                <hr>
    
                <div class='text-left mx-auto row'>
                    <span class='col-3'> Description: </span> 
                    <p class='text-left mx-auto col'>${description}</p>
                </div>
    
                <hr>
    
                <button type="button" class="btn blue-btn-color">
                    Add to Cart
                </button>
            </div>
    
                      `

                $('#productDetails').html(productHTML);
                resolve();
            },
            error: function (xhr, textStatus, error) {
                console.log('error category ' + error);
                switch (error) {
                    case 'Not Found':
                        $('#productDetails').html(`<span class="font-weight-light font-italic mx-auto my-5">
                                                    <h3 class="err">Product not found</h3>
                                                    </span>`);
                        break;
                    default:
                        $('#productDetails').html(`<span class="font-weight-light font-italic mx-auto my-5">
                                                    <h4 class="err"> Something went wrong, please4return to home page</h3>
                                                    </span>`);
                }
                reject();
            }
        });
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

            avgRatingHTML = `${avgRating.toFixed(2)}/5 stars`;

            $('#avgRating').html(avgRatingHTML);

        },
        error: function (xhr, textStatus, error) {
            console.log('error category ' + error);
            document.getElementById('productDetails').style = 'color:red';
            document.getElementById('productDetails').innerHTML = 'Something went wrong';
        }
    });
}

//display review form
function addReviewForm() {
    // promise to ensure button exists before attaching submit function
    // and stars exist to create star form
    return new Promise(function (resolve, reject) {
        // show form
        $('#reviewForm').removeClass('d-none');

        // add form html
        reviewFormHtml = `
    <form action="" class="form-inline">
        <div class="my-3 text-left">
            Rating: <span id='stars' class="pl-3"></span>
        </div>
        <textarea id="reviewText" placeholder="Write a review..." autocapitalize="none"></textarea>
        <input type="button" value="Submit Review" class="btn blue-btn-color" id="reviewSubmit">
    </form>
    
    <div id="reviewPostMsg"><div>`
        $('#reviewForm').append(reviewFormHtml);
        resolve();
    })
}

//post a review for product
function postProductIdReview(productid) {
    //extarct necessary info from form
    const token = localStorage.getItem('token');
    var reviewObj = {}
    reviewObj.userid = localStorage.getItem('userid');
    reviewObj.rating = $('#starsRating').val();
    reviewObj.review = $('#reviewText').val();
    // console.log(reviewObj)

    //format to JSON
    const data = JSON.stringify(reviewObj);
    console.log(data);

    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `http://localhost:8081/product/${productid}/review/`,
        type: 'POST',
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, textStatus) {
            window.location.assign(window.location.href);
            console.log('ajax success');
        },
        error: function (xhr, textStatus, error) {
            console.log(error)
            switch (error) {
                case 'Unauthorized':
                    $('#reviewPostMsg').html(`<span class="font-weight-light font-italic mx-auto my-5">
                    <h6 class="err"> Unauthorised, please logout 4nd login again</h6>
                    </span>`);
                    break;
                case 'Forbidden':
                    $('#reviewPostMsg').html(`<span class="font-weight-light font-italic mx-auto my-5">
                    <h6 class="err"> Please login to leave a review</h6>
                    </span>`);
                    break;
                case 'Unprocessable Entity':
                    $('#reviewPostMsg').html(`<span class="font-weight-light font-italic mx-auto my-5">
                    <h6 class="err"> You already left a review</h6>
                    </span>`);
                    break;
                default:
                    document.getElementById('reviewPostMsg').innerHTML = `<span class="font-weight-light font-italic mx-auto my-5">
                    <h6 class="err"> Something went wrong</h6>
                    </span>`;
            }
        }
    });
}

//get all reviews of specified productid
function getProductIdReviews(productid) {
    $.ajax({
        url: `http://localhost:8081/product/${productid}/reviews/`,
        type: 'GET',
        dataType: "json",
        success: function (response, textStatus) {
            reviewsHTML = ""
            response.forEach(function (productReview) {
                const { username, rating, review, created_at } = productReview;

                reviewsHTML += `
                <div class="col-4 my-3 text-center border-left border-right">
                        <h4 class="font-weight-normal">
                            ${username}
                        </h4>
                        <div>
                            <span class="d-block my-3 rates-container" id='userReviewStars'>
                `
                for (var i = 1; i <= 5; i++) {
                    reviewsHTML += `<img src="images/black-star.png" style="height: 15px;"`
                    if (i <= rating) {
                        reviewsHTML += ' class = "rates-blue"'
                    }
                    reviewsHTML += '>'
                }

                reviewsHTML += `   </span>
                             ${review}
                             <h6 class = "font-weight-light font-italic">Created at: ${new Date(created_at * 1000)}</h6>
                    </div>
                </div>`
            })

            $('#reviewsContainer').html(reviewsHTML);
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.responseJSON);

            switch (error) {
                case ('Not Found'):
                    $('#reviewsContainer').html(`<h3 class="font-weight-light font-italic mx-auto my-3">No reviews</h3>`)
            }
        }
    });
}
