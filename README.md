# Online-Bookstore
#### Description: An online bokstore to buy and sell books online.


## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)



## Description
This project is a backend server for an online bookstore, using Nestjs and Typescript, a PostgreSQL database and TypeORM, along with JWT authentication and Paymob Payment Inegration. 


## Installation

1. Clone the repository: 
    ```
    git clone https://github.com/SaifAshrafHelmy/Online-Bookstore.git 
    cd Online-Bookstore/server
    ```


3. Install the required dependencies:

    ```
    npm install
    ```

4. Create a PostgreSQL database with the name `online-bookstore`.

    - Make sure to update the database username and password in the `app_module_imports.ts` file according to your actual credentials.
   


5. Run the server: 

    ```
    npm run start:dev 
    ```
   - The application will be accessible at http://localhost:5000. 

7. Test the application using Swagger or Postman collection: 
   - Swagger: https://app.swaggerhub.com/apis/SAIFASHRAFHELMY_1/Online-Book-Store-API/1.0.0-oas3 
   - Postman: https://documenter.getpostman.com/view/26023359/2sA2xb6bQo \
   (Make sure to add the endpoint collection variable as http://localhost:5000)
   

## Usage
1. Register or log in to your account (as a cusomter or a seller).
2. Explore books or add new books.
3. Create an order for the books wanted.
4. Pay for the order using your Credit Card or Mobile Wallet..



