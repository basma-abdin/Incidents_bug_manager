const express = require('express');
const auth = require('../middleware/auth')
const issues_router = require('./issues');

const router = express.Router({ mergeParams: true });

const categories_controller = require('../controllers/categoriesController');
const Category = require('../models/Category');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management. NB; All Category operations depends on team that
 *                it belongs to and logged user (it is private for TEAM MEMBERS).
 */

 /**
 * @swagger
 * definitions:
 *  UpdateCat:
 *   schema:
 *    type: object
 *    properties:
 *      name:
 *        type: string
 *      color:
 *        type: string
 *        enum:
 *          - Gray
 *          - Red
 *          - Pink
 *          - Blue
 *          - Yellow
 *          - Green
 *          - Orang
 *          - Purple
 *    required:
 *      - name
 *   example:
 *      name: frontend design
 *      color: Red
 */


/**
 * @swagger
 * path:
 *  /teams/{teamId}/categories/:
 *    get:
 *      summary: Get list of categories of team.
 *      tags: [Categories]
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the team;
 *         example: 5da4dfa8e99a6829bb6e5989
 *      responses:
 *        "400":
 *           description: Bad request
 *        "200":
 *          description: An array of categories
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                    $ref: '#/components/schemas/Category'
 */
router.get('/', auth, categories_controller.get_categories);

/**
 * @swagger
 *
 * path:
 *  /teams/{teamId}/categories/:
 *    post:
 *      summary: Create a new category AND add it to the team passed in parameters.
 *               NB; issues will be added automatically
 *      tags: [Categories]
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the team
 *         example:
 *            5da4dfa8e99a6829bb6e5989
 *      requestBody:
 *        description: Category name and color.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/UpdateCat'
 *      responses:
 *        "201":
 *          description: Created category
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Category'
 *        "400":
 *           description: Bad request
 *           content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 *        "401":
 *          description: Not authorized to access this resource (e.g. try to create a category for a team you not member!)
 *          content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 */
router.post('/', auth, categories_controller.create_category);

/**
 * @swagger
 * paths:
 *  /teams/{teamId}/categories/{categoryId}:
 *    get:
 *     summary: Get category details, NB; it is private for team member.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the team
 *         example:
 *            5da4dfa8e99a6829bb6e5989
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the category. Category should belongs to team
 *         example:
 *            5dab92ae7ec6a9549a4a9372
 *     responses:
 *       "4XX":
 *          description: e.g. Not authorized to access this resource (e.g. try to get a category, even you are not a team member!)
 *          content:
 *            application/json:
 *             schema:
 *              $ref: '#/definitions/error'
 *       "200":
 *          description: Return category
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  issue_length:
 *                     type: integer
 *                  category:
 *                    $ref: '#/components/schemas/Category'
 *
 */
router.get('/:category_id', auth , categories_controller.get_category);

/**
 * @swagger
 * paths:
 *  /teams/{teamId}/categories/{categoryId}:
 *    delete:
 *     summary: Delete a category, it will delete all category issues.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the team
 *         example:
 *            5dab1f75864d7a256b7d3992
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the category. Category should belongs to team
 *         example:
 *            5dab92ae7ec6a9549a4a9372
 *     responses:
 *       "4XX":
 *          description: e.g. Not authorized to access this resource (e.g. try to delete a category, even you are not a team member!)
 *          content:
 *            application/json:
 *             schema:
 *              $ref: '#/definitions/error'
 *       "200":
 *          description: Return message
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                     type: string
 *
 */
router.delete('/:category_id',auth ,  categories_controller.delete_category);

/**
 * @swagger
 * paths:
 *  /teams/{teamId}/categories/{categoryId}:
 *    patch:
 *     summary: Upadte category, NB; just team member can update.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the team
 *         example:
 *            5dab1f75864d7a256b7d3992
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the category. Category should belongs to team
 *         example:
 *            5dab92ae7ec6a9549a4a9372
 *     requestBody:
 *        description: New name or color, NB; issues have their own route to update
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/UpdateCat'
 *     responses:
 *       "4XX":
 *          description: e.g. Not authorized to access this resource (e.g. try to update a category, even you are not a team member!)
 *          content:
 *            application/json:
 *             schema:
 *              $ref: '#/definitions/error'
 *       "200":
 *          description: Return updated category
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                     type: string
 *                  category:
 *                    $ref: '#/components/schemas/Category'
 *
 */
router.patch('/:category_id', auth , categories_controller.update_category);

//router.get('/', auth , categories_controller.get_teams);




router.use('/:category_id/issues', issues_router);


module.exports = router;