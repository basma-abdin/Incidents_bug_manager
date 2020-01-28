const mongoose = require('mongoose');
/**
 * @swagger
 *  components:
 *    schemas:
 *      Category:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          name:
 *            type: string
 *          color:
 *            type: string
 *            enum:
 *              - Gray
 *              - Red
 *              - Pink
 *              - Blue
 *              - Yellow
 *              - Green
 *              - Orang
 *              - Purple
 *          issues:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Issue'
 *            description: Issues linked to this category (arraye issue object_id).
 *        example:
 *           name:  design
 *           color: Purple
 *           issues: [5dab9ebd435acd5e430ac9f0,5daba194fef2405f78dd5306]
 *
 */
const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color :  {
  	type : String,
    enum : ['Gray', 'Red', 'Blue','Pink','Yellow','Green','Orange','Purple','Silver'],
    default : 'Gray'
  },
  issues : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue'
    }
  ]

});

module.exports = mongoose.model('Category', CategorySchema);