const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')
const validator = require('../middleware/validator.js')
const users_controller = require('../controllers/usersController');
const issues_router = require('./issues');

const router = express.Router()
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */


/**
 * @swagger
 * path:
 *  /users/register:
 *    post:
 *      summary: Register a user
 *      tags: [Users]
 *      requestBody:
 *        description: Just admin can assign roles, so in body role AND issues will be ignored (issues will be added automatically when they are assigned to user), after register , keep your token
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "201":
 *          description: Created user
 *          content:
 *            application/json:
 *              token :
 *                type: string
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.post('/register',  validator.userValidationRules(), validator.validate, users_controller.creat_user);

/**
 * @swagger
 * path:
 *  /users/:
 *    get:
 *      summary: Get all site users
 *      tags: [Users]
 *      security:
 *       - bearerAuth: []
 *      responses:
 *        "400":
 *           description: Bad request
 *        "200":
 *          description: An array of users
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                    $ref: '#/components/schemas/User'
 */
router.get('/', auth, users_controller.get_users);

/**
 * @swagger
 *
 * path:
 *  /users/login:
 *    post:
 *      summary: login into your account, keep your id and your token in mind
 *      tags: [Users]
 *      requestBody:
 *        description: need email and password to login
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  decription: user email
 *                password:
 *                  type: string
 *                  format: password
 *                  description: Password for the user.
 *              required:
 *                - email
 *                - password
 *            examples:
 *               admin:
 *                value:
 *                 email: super_admin@dev.net
 *                 password: super11@31
 *               user:
 *                value:
 *                 email: user@ab.com
 *                 password: user1234
 *      responses:
 *        "400":
 *           description: Bad request
 *        "200":
 *          description: An array of users
 *          headers:
 *            auth-token:
 *              schema:
 *                type: integer
 *              description: JWT token.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  user:
 *                    $ref: '#/components/schemas/User'
 *                  token:
 *                     type: string
 */
router.post('/login', validator.userValidationLogin(), validator.validate, users_controller.login);


/**
 * @swagger
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:            # arbitrary name for the security scheme
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *
 * paths:
 *  /users/{userId}:
 *    get:
 *     summary: Get a profile of user by ID, NB; user should be logged
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the user to get
 *         example: 5da2212fb7f5f757f6f76ff3
 *     responses:
 *       "401":
 *          description: Not authorized to access this resource (e.g. access another user profile!)
 *       "200":
 *         description: profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 */
router.get('/:user_id', auth, users_controller.get_user);


/**
 * @swagger
 * paths:
 *  /users/{userId}:
 *    patch:
 *     summary: Upadte a profile of user by ID, NB; user should be logged for updating profile
 *              . Admin can update user role.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the user to get
 *         examples:
 *            user:
 *              value:
 *                5da22173b7f5f757f6f76ff8
 *     requestBody:
 *        description: Update user profile (name, emi, password), Update other user role (Just logged user as ADMIN can do it)
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                  decription: user email
 *                password:
 *                  type: string
 *                  format: password
 *                role:
 *                  type: String
 *            examples:
 *              user:
 *                value:
 *                  name: user updated name
 *              admin:
 *                value:
 *                  role: 'USER'
 *     responses:
 *       "4XX":
 *          description: e.g. Not authorized to access this resource (e.g. access another user profile!)
 *                       AND Just admin can change role! (e.g user trying update role)
 *          content:
 *            application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                     type: string
 *       "200":
 *          description: return updated user
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                     type: string
 *                  user:
 *                    $ref: '#/components/schemas/User'
 *
 */
router.patch('/:user_id', auth ,validator.userValidationUpdate(),validator.validate, users_controller.update_user);


/**
 * @swagger
 * paths:
 *  /users/{userId}/logout:
 *    post:
 *     summary: logout from your account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the user to get
 *         example: 5da22173b7f5f757f6f76ff8
 *     responses:
 *       "401":
 *          description: Not authorized to access this resource (e.g. access another user profile!)
 *       "200":
 *         description: profile
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                      type: string
 *
 */
router.post('/:user_id/logout', auth, users_controller.logout);

/**
 * @swagger
 * definitions:
 *   Issue:
 *    properties:
 *      title:
 *        type: string
 *      description:
 *        type: string
 *      deadline:
 *        type: string
 *        format: date-time
 *      status:
 *        type: string
 *        enum:
 *          - TO DO
 *          - DONE
 *          - BLOCKED
 *          - IN PROGRESS
 *          - CLOSED
 *        description: Describe issue progress.
 *      prority:
 *        type: string
 *        enum:
 *          - LOW
 *          - MEDIIM
 *          - HIGH
 *        description: Describe issue priority.
 *      category:
 *        type: _id
 *        description: Category that issue belongs to.
 *      team:
 *        type: _id
 *        description: Team that issue belongs to.
 *      assign_to:
 *        type: _id
 *        description: Member in charge to fix issue (user_id).
 *      comments:
 *        type: array
 *        description: array of comments
*/
/**
 * @swagger
 * path:
 *  /users/{userId}/issues:
 *    get:
 *      summary: Get all user issues (assigned to him)
 *      tags: [Users]
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *            type: string
 *          required: true
 *          description: Numeric ID of the user to get
 *          examples:
 *             user:
 *               value:
 *                 5da2212fb7f5f757f6f76ff3
 *      responses:
 *         "401":
 *           description: e.g. Not authorized, e.g. try to access another user issue!
 *           content:
 *             application/json:
 *              schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                      type: string
 *         "400":
 *            description: Bad request
 *         "200":
 *            description: An array of issues
 *            content:
 *              application/json:
 *                schema:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Issue'
 */
router.use('/:user_id/issues', issues_router);


module.exports = router