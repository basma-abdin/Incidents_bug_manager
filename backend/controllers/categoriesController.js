const Category = require('../models/Category');
const Team = require('../models/Team');
const Issue = require('../models/Issue');
const issues_controller = require('../controllers/IssuesController');

const auth = require('../middleware/auth');

const CategoriesController = {
  async get_categories(req, res){
    user = req.user
    try {
      const team  = await Team.findById(req.params.team_id);
      if(!team) return res.status(404).json({error: "team not found"})

      if (team.members.includes(user.id)){
        var categories = await Category.find({'_id': { $in: team.categories}});
        res.status(200).json(categories);
     }else
        res.status(401).json({ message : 'Not authorized, you are not member!' })
    } catch (error) {
      res.status(400).json({ message: error});
    }
  },

  async create_category(req,res) {
    user = req.user
    try {
      if(user != null){
        const team  = await Team.findById(req.params.team_id);
        if(!team) return res.status(404).json({error: "team not found"})

        if (team.members.includes(user.id)){
          const category = new Category(req.body)
          await category.save()

          team.categories.push(category)
          await team.save()
          res.status(201).json(category);
       }
      }
      else
        {res.status(401).json({ message : 'Not authorized, you are not member!' })}
      }catch(err) {
        res.status(400).json({ message: err});
      }
  },

  async get_category(req,res){
    try {
      const team = await Team.findById(req.params.team_id);
      if(!team) return res.status(404).json({error: "team not found"})

      if (team.members.includes(req.user.id) && team.categories.includes(req.params.category_id)){

        const category = await Category.findById(req.params.category_id).lean().populate('issues')

        return res.status(200).json({issue_length: category.issues.length , category})
      }
      else
        return res.status(401).json({ message : 'Not authorized, you are not member!' })
    } catch (error) {
      res.status(400).json({message: error});
    }
  },
  async delete_category(req,res){
    try {
      const team  = await Team.findById(req.params.team_id);

      if (team.members.includes(req.user.id)  && team.categories.includes(req.params.category_id) ){

        const category = await Category.findById(req.params.category_id)

        CategoriesController.delete_one_category(category, team)

        return res.status(200).json({message: "Category deleted"})
      }
      else
        return res.status(401).json({ message : 'Not authorized, you are not member!' })
    }catch (error) {
      res.status(400).json({message: error});
    }
  },

  async update_category(req,res){
    try {
      const team  = await Team.findById(req.params.team_id);

      if (team.members.includes(req.user.id) && team.categories.includes(req.params.category_id)){

        const updated_category = await Category.updateOne(
          {_id: req.params.category_id},
          { $set:  data_to_update(req.body)},
          {runValidators: true}
        )
        return res.status(200).json({message: "category updated", updated_category})
      }
      else
        return res.status(401).json({ message : 'Not authorized, you are not member!' })
    } catch (error) {
      res.status(400).json({message: error});
    }
  },

  async delete_one_category(category, team){
    try {
      await Team.updateOne(
        {_id: team.id},
        {$pull: {categories: category.id}},
        {safe: true, upsert: true},
      )

      var issues = category.issues
      for (const issue_id of issues) {
        var issue = await Issue.findById(issue_id)
        issues_controller.delete_one_issue(issue, category)
      }
      await Category.deleteOne({_id: category.id})

    } catch (error) {
      return error;
    }
  }
};

function data_to_update(params){
  if(params.color != null && params.name != null){
    return { name: params.name, color: params.color};
  }
  if(params.name != null){
    return { name: params.name };
  }
  if(params.color != null){
    return { color: params.color };
  }
  else {}
}


module.exports = CategoriesController;