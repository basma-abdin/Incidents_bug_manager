const Team = require('../models/Team');
const User = require('../models/User');
const Issue = require('../models/Issue');
const Category = require('../models/Category');
const categories_controller = require('../controllers/categoriesController');

const auth = require('../middleware/auth');


const teamsController = {
  async get_teams(req, res){
    try {
      const teams = await Team.find({ members: req.user }).populate('creator', 'name')
      .populate('members','name')
      .populate('categories','name color')
      .populate('creator','name')

      res.status(200).json(teams);
    } catch (error) {
      res.status(400).json({message:error});
    }
  },

  async create_team(req, res){
    user = req.user
    try {
      if(user != null ){
        const team = new Team(req.body);
        team.creator = user
        team.members.push(user)

        await team.save()
        res.status(201).json({team});
        console.log("new team created , id: " + team.id);
      }
      else {
        res.status(401).send({ error: 'Not authorized, you should be signed in!' })
      }
    } catch (error) {
      res.status(400).json({message : error});
    }
  },

  async get_team(req,res){
    try {

      const team = await Team.findById(req.params.team_id)
      if(!team) return res.status(404).send(not_found("team"))


      if (team.members.includes(req.user.id)){
        const team = await Team.findOne({_id: req.params.team_id})
        .populate('members','name')
        .populate('categories','name color')
        .populate('creator','name')
        return res.status(200).json(team)
      }
      else
        return res.status(401).json({ message : 'Not authorized, you are not member!' })
    } catch (error) {
      res.status(400).json({message: error});
    }
  },

  async delete_team(req,res){
    try {
      const team = await Team.findById(req.params.team_id)
      if(!team) return res.status(404).send(not_found("team"))

      if(team.creator == req.user.id){
        var categories = team.categories

        for (const category_id of categories) {
          var category = await Category.findById(category_id)
          categories_controller.delete_one_category(category, team)
        }

        await Team.deleteOne({_id: team.id})
         return res.status(200).json({message: "team deleted"})
      }else
        return res.status(401).json({ message : 'Not authorized, you are not the creator!' })
    } catch (error) {
      res.status(400).json({message: error});
    }
  },

  async update_team(req,res){
    try {
      var team = await Team.findById(req.params.team_id)

      if(!team)  return res.status(404).send(not_found("team"))

      if(team.creator == req.user.id){
        team.name = req.body.name
        const updated_team =await team.save();
        return res.status(200).json({message: "team updated", updated_team})
      }else
        return res.status(401).json({ message : 'Not authorized, you are not the team creator!' })
    } catch (error) {
      res.status(400).json({message: error});
    }
  },

  async delete_member(req,res){
    try {
      const team = await Team.findById(req.params.team_id);
      if(!team)  return res.status(404).send(not_found("team"))

      const member = await User.findById(req.params.member_id)
      if(!member)  return res.status(404).send(not_found("member"))

      if(!member){
        return res.status(404).json({ message : 'Not found member!', team})
      }

      // si creator ou si req.user.id = req.params.member_id donc moi je veut quitter ce team
      if(team.creator != req.user.id && req.user.id != member.id )
        return res.status(401).json({ message : 'Not authorized, you are not the team creator, neither the member!' })

      if (!team.members.includes(member.id))
        return res.status(400).json({ message : 'is not a member!', team})

      var issues  = await Issue.find({team: team.id, assign_to: member.id},'_id')

      var updated = await Issue.updateMany({team: team.id, assign_to: member.id},
          { $set:  {assign_to: null}}
        )

      const updated_member = await User.updateOne(
        {_id: member.id},
        { $pull: { issues: { $in: issues } }}
      )

      await Team.updateOne(
        {_id: team.id},
        {$pull: {members: member.id}},
        {safe: true, upsert: true},
      )

      console.log("member //"+member.id+"// deleted from team//"+team.id+"// :(");

      return res.status(200).json({message: "member deleted", team})
    } catch (error) {
      res.status(400).json({message: error});
    }
  },

  async add_member(req,res){
    try {
      var team = await Team.findById(req.params.team_id)

      if(!req.body.member){
        return res.status(400).json({ message : 'Request does not contain member' })
      }

      var member = await User.findById(req.body.member)
      if(!member) return res.status(400).json({ error : 'unfound member'})

      if(team.creator == req.user.id ){
        if (team.members.includes(member.id)){
          return res.status(400).json({ message : 'already member!', member})
        }

        await Team.updateOne(
          {_id: team.id},
          {$push: {members: member}},
          {safe: true, upsert: true},
        )
        console.log("new member //"+member.id+"// added to team//"+team.id+"// :)");
        return res.status(200).json({message: "member added", team})
      }else
        return res.status(401).json({ message : 'Not authorized, you are not the team creator!' })
      } catch (error) {
      res.status(400).json({message: error});
    }
  },

  async get_members(req,res){
    try {
      const team = await Team.findById(req.params.team_id)
      if (team.members.includes(req.user.id)){

        var members = await User.find({'_id': { $in: team.members}}, '_id name email')
        return res.status(200).json(members)
      }
      else
        return res.status(401).json({ message : 'Not authorized, you are not member!' })
    } catch (error) {
      res.status(400).json({message: error});
    }
  }
};

function not_found(message){
  return { error: message+' not found!' }
}

module.exports = teamsController;