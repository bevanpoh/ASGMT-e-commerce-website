// displays admin dashboard to edit product/category
// adds forms to submit post request
function displayAdminDashboard() {
    // display dahsboard
    $('#adminDashboard').removeClass('d-none');

    // add product form
    // attaches post function at the end of form row
    document.getElementById('createProductForm').innerHTML = `
            <h5 class="font-weight-bold my-3 col-12">Add product:</h5>
            <form class="col-10 offset-1" id="productForm" enctype="multipart/form-data">
                <div class="form-row">
                    <label for="">Product name:  <span class="err">*</span> </label>
                    <input type="text" class="form-control" 
                    placeholder ="Product name" id="productName" required>
        
                    <!-- brand price row -->
                    <div class="form-row my-3 col-12">
                        <div class="col">
                            <label for="">Brand:  <span class="err">*</span> </label>
                            <input type="text" class="form-control" 
                            placeholder ="Brand" id="productBrand" required>
                        </div>
        
                        <div class="col">
                            <label for="" class="d-block">Price:  <span class="err">*</span> </label>
                            <input type="number" class="form-control" 
                            pattern="[0-9]+(\.[0-9][0-9]?)?" min="0.00" step="0.01" 
                            placeholder ="-.--" id="productPrice" required>
                        </div>
                    </div>
                    <!-- /brand price row -->
        
                    <label for="">Description: </label>
                    <textarea id="productDescription" class="form-control mb-3" 
                    placeholder ="Description"></textarea>
        
                    <label for="">Category:  <span class="err">*</span> </label>
                    <select class="custom-select mb-3 productSelect"
                    id="productCategoryid" required>
                        <option selected hidden value="">Pick a category</option>
                    </select>
        
                    <label for="">Product image: </label>
                    <input type="file" class="form-control-file" accept="image/*" 
                    id="productImage">
        
                    <input type="button" value="Add Product" class="btn blue-btn-color my-3" 
                    onclick ="productPost()" >
                </div>
                <!-- form row -->
            </form>
                `;
    // add category form
    // attaches post function at the end of form row
    document.getElementById('createCategoryForm').innerHTML = `
        <h5 class="font-weight-bold my-3 col-12">Add category:</h5>
        <form action="#" class="col-10 offset-1" id="categoryForm" enctype="multipart/form-data">
            <div class="form-row">
                <label for="">Category name:</label>
                <input type="text" class="form-control"
                placeholder="Category name" id="categoryName">
    
                <label for="">Description:</label>
                <textarea name="" class="form-control mb-3"
                placeholder="Description" id="categoryDescription"></textarea>
    
                <label for="">Category image:</label>
                <input type="file" class="form-control-file" accept="image/*" id="categoryImage">
    
                <input type="button" value="Add Category" class="btn blue-btn-color my-3" 
                onclick="categoryPost()">
            </div>
            <!-- form row -->
        </form>
                `;
}

// post product
function productPost() {
    const token = localStorage.getItem('token');
    //extarct necessary info from form
    var productObj = {}

    productObj.name = $(`input#productName`).val();
    productObj.brand = $(`input#productBrand`).val();
    productObj.price = $(`input#productPrice`).val();
    productObj.description = $(`textarea#productDescription`).val();
    productObj.categoryid = $(`select#productCategoryid`).val();

    var imageFormData = new FormData();
    const productImage = $(`input#productImage`).prop('files');
    // format as json
    // console.log(productObj)

    //format to JSON
    const data = JSON.stringify(productObj);
    console.log(data);

    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `http://localhost:8081/product/`,
        type: 'POST',
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, textStatus, xhr) {
            window.alert(`Product '${productObj.name}' insert successful`);
            //if image was provideds
            if (productImage.length !== 0) {
                // create form data
                imageFormData.append('imageUpload',
                    productImage[0],
                    `${productObj.name.replace(/ /g, '')}_${productObj.brand.replace(/ /g, '_')}`
                )
                //pass to iamge upload ednpoint 
                productImageUpload(response.productid, imageFormData);
            }
            else {
                window.location.assign(window.location.href);
            }
        },
        error: function (xhr, textStatus, error) {
            console.log(error);
            console.log(xhr.responseJSON);
            switch (error) {
                default:
                    window.alert(`Product '${productObj.name}' insert unsuccesful
                    \nMessage: ${xhr.responseJSON.message}`);
            }
        }
    });
}

// post category
function categoryPost() {
    const token = localStorage.getItem('token');

    //extarct necessary info from form
    var categoryObj = {};
    categoryObj.category = $(`input#categoryName`).val();
    categoryObj.description = $(`input#categoryDescription`).val();
    // format as json


    //format to JSON
    const data = JSON.stringify(categoryObj);
    // console.log(data);

    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `http://localhost:8081/category/`,
        type: 'POST',
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, textStatus, xhr) {
            window.alert(`Category '${categoryObj.category}' insert succesful!`);
            console.log('ajax success');
            //refresh page for changes
            window.location.assign(window.location.href);
        },
        error: function (xhr, textStatus, error) {
            console.log(error);
            console.log(xhr.responseJSON);
            switch (error) {
                default:
                    window.alert(`Category '${categoryObj.category}' insert unsuccesful\nMessage: ${xhr.responseJSON.message}`);
            }
        }
    });
}

//upload image
function productImageUpload(itemId, imageFormData) {
    const token = localStorage.getItem('token');
    console.log(...imageFormData);
    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `http://localhost:8081/product/${itemId}/image/upload`,
        type: 'PUT',
        data: imageFormData,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (response, textStatus, xhr) {
            window.alert(`Product image insert successful`);
            window.location.assign(window.location.href);
        },
        error: function (xhr, textStatus, error) {
            console.log(error);
            console.log(xhr.responseJSON);
            switch (error) {
                default:
                    window.alert(`Product image insert unsuccesful
                    \nMessage: ${xhr.responseJSON.message}`);
                    window.location.assign(window.location.href);
            }
        }
    });
}

//gets details of all products, creates forms
//attaches delete/upadte functions at the end of form row
function getProducts() {
    //promise to ensure that categoryname dropdown is added after form creation and id exists
    return new Promise(function (resolve, reject) {
        // each card is form with product details as default value
        // submit form to update, or to delete
        $.ajax({
            url: `http://localhost:8081/products`,
            type: 'GET',
            dataType: "json",
            success: function (response, textStatus) {
                productHTML = '<h5 class="font-weight-bold my-3 col-12">Products</h5>'

                response.forEach(function (product) {
                    const { productid, productname, categoryname, description, brand, price, categoryid, imageurl } = product
                    //product card detail HTML
                    productHTML += `
                <form action="" class="col-6 mb-2">
                <div class="card">
                    <div class="row mt-3">
                        <!-- img container -->
                        <div class="col-5 mx-auto my-auto" style="cursor:pointer" 
                        onclick="window.location.assign('productDetail.html?product=${productid}')">
                            <div class="form-group">
                                <img src="http://localhost:8081/images/${imageurl}" alt="${productname} image"
                                    class='img-fluid img-thumbnail img-responsive horizontalCard_img'>
                            </div>
                            <!-- /form group -->
                        </div>
                        <!-- /img container -->

                        <!-- product info -->
                        <div class="col-6 mx-auto card-body">
                            <div class="form-row">
                                <label for="">Product name:</label>
                                <input type="text" class="form-control form-control-sm" 
                                value="${productname}" id="productName${productid}">

                                <!-- brand price row -->
                                <div class="form-row col-12">
                                    <div class="col">
                                        <label for="">Brand:</label>
                                        <input type="text" class="form-control form-control-sm" 
                                        value="${brand}" id="productBrand${productid}">
                                    </div>

                                    <div class="col">
                                        <label for="" class="d-block">Price:</label>
                                        <input type="number" class="form-control form-control-sm"
                                            pattern="[0-9]+(\.[0-9][0-9]?)?" min="0.00" step="0.01"
                                            value="${price.toFixed(2)}" id="productPrice${productid}">
                                    </div>
                                </div>
                                <!-- /brand price row -->

                                <label for="">Description:</label>
                                <textarea name="" id="productDescription${productid}" 
                                class="form-control form-control-sm">${description}</textarea>

                                <label for="">Category:</label>
                                <select class="custom-select form-control-sm productSelect" 
                                id="productCategoryId${productid}">
                                    <option selected hidden value='${categoryid}'>${categoryname}</option>

                                </select>

                                <div class="my-3 mx-auto">
                                    <button class="btn blue-btn-color my-3" type = "button"
                                    onclick="productUpdate(${productid})">
                                        Update details
                                    </button>
                                    <button class="btn blue-btn-color" type = "button"
                                    onclick="productImageDelete(${productid})">
                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                            <!-- /form row -->
                        </div>
                        <!-- /product info -->
                    </div>
                    <!-- row -->
                </div>
                <!-- /card -->
            </form>
                  `
                });
                //add productcard HTML
                $('#productsContainer').html(productHTML);

                resolve();
            },
            error: function (xhr, textStatus, error) {
                switch (error) {
                    case 'Not Found':
                        $('#productsContainer').html(`<span class="font-weight-light font-italic mx-auto my-5">
                                                <h3 class="err">No products</h3>
                                                </span>`);
                        break;
                    default:
                        $('#productsContainer').html(`<span class="font-weight-light font-italic mx-auto my-5">
                                                <h3 class="err"> Something went wrong, please return to home page</h3>
                                                </span>`);
                }
                console.log('error ' + error);
                reject();
            }
        });
    });
}

//updates product
function productUpdate(productid) {
    // create req body
    var productObj = {};
    productObj.productid = productid;
    productObj.productname = $(`input#productName${productid}`).val();
    productObj.categoryid = $(`input#productCategoryId${productid}`).val();
    productObj.description = $(`input#productDescription${productid}`).val();
    productObj.brand = $(`input#productBrand${productid}`).val();
    productObj.price = $(`input#productPrice${productid}`).val();
    // format as json
    const data = JSON.stringify(productObj);

    console.log(data);

    const token = localStorage.getItem('token');
    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `http://localhost:8081/product/${productid}`,
        type: 'PUT',
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, textStatus) {
            console.log(response);
            window.alert(`Product '${productObj.productname}' update succesful!`);
            //refresh page for changes
            window.location.assign(window.location.href);
        },
        error: function (xhr, textStatus, error) {
            switch (error) {
                case 'Conflict':
                    window.alert(`Product '${productObj.productname}' no changes made`);
                    break;
                default:
                    window.alert(`Product '${productObj.productname}' update unsuccesful\nMessage: ${xhr.responseJSON.message}`);
            }
            console.log('error ' + error);
        }
    });
}

// delete product
function productDelete(productid) {
    const productname = $(`input#productName${productid}`).val();

    const token = localStorage.getItem('token');
    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `http://localhost:8081/product/${productid}/`,
        type: 'DELETE',
        dataType: "json",
        success: function (response, textStatus) {
            window.alert(`Product '${productname}' delete succesful!`);
            //refresh page for changes
            window.location.assign(window.location.href);
        },
        error: function (xhr, textStatus, error) {
            switch (error) {
                default:
                    window.alert(`Product '${productname}' delete unsuccesful\nMessage: ${xhr.responseJSON.message}`);
            }
            console.log('error ' + error);
        }
    });
}

//delete product image
//runs first to ensure that image of product is deleted
function productImageDelete(productid) {
    const productname = $(`input#productName${productid}`).val();

    const token = localStorage.getItem('token');
    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `http://localhost:8081/product/${productid}/image/delete`,
        type: 'DELETE',
        dataType: "json",
        success: function (response, textStatus, xhr) {
            productDelete(productid);
        },
        error: function (xhr, textStatus, error) {
            console.log(error);
            console.log(xhr.responseJSON);
            switch (error) {
                default:
                    window.alert(`Product '${productname}' delete unsuccesful\nMessage: ${xhr.responseJSON.message}`);
            }
            console.log('error ' + error);
        }
    });
}

// gets details of all categories, creates forms, 
// adds category dropdown to product form
//attaches delete/upadte functions at the end of form row
function getCategories() {
    // each card is form with category details as default value
    // submit the form to update, button to delete
    $.ajax({
        url: `http://localhost:8081/category`,
        type: 'GET',
        dataType: "json",
        success: function (response, textStatus) {
            var categoriesHTML = '<h5 class="font-weight-bold my-3 col-12">Categories</h5>';
            var productSelectOptionsHtml = '';

            response.forEach(function (category) {
                const { categoryid, categoryname, description } = category;
                // category card detail html
                categoriesHTML += `
                <form action="" class="col-6 mb-2">
                                <div class="card">
                                    <div class="row mt-3">
                                        <!-- img container -->
                                        <div class="col-5 mx-auto my-auto">
                                            <div class="form-group">
                                                <img src="../images/" alt="${categoryname} image"
                                                    class='img-fluid img-thumbnail img-responsive horizontalCard_img'>
                                            </div>
                                            <!-- /form group -->
                                        </div>
                                        <!-- /img container -->

                                        <!-- category info -->
                                        <div class="col-6 mx-auto card-body">
                                            <div class="form-row">
                                                <label for="">Category name:</label>
                                                <input type="text" class="form-control"
                                                value="${categoryname}" id="categoryName${categoryid}">

                                                <label for="">Description:</label>
                                                <textarea name="" id="categoryDescription${categoryid}" class="form-control mb-3">${description}</textarea>

                                                <!-- button container -->
                                                <div class="my-3 mx-auto">
                                                    <button class="btn blue-btn-color" type="button" F
                                                    onclick="categoryUpdate(${categoryid})">
                                                        Update details
                                                    </button>
                                                    <button class="btn blue-btn-color" type="button" 
                                                    onclick="categoryDelete(${categoryid})">
                                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                                <!-- /button container -->
                                            </div>
                                            <!-- /form row -->
                                        </div>
                                        <!-- /category info -->
                                    </div>
                                    <!-- row -->
                                </div>
                                <!-- /card -->
                            </form>`

                //product select form option elements
                productSelectOptionsHtml += `<option value="${categoryid}">${categoryname}</option>`
            });
            //add card html
            $('#categoriesContainer').html(categoriesHTML);
            //add select form html
            $('select.productSelect').append(productSelectOptionsHtml);
        },
        error: function (xhr, textStatus, error) {
            switch (error) {
                case 'Not Found':
                    $('#userContainer').html(`<span class="font-weight-light font-italic mx-auto my-5">
                                                <h3 class="err">No products</h3>
                                                </span>`);
                    break;
                default:
                    $('#userContainer').html(`<span class="font-weight-light font-italic mx-auto my-5">
                                                <h3 class="err"> Something went wrong, please return to home page</h3>
                                                </span>`);
            }
            console.log('error ' + error);
        }
    });
}

//updates category
function categoryUpdate(categoryid) {
    // create req body
    var categoryObj = {};
    categoryObj.categoryid = categoryid;
    categoryObj.name = $(`#categoryName${categoryid}`).val();
    categoryObj.description = $(`#categoryDescription${categoryid}`).val();
    // format as json
    const data = JSON.stringify(categoryObj);

    console.log(data);

    const token = localStorage.getItem('token');
    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `http://localhost:8081/category/${categoryid}`,
        type: 'PUT',
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, textStatus) {
            console.log(response);
            window.alert(`Category '${categoryObj.name}' update succesful!`);
            //refresh page for changes
            window.location.assign(window.location.href);
        },
        error: function (xhr, textStatus, error) {
            switch (error) {
                case 'Conflict':
                    window.alert(`Category '${categoryObj.name}' no changes made`);
                    break;
                default:
                    window.alert(`Category '${categoryObj.name}' update unsuccesful\nMessage: ${xhr.responseJSON.message}`);
            }
            console.log('error ' + error);
        }
    });
}

// delete category
function categoryDelete(categoryid) {
    const categoryname = $(`#categoryName${categoryid}`).val();

    const token = localStorage.getItem('token');
    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `http://localhost:8081/category/${categoryid}`,
        type: 'DELETE',
        dataType: "json",
        success: function (response, textStatus) {
            console.log(response);
            window.alert(`Category '${categoryname}' delete succesful!`);
            //refresh page for changes
            window.location.assign(window.location.href);
        },
        error: function (xhr, textStatus, error) {
            switch (error) {
                default:
                    window.alert(`Category '${categoryname}' delete unsuccesful\nMessage: ${xhr.responseJSON.message}`);
            }
            console.log('error ' + error);
        }
    });
}
