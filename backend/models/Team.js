const mongoose = require('mongoose');
/**
 * @swagger
 *  components:
 *    schemas:
 *      Team:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          name:
 *            type: string
 *          creator:
 *            type: _id
 *            description: id of user who creae this team (object_id).
 *          members:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/User'
 *            description: team members (arraye user object_id).
 *          categories:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/User'
 *            description: team categories (array of categories object_id).
 *        example:
 *           name:  frontend developpers
 *           creator: 5dc328a5192cda1c34618f2d
 *           members: [5dc328a5192cda1c34618f2d,5dc328a5192cda1c34618f2d]
 *           categorie: [5dc328a5192cda1c34618f2d,5dc328a5192cda1c34618f2d]
 *
 */
const TeamSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  creator : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  categories : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ]
});

module.exports = mongoose.model('Team', TeamSchema);