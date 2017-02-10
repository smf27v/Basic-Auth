var express = require('express');
var router = express.Router();

/* GET home page. */

// Option 1

router.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

router.get('/secret', function(req, res, next) {
  res.render('secret');
});

// End Option 1

//------------------------------------------------

// Option 2 more elegant

// router.get('/secret', ensureLogged, function(req, res, next) {
//   res.render('secret');
// });
//

// ensureLogged is a middleware and we can pass it as arrgument see above

// function ensureLogged(req, res, next){
//   if (req.session.currentUser){
//     next();
//   } else {
//     res.redirect("/login");
//   }
// }

// End Option 2

// -----------------------------------------------

module.exports = router;
