const express = require('express');
const auth = require('../middleware/auth')
const comments_router = require('./comments');
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Issues
 *   description: Issue management. NB; All issues operations depends on logged user (user should be a team member of issue team).
 */

const issues_controller = require('../controllers/IssuesController');
const Issue = require('../models/Issue');

 /**
 * @swagger
 * definitions:
 *  UpdateIssue:
 *   schema:
 *    type: object
 *    properties:
 *      title:
 *        type: string
 *      description:
 *        type: string
 *      deadline:
 *         type: string
 *         format: date-time
 *      status:
 *        type: string
 *        enum:
 *          - TO DO
 *          - DONE
 *          - BLOCKED
 *          - IN PROGRESS
 *          - CLOSED
 *      prority:
 *        type: string
 *        enum:
 *          - LOW
 *          - MEDIUM
 *          - HIGH
 *      assign_to:
 *        type: _id
 *        description: Member in charge to fix issue (user_id)(object_id).
 *    required:
 *      - title
 *   example:
 *      title: probleme de reseau
 *      description:  la reseau est en panne
 *      status: "DONE"
 *      priority: "MEDIUM"
 *
 *  UpdateIssue2:
 *   schema:
 *    type: object
 *    properties:
 *      title:
 *        type: string
 *      description:
 *        type: string
 *      deadline:
 *         type: string
 *         format: date-time
 *      status:
 *        type: string
 *        enum:
 *          - TO DO
 *          - DONE
 *          - BLOCKED
 *          - IN PROGRESS
 *          - CLOSED
 *      prority:
 *        type: string
 *        enum:
 *          - LOW
 *          - MEDIUM
 *          - HIGH
 *      assign_to:
 *        type: _id
 *        description: Member in charge to fix issue (user_id)(object_id).
 *      category:
 *        type: _id
 *        description: Category that issue belongs to (object_id).
 *    required:
 *      - title
 *      - category
 *   example:
 *      title: probleme de reseau
 *      description:  la reseau est en panne
 *      status: "DONE"
 *      priority: "MEDIUM"
 *      category: 5dab92ae7ec6a9549a4a9372
 *
 */


/**
 * @swagger
 * path:
 *  /teams/{teamId}/categories/{categoryId}/issues:
 *    get:
 *      summary: Get list of issues of team and category passed in parameters
 *      tags: [Categories]
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: teamId
 *          schema:
 *            type: string
 *          required: true
 *          description: Numeric ID of the team
 *          example:
 *             5da4dfa8e99a6829bb6e5989
 *        - in: path
 *          name: categoryId
 *          schema:
 *            type: string
 *          required: true
 *          description: Numeric ID of the category. Category should belongs to team
 *          example:
 *             5dab92ae7ec6a9549a4a9372
 *      responses:
 *        "400":
 *           description: Bad request
 *        "200":
 *          description: An array of teams
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                    $ref: '#/components/schemas/Issue'
 */
router.get('/', auth, issues_controller.get_issues);

 /**
 * @swagger
 *
 * path:
 *  /issues:
 *    post:
 *      summary: (another path for creating issue) Create a new issues AND add it to the category passed in body.
 *      tags: [Issues]
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        description: Issue title, description, priority (dafault MEDUIM), status (defalut TO DO), deadline,assigne_to,
 *                      category is REQUIRED.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/UpdateIssue2'
 *      responses:
 *        "201":
 *          description: Issue category
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Issue'
 *        "400":
 *           description: Bad request
 *           content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 *        "401":
 *          description: Not authorized to access this resource (e.g. try to create an issue for a team you not member!)
 *          content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 */
router.post('/', auth,issues_controller.create_issue);

/**
 * @swagger
 * paths:
 *  /issues/{issueId}:
 *    get:
 *     summary: Get issue details, NB; it is private for team member.
 *     tags: [Issues]
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
 *            5dab9866964aa85b0a0b0c00
 *     responses:
 *       "4XX":
 *          description: e.g. Not authorized to access this resource (e.g. try to get a issue, even you are not a team member!)
 *          content:
 *            application/json:
 *             schema:
 *              $ref: '#/definitions/error'
 *       "200":
 *          description: Return issue
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  issue_length:
 *                     type: integer
 *                  category:
 *                    $ref: '#/components/schemas/Issue'
 */
router.get('/:issue_id', auth, issues_controller.get_issue);

/**
 * @swagger
 * paths:
 *  /issues/{issueId}:
 *    delete:
 *     summary: Delete an issue, anyone of the team can delete an issue.
 *     tags: [Issues]
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
 *            5dab9866964aa85b0a0b0c00
 *     responses:
 *       "4XX":
 *          description: e.g. Not authorized to access this resource (e.g. try to delete an issue, even you are not a team member!)
 *          content:
 *            application/json:
 *             schema:
 *              $ref: '#/definitions/error'
 *       "200":
 *          description: Return Issue
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                     type: string
 *
 */
router.delete('/:issue_id', auth, issues_controller.delete_issue);

/**
 * @swagger
 * paths:
 *  /issues/{issueId}:
 *    patch:
 *     summary: Upadte issues, NB; just team member can update, members can update title, description, deadline,
 *              status, priority, category and assigne_to.
 *     tags: [Issues]
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
 *            5dab9866964aa85b0a0b0c00
 *     requestBody:
 *        description: New data for issues, NB; team can not be updated
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/UpdateIssue2'
 *     responses:
 *       "4XX":
 *          description: e.g. Not authorized to access this resource (e.g. try to update an issue, even you are not a team member!)
 *          content:
 *            application/json:
 *             schema:
 *              $ref: '#/definitions/error'
 *       "200":
 *          description: Return updated issue
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                     type: string
 *                  category:
 *                    $ref: '#/components/schemas/Issue'
 *
 */
router.patch('/:issue_id', auth, issues_controller.update_issue);



/**
 * @swagger
 *
 * path:
 *  /teams/{teamId}/categories/{categoryId}/issues:
 *    post:
 *      summary: Another way for creating a new issues AND add it to the category passed in parameters.
 *      tags: [Issues]
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
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the category. Category should belongs to team
 *         example:
 *            5dab92ae7ec6a9549a4a9372
 *      requestBody:
 *        description: Issue title, description, priority, status, deadline.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/UpdateIssue'
 *      responses:
 *        "201":
 *          description: Issue category
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Issue'
 *        "400":
 *           description: Bad request
 *           content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 *        "401":
 *          description: Not authorized to access this resource (e.g. try to create a issue for a team you not member!)
 *          content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 */

// Comments
router.use('/:issue_id/comments', comments_router);

module.exports = router;