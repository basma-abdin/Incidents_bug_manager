const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const categories_router = require('./categories');

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: Team management. NB; All team operations depends on logged user (user should be a team member).
 */

 /**
 * @swagger
 * definitions:
 *  TeamName:
 *   schema:
 *    type: object
 *    properties:
 *      name:
 *        type: string
 *    required:
 *      - name
 *   example:
 *      name: frontend developpers
 *  error:
 *   schema:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 *   example:
 *    message: error
 *  NewMember:
 *    schema:
 *      type: object
 *      properties:
 *        member:
 *          type: _id
 *        description: id of user to add (object_id)
 *      required:
 *        - member:
 *    example:
 *      member: 5dc406b3bd45c7318c522bda
  */


const teams_controller = require('../controllers/teamsController');
const categories_controller = require('../controllers/categoriesController');
const Team = require('../models/Team');

/**
 * @swagger
 * path:
 *  /teams/:
 *    get:
 *      summary: Get list of teams that user belongs to, depends on logged user
 *      tags: [Teams]
 *      security:
 *       - bearerAuth: []
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
 *                    $ref: '#/components/schemas/Team'
 */
router.get('/', auth , teams_controller.get_teams);

/**
 * @swagger
 *
 *
 * path:
 *  /teams/:
 *    post:
 *      summary: Create a new team, keep in mind the team_id
 *      tags: [Teams]
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        description: Need to provide just the team name, (creator, categories, members) will be added automatically, so useless to write them!
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/TeamName'
 *      responses:
 *        "201":
 *          description: Created team
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Team'
 *        "400":
 *           description: Bad request
 *           content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 *        "401":
 *          description: Not authorized to access this resource (e.g. try to access another user teams!)
 *          content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 */
router.post('/', auth, teams_controller.create_team);

/**
 * @swagger
 * paths:
 *  /teams/{teamId}:
 *    get:
 *     summary: Get team details
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the team, NB; team should be accessible by user, e.g user is member of team OR it's creator
 *         example: 5da4dfa8e99a6829bb6e5989
 *     responses:
 *       "401":
 *          description: Not authorized to access this resource (e.g. try to access a team, even you are not a team member!)
 *          content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 *       "400":
 *           description: Bad request
 *           content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 *       "200":
 *         description: team with details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *
 */
router.get('/:team_id', auth , teams_controller.get_team);

/**
 * @swagger
 * paths:
 *  /teams/{teamId}:
 *    delete:
 *     summary: delete team details and all it's issues, categories. NB; Just team creator can delete it!
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the team, NB; team should be accessible to user, e.g user is member of team OR it's creator
 *         example: 5dab1f75864d7a256b7d3992
 *     responses:
 *       "401":
 *          description: Not authorized to access this resource (e.g. try to delete a team, even you are not the team creator!)
 *          content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 *       "400":
 *           description: Bad request
 *           content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 *       "200":
 *         description: delete confirmation
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *
 */
router.delete('/:team_id', auth , teams_controller.delete_team);

/**
 * @swagger
 * paths:
 *  /teams/{teamId}:
 *    patch:
 *     summary: Upadte team name, NB; just team creator can update.
 *              Creator can't be updated, members and categories have their own routes for updates
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the team
 *         examples:
 *            user:
 *              value:
 *                5dab1f75864d7a256b7d3992
 *     requestBody:
 *        description: New name for team
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/TeamName'
 *     responses:
 *       "4XX":
 *          description: e.g. Not authorized to access this resource (e.g. try to update a team, even you are not the team creator!)
 *          content:
 *            application/json:
 *             schema:
 *              $ref: '#/definitions/error'
 *       "200":
 *          description: Return updated team
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                     type: string
 *                  team:
 *                    $ref: '#/components/schemas/Team'
 *
 */
router.patch('/:team_id', auth , teams_controller.update_team);

/**
 * @swagger
 * path:
 *  /teams/{teamId}/members:
 *    get:
 *      summary: Get list of team members, NB; work if logged user is member of team
 *      tags: [Teams]
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the team
 *         examples:
 *            user:
 *              value:
 *                5dab1f75864d7a256b7d3992
 *      responses:
 *        "200":
 *          description: An array of team members
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 *        "400":
 *           description: Bad request
 *           content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 *        "401":
 *          description: Not authorized to access this resource (e.g. try to access members, even you are not a team member!)
 *          content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 */
router.get('/:team_id/members', auth , teams_controller.get_members);

/**
* @swagger
* path:
*  /teams/{teamId}/members:
*    post:
*      summary: Add a team member,  NB; Just team creator can add member!
*               You can take users id by send request (api/v1/users) in users section
*      tags: [Teams]
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
 *           5dab1f75864d7a256b7d3992
*      requestBody:
*        description: Member id (user_id) to add, NB; Just team creator can add member!!
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/definitions/NewMember'
*      responses:
*        "200":
*          description: Created team
*          content:
*            application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                     type: string
 *                  team:
 *                    $ref: '#/components/schemas/Team'
*        "400":
*           description: Bad request
*           content:
*            application/json:
*             schema:
*               $ref: '#/definitions/error'
*        "401":
*          description: Not authorized to access this resource (e.g. try to add member, even you are not the team creator!!)
*          content:
*            application/json:
*             schema:
*               $ref: '#/definitions/error'
*/
router.post('/:team_id/members', auth , teams_controller.add_member);

/**
 * @swagger
 * paths:
 *  /teams/{teamId}/members/{memberId}:
 *    delete:
 *     summary: delete member of team. NB; Just team creator can delete member!
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the team
 *         example: 5dab1f75864d7a256b7d3992
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the member
 *         example: 5da22145b7f5f757f6f76ff5
 *     responses:
 *       "401":
 *          description: Not authorized to access this resource (e.g. try to delete member, even you are not the team creator!!)
 *          content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 *       "400":
 *           description: Bad request
 *           content:
 *            application/json:
 *             schema:
 *               $ref: '#/definitions/error'
 *       "200":
 *         description: delete confirmation
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *
 */
router.delete('/:team_id/members/:member_id', auth , teams_controller.delete_member);

// CATEGORIES
router.use('/:team_id/categories', categories_router);

module.exports = router;