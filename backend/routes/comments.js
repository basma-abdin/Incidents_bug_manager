const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

const comments_controller = require('../controllers/commentsController');
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comments management. NB; All comments operations depends on issue that
 *                it belongs to and logged user (it is private for TEAM MEMBERS).
 */


/**
 * @swagger
 * definitions:
 *  UpdateComment:
 *   schema:
 *    type: object
 *    properties:
 *      title:
 *        type: string
 *      body:
 *        type: string
 *    required:
 *      - title
 *      - body
 *   example:
 *      title: a quoi sert cette issue?
 *      body: je vois pas l'interet
 */

 /**
 * @swagger
 * path:
 *  /issues/{issueId}/comments:
 *    get:
 *      summary: Get list of comments of issue.
 *      tags: [Comments]
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: issueId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the issue
 *         example: 5daba194fef2405f78dd5306
 *      responses:
 *        "400":
 *           description: Bad request
 *        "2xx":
 *          description: An array of comments
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                    $ref: '#/components/schemas/Comment'
 */
router.get('/', auth, comments_controller.get_comments);

/**
 * @swagger
 *
 * path:
 *  /issues/{issueId}/comments:
 *    post:
 *      summary: Create a new comment AND add it to the issue passed in parameters.
 *               NB; comment creator and creation date will be added automatically
 *      tags: [Comments]
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: issueId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the issue
 *         example:
 *            5daba194fef2405f78dd5306
 *      requestBody:
 *        description: Cmments title and body.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/UpdateComment'
 *      responses:
 *        "201":
 *          description: Created category
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Comment'
 *        "400":
 *           description: Bad request
 *           content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 *        "401":
 *          description: Not authorized to access this resource (e.g. try to create a comment for a team you not member!)
 *          content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 */
router.post('/', auth, comments_controller.create_comment);

/**
 * @swagger
 * paths:
 *  /issues/{issueId}/comments/{commentId}:
 *    get:
 *     summary: Get comment details, NB; it is private for team member.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: issueId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the team
 *         example:
 *            5daba194fef2405f78dd5306
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the comment. Comment should belongs to issue
 *         example:
 *            5dc89533f483f43fc83b6d75
 *     responses:
 *       "4XX":
 *          description: e.g. Not authorized to access this resource (e.g. try to get a comment, even you are not a team member!)
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
 *                    $ref: '#/components/schemas/Comment'
 *
 */
router.get('/:comment_id', auth, comments_controller.get_comment);


/**
 * @swagger
 * paths:
 *  /issues/{issueId}/comments/{commentId}:
 *    patch:
 *     summary: Upadte comment, NB; just comment editor can update.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
*     parameters:
 *       - in: path
 *         name: issueId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the issue
 *         example:
 *            5daba194fef2405f78dd5306
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the comment. Comment should belongs to issue
 *         example:
 *            5dc89533f483f43fc83b6d75
 *     requestBody:
 *        description: New title or body, NB; creator or dateCreation fields can not be updated
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/UpdateComment'
 *     responses:
 *       "4XX":
 *          description: e.g. Not authorized to access this resource (e.g. try to get a comment, even you are not a team member!)
 *          content:
 *            application/json:
 *             schema:
 *              $ref: '#/definitions/error'
 *       "200":
 *          description: Return updated comment
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                     type: string
 *                  category:
 *                    $ref: '#/components/schemas/Comment'
 *
 */
router.patch('/:comment_id', auth, comments_controller.update_comment);

/**
 * @swagger
 * paths:
 *  /issues/{issueId}/comments/{commentId}:
 *    delete:
 *     summary: Delete a comment.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: issueId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the issue
 *         example:
 *            5daba194fef2405f78dd5306
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the comment. Comment should belongs to issue
 *         example:
 *            5dc89533f483f43fc83b6d75
 *     responses:
 *       "4XX":
 *          description: e.g. Not authorized to access this resource (e.g. try to get a comment, even you are not a team member!)
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
router.delete('/:comment_id', auth, comments_controller.delete_comment);


module.exports = router;
