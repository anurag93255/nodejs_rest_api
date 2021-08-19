1) login

    This will take username and return jwt token

    "/login"   - "POST"

2) Products

    This does not take any input and return all products list.

    "/products" - "GET"

3) Product with specific id

     This will take product id as input and return product detail

     "/product/ID" - "GET"

4) Add Product

     This will take prod_id, name and price as input and return success message.

     "/addProduct" - "POST"

5) Edit Product

     This will edit product detail by specifying product id and updation value as object.

     "/editProduct" - "PATCH"

6) Delete Product

     This will delete Product by specifying id and response of this will be a success message.

     "/deleteProduct" - "DELETE"

 

Note: "A .rest file is already present in the project you can refer that for actual example".
