const Article = require('../models/articles');

const issue_index = async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) res.redirect('/all');
    res.render('articles/show', { article: article });
}
const issue_create = async (req, res) => {
    res.render('articles/new', { article: new Article() });
}

const issue_create_post = async (req, res, next) => {
    req.article = new Article();
    next();
}

const issue_edit_get = async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
}

const issue_edit_put = async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
    saveArticleAndRedirect('edit');    
}

const issue_delete = async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/all');
}

function saveArticleAndRedirect(path) {
    return async (req, res) => {
      let article = req.article
      article.title = req.body.title
      article.description = req.body.description
      article.markdown = req.body.markdown
      try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
      } catch (e) {
        res.render(`articles/${path}`, { article: article })
      }
    }
  }
  
  module.exports = {
      issue_index,
      issue_create,
      issue_create_post,
      issue_edit_get,
      issue_edit_put,
      issue_delete,
      saveArticleAndRedirect
  }