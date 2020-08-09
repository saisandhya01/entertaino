module.exports = {
    checkAuthenticated: function(req, res, next) {
        if(!req.session.user){
            res.redirect('/login');
        }
        else{
            next();
        }    
    },
    checkNotAuthenticated: function(req, res, next) {
        if(req.session.user){
            res.redirect('/home');
        }
        else{
            next();
        }    
    }
  };
  