var express = require('express');
var router = express.Router();
var Book = require("../models").Book;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* MAIN PAGE */
router.get('/', function(req, res, next) {
    const limit = 5;
    let offset = 0;
    let currentPage = req.query.page;
    if (currentPage === 1 || currentPage === NaN || !currentPage) {
        offset = 0
    } else if (currentPage > 1) {
        offset = (currentPage - 1) * 5;
    }
    Book.findAll({limit, offset, order: [["title", "ASC"]]}).then(function(books){
    res.render("books/index", {books: books, title: "Books", currentPage: currentPage});
  }).catch(function(error){
      res.send(500, error);
   });
});

/* SEARCH */
router.post('/search/', function(req, res, next) {
    const search = req.body.search;
    !search ? res.redirect('/') : null;
    Book.findAll({
        where: {
            [Op.or]: [
                {title: { [Op.like]: `%${search}%` }},
                {author: { [Op.like]: `%${search}%` }},
                {genre: { [Op.like]: `%${search}%` }},
                {year: { [Op.like]: `%${search}%` }}
            ]
        }, 
        order: [["title", "ASC"]]
    }).then(function(books){
        books.length > 0 ? res.render("books/index", {books: books, title: "Books found", searched: 1})
                         : res.render("books/index", {title: "Books found", searched: 1 })
    }).catch(function(error){
    res.send(500, error);
    });
});


/* NEW BOOK */
router.get('/new', function(req, res, next) {
    res.render("books/new-book", {book: {}, title: "New Book"});
});

router.post('/new', function(req, res, next) {
    Book.create(req.body).then(function(book) {
      res.redirect("/books/");
    }).catch(function(error){
        if(error.name === "SequelizeValidationError") {
          res.render("books/new-book", {book: Book.build(req.body), errors: error.errors, title: "New Book"})
        } else {
          throw error;
        }
    }).catch(function(error){
        res.send(500, error);
     });
;});

/* UPDATE */
router.get("/:id/" , function(req, res, next){
    Book.findByPk(req.params.id).then(function(book){
      if(book) {
          Book.update
        res.render("books/update-book", {book: book, title: "Edit Book"});      
      } else {
        var err = new Error('Book Not Found');
        err.status = 404;
        res.render('page-not-found', {
            message: err.message,
            error: err
          });;
      }
    }).catch(function(error){
        res.send(500, error);
     });
  });

router.post("/:id", function(req, res, next){
    Book.findByPk(req.params.id).then(function(book){
        if(book) {
            return book.update(req.body);
        } else {
            res.send(404);
        }
    }).then(function(book){
        res.redirect("/books/");        
    }).catch(function(error){
        if(error.name === "SequelizeValidationError") {
            var book = Book.build(req.body);
            book.id = req.params.id;
            res.render("books/update-book", {book: book, errors: error.errors, title: "Update Book"})
        } else {
            throw error;
        }
    }).catch(function(error){
        res.send(500, error);
        });
});

/* DELETE */
router.post("/:id/delete", function(req, res, next){
    Book.findByPk(req.params.id).then(function(book){  
        if(book) {
            return book.destroy();
            } else {
            res.send(404);
            }
        }).then(function(){
            res.redirect("/books");    
        }).catch(function(error){
            res.send(500, error);
            });
  });


module.exports = router;