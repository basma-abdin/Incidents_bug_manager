const Issue = require('../models/Issue');
const Team = require('../models/Team');
const Category = require('../models/Category');

const commentsController = {
  async create_comment(req,res){
    try {
      user = req.user;

      var issue = await Issue.findById(req.params.issue_id)
      if(!issue)  return res.status(404).send(not_found("Team"))

      var team = await Team.findById(issue.team)
      if(!team)  return res.status(404).send(not_found("Team"))

      var category = await Category.findById(issue.category)
      if(!category)  return res.status(404).send(not_found("Category"))

      error = check_ability( req , team, category)
      if(error)
          return res.status(401).json(error)

      if(!req.body.title || !req.body.body)
        return res.status(401).json({message: "comment title and body are required"})

      issue.comments.push({
        title: req.body.title,
        body: req.body.body,
        creator: user,
        dateCreation: new Date()
      })

      issue.save();
      res.status(201).json({ message : "comment added!"})

    } catch (error) {
      res.status(400).json({message : error});
    }
  },

  async get_comments(req,res){
    try {
      var issue = await Issue.findById(req.params.issue_id)
      if(!issue)  return res.status(404).send(not_found("Team"))

      var team = await Team.findById(issue.team)
      if(!team)  return res.status(404).send(not_found("Team"))

      var category = await Category.findById(issue.category)
      if(!category)  return res.status(404).send(not_found("Category"))

      error = check_ability( req , team, category)
      if(error)
          return res.status(401).json(error)

      res.status(201).json({ comments : issue.comments})
    } catch (error) {
      res.status(400).json({message : error});
    }
  },

  async get_comment(req,res){
    try {
      var issue = await Issue.findById(req.params.issue_id)
      if(!issue)  return res.status(404).send(not_found("Team"))

      var team = await Team.findById(issue.team)
      if(!team)  return res.status(404).send(not_found("Team"))

      var category = await Category.findById(issue.category)
      if(!category)  return res.status(404).send(not_found("Category"))

      error = check_ability( req , team, category)
      if(error)
          return res.status(401).json(error)

      var comment = issue.comments.id(req.params.comment_id)

      // comment.populate('creator')

      res.status(201).json({ comment : comment})
    } catch (error) {
      res.status(400).json({message : error});
    }
  },
  async update_comment(req,res){
    try {

      var issue = await Issue.findById(req.params.issue_id)
      if(!issue)  return res.status(404).send(not_found("Team"))

      var team = await Team.findById(issue.team)
      if(!team)  return res.status(404).send(not_found("Team"))

      var category = await Category.findById(issue.category)
      if(!category)  return res.status(404).send(not_found("Category"))

      error = check_ability( req , team, category)
      if(error)
          return res.status(401).json(error)

      var comment = issue.comments.id(req.params.comment_id)
      if(comment.creator._id != req.user.id)
        return res.status(401).json({message: "just editor of comment can update"})

      var set = {};
      // for (var field in req.body) {
      //   set['comments.$.' + field] = req.body[field];
      // }
console.log("eeeeeeeeeeee");

      if(req.body.title) set['comments.$.' + 'title'] = req.body.title
      if(req.body.body) set['comments.$.' + 'body'] = req.body.body

      await Issue.update({_id: issue._id, "comments._id": comment._id},
      {$set: set}
      )
      console.log("zzzzzzzzzzzzzz");

      console.log("comment :"+ comment_id + "  edited");
      res.status(200).json({ message: "comment edited"})
    } catch (error) {
      res.status(400).json({message : error});
    }
  },

  async delete_comment(req,res){
    try {

      var issue = await Issue.findById(req.params.issue_id)
      if(!issue)  return res.status(404).send(not_found("Team"))

      var team = await Team.findById(issue.team)
      if(!team)  return res.status(404).send(not_found("Team"))

      var category = await Category.findById(issue.category)
      if(!category)  return res.status(404).send(not_found("Category"))

      error = check_ability( req , team, category)
      if(error)
          return res.status(401).json(error)

      var comment = issue.comments.id(req.params.comment_id)
      if(comment.creator._id != req.user.id)
        return res.status(401).json({message: "just editor of comment can delete"})

      issue.comments.id(comment._id).remove();
      await issue.save();

      console.log("comment :"+ comment._id + " deleted");
      res.status(200).json({ message: "comment delete"})
    } catch (error) {
      res.status(400).json({message : error});
    }
  }
};


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

function check_ability( req , team, category){
  var user = req.user

  if(request_users_path(req)){
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

function request_users_path(req){
  if(req.params.user_id == null){
    return false;
  }else return true;
}

module.exports = commentsController;
