const Issue = require('../models/Issue');
const Team = require('../models/Team');
const User = require('../models/User');
const Category = require('../models/Category');


const IssuesController = {
  async get_issues(req, res){
    var user = req.user
    try {
      if(request_users_path(req)){

        if(user.id != req.params.user_id)
          return res.status(401).json({ error: 'Not authorized' })

        var issues = await Issue.find({'_id': { $in: user.issues}})
        res.json(issues)
      }else{
        var team = await Team.findById(req.params.team_id)
        var category = await Category.findById(req.params.category_id)

        if(!team.members.includes(req.user.id))
          return res.status(401).json({ error: 'Not authorized, you are not member!' })
        if(!team.categories.includes(category.id))
          return res.status(401).json({ error: 'Not authorized, category is not part of team' })

        var issues = await Issue.find({'_id': { $in: category.issues}})
        res.status(200).json(issues)
      }
    } catch (error) {
      res.status(400).json({ message: error});
    }
  },

  async create_issue(req,res){
    try {
      var user = req.user;

      if(request_issues_path(req) || request_users_path(req) ){
        if(request_users_path(req)) {
          if(user.id != req.params.user_id) return res.status(401).send({ error: 'Not authorized' })
        }

        if(!req.body.category)
          return res.status(400).send({ error: 'Category is not specified!' })

        var category = await Category.findById(req.body.category)
        if(!category)  return res.status(404).send(not_found("Category"))

        var teams =  await Team.find({'categories': { $in: category.id}})
        if(teams.length < 1)  return res.status(404).send(not_found("Team"))

        var team = teams[0]
      }else{
        var team = await Team.findById(req.params.team_id)
        var category = await Category.findById(req.params.category_id)

        if(!team)  return res.status(404).send(not_found("Team"))
        if(!category)  return res.status(404).send(not_found("Category"))
      }

      if(!team.members.includes(req.user.id))
        return res.status(401).send({ error: 'Not authorized, you are not member of team!' })
      if(!team.categories.includes(category.id))
        return res.status(401).send({ error: 'Category is not part of team' })

      if(req.body.assign_to){
        var assigned_user = await User.findById(req.body.assign_to)
        if(!team.members.includes(assigned_user.id))
          return res.status(401).send({ error: 'Assigned user is not member of team' })
      }

        const issue = new Issue(req.body);
        issue.team = team
        issue.category = category

        await issue.save()

        // add isssue to user

        if (assigned_user)
        {  await User.updateOne(
            {_id: assigned_user.id},
            {$push: {issues: issue.id}},
            {safe: true, upsert: true},
          )
        }

        await Category.updateOne(
          {_id: category.id},
          {$push: {issues: issue.id}},
          {safe: true, upsert: true},
        )

        res.status(201).send({issue});
        console.log("new issue created , id: " + issue.id);
    }catch (error) {
      res.status(400).json({message : error});
    }
  },

  async get_issue(req,res){
    try {
      var issue = await Issue.findById(req.params.issue_id)
        .populate('team','_id name')
        .populate('category', '_id name color')
        .populate('assign_to', '_id name')

      if(issue == null)
        return res.status(401).json({ error: 'issue ot found' })

      var team = await Team.findById(issue.team)
      var category = await Category.findById(issue.category)

      error = check_ability(req, team, category)

      if(error)
        return res.status(401).json(error)

        return res.status(200).json(issue)
    } catch (err) {
      res.status(400).json({message: err});
    }
  },

  async delete_issue(req,res){
    try {

      var user = req.user;
      var issue = await Issue.findById(req.params.issue_id)

      if(issue == null)
        return res.status(401).json({ error: 'issue ot found' })

      var team = await Team.findById(issue.team)
      var category = await Category.findById(issue.category)

      // n'importe qui de team peut supprimer l'issue

      error = check_ability(req, team, category)
      if(error)
        return res.status(401).json(error)

      IssuesController.delete_one_issue(issue,category)

      res.status(200).json({message: "issue deleted"})
    console.log("issue deleted , id: " + issue.id);
    } catch (error) {
      res.status(400).json({message: error});
    }
  },

  // ON PEUT (si on est member de team) faire update de: title, description, deadline, status, priority,
  // category_id, assigne_to(user_id)
  // ON NE PEUT PAS faire update team
  async update_issue(req,res){
    try {
      var user = req.user

      var issue = await Issue.findById(req.params.issue_id)
      if(!issue)  return res.status(404).send(not_found("Team"))

      var team = await Team.findById(issue.team)
      if(!team)  return res.status(404).send(not_found("Team"))

      var category = await Category.findById(issue.category)
      if(!category)  return res.status(404).send(not_found("Category"))

      error = check_ability(req, team, category)
      if(error)
        return res.status(401).json(error)

      if(req.body.team){
        return res.status(401).json({error: "issue team cannot be changed"})
      }

      var new_data = data_to_update(req.body);

      // n'importe quel member peut changer

      // check if category is member of team!
      if(new_data.category != null){
        var new_category = await Category.findById(new_data.category)
        if(!new_category)  return res.status(404).send(not_found("New category"))


        if(!team.categories.includes(new_data.category))
          return res.status(401).json({ error: 'Category is not part of team!' })

        //delete issue from old category, and add it in the new one
        await Category.updateOne(
          {_id: category.id},
          {$pull: {issues: issue.id}},
          {safe: true, upsert: true},
        )

        await Category.updateOne(
          {_id: new_category.id},
          {$push: {issues: issue.id}},
          {safe: true, upsert: true},
        )
      }
      // DELETE Issue from old assigned_user , ADD it to new assigned_user
      if(new_data.hasOwnProperty('assign_to')){
        // NB: issue.assign_to can be empty
        if(issue.assign_to){
          var old_assigned_user = await User.findById(issue.assign_to)
          if(!old_assigned_user)  return res.status(404).send(not_found("Assigned user"))
        }

        // assign_to can be empty
        if(new_data.assign_to == null){
          if (old_assigned_user)
            await User.updateOne(
              {_id: old_assigned_user.id},
              {$pull: {issues: issue.id}},
              {safe: true, upsert: true},
            )
        }else{
          var new_assigned_user = await User.findById(new_data.assign_to)
          if(!new_assigned_user)  return res.status(404).send(not_found("Assigned user"))

          if(!team.members.includes(new_assigned_user.id))
            return res.status(401).send({ error: 'Assigned user is not member of team' })

          // if old_assigned_user = new_assigned_user we do nothing!,
          // else DELETE Issue from old assigned_user , ADD it to new assigned_user

          if(!old_assigned_user)
            await User.updateOne(
              {_id: new_assigned_user.id},
              {$push: {issues: issue.id}},
              {safe: true, upsert: true},
            )
          else if(old_assigned_user != new_assigned_user){
            await User.updateOne(
              {_id: old_assigned_user.id},
              {$pull: {issues: issue.id}},
              {safe: true, upsert: true},
            )

            await User.updateOne(
              {_id: new_assigned_user.id},
              {$push: {issues: issue.id}},
              {safe: true, upsert: true},
            )
          }
        }
      }
      // update isssue
      const updated_issue = await Issue.updateOne(
        {_id: issue.id},
        { $set:  new_data},
        {runValidators: true}
      )
      return res.status(200).json({message: "issue updated", updated_issue})
    } catch (error) {
      res.status(400).json({message: error});
    }
  },

  async delete_one_issue(issue,category){
    try {
      if(issue.assign_to){
        await User.updateOne(
          {_id: issue.assign_to},
          {$pull: {issues: issue.id}},
          {safe: true, upsert: true},
        )
      }

      await Category.updateOne(
        {_id: category.id},
        {$pull: {issues: issue.id}},
        {safe: true, upsert: true},
      )

      await Issue.deleteOne({_id: issue.id})

    } catch (error) {
      return error
    }
  }

};

// CHECK if request from users/:user_id/issues OR
//  teams/:team_id/categories/:cat_id/issues
function request_users_path(req){
  if(req.params.user_id == null){
    return false;
  }else return true;
}

function request_teams_path(req){
  if(req.params.team_id != null && req.params.category_id != null){
    return true;
  }else return false;
}

function request_issues_path(req){
  if(req.params.team_id == null && req.params.user_id == null){
    return true;
  }else return false;
}

function data_to_update(params){
  var obj = {}
  if(params.title)
    obj.title = params.title
  if(params.description)
    obj.description = params.description
  if(params.deadline)
    obj.deadline = params.deadline
  if(params.status)
    obj.status = params.status
  if(params.priority)
    obj.priority = params.priority
  if(params.hasOwnProperty('category'))
    obj.category = params.category
  if(params.hasOwnProperty('assign_to'))
    obj.assign_to = params.assign_to
  console.log("obj");
  console.log(obj);

  return obj
}

function check_ability( req , team, category){
  var user = req.user

  if(request_users_path(req) ){
    // requst send from path : users/userId/issues/issueId
    if(user.id != req.params.user_id)
      return { error: 'Not authorized' }
  }
  if(request_teams_path(req)){
     // requst send from path : teams/teamId/categories/categoryId/issues/issueId
    if (team.id != req.params.team_id)
      return { error: 'issue team and team in params are not equl!!' }
    if (category.id != req.params.category_id)
      return { error: 'issue category and category in params are not equl!!' }
  }
  if(!team.members.includes(user.id))
    return { error: 'Not authorized, you are not member!' }

  if(!team.categories.includes(category.id))
    return { error: 'Category is not part of team' }
}

function not_found(message){
  return { error: message+' not found!' }
}


module.exports = IssuesController;