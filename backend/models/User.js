const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - password
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          password:
 *            type: string
 *            format: password
 *            description: Password for the user.
 *          role:
 *            type: string
 *            enum:
 *               - ADMIN
 *               - USER
 *          issues:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Issue'
 *            description: array of user issues_id
 *        example:
 *           name:  Alexander
 *           email: fake@email.com
 *           password: alex32$1
 *           role: 'USER'
 *
 */
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    role : {
        type : String,
        enum : ['ADMIN', 'USER'],
        default : 'USER'
    },
    issues : [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Issue'
        }
      ]
})

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email} )
    if (!user) {
        return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        return;
    }

    return user
}

userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    delete obj.tokens;
    // delete obj.role;
    return obj;
}
// cacher les tokens aussi!!
userSchema.methods.toFilteredJSON = function () {
    var obj = this.toObject();
    delete obj.name;
    return obj;
}


const User = mongoose.model('User', userSchema)

module.exports = User