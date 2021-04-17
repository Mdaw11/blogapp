const express = require('express')
const Article = require('./../models/articles')
const { ensureAuthenticated } = require('../controller/auth');
const issueController = require('../controller/issuecontroller');
const router = express.Router()

router.get('/new', issueController.issue_create, ensureAuthenticated);

router.get('/edit/:id', issueController.issue_edit_get, ensureAuthenticated);

router.get('/:slug', issueController.issue_index, ensureAuthenticated);

router.post('/', async (req, res, next) => {
  req.article = new Article();
  next();
},  saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', issueController.issue_delete)

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

module.exports = router