const mongoose = require('mongoose');
/**
 * @swagger
 *  components:
 *    schemas:
 *      Comment:
 *        type: object
 *        required:
 *          - title
 *        properties:
 *          title:
 *            type: string
 *          body:
 *            type: string
 *          dateCreation:
 *            type: string
 *            format: date-time
 *          creator:
 *            type: _id
 *            description: Member who created the comment(user_id)(object_id).
 */
const CommentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body : {
    type: String,
    required:true
  },
  creator : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dateCreation : Date
});
CommentSchema.set('toJSON', { virtuals: true });
const AttachementSchema = mongoose.Schema({
  type: {
    type: String
  },
  url : {
    type: String
  }
});

/**
 * @swagger
 *  components:
 *    schemas:
 *      Issue:
 *        type: object
 *        required:
 *          - title
 *          - team
 *          - category
 *        properties:
 *          title:
 *            type: string
 *          description:
 *            type: string
 *          deadline:
 *            type: string
 *            format: date-time
 *          status:
 *            type: string
 *            enum:
 *              - TO DO
 *              - DONE
 *              - BLOCKED
 *              - IN PROGRESS
 *              - CLOSED
 *            description: Describe issue progress.
 *          prority:
 *            type: string
 *            enum:
 *              - LOW
 *              - MEDIUM
 *              - HIGH
 *            description: Describe issue priority.
 *          category:
 *            type: _id
 *            description: Category that issue belongs to (object_id).
 *          team:
 *            type: _id
 *            description: Team that issue belongs to (object_id).
 *          assign_to:
 *            type: _id
 *            description: Member in charge to fix issue (user_id)(object_id).
 *          comments:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Comment'
 *            description: array of user comments
 */

const IssueSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description : String,
  deadline: Date,
  status : {
  	type : String,
    enum : ['TO DO', 'DONE', 'BLOCKED', 'IN PROGRESS', 'CLOSED'],
    default: 'TO DO'
  },
  priority : {
  	type : String,
    enum : ['LOW', 'MEDIUM', 'HIGH'],
    default : 'MEDIUM'
  },
  category :  { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  team: { type: mongoose.Schema.Types.ObjectId,      ref: 'Team' },
  assign_to: { type: mongoose.Schema.Types.ObjectId,      ref: 'User' },
  comments : [ CommentSchema ],
  attachement :  [ AttachementSchema ]
});

module.exports = mongoose.model('Issue', IssueSchema);
// module.exports = mongoose.model('Comment', CommentSchema);
// module.exports = mongoose.model('Attachement', AttachementSchema);