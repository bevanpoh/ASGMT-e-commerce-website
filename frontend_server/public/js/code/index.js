
//get products to populate index page
function get6RandomProducts() {
    $.ajax({
        url: `http://localhost:8081/product/random`,
        type: 'GET',
        dataType: "json",
        success: function (response, textStatus) {
            productHTML = ''

            response.forEach(function (product) {
                const { productid, productname, imageurl, brand, price } = product

                productHTML += `
                <div class="col-sm-6 col-md-4 col-lg-4">
                    <div class="box">
                        <div class="option_container">
                         <div class="options">
                            <a href="" class="option1">
                               Add to Cart
                             </a>
                            <a class="option2" href="productDetail.html?product=${productid}">
                                View Details
                            </a>
                         </div>
                          </div>

                    <div class="img-box">
                        <img src="http://localhost:8081/images/${imageurl}" alt="">
                    </div>

                    <div class="detail-box">
                        <div>
                            <h5>
                            ${productname}
                            </h5>
                            ${brand}
                        </div>

                         <h6 class="my-auto">
                           $${price.toFixed(2)}
                         </h6>
                    </div>
    
                    </div>
                </div>
                  `
            });

            document.getElementById('productContainer').innerHTML = productHTML
        },
        error: function (xhr, textStatus, error) {
            console.log('error category')
        }
    });
}

