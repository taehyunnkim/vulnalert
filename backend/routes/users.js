import express from 'express';
import session from 'express-session';
var router = express.Router();

router.post('/', async function(req, res, next) {
  if(req.session.isAuthenticated){   
      try{
          const newUser = new req.models.Users({
          username: req.session.account.username,
          email: req.session.account.email
          })

          await newUser.save()

          res.json({"status": "Sucess"})
      }catch(error){
          console.log("Error saving post: ", error)
          res.status(500).json({"status": "error", "error": error})
      }
  }else {
      res.status(401).json({
          status: "error",
          error: "not logged in"})
    }
  
})


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

export default router;
