![CF](http://i.imgur.com/7v5ASc8.png) LAB
=================================================

<!-- LINKS -->
<!-- Replace the link for each in brackets below -->
<!-- PR (working into submission) -->
[1]: https://github.com/401-advanced-javascript-billybunn/lab-14/pull/1
<!-- travis build -->
[2]: https://travis-ci.com/401-advanced-javascript-billybunn/lab-14
<!-- back-end -->
[3]: https://billybunn-401-lab-14.herokuapp.com/
<!-- front-end -->
[4]: http://xyz.com
<!-- swagger -->
[5]: http://xyz.com
<!-- jsdoc-->
[6]: heroku-link/docs 

## Access Control (ACL)

### Author: Billy Bunn

### Links and Resources
* [PR][1]
* [travis][2]
* [back-end][3]
<!-- (when applicable) -->
<!-- * [front-end][4] -->

<!-- #### Documentation -->
<!-- API assignments only -->
<!-- * [swagger][5] -->
<!-- (All assignments) -->
<!-- * [jsdoc][6] -->

<!-- ### Modules -->
<!-- #### `modulename.js` -->
<!-- ##### Exported Values and Methods -->

<!-- ###### `foo(thing) -> string` -->
<!-- If you finished everything, you should be able to copy/paste the lab requirements and put them in present tense. -->
<!-- Usage Notes or examples -->

<!-- ###### `bar(array) -> array` -->
<!-- Usage Notes or examples -->

### Setup
#### `.env` requirements
* `npm i` - install all depedencies
* `.env` - add the following environment variables:
  * `PORT` - assign a port number
  * `MONGODB_URI` - URL to the running mongo instance/db
  * `SECRET` - secret to sign/verify JWT token
* install `HTTPie` to make HTTP requests in your CLI


#### Running the app
* `nodemon` - get the sever up an running on the `PORT` you specify in your `.env`
* Endpoint: `/signup` - (using `HTTPie` in the CLI)
    * `echo '{"username":"<yourusername>", "password":"<yourpassword>", "role":"role"}' | http :<yourPORT>/signup`
    * a token should be returned
* Endpoint: `/signin`
  * `http post :<yourPORT>/signin "Authorization: Bearer <yourtoken>`
  * a new JWT token generated by the server should be returned
##### The following endpoints can only be accessed by roles with the capabilities indicated
  * `router.get('/public-stuff')` should be visible by anyone
  * `router.get('/hidden-stuff')` should require only a valid login
  * `router.get('/something-to-read')` should require the `read` capability
  * `router.post('/create-a-thing)` should require the `create` capability
  * `router.put('/update)` should require the `update` capability
  * `router.patch('/jp)` should require the `update` capability
  * `router.delete('/bye-bye)` should require the `delete` capability
  * `router.get('/everything')` should require the `superuser` capability

  
#### Tests
* How do you run tests?
  * `npm run test`
  * `npm run lint`
<!-- * What assertions were made? -->
<!-- * What assertions need to be / should be made? -->

#### UML
Created with Jon Gentry
![Lab 13 UML](https://i.imgur.com/Z3AkIS0.jpg)
