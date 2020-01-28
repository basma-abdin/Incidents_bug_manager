const User = require('../models/User');
const auth = require('../middleware/auth')


const usersController = {
  async creat_user(req, res){
    try {

      const { name, email, password } = req.body
      const user = new User({name: name, email:email, password:password});
      await user.save()

      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
      console.log("new user created" + user.id);

    } catch (error) {
        res.status(400).send(error);
    }
  },

  async get_users(req, res){
    try {

        const users = await User.find();
        res.status(200).json(users);

    } catch (error) {
      res.json({ message: error});
    }
  },

  async login(req, res){
    try {
      const { email, password, num } = req.body

      const user = await User.findByCredentials(email, password)
      if (!user) {
          return res.status(400).json({message: 'Login failed! Check authentication credentials'})
      }
      const token = await user.generateAuthToken()
      // res.status(202).send({ user, token })
      res.header('auth-token', token).json({ user, token })
    } catch (error) {
        res.status(400).json(error)
    }
  },

  // nom, email, issues,
  async get_user(req, res){

    if(req.params.user_id === req.user.id) {
      /// profile
      res.status(200).json(req.user)
    }else {
      res.status(401).send({ error: 'Not authorized to access this resource' })
    }
  },

  async logout(req, res){
    try {
      if(req.params.user_id === req.user.id) {
        req.user.tokens = req.user.tokens.filter((token) => {
          return token.token != req.token
        })
        await req.user.save()
        res.status(200).json({message: "You are logged out successfully"})
      }else {
        res.status(401).json({ error: 'Not authorized to access this resource' })
      }
    } catch (error) {
        res.status(500).send(error)
    }
  },


  async update_user(req,res){
    try {
      user = req.user;

      if(req.params.user_id != user.id && user.role != 'ADMIN')
        return res.status(401).json({ message : 'Not authorized' })

      // admin can update just the user role
      if(req.params.user_id != user.id && user.role == 'ADMIN'){

        var user_to_update = await User.findById(req.params.user_id)

        if(!req.body.role)
          return res.status(400).json({ message : 'Admin can update other user role only' })

        user_to_update.role = req.body.role
        await user_to_update.save();
        return res.status(200).json({message: "user role updated", user_to_update})
      }

      if(req.body.role && user.role != 'ADMIN'){
        return res.status(401).json({ message : 'Just admin can change role!' })
      }

      // updating my profile (Admin or user)
      if(req.body.issues) delete req.body.issues;

      for (let i in req.body) {
        user[i] = req.body[i];
      }
      var saved_u = await user.save();


      if(saved_u && (req.body.hasOwnProperty('password') || req.body.hasOwnProperty('email') )){
        user.tokens.splice(0, user.tokens.length)
        await user.save()
      }
      return res.status(200).json({message: "user account updated", saved_u})

    } catch (error) {
      res.status(400).json({message: error});
    }
  }
};


module.exports = usersController;